/**
 * POST /api/generate-single-image
 * Generates a Flux.1-schnell image (via Together.ai) matching the post content.
 * Uses hook + caption + brand context to build a specific, varied prompt.
 * Cycles through visual styles so images are never all the same type.
 * 13x cheaper than DALL-E at $0.003/image.
 *
 * Body: { imagePrompt?, hook, caption, brandName, businessType, postIndex }
 * Returns: { imageUrl: string }
 */

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120; // increased for rate limit retry waits (8s + 16s + 24s + generation)

// Cycles so each post gets a different visual approach
const VISUAL_APPROACHES = [
  "a person naturally engaged in the activity — working, eating, in conversation, using a product — candid and real, not posed",
  "an atmospheric environment or setting that represents the theme — no people, mood-driven, rich textures and natural light",
  "close-up detail: hands working, a key object, a surface, a product — craft and texture visible",
  "a lifestyle scene that represents the outcome or feeling — dynamic, authentic, shows context and story",
  "abstract or conceptual composition — shapes, light, motion blur, patterns that visually represent the idea",
  "editorial-style: a real moment captured, minimal staging, authentic environment, true to the brand world",
];

function buildPrompt(body: {
  imagePrompt?: string;
  hook: string;
  caption: string;
  brandName: string;
  businessType: string;
  postIndex: number;
}): string {
  const { imagePrompt, hook, caption, brandName, businessType, postIndex } = body;
  const approach = VISUAL_APPROACHES[postIndex % VISUAL_APPROACHES.length];

  // Use the pre-written image prompt as the content core if available
  const contentCore = imagePrompt
    ? imagePrompt
    : `${hook}. ${caption.substring(0, 120)}`;

  return `Social media background image for ${brandName}, a ${businessType} brand.

Visual approach: ${approach}.

What this post is about: ${contentCore}

Strict rules — NO EXCEPTIONS:
- NO text, words, letters, numbers, signs, labels, captions, watermarks, or typography of any kind anywhere in the image
- NO overlaid graphics, logos, or UI elements
- The image must be directly and obviously relevant to the post topic
- Do NOT show random faces staring at camera — if showing a person, show them naturally in context doing something
- Do NOT include any religious markers (bindi, tilak, cross, hijab, etc.) — keep it culturally neutral
- Do NOT use stock photo clichés: no fake smiles, no business handshakes, no pointing at whiteboards
- High quality, cinematic, social-media-ready photograph or illustration
- Square 1:1 composition
- Pure visual only — text will be added separately`.trim();
}

async function generateFlux(prompt: string, apiKey: string, retries = 3): Promise<string | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.together.xyz/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "black-forest-labs/FLUX.1-schnell",
          prompt,
          width: 1024,
          height: 1024,
          steps: 4,
          n: 1,
        }),
      });

      if (res.status === 429) {
        const wait = attempt * 8000; // 8s, 16s, 24s — gives rate limit window time to reset
        console.warn(`Flux rate limited. Retrying in ${wait}ms (attempt ${attempt}/${retries})`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      if (!res.ok) {
        const text = await res.text();
        console.error("Flux error:", res.status, text);
        return null;
      }

      const data = await res.json();
      const item = data?.data?.[0];
      if (item?.url) return item.url;
      if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`;
      return null;
    } catch (err) {
      console.error("Flux fetch error:", err);
      return null;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  const togetherKey = process.env.TOGETHER_API_KEY;
  if (!togetherKey) {
    return NextResponse.json({ error: "Together.ai API key not configured" }, { status: 500 });
  }

  let body: {
    imagePrompt?: string;
    hook: string;
    caption: string;
    brandName: string;
    businessType: string;
    postIndex: number;
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
  const imageUrl = await generateFlux(prompt, togetherKey);

  if (imageUrl) {
    return NextResponse.json({ imageUrl });
  }

  return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
}
