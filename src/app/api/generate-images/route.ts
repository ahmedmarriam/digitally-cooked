/**
 * POST /api/generate-images
 * Uses the AI template engine to generate branded posts.
 * 60% image posts (Flux.1-schnell via Together.ai), 40% solid templates.
 * Bonus posts: 70% image, 30% solid.
 * Cost: $0.003/image — 13x cheaper than DALL-E.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  buildBrandContext,
  selectTemplate,
  shouldUseImage,
  renderSolidTemplate,
  renderImageOverlay,
} from "@/lib/templateEngine";

export const maxDuration = 300;

const FLUX_API_URL = "https://api.together.xyz/v1/images/generations";
const STORAGE_BUCKET = "post-images";

let lastError = "";

// ── Flux.1-schnell image generation (via Together.ai) ─────────
async function generateFluxImage(
  prompt: string,
  apiKey: string
): Promise<string | null> {
  try {
    const res = await fetch(FLUX_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt,
        width: 1024,
        height: 1024,
        steps: 4,
        n: 1,
      }),
    });
    if (!res.ok) {
      lastError = `Flux ${res.status}: ${await res.text()}`;
      console.error(lastError);
      return null;
    }
    const data = await res.json();
    const item = data?.data?.[0];
    if (item?.url) return item.url;
    if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`;
    return null;
  } catch (err) {
    lastError = String(err);
    return null;
  }
}

// ── Download URL or base64 → Buffer ───────────────────────────
async function fetchBuffer(url: string): Promise<Buffer | null> {
  try {
    if (url.startsWith("data:")) {
      const b64 = url.split(",")[1];
      return b64 ? Buffer.from(b64, "base64") : null;
    }
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

// ── Ensure Supabase Storage bucket exists ─────────────────────
async function ensureBucket() {
  const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
  if (error && !error.message.includes("already exists")) {
    console.error("Bucket error:", error.message);
  }
}

// ── Upload buffer → Supabase Storage → public URL ─────────────
async function uploadImage(buffer: Buffer, fileName: string): Promise<string | null> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, buffer, { contentType: "image/jpeg", upsert: true });
  if (error) { console.error("Upload error:", error.message); return null; }
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return data.publicUrl ?? null;
}

// ── Main handler ───────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const togetherKey = process.env.TOGETHER_API_KEY;
  if (!togetherKey) {
    return NextResponse.json({ error: "Together.ai API key not configured." }, { status: 500 });
  }

  let brand_id: string | null = null;
  try {
    const body = await request.json().catch(() => ({}));
    brand_id = body.brand_id ?? null;
  } catch { /* no body is fine */ }

  try {
    await ensureBucket();

    let rawBrand = null;

    if (brand_id) {
      // Look up the specific brand directly
      const { data } = await supabase
        .from("brands")
        .select("id, brand_name, brand_colors, content_tone, visual_style, business_type, logo_url")
        .eq("id", brand_id)
        .single();
      rawBrand = data ?? null;
    } else {
      // Fallback: find the most recent brand with posts needing images
      const { data: recentBrands } = await supabase
        .from("brands")
        .select("id, brand_name, brand_colors, content_tone, visual_style, business_type, logo_url")
        .in("generation_status", ["complete", "generating"])
        .order("created_at", { ascending: false })
        .limit(10);

      for (const b of recentBrands ?? []) {
        const { count } = await supabase
          .from("posts")
          .select("id", { count: "exact", head: true })
          .eq("brand_id", b.id)
          .is("image_url", null);
        if (count && count > 0) { rawBrand = b; break; }
      }
    }

    if (!rawBrand) {
      return NextResponse.json({ message: "No posts need images.", count: 0 });
    }

    const brand = buildBrandContext(rawBrand);

    // Fetch posts needing images
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("id, post_group, image_prompt, format, hook, caption, cta, hashtags, is_bonus")
      .eq("brand_id", rawBrand.id)
      .is("image_url", null)
      .not("image_prompt", "is", null)
      .order("post_group", { ascending: true });

    if (postsError || !posts || posts.length === 0) {
      return NextResponse.json({ message: "No posts need images.", count: 0 });
    }

    // Deduplicate by post_group — one image per concept
    const seen = new Set<number>();
    const allConcepts = posts.filter((p) => {
      const key = p.post_group ?? p.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Process up to 8 concepts per call — enough for one full batch
    const uniqueConcepts = allConcepts.slice(0, 8);

    let generated = 0;
    let failed = 0;

    for (const post of uniqueConcepts) {
      const isBonus = post.is_bonus ?? false;
      const postGroup = post.post_group ?? 1;
      // Use post_group as the ratio index — globally unique per concept
      const useImage = shouldUseImage(postGroup, isBonus);
      const template = selectTemplate(brand, postGroup);
      const w = 1024;
      const h = 1024;

      const postContent = {
        hook: post.hook ?? "",
        caption: post.caption ?? "",
        cta: post.cta ?? "",
        hashtags: post.hashtags ?? "",
        format: post.format ?? "",
        postIndex: postGroup,
        isBonus,
      };

      let imageBuffer: Buffer | null = null;

      if (useImage) {
        const imageUrl = await generateFluxImage(post.image_prompt ?? "", togetherKey);
        if (imageUrl) imageBuffer = await fetchBuffer(imageUrl);
      }

      let finalBuffer: Buffer | null = null;

      try {
        if (useImage && imageBuffer) {
          finalBuffer = await renderImageOverlay(imageBuffer, brand, postContent, w, h);
        } else {
          finalBuffer = await renderSolidTemplate(brand, postContent, template, w, h);
        }
      } catch (renderErr) {
        console.error("Render error for post_group", post.post_group, renderErr);
        // Fall back to solid template if image overlay fails
        try {
          finalBuffer = await renderSolidTemplate(brand, postContent, template, w, h);
        } catch {
          finalBuffer = null;
        }
      }

      if (finalBuffer) {
        const fileName = `posts/${rawBrand.id}/pg${post.post_group ?? postGroup}-${Date.now()}.jpg`;
        const publicUrl = await uploadImage(finalBuffer, fileName);

        if (publicUrl) {
          await supabase
            .from("posts")
            .update({ image_url: publicUrl })
            .eq("brand_id", rawBrand.id)
            .eq("post_group", post.post_group);
          generated++;
        } else {
          failed++;
        }
      } else {
        failed++;
      }

    }

    return NextResponse.json({
      success: true,
      generated,
      failed,
      total: uniqueConcepts.length,
      remaining: allConcepts.length - uniqueConcepts.length,
      last_error: lastError || null,
    });
  } catch (err) {
    console.error("Generate images error:", err);
    return NextResponse.json({ error: "Internal error generating images." }, { status: 500 });
  }
}
