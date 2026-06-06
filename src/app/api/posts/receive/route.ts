/**
 * POST /api/posts/receive
 *
 * Called by Make.com after it finishes generating 40 posts.
 * Expects a JSON body with brand_id, user_id, and an array of posts.
 *
 * Make.com setup:
 *   - Add an HTTP module at the END of your pipeline
 *   - Method: POST
 *   - URL: https://digitallycooked.com/api/posts/receive
 *   - Body: { "brand_id": "{{brand_id}}", "user_id": "{{user_id}}", "posts": [array of post objects] }
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Simple shared secret to verify requests come from Make.com
const RECEIVE_SECRET = process.env.POSTS_RECEIVE_SECRET || "dc_make_secret_2026";

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Make.com
    const authHeader = request.headers.get("x-dc-secret");
    if (authHeader !== RECEIVE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { brand_id, user_id, posts } = await request.json();

    if (!brand_id || !posts || !Array.isArray(posts)) {
      return NextResponse.json({ error: "Missing brand_id or posts array." }, { status: 400 });
    }

    // Map posts into DB rows
    const rows = posts.map((post: {
      post_number?: number;
      post_group?: number;
      day?: number;
      is_bonus?: boolean;
      platform?: string;
      format?: string;
      pillar?: string;
      hook?: string;
      caption?: string;
      cta?: string;
      hashtags?: string;
      image_prompt?: string;
      image_url?: string;
    }) => ({
      brand_id,
      user_id,
      post_number: post.post_number,
      // post_group groups platform variants of the same concept into one card
      // Fall back to post_number so platform tabs work even if Make.com doesn't send post_group
      post_group: post.post_group ?? post.post_number ?? null,
      day: post.day ?? null,
      is_bonus: post.is_bonus ?? false,
      platform: (post.platform ?? "").toLowerCase(),
      format: post.format,
      pillar: post.pillar,
      hook: post.hook,
      caption: post.caption,
      cta: post.cta,
      hashtags: post.hashtags,
      image_prompt: post.image_prompt,
      image_url: post.image_url ?? null,
      status: "draft",
    }));

    // Insert all posts in one batch
    const { error: insertError } = await supabase.from("posts").insert(rows);

    if (insertError) {
      console.error("Posts insert error:", insertError);
      return NextResponse.json({ error: "Failed to save posts." }, { status: 500 });
    }

    // Mark brand generation as complete
    await supabase
      .from("brands")
      .update({ generation_status: "complete" })
      .eq("id", brand_id);

    return NextResponse.json({ success: true, count: rows.length });
  } catch (err) {
    console.error("Posts receive error:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
