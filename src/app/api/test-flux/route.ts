/**
 * GET /api/test-flux
 * Quick test to confirm Together.ai + Flux is working.
 * Hit this endpoint once to verify — remove after testing.
 */

import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET() {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TOGETHER_API_KEY not set in environment." }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.together.xyz/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt: "A vibrant, modern social media branded background, bold colors, clean minimal design, professional",
        width: 1024,
        height: 1024,
        steps: 4,
        n: 1,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: "Together.ai error", details: data }, { status: res.status });
    }

    const imageUrl = data?.data?.[0]?.url ?? null;
    const b64 = data?.data?.[0]?.b64_json ?? null;

    return NextResponse.json({
      success: true,
      model: "FLUX.1-schnell-Free",
      imageUrl,
      hasBase64: !!b64,
      cost: "$0.000 (free model)",
    });

  } catch (err) {
    return NextResponse.json({ error: "Request failed", details: String(err) }, { status: 500 });
  }
}
