import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Webhook URL kept server-side only — never expose to client
const WEBHOOK_URL = "https://hook.us2.make.com/aba6mfll6svmbqt1zdxrya28p6t4ac1d";

function getSessionUser(request: NextRequest) {
  const cookie = request.cookies.get("dc_session")?.value;
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie, "base64").toString());
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = getSessionUser(request);

    // Save brand profile to Supabase if user is logged in
    let brandId: string | null = null;
    if (session?.userId) {
      const { data: brand, error: brandError } = await supabase
        .from("brands")
        .insert({
          user_id: session.userId,
          // Step 1 — Brand Strategy
          brand_personality: body.brand_personality,
          tone_of_voice: body.content_tone,
          target_audience: body.ideal_customer,
          audience_pain_points: Array.isArray(body.painPoints) ? body.painPoints.filter(Boolean).join("; ") : body.audience_pain_points,
          audience_goals: body.audience_goals,
          positioning_statement: body.positioning_statement,
          brand_colors: body.brandColors,
          brand_mission: body.brandMission,
          brand_vision: body.brandVision,
          // Step 2 — Content Details
          brand_name: body.brandName,
          owner_name: body.ownerName,
          business_type: body.businessType,
          location: body.location,
          business_description: body.businessDescription,
          top_products: body.topProducts,
          unique_factor: body.uniqueFactor,
          ideal_customer: body.idealCustomer,
          content_tone: body.contentTone,
          visual_style: body.visualStyle,
          monthly_goal: body.monthlyGoal,
          posting_frequency: body.postingFrequency,
          platforms: body.platforms,
          wants_reels: body.wantsReels ?? false,
          logo_url: body.logoBase64 || body.logoFileName || null,
          caption_language: body.captionLanguage ?? "English",
          social_style_context: body.socialStyleContext ?? null,
          niche_intelligence: body.nicheIntelligence ?? null,
          generation_status: "generating",
        })
        .select()
        .single();

      if (brandError) {
        console.error("Brand save error:", brandError);
      } else {
        brandId = brand?.id ?? null;
      }
    }

    // Forward to Make.com with snake_case keys (Make.com Set Variables uses {{1.brand_name}} etc.)
    const webhookPayload = {
      brand_name:           body.brandName,
      owner_name:           body.ownerName,
      business_type:        body.businessType,
      location:             body.location,
      business_description: body.businessDescription,
      top_products:         body.topProducts,
      unique_factor:        body.uniqueFactor,
      ideal_customer:       body.idealCustomer,
      content_tone:         body.contentTone,
      visual_style:         body.visualStyle,
      brand_colors:         body.brandColors,
      monthly_goal:         body.monthlyGoal,
      posting_frequency:    body.postingFrequency,
      platforms:            body.platforms,
      caption_language:     body.captionLanguage,
      brand_id:             brandId,
      user_id:              session?.userId ?? null,
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Make.com webhook error:", res.status, text);
      return NextResponse.json({ error: "Pipeline submission failed." }, { status: 502 });
    }

    return NextResponse.json({ success: true, brandId });
  } catch (err) {
    console.error("Brand profile submit error:", err);
    return NextResponse.json({ error: "Internal error submitting brand profile." }, { status: 500 });
  }
}
