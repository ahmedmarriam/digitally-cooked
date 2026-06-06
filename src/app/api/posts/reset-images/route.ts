/**
 * POST /api/posts/reset-images
 * Clears image_url for posts belonging to a brand.
 * If postGroup is provided, resets only that concept group.
 * If not, resets all posts for the brand.
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

export async function POST(request: NextRequest) {
  const session = getSessionUser(request);
  if (!session?.userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { brandId, postGroup } = await request.json();
    if (!brandId) {
      return NextResponse.json({ error: "Missing brandId." }, { status: 400 });
    }

    // Verify this brand belongs to the user
    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("id", brandId)
      .eq("user_id", session.userId)
      .single();

    if (!brand) {
      return NextResponse.json({ error: "Brand not found." }, { status: 404 });
    }

    let query = supabase
      .from("posts")
      .update({ image_url: null })
      .eq("brand_id", brandId);

    // If postGroup provided, only reset that concept group
    if (postGroup !== undefined && postGroup !== null) {
      query = query.eq("post_group", postGroup);
    }

    const { error } = await query;

    if (error) {
      console.error("Reset images error:", error);
      return NextResponse.json({ error: "Failed to reset images." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset images error:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
