import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function getSessionUser(request: NextRequest) {
  const cookie = request.cookies.get("dc_session")?.value;
  if (!cookie) return null;
  try { return JSON.parse(Buffer.from(cookie, "base64").toString()); } catch { return null; }
}

export async function GET(request: NextRequest) {
  const session = getSessionUser(request);
  if (!session?.userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { data: brands } = await supabase
    .from("brands")
    .select("id, brand_name, business_type, generation_status, created_at")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ brands: brands ?? [] });
}
