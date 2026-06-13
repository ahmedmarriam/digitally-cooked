/**
 * GET /api/posts?platform=instagram
 * Returns all posts for the logged-in user's most recent brand.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function getSessionUser(request: NextRequest) {
  const cookie = request.cookies.get("dc_session")?.value;
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie, "base64").toString());
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const session = getSessionUser(request);
  if (!session?.userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const brandId = searchParams.get("brandId");

  let brandQuery = supabase
    .from("brands")
    .select("id, brand_name, generation_status, platforms, brand_colors, logo_url, content_tone, visual_style, business_type, niche_intelligence")
    .eq("user_id", session.userId);

  if (brandId) {
    brandQuery = brandQuery.eq("id", brandId);
  } else {
    brandQuery = brandQuery.order("created_at", { ascending: false }).limit(1);
  }

  const { data: brandData } = await brandQuery;
  const brand = Array.isArray(brandData) ? brandData[0] : brandData;

  if (!brand) {
    return NextResponse.json({ posts: [], brand: null });
  }

  // Fetch posts
  let query = supabase
    .from("posts")
    .select("*")
    .eq("brand_id", brand.id)
    .order("day", { ascending: true });

  if (platform && platform !== "all") {
    query = query.eq("platform", platform.toLowerCase());
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
  }

  // Parse niche_intelligence and expose it as platformNicheIntelligence (keyed by lowercase platform)
  let platformNicheIntelligence: Record<string, Record<string, string>> = {};
  if (brand.niche_intelligence) {
    try {
      const raw = typeof brand.niche_intelligence === "string"
        ? JSON.parse(brand.niche_intelligence)
        : brand.niche_intelligence;
      // Normalize all keys to lowercase for reliable lookup
      for (const key of Object.keys(raw)) {
        platformNicheIntelligence[key.toLowerCase()] = raw[key];
      }
    } catch { /* malformed niche intelligence — skip */ }
  }

  const brandWithNiche = { ...brand, platformNicheIntelligence };

  return NextResponse.json({ posts: posts ?? [], brand: brandWithNiche });
}
