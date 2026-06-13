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

/**
 * Visual approaches split into PERSON and SCENE pools.
 * Pattern: postIndex % 4 === 0 → person; all others → scene.
 * This means only 1 in 4 posts shows a face — the rest are environments,
 * objects, or abstractions. Prevents the "same woman 4 times" problem.
 */
const PERSON_APPROACHES = [
  "a single person captured candidly — seen from the side, slightly behind, or at shoulder-level. Never staring at camera. Natural pose in their real environment. The setting is as important as the person",
  "hands in motion — working, writing, creating, gesturing. No face visible. The hands tell the story. Close and intimate, sharp focus on what they're doing",
];

const SCENE_APPROACHES = [
  "an atmospheric environment or setting — NO people. The space itself carries the emotion. Mood-driven, rich textures, deliberate natural light, negative space",
  "close-up of a meaningful object or surface — a product, a tool, a texture, fabric, food, a book, a desk. NO people. Craft and material are visible, beautifully lit",
  "abstract or conceptual composition — shapes, light beams, shadows, motion blur, bokeh, geometric patterns that represent the post idea. NO people. Visually striking",
  "a styled flat-lay or still life — purposeful arrangement of objects relevant to the brand world. Viewed from above or at slight angle. Clean, designed, intentional. NO people",
  "an environment shot wide — a room, a street, a workspace, nature — seen without any person present. Shows the world the brand inhabits. Atmospheric and considered",
];

// Cultural context based on brand location — makes images feel authentic to the market
function getCulturalContext(location: string): string {
  const loc = (location ?? "").toLowerCase();

  if (
    loc.includes("pakistan") || loc.includes("lahore") || loc.includes("karachi") ||
    loc.includes("islamabad") || loc.includes("peshawar") || loc.includes("faisalabad") ||
    loc.includes("multan") || loc.includes("rawalpindi") || loc.includes("quetta")
  ) {
    return `CULTURAL CONTEXT — CRITICAL: This brand is Pakistani. All people must have Pakistani South Asian appearance and aesthetic.
- Pakistani urban style: smart casuals, modest wear, kurtas, shalwar kameez, or contemporary western clothing
- Pakistani home and office aesthetics: warm lighting, marble floors, ornate textiles, Pakistani architecture
- Lahore/Karachi professional class visual feel — aspirational but grounded
- STRICTLY NOT Indian: no Indian cultural markers, no Indian styling, no Bollywood aesthetic, no bindis, no Indian street contexts
- People should feel Pakistani — NOT generically South Asian, NOT Indian`;
  }
  if (loc.includes("uae") || loc.includes("dubai") || loc.includes("abu dhabi") || loc.includes("sharjah")) {
    return "CULTURAL CONTEXT: Modern Gulf/UAE aesthetic — sleek, aspirational, multicultural Dubai setting. Contemporary architecture, luxury interiors.";
  }
  if (loc.includes("uk") || loc.includes("united kingdom") || loc.includes("london")) {
    return "CULTURAL CONTEXT: British setting — modern UK urban aesthetic. Diverse British representation. British interiors and city environments.";
  }
  if (loc.includes("india") || loc.includes("mumbai") || loc.includes("delhi") || loc.includes("bangalore")) {
    return "CULTURAL CONTEXT: Modern urban Indian aesthetic — contemporary Indian fashion and environments. Vibrant but professional.";
  }
  return "";
}

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
  location?: string;
  postIndex: number;
  nicheIntelligence?: string;
  platform?: string;
}): string {
  const { imagePrompt, hook, caption, brandName, businessType, visualStyle, location, postIndex, nicheIntelligence, platform } = body;

  // Smart subject variety: only 1 in 4 posts shows a person (prevents "same face 4 times")
  const isPersonPost = postIndex % 4 === 0;
  const approach = isPersonPost
    ? PERSON_APPROACHES[Math.floor(postIndex / 4) % PERSON_APPROACHES.length]
    : SCENE_APPROACHES[postIndex % SCENE_APPROACHES.length];

  const platformName = platform?.toLowerCase() ?? "instagram";
  const platformTactic = PLATFORM_TACTICS[platformName] || PLATFORM_TACTICS.instagram;

  // Brand aesthetic fingerprint — keeps all images tonally consistent
  const brandAesthetic = getBrandAesthetic(visualStyle ?? "", businessType);

  // Cultural context — ensures images feel authentic to the brand's market
  const culturalContext = getCulturalContext(location ?? "");
  const culturalLine = culturalContext ? `\n${culturalContext}\n` : "";

  // Use the pre-written image prompt as the content core if available
  const contentCore = imagePrompt
    ? imagePrompt
    : `${hook}. ${caption.substring(0, 120)}`;

  // Niche intelligence for competitive differentiation
  const nicheMode = nicheIntelligence
    ? `\nNICHE INTELLIGENCE (make this visually DIFFERENT from competitors):\n${nicheIntelligence}\nStand out by using unexpected compositions or authentic moments competitors are missing.`
    : "";

  return `Social media background image for ${brandName}, a ${businessType} brand.

BRAND VISUAL DIRECTION — apply consistently across all images so the grid reads as one curated body of work:
${brandAesthetic}
${culturalLine}
Platform: ${platformName} — ${platformTactic}.

Subject approach for this post: ${approach}.

What this post is about: ${contentCore}
${nicheMode}

Strict rules — NO EXCEPTIONS:
- NO text, words, letters, numbers, signs, labels, captions, watermarks, or typography of any kind
- NO overlaid graphics, logos, or UI elements
- The image must be directly relevant to the post topic
- If showing a person: NEVER staring at camera. Show them in profile, from behind, or naturally engaged in context
- Do NOT include any religious markers (bindi, tilak, cross, hijab, etc.)
- Do NOT use stock photo clichés: no fake smiles, no pointing at whiteboards, no staged business handshakes
- High quality, cinematic, social-media-ready photograph
- Square 1:1 composition
- Pure visual only — text will be added separately
- GRID COHESION: This image must feel like it belongs in the same curated Instagram feed as every other image for this brand — same mood, same lighting feel, same world`.trim();
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
    location?: string;
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
