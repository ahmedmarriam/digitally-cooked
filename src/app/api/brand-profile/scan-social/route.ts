/**
 * POST /api/brand-profile/scan-social
 * Scans a social media profile and returns a strategic content analysis:
 * what works, what doesn't, posting frequency, and a content strategy recommendation.
 */

import { NextRequest, NextResponse } from "next/server";

const SCREENSHOT_ONLY = ["instagram", "tiktok"];

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI not configured." }, { status: 500 });

  try {
    const { platform, url, screenshot } = await request.json();
    if (!platform) return NextResponse.json({ error: "Platform required." }, { status: 400 });

    const platformLower = platform.toLowerCase();
    let analysisText = "";

    const analysisPrompt = `You are a social media strategist reviewing a brand's ${platform} presence.

Analyze their content and return ONLY a JSON object with these fields:

{
  "visualAesthetic": "describe their current visual style, colors, layout in 1 sentence",
  "contentTypes": "list the types of posts they make (e.g. product shots, behind-the-scenes, tips, testimonials)",
  "tone": "their current tone of voice (e.g. casual and friendly, professional, humorous)",
  "postingFrequency": "estimate how often they post (e.g. daily, 3x per week, sporadic)",
  "whatWorks": "specific content types or approaches that appear to drive engagement — be specific",
  "whatDoesntWork": "what is getting low engagement or missing the mark — be honest and specific",
  "contentGaps": "what types of content are missing that would improve performance",
  "recommendedStrategy": "a clear 2-sentence strategy recommendation: what to do more of and what to change",
  "postingStyle": "one-sentence summary of their overall posting style",
  "strengths": "what they are genuinely doing well",
  "improvements": "the single most impactful improvement they should make"
}

Return ONLY the JSON object, no other text.`;

    // ── Screenshot path (vision) ──
    if (screenshot && screenshot.startsWith("data:")) {
      const mediaType = screenshot.split(";")[0].split(":")[1] ?? "image/jpeg";
      const base64Data = screenshot.split(",")[1];

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: mediaType, data: base64Data },
                },
                { type: "text", text: `This is a screenshot of a brand's ${platform} profile/feed.\n\n${analysisPrompt}` },
              ],
            },
          ],
        }),
      });

      if (!res.ok) return NextResponse.json({ error: "Analysis failed." }, { status: 500 });
      const data = await res.json();
      analysisText = data.content?.[0]?.text ?? "";
    }

    // ── URL scrape path ──
    else if (url && !SCREENSHOT_ONLY.includes(platformLower)) {
      let pageText = "";
      try {
        const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
        const fetchRes = await fetch(cleanUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; DigitallyCookedBot/1.0)" },
          signal: AbortSignal.timeout(8000),
        });
        const html = await fetchRes.text();

        if (html.toLowerCase().includes("login") && html.length < 5000) {
          return NextResponse.json({ blocked: true, platform });
        }

        pageText = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 6000);
      } catch {
        return NextResponse.json({ blocked: true, platform });
      }

      if (!pageText || pageText.length < 100) {
        return NextResponse.json({ blocked: true, platform });
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Analyze this ${platform} profile content.\n\n${analysisPrompt}\n\nProfile content: ${pageText}`,
            },
          ],
        }),
      });

      if (!res.ok) return NextResponse.json({ error: "Analysis failed." }, { status: 500 });
      const data = await res.json();
      analysisText = data.content?.[0]?.text ?? "";
    }

    else {
      return NextResponse.json({ blocked: true, platform });
    }

    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisText);
      return NextResponse.json({ success: true, platform, analysis });
    } catch {
      return NextResponse.json({ error: "Could not parse analysis." }, { status: 500 });
    }
  } catch (err) {
    console.error("Scan social error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
