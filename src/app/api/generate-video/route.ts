/**
 * POST /api/generate-video
 * Generates a short social media video from a branded post image using LTX Studio API.
 * 9:16 portrait format — ready for Instagram Reels, TikTok, YouTube Shorts.
 *
 * TOGGLE: Set ENABLE_VIDEO_GENERATION=true in .env.local (or Vercel env) to activate.
 * Leave as false during testing to protect LTX credits.
 *
 * Body: { post_id, image_url, hook, platform, brand_name, business_type }
 * Returns: { skipped: true } when disabled | { video_url: string } when enabled
 */

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

// ── Safety toggle — flip to true in env when ready to launch ──────────────────
const VIDEO_ENABLED = process.env.ENABLE_VIDEO_GENERATION === "true";

export async function POST(request: NextRequest) {
  // ── GATE: return early during testing, no credits burned ──────────────────
  if (!VIDEO_ENABLED) {
    console.log("[generate-video] Video generation is disabled (ENABLE_VIDEO_GENERATION=false). Skipping.");
    return NextResponse.json({
      skipped: true,
      reason: "Video generation is currently disabled for testing. Set ENABLE_VIDEO_GENERATION=true to activate.",
    });
  }

  const ltxKey = process.env.LTX_API_KEY;
  if (!ltxKey) {
    return NextResponse.json({ error: "LTX API key not configured." }, { status: 500 });
  }

  let body: {
    post_id?: string;
    image_url: string;
    hook?: string;
    platform?: string;
    brand_name?: string;
    business_type?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.image_url) {
    return NextResponse.json({ error: "image_url is required." }, { status: 400 });
  }

  // ── Build a platform-aware motion prompt ──────────────────────────────────
  const platform = body.platform?.toLowerCase() ?? "instagram";
  const hook = body.hook ?? "";
  const brandName = body.brand_name ?? "the brand";

  const motionStyle: Record<string, string> = {
    instagram: "smooth cinematic dolly forward, warm natural light, engaging social media energy",
    tiktok: "dynamic motion, quick energy, trend-aware cinematic movement",
    linkedin: "professional subtle drift, clean corporate aesthetic, confident tone",
    facebook: "warm lifestyle feel, natural movement, relatable everyday energy",
    youtube: "cinematic wide reveal, premium production feel, bold visual storytelling",
  };

  const prompt = `Short-form social media video for ${brandName}. ${hook ? `Post hook: "${hook}".` : ""} Visual style: ${motionStyle[platform] ?? motionStyle.instagram}. No text overlays. Pure visual motion. 9:16 portrait.`;

  try {
    // ── Submit async job to LTX ──────────────────────────────────────────────
    const submitRes = await fetch("https://api.ltx.video/v2/image-to-video", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ltxKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_uri: body.image_url,
        prompt,
        model: "ltx-2-3-fast",    // fast = cost-efficient, great quality
        duration: 5,               // 5 seconds — optimal for Reels/TikTok
        resolution: "1080x1920",   // 9:16 portrait — native social format
        fps: 24,
        generate_audio: true,      // native audio included
      }),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      console.error("[generate-video] LTX submit failed:", err);
      return NextResponse.json({ error: "Video generation failed." }, { status: 502 });
    }

    const job = await submitRes.json();
    const jobId = job.id;

    if (!jobId) {
      return NextResponse.json({ error: "No job ID returned from LTX." }, { status: 502 });
    }

    // ── Poll for completion (max 90 seconds) ──────────────────────────────────
    const maxAttempts = 18; // 18 × 5s = 90s
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 5000));

      const pollRes = await fetch(`https://api.ltx.video/v2/image-to-video/${jobId}`, {
        headers: { Authorization: `Bearer ${ltxKey}` },
      });

      const status = await pollRes.json();

      if (status.status === "completed") {
        const videoUrl = status.result?.video_url;
        return NextResponse.json({ success: true, video_url: videoUrl, job_id: jobId });
      }

      if (status.status === "failed") {
        console.error("[generate-video] LTX job failed:", status.error?.message);
        return NextResponse.json({ error: "Video generation failed.", detail: status.error?.message }, { status: 502 });
      }
    }

    // Timed out — return job ID so caller can poll later
    return NextResponse.json({ pending: true, job_id: jobId, message: "Video still processing — poll with job_id." });

  } catch (err) {
    console.error("[generate-video] Error:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
