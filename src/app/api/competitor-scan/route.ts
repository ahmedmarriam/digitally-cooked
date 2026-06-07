/**
 * POST /api/competitor-scan
 * Accepts 2-3 competitor names + their top performing post hooks/captions.
 * Claude extracts niche patterns — hook styles, content formats, hashtag clusters,
 * emotional triggers — WITHOUT copying the content. Returns intelligence only.
 */

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

interface Competitor {
  name: string;
  posts: string; // pasted hooks/captions from their top posts
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured." }, { status: 500 });
  }

  let competitors: Competitor[] = [];
  try {
    const body = await request.json();
    competitors = (body.competitors ?? []).filter(
      (c: Competitor) => c.name?.trim() && c.posts?.trim()
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (competitors.length === 0) {
    return NextResponse.json({ error: "No competitor data provided." }, { status: 400 });
  }

  const competitorContext = competitors
    .map((c, i) => `COMPETITOR ${i + 1} — ${c.name}:\n${c.posts.trim()}`)
    .join("\n\n---\n\n");

  const prompt = `You are a social media strategist analysing what makes content perform in a specific niche.

Study the following competitor posts carefully. Do NOT copy any content. Instead, extract the underlying PRINCIPLES and PATTERNS that make this content work.

${competitorContext}

Analyse and return a JSON object with these exact fields:

{
  "hookPatterns": "Describe the hook formula that gets attention — question hooks? bold statements? stats? pain points first? (2-3 sentences)",
  "contentFormats": "What content formats dominate — education, storytelling, transformation, controversy, behind-the-scenes? (1-2 sentences)",
  "emotionalTriggers": "What emotions do these posts activate — fear, aspiration, curiosity, humour, validation? (1-2 sentences)",
  "toneAndVoice": "How do they speak — casual or formal, long or short, personal or distant? (1-2 sentences)",
  "hashtagStrategy": "What hashtag approach works — niche-specific, broad, branded, mixed? Give 5-8 hashtag examples from patterns seen. (1-2 sentences + examples)",
  "whatMakesItWork": "The single most powerful thing this niche responds to — the core insight. (2-3 sentences)",
  "howToDoItBetter": "Specifically how our brand should apply these patterns but make it MORE authentic, MORE original, and ONE level above these competitors. (2-3 sentences)"
}

CRITICAL RULES:
- Never reproduce actual competitor text verbatim
- Focus on patterns and principles, not specific content
- Be specific and actionable, not generic
- Output ONLY valid JSON — no explanation, no markdown fences`;

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
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Claude API failed." }, { status: 502 });
    }

    const data = await res.json();
    const raw = data.content?.[0]?.text?.trim() ?? "";

    // Parse the JSON response
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    let intelligence;
    try {
      intelligence = JSON.parse(cleaned);
    } catch {
      // Return raw text if JSON parse fails
      intelligence = { summary: cleaned };
    }

    return NextResponse.json({ success: true, intelligence });
  } catch (err) {
    console.error("Competitor scan error:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
