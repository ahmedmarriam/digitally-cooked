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

  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, plan, created_at")
    .eq("id", session.userId)
    .single();

  if (error || !user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  return NextResponse.json({ user });
}
