/**
 * POST /api/generate-posts
 * Called by Make.com with { "batch": 1|2|3|4|5|6 }
 * Single Claude call per batch — fast, reliable, within Make.com timeout.
 * Batches 1-5: 6 concepts each = 30 calendar days
 * Batch 6: 10 bonus concepts
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const maxDuration = 300;

function getTotalConceptsNeeded(postingFrequency: string): number {
  const f = (postingFrequency ?? "").toLowerCase();
  if (f.includes("daily")) return 30;
  if (f.includes("3") || f.includes("4")) return 14;
  if (f.includes("2x") || f.includes("2 x")) return 8;
  if (f.includes("weekly") || f.includes("once")) return 4;
  return 30;
}

function getVisualCue(businessType: string): string {
  const t = (businessType ?? "").toLowerCase();
  if (t === "real estate") return "property interior or exterior, architectural photography, modern living spaces";
  if (t === "restaurant") return "food photography, beautifully plated dishes, warm restaurant ambiance";
  if (t === "fitness") return "gym, athletic movement, energy, healthy lifestyle";
  if (t === "beauty") return "skincare or beauty products, glowing skin, clean aesthetic";
  if (t === "retail") return "product flatlay or lifestyle shot, clean background";
  if (t === "tech") return "sleek devices, digital screens, modern workspace";
  if (t === "healthcare") return "wellness, care, clean medical or health environment";
  if (t === "education") return "learning, books, classroom, knowledge sharing";
  if (t === "service") return "professional service, people helping people";
  return "professional brand lifestyle imagery";
}

interface Variation {
  platform: string;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string;
}

interface ConceptGroup {
  group: number;
  day: number;
  format: string;
  image_prompt: string;
  variations: Variation[];
}

function tryExtractConcepts(text: string): ConceptGroup[] | null {
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  // Replace literal newlines inside strings with a space
  cleaned = cleaned.replace(/("(?:[^"\\]|\\.)*")/g, (match) =>
    match.replace(/\n/g, " ").replace(/\r/g, " ")
  );

  const arrayStart = cleaned.indexOf("[");
  if (arrayStart === -1) return null;
  cleaned = cleaned.substring(arrayStart);

  // Attempt 1: parse as-is
  try {
    const r = JSON.parse(cleaned);
    if (Array.isArray(r) && r.length > 0) return r;
  } catch {}

  // Attempt 2: close the array
  try {
    const r = JSON.parse(cleaned + "]");
    if (Array.isArray(r) && r.length > 0) return r;
  } catch {}

  // Attempt 3: drop the last (truncated) item and close the array
  // Find the second-to-last top-level object boundary
  const patterns = [",\n  {", ",\n{", ", {"];
  for (const pat of patterns) {
    const idx = cleaned.lastIndexOf(pat);
    if (idx > 0) {
      const partial = cleaned.substring(0, idx) + "]";
      try {
        const r = JSON.parse(partial);
        if (Array.isArray(r) && r.length > 0) return r;
      } catch {}
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Anthropic API key not configured." }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { batch = 1, brand_id: raw_brand_id } = body;
    // Sanitise brand_id — Make.com can forward "null" as a string
    const brand_id = raw_brand_id && raw_brand_id !== "null" ? raw_brand_id : null;
    const batchNum = Number(batch);
    const isBonus = batchNum === 6;

    let brand = null;

    if (brand_id) {
      // Prefer looking up by brand_id — reliable even if status changed or scenario retries
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("id", brand_id)
        .single();
      if (!error && data) brand = data;
    }

    if (!brand) {
      // Fallback: find the most recently-started brand that is still generating
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("generation_status", "generating")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (!error && data) brand = data;
    }

    if (!brand) {
      return NextResponse.json(
        { error: "No brand found to generate posts for.", hint: "Pass brand_id in the request body or ensure generation_status is 'generating'." },
        { status: 404 }
      );
    }

    const brandDbId = brand.id;
    const user_id = brand.user_id;
    const platformArray: string[] = Array.isArray(brand.platforms)
      ? brand.platforms
      : String(brand.platforms ?? "").split(",").map((p: string) => p.trim());
    const numPlatforms = Math.max(platformArray.length, 1);
    const platformList = platformArray.join(", ");
    const captionLanguage = brand.caption_language ?? "English";
    const wants_reels = brand.wants_reels ?? false;

    const formatOptions = wants_reels
      ? `"Reel", "Carousel", "Static Post", "Story"`
      : `"Carousel", "Static Post", "Story"`;

    const totalNeeded = isBonus ? 10 : getTotalConceptsNeeded(brand.posting_frequency);
    const batchOffset = isBonus ? 0 : (batchNum - 1) * 6;
    const conceptsPerBatch = isBonus ? 10 : Math.max(0, Math.min(6, totalNeeded - batchOffset));

    // If nothing to generate for this batch, return early (keep status as-is so batch 6 still runs)
    if (!isBonus && conceptsPerBatch === 0) {
      return NextResponse.json({ success: true, batch: batchNum, concepts: 0, skipped: true });
    }

    const startGroup = isBonus ? 1 : batchOffset + 1;
    const startDay   = isBonus ? 1 : batchOffset + 1;
    const endGroup   = isBonus ? 10 : batchOffset + conceptsPerBatch;
    const endDay     = endGroup;

    // Parse niche intelligence — per platform if available, fallback to flat
    let nicheByPlatform: Record<string, Record<string, string>> = {};
    let nicheContext = ""; // fallback for prompt-level context

    if (brand.niche_intelligence) {
      try {
        const ni = typeof brand.niche_intelligence === "string"
          ? JSON.parse(brand.niche_intelligence)
          : brand.niche_intelligence;

        // Detect if it's per-platform (keys match platform names) or flat
        const isPerPlatform = platformArray.some((p: string) =>
          ni[p] || ni[p.toLowerCase()] || ni[p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()]
        );

        if (isPerPlatform) {
          // Normalise keys to lowercase for easy lookup
          for (const key of Object.keys(ni)) {
            nicheByPlatform[key.toLowerCase()] = ni[key];
          }
        } else {
          // Flat intelligence — apply to all platforms
          nicheContext = `
NICHE INTELLIGENCE (apply these patterns but make content MORE original):
- Hook patterns: ${ni.hookPatterns ?? ""}
- Content formats: ${ni.contentFormats ?? ""}
- Emotional triggers: ${ni.emotionalTriggers ?? ""}
- Tone: ${ni.toneAndVoice ?? ""}
- Core insight: ${ni.whatMakesItWork ?? ""}
- How to beat competitors: ${ni.howToDoItBetter ?? ""}`;
        }
      } catch { /* ignore parse errors */ }
    }

    // Build per-platform niche context strings for the prompt
    const platformNicheGuide = platformArray.map((p: string) => {
      const key = p.toLowerCase();
      const ni = nicheByPlatform[key];
      if (!ni) return null;
      return `${p} NICHE INTELLIGENCE:
- Hook patterns: ${ni.hookPatterns ?? ""}
- What works: ${ni.whatMakesItWork ?? ""}
- How to beat competitors: ${ni.howToDoItBetter ?? ""}
- Hashtag strategy: ${ni.hashtagStrategy ?? ""}`;
    }).filter(Boolean).join("\n\n");

    if (platformNicheGuide) {
      nicheContext = `\n\nPER-PLATFORM NICHE INTELLIGENCE (apply per platform variation — keep content 100% original):\n${platformNicheGuide}`;
    }

    const platformStyleGuide = platformArray.map((p: string) => {
      const n = p.toLowerCase();
      if (n === "instagram") return "Instagram: punchy, emoji-friendly, story-driven";
      if (n === "facebook")  return "Facebook: conversational, community-focused";
      if (n === "linkedin")  return "LinkedIn: professional, insight-driven";
      if (n === "tiktok")    return "TikTok: energetic, trend-aware, bold";
      if (n === "youtube")   return "YouTube: educational, value-packed";
      return `${p}: platform-appropriate`;
    }).join("; ");

    // Build a one-shot example so Claude understands EXACTLY how short to write
    const examplePlatform = platformArray[0] ?? "Instagram";
    const exampleJSON = JSON.stringify([
      {
        group: startGroup,
        day: startDay,
        format: "Static Post",
        image_prompt: `[Write a unique scene showing ${brand.brand_name}'s actual product/service in ${brand.location}]`,
        variations: platformArray.map((p) => ({
          platform: p,
          hook: "Stop scrolling. This changes everything.",
          caption: `We built this for people tired of average. Try it and see why thousands switched.`,
          cta: "Tap the link in bio",
          hashtags: "#brand #product #lifestyle #quality #trending #inspo"
        }))
      }
    ], null, 2);

    const systemPrompt = `You are a social media content strategist. Output ONLY a valid JSON array — no markdown, no explanation, no code fences.

COPY THIS STRUCTURE EXACTLY. Keep all text this short or shorter:
${exampleJSON}

RULES (breaking any rule produces unusable output):
1. image_prompt — max 15 words. MUST describe a UNIQUE, SPECIFIC scene for each concept using ${brand.brand_name}'s actual products (${brand.top_products?.substring(0,60) ?? ''}), set in ${brand.location}. Every concept MUST show a different scene — no two image_prompts can be the same.
2. hook — max 8 words, no punctuation beyond one period or question mark
3. caption — max 20 words, single sentence, NO line breaks, NO bullet points
4. cta — max 6 words
5. hashtags — exactly 6 hashtags in one string
6. variations — exactly ${numPlatforms} item(s), one per platform: ${platformList}
7. group numbers: ${startGroup} to ${endGroup}
8. day numbers: ${startDay} to ${endDay}, each unique
9. Language for captions: ${captionLanguage}

Platform styles: ${platformStyleGuide}`;

    const userPrompt = `Generate ${conceptsPerBatch} post concepts (groups ${startGroup}–${endGroup}, days ${startDay}–${endDay}) for:

Brand: ${brand.brand_name ?? ""}
Business: ${brand.business_type ?? ""} — ${brand.business_description ?? ""}
Products: ${brand.top_products ?? ""}
Unique: ${brand.unique_factor ?? ""}
Customer: ${brand.ideal_customer ?? ""}
Customer Pain Points: ${brand.audience_pain_points ?? ""}
Mission: ${brand.brand_mission ?? ""}
Tone: ${brand.content_tone ?? ""}
Colors: ${brand.brand_colors ?? ""}
Goal: ${brand.monthly_goal ?? ""}
Platforms: ${platformList}${nicheContext}${brand.social_style_context ? `\n\nExisting social media style (IMPROVE on this):\n${brand.social_style_context}` : ""}${isBonus ? "\n\nBONUS posts — make them extra viral and high-engagement." : ""}`;

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [
          { role: "user", content: userPrompt },
          { role: "assistant", content: "[" },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error("Anthropic API error:", anthropicResponse.status, errText);
      return NextResponse.json({ error: "Claude API call failed.", detail: errText }, { status: 502 });
    }

    const anthropicData = await anthropicResponse.json();
    const rawText: string = "[" + (anthropicData.content?.[0]?.text ?? "");

    if (!rawText || rawText === "[") {
      return NextResponse.json({ error: "Empty response from Claude." }, { status: 502 });
    }

    const conceptGroups = tryExtractConcepts(rawText);

    if (!conceptGroups || conceptGroups.length === 0) {
      console.error("JSON parse failed entirely. Raw:", rawText.substring(0, 1000));
      return NextResponse.json(
        { error: "Failed to parse Claude response as JSON.", raw_preview: rawText.substring(0, 500) },
        { status: 422 }
      );
    }

    console.log(`Batch ${batchNum}: parsed ${conceptGroups.length} concepts (some may have been trimmed if truncated)`);

    // ── VIRALITY GATE ─────────────────────────────────────────────
    // Score all hooks in one Claude call. Rewrite any scoring below 70.
    // This runs silently — users only ever see the improved version.
    try {
      const hookList = conceptGroups
        .map((c, i) => `${i + 1}. [Group ${c.group}] ${c.variations?.[0]?.hook ?? ""}`)
        .join("\n");

      const viralityCheckPrompt = `You are a social media virality expert. Score each hook (0-100) and rewrite any scoring below 70.

A strong hook (70+) must:
- Stop the scroll in under 2 seconds
- Create immediate curiosity, emotion, or recognition of a pain point
- Be under 8 words and punchy
- NOT start with "I", "We", or the brand name
- NOT use generic phrases like "Check this out" or "You won't believe"

Hooks to evaluate:
${hookList}

Brand context: ${brand.brand_name} — ${brand.business_description?.substring(0, 100) ?? ""}
Tone: ${brand.content_tone ?? ""}${nicheContext ? `\nNiche patterns to apply: ${nicheContext.substring(0, 200)}` : ""}

Return ONLY a JSON array with one object per hook:
[{"index": 1, "score": 85, "rewrite": null}, {"index": 2, "score": 55, "rewrite": "The stronger rewritten hook here"}]

If score >= 70, set rewrite to null. If score < 70, write a stronger hook in "rewrite".`;

      const viralityRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 1500,
          messages: [{ role: "user", content: viralityCheckPrompt }],
        }),
      });

      if (viralityRes.ok) {
        const viralityData = await viralityRes.json();
        const rawV = (viralityData.content?.[0]?.text ?? "")
          .replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
        const arrayStart = rawV.indexOf("[");
        if (arrayStart !== -1) {
          const scores: { index: number; score: number; rewrite: string | null }[] =
            JSON.parse(rawV.substring(arrayStart));
          // Apply rewrites
          for (const s of scores) {
            const idx = s.index - 1;
            if (s.rewrite && conceptGroups[idx]) {
              for (const variation of conceptGroups[idx].variations ?? []) {
                variation.hook = s.rewrite;
              }
            }
          }
          console.log(`Virality gate: ${scores.filter(s => s.rewrite).length} hooks improved out of ${scores.length}`);
        }
      }
    } catch (viralityErr) {
      // Non-fatal — log and continue with original hooks
      console.warn("Virality gate skipped:", viralityErr);
    }
    // ── END VIRALITY GATE ─────────────────────────────────────────

    // Flatten into post rows
    const rows: Record<string, unknown>[] = [];
    let postNum = isBonus ? 1001 : (batchNum - 1) * 6 * numPlatforms + 1;

    for (const concept of conceptGroups) {
      const variations = Array.isArray(concept.variations) ? concept.variations : [];
      const postGroup = isBonus ? concept.group + 100 : concept.group;

      for (const variation of variations) {
        rows.push({
          brand_id: brandDbId,
          user_id: user_id ?? null,
          post_number: postNum++,
          post_group: postGroup,
          day: concept.day ?? null,
          is_bonus: isBonus,
          platform: String(variation.platform ?? "").toLowerCase(),
          format: concept.format ?? null,
          hook: variation.hook ?? null,
          caption: variation.caption ?? null,
          cta: variation.cta ?? null,
          hashtags: variation.hashtags ?? null,
          image_prompt: concept.image_prompt ?? null,
          image_url: null,
          status: "draft",
        });
      }
    }

    if (rows.length > 0) {
      const { error: insertError } = await supabase.from("posts").insert(rows);
      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to save posts.", detail: insertError.message },
          { status: 500 }
        );
      }
    }

    if (batchNum === 6) {
      await supabase.from("brands").update({ generation_status: "complete" }).eq("id", brandDbId);
    }

    return NextResponse.json({ success: true, batch: batchNum, concepts: conceptGroups.length });
  } catch (err) {
    console.error("Generate posts error:", err);
    return NextResponse.json({ error: "Internal error generating posts." }, { status: 500 });
  }
}
