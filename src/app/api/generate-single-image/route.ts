/**
 * POST /api/generate-single-image
 * Generates a DALL-E image that matches the actual post content.
 * Uses hook + caption + brand context + niche intelligence to build smart, viral-focused prompts.
 * Cycles through visual styles so images are never all the same type.
 *
 * Niche intelligence: Competitor context (hooks, patterns, what works) → differentiated visuals
 *
 * Body: { imagePrompt?, hook, caption, brandName, businessType, postIndex, nicheIntelligence?, platform? }
 * Returns: { imageUrl: string }
 */

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Cycles so each post gets a different visual approach
const VISUAL_APPROACHES = [
  "a person naturally engaged in the activity — working, eating, in conversation, using a product — candid and real, not posed",
  "an atmospheric environment or setting that represents the theme — no people, mood-driven, rich textures and natural light",
  "close-up detail: hands working, a key object, a surface, a product — craft and texture visible",
  "a lifestyle scene that represents the outcome or feeling — dynamic, authentic, shows context and story",
  "abstract or conceptual composition — shapes, light, motion blur, patterns that visually represent the idea",
  "editorial-style: a real moment captured, minimal staging, authentic environment, true to the brand world",
];

// Platform-specific viral tactics to inject into prompts
const PLATFORM_TACTICS: Record<string, string> = {
  instagram: "bold colors, high contrast, eye-catching composition — thumb-stopping at 0.5s",
  tiktok: "dynamic movement, emotional peak moment, hook-friendly framing — designed to stop scroll",
  linkedin: "professional authenticity, real-world application, thought-leadership visual — credible and sharp",
  facebook: "warm, relatable, community-focused feeling — conversational visual tone",
  youtube: "cinematic quality, compelling thumbnail-friendly composition, clear focal point — click-worthy",
};

// Map visual_style + businessType to a consistent aesthetic fingerprint
// This is what makes a brand's grid look cohesive — every image shares the same mood
function getBrandAesthetic(visualStyle: string, businessType: string): string {
  const vs = (visualStyle ?? "").toLowerCase();
  const bt = (businessType ?? "").toLowerCase();

  if (vs.includes("elegant") || vs.includes("luxury") || vs.includes("premium") || vs.includes("editorial") ||
      bt.includes("coach") || bt.includes("consult") || bt.includes("therapy") || bt.includes("legal") || bt.includes("finance")) {
    return "cinematic and editorial — rich shadows, selective soft lighting, intimate and thoughtful. Dark moody tones. Every frame feels intentional, like a magazine shoot. NO bright overexposed looks.";
  }
  if (vs.includes("bold") || vs.includes("vibrant") || vs.includes("energetic") || vs.includes("dynamic") ||
      bt.includes("fitness") || bt.includes("sport") || bt.includes("gym") || bt.includes("startup") || bt.includes("agency")) {
    return "high contrast and dramatic — bold directional lighting, deep shadows, strong graphic compositions. Powerful and unapologetic. NO soft pastel or low-contrast looks.";
  }
  if (vs.includes("minimal") || vs.includes("clean") || vs.includes("simple") || vs.includes("modern") ||
      bt.includes("tech") || bt.includes("saas") || bt.includes("software") || bt.includes("design")) {
    return "minimal and refined — clean compositions, soft natural light, lots of breathing room. Muted palette, precise framing. Feels expensive and considered. NO cluttered or chaotic frames.";
  }
  if (vs.includes("warm") || vs.includes("playful") || vs.includes("friendly") || vs.includes("fun") ||
      bt.includes("food") || bt.includes("restaurant") || bt.includes("cafe") || bt.includes("wellness") || bt.includes("yoga")) {
    return "warm and authentic — golden tones, soft bokeh, genuine candid moments. Feels real and lived-in. Approachable lighting, natural colour grading. NO cold corporate or overly staged looks.";
  }
  // Default: clean and cinematic works for any brand
  return "clean and cinematic — purposeful compositions, controlled lighting, strong visual hierarchy. Professional without being sterile. Feels designed, not accidental.";
}

function buildPrompt(body: {
  imagePrompt?: string;
  hook: string;
  caption: string;
  brandName: string;
  businessType: string;
  visualStyle?: string;
  postIndex: number;
  nicheIntelligence?: string;
  platform?: string;
}): string {
  const { imagePrompt, hook, caption, brandName, businessType, visualStyle, postIndex, nicheIntelligence, platform } = body;
  const approach = VISUAL_APPROACHES[postIndex % VISUAL_APPROACHES.length];
  const platformName = platform?.toLowerCase() ?? "instagram";
  const platformTactic = PLATFORM_TACTICS[platformName] || PLATFORM_TACTICS.instagram;

  // Brand aesthetic fingerprint — applied to EVERY image so the grid looks cohesive
  const brandAesthetic = getBrandAesthetic(visualStyle ?? "", businessType);

  // Use the pre-written image prompt as the content core if available
  const contentCore = imagePrompt
    ? imagePrompt
    : `${hook}. ${caption.substring(0, 120)}`;

  // If niche intelligence exists, use it to differentiate and make more viral
  const nicheMode = nicheIntelligence
    ? `

NICHE INTELLIGENCE (make this visually DIFFERENT from what competitors are doing):
${nicheIntelligence}

Your visual strategy: Stand out in the ${businessType} space by using unexpected compositions, unique lighting, or authentic moments competitors are missing.`
    : "";

  return `Social media background image for ${brandName}, a ${businessType} brand.

BRAND VISUAL DIRECTION — apply this aesthetic consistently to every image so the feed looks like one curated body of work:
${brandAesthetic}

Platform: ${platformName} — ${platformTactic}.

Composition approach for this specific post: ${approach}.

What this post is about: ${contentCore}
${nicheMode}

Strict rules — NO EXCEPTIONS:
- NO text, words, letters, numbers, signs, labels, captions, watermarks, or typography of any kind
- NO overlaid graphics, logos, or UI elements
- The image must be directly and obviously relevant to the post topic
- Do NOT show random faces staring at camera — if showing a person, show them naturally in context
- Do NOT include any religious markers (bindi, tilak, cross, hijab, etc.) — keep it culturally neutral
- Do NOT use stock photo clichés: no fake smiles, no business handshakes, no pointing at whiteboards
- High quality, cinematic, social-media-ready photograph or illustration
- Square 1:1 composition
- Pure visual only — text will be added separately
- GRID COHESION: This image must feel like it belongs in the same curated Instagram feed as all other images for this brand`.trim();
}

async function generateDalle(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "low",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("DALL-E error:", res.status, text);
      return null;
    }

    const data = await res.json();
    const item = data?.data?.[0];
    if (item?.url) return item.url;
    if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`;
    return null;
  } catch (err) {
    console.error("DALL-E fetch error:", err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  let body: {
    imagePrompt?: string;
    hook: string;
    caption: string;
    brandName: string;
    businessType: string;
    visualStyle?: string;
    postIndex: number;
    nicheIntelligence?: string;
    platform?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.hook && !body.imagePrompt) {
    return NextResponse.json({ error: "Missing prompt content" }, { status: 400 });
  }

  const prompt = buildPrompt(body);
  const imageUrl = await generateDalle(prompt, openaiKey);

  if (imageUrl) {
    return NextResponse.json({ imageUrl });
  }

  return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
}
