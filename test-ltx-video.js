/**
 * LTX Video API - Quick Test Script
 * Run: node test-ltx-video.js
 *
 * Uses ltx-2-3-fast + 5 seconds to stay within $1.25 free credit.
 * Tests image-to-video in 9:16 portrait (social media ready).
 */

const API_KEY = process.env.LTXV_API_KEY || "YOUR_API_KEY_HERE";

// Test image — swap this for any branded post image URL you want to animate
const TEST_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80";

const PROMPT =
  "Gentle camera drift forward, soft natural light, peaceful and motivating atmosphere, cinematic social media style";

async function testLTX() {
  console.log("🎬 Submitting video job to LTX...\n");

  // 1. Submit the job
  const submitRes = await fetch("https://api.ltx.video/v2/image-to-video", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_uri: TEST_IMAGE,
      prompt: PROMPT,
      model: "ltx-2-3-fast",   // fast = cheaper, still great quality
      duration: 5,               // 5 seconds = minimal credit usage
      resolution: "1080x1920",   // 9:16 portrait for Reels/TikTok
      fps: 24,
      generate_audio: true,      // test the native audio too
    }),
  });

  if (!submitRes.ok) {
    const err = await submitRes.text();
    console.error("❌ Submit failed:", submitRes.status, err);
    return;
  }

  const job = await submitRes.json();
  console.log("✅ Job submitted. ID:", job.id);
  console.log("⏳ Polling for result every 5 seconds...\n");

  // 2. Poll until complete
  while (true) {
    await new Promise((r) => setTimeout(r, 5000));

    const pollRes = await fetch(
      `https://api.ltx.video/v2/image-to-video/${job.id}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );

    const status = await pollRes.json();
    console.log("Status:", status.status);

    if (status.status === "completed") {
      const videoUrl = status.result?.video_url;
      console.log("\n🎉 VIDEO READY!");
      console.log("📹 URL:", videoUrl);
      console.log("\nOpen this URL in your browser to preview the video.");
      break;
    }

    if (status.status === "failed") {
      console.error("\n❌ Generation failed:", status.error?.message);
      break;
    }
  }
}

testLTX().catch(console.error);
