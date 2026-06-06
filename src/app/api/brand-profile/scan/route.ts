/**
 * POST /api/brand-profile/scan
 * Fetches a website URL, extracts text content, passes to Claude API,
 * and returns auto-filled brand profile fields.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL is required." }, { status: 400 });

    // Normalize URL
    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;

    // Fetch the website
    let pageText = "";
    try {
      const res = await fetch(cleanUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; DigitallyCookedBot/1.0)" },
        signal: AbortSignal.timeout(10000),
      });
      const html = await res.text();
      // Strip HTML tags and collapse whitespace
      pageText = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 6000); // Limit to ~6000 chars for Claude
    } catch {
      return NextResponse.json({ error: "Could not fetch that website. Please check the URL and try again." }, { status: 400 });
    }

    if (!pageText || pageText.length < 50) {
      return NextResponse.json({ error: "Could not read enough content from that website. Try a different URL." }, { status: 400 });
    }

    // Call Claude API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI scanner not configured." }, { status: 500 });
    }

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Analyze this website content and extract brand information. Return ONLY a valid JSON object with these exact fields. If you can't determine a value, use an empty string.

Website URL: ${cleanUrl}
Website content: ${pageText}

Return this exact JSON structure:
{
  "brandName": "the business name",
  "businessType": "one of: Retail, Service, Restaurant, Tech, Healthcare, Education, Fitness, Beauty, Real Estate, Other",
  "location": "city/country if mentioned, otherwise empty string",
  "businessDescription": "2-3 sentence description of what this business does",
  "topProducts": "their main products or services, comma separated",
  "uniqueFactor": "what makes them different or their key value proposition",
  "idealCustomer": "who their target customer is",
  "contentTone": "one of: Professional, Casual, Humorous, Inspirational, Educational, Bold",
  "visualStyle": "one of: Minimal, Bold, Elegant, Playful, Corporate, Lifestyle",
  "brandColors": "primary brand colors if visible (e.g. Navy blue, Gold)",
  "brandPersonality": "2-3 words describing the brand personality",
  "brandMission": "their mission statement or what they do today, one sentence",
  "brandVision": "their vision or what they are building toward, one sentence"
}

Return ONLY the JSON object, no other text.`,
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      console.error("Claude API error:", await claudeRes.text());
      return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 500 });
    }

    const claudeData = await claudeRes.json();
    const content = claudeData.content?.[0]?.text ?? "";

    // Parse JSON from Claude response
    let brandData;
    try {
      // Extract JSON if Claude wrapped it in markdown
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      brandData = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      return NextResponse.json({ error: "Could not parse brand data. Please fill the form manually." }, { status: 500 });
    }

    return NextResponse.json({ success: true, brand: brandData });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
