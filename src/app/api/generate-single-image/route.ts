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

function buildPrompt(body: {
  imagePrompt?: string;
  hook: string;
  caption: string;
  brandName: string;
  businessType: string;
  postIndex: number;
  nicheIntelligence?: string;
  platform?: string;
}): string {
  const { imagePrompt, hook, caption, brandName, businessType, postIndex, nicheIntelligence, platform } = body;
  const approach = VISUAL_APPROACHES[postIndex % VISUAL_APPROACHES.length];
  const platformName = platform?.toLowerCase() ?? "instagram";
  const platformTactic = PLATFORM_TACTICS[platformName] || PLATFORM_TACTICS.instagram;

  // Use the pre-written image prompt as the content core if available
  const contentCore = imagePrompt
    ? imagePrompt
    : `${hook}. ${caption.substring(0, 120)}`;

  // If niche intelligence exists, use it to differentiate and make more viral
  const nichemode = nicheIntelligence
    ? `

NICHE INTELLIGENCE (make this visually DIFFERENT from what competitors are doing):
${nicheIntelligence}

Your visual strategy: Stand out in the ${businessType} space by using unexpected compositions, unique lighting, or authentic moments competitors are missing. Make it so engaging users can't scroll past.`
    : "";

  return `Social media background image for ${brandName}, a ${businessType} brand.

Platform: ${platformName} — ${platformTactic}.

Visual approach: ${approach}.

What this post is about: ${contentCore}
${nichemode}

Strict rules — NO EXCEPTIONS:
- NO text, words, letters, numbers, signs, labels, captions, watermarks, or typography of any kind anywhere in the image
- NO overlaid graphics, logos, or UI elements
- The image must be directly and obviously relevant to the post topic
- Do NOT show random faces staring at camera — if showing a person, show them naturally in context doing something
- Do NOT include any religious markers (bindi, tilak, cross, hijab, etc.) — keep it culturally neutral
- Do NOT use stock photo clichés: no fake smiles, no business handshakes, no pointing at whiteboards
- High quality, cinematic, social-media-ready photograph or illustration
- Square 1:1 composition
- Pure visual only — text will be added separately
- VIRAL PRIORITY: The visual must be scroll-stopping, emotionally resonant, and impossible to ignore`.trim();
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
