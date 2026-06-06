/**
 * POST /api/brand-kit/positioning
 * Takes all brand kit answers and generates a compelling, authentic
 * positioning statement using Claude — not a fill-in-the-blank template.
 */

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured." }, { status: 500 });
  }

  let kit: Record<string, unknown>;
  try {
    kit = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const prompt = `You are a brand strategist writing a positioning statement for a business.

Here is everything the brand owner told us about their brand:

BRAND PERSONALITY & VIBE: ${Array.isArray(kit.primaryVibe) ? kit.primaryVibe.join(", ") : kit.primaryVibe || "not specified"}
FORMALITY LEVEL: ${kit.formalityLevel || "not specified"}
HOW THEY WANT CUSTOMERS TO FEEL: ${Array.isArray(kit.customerEmotion) ? kit.customerEmotion.join(", ") : kit.customerEmotion || "not specified"}
BUSINESS SIZE: ${kit.businessSize || "not specified"}
CONTENT GOALS: ${Array.isArray(kit.contentGoal) ? kit.contentGoal.join(", ") : kit.contentGoal || "not specified"}
TONE OF VOICE: ${kit.toneOfVoice || "not specified"}
TARGET AGE RANGES: ${Array.isArray(kit.ageRanges) ? kit.ageRanges.join(", ") : kit.ageRanges || "not specified"}
TARGET LOCATION: ${kit.location || "not specified"}
CUSTOMER INTERESTS: ${kit.interests || "not specified"}
CUSTOMER PAIN POINTS: ${Array.isArray(kit.painPoints) ? (kit.painPoints as string[]).filter(Boolean).join("; ") : kit.painPoints || "not specified"}
WHAT THEY DO: ${kit.whatYouDo || "not specified"}
WHO THEY SERVE: ${kit.whoYouServe || "not specified"}
HOW THEY DIFFER FROM COMPETITION: ${kit.howYouDiffer || "not specified"}

Write a single, powerful positioning statement (2-3 sentences max) that:
- Captures the brand's true essence and personality
- Speaks directly to their ideal customer's pain points and desires
- Highlights what genuinely makes them different — not in a generic way
- Matches the tone they described (${kit.toneOfVoice || "their stated tone"})
- Sounds like something a real human brand would actually say — NOT corporate jargon
- Does NOT start with "We help" or use tired phrases like "world-class", "seamless", "passionate", "leverage", "solutions"

Output ONLY the positioning statement — no explanation, no quotes, no label.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Claude API failed." }, { status: 502 });
    }

    const data = await res.json();
    const statement = data.content?.[0]?.text?.trim();

    if (!statement) {
      return NextResponse.json({ error: "Empty response." }, { status: 502 });
    }

    return NextResponse.json({ statement });
  } catch (err) {
    console.error("Positioning statement error:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
