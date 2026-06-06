import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabase } from "@/lib/supabase";

function getSessionUser(request: NextRequest) {
  const cookie = request.cookies.get("dc_session")?.value;
  if (!cookie) return null;
  try { return JSON.parse(Buffer.from(cookie, "base64").toString()); } catch { return null; }
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "dc_salt_2026").digest("hex");
}

export async function PUT(request: NextRequest) {
  const session = getSessionUser(request);
  if (!session?.userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await request.json();
  const { type } = body;

  if (type === "profile") {
    const { name, email } = body;
    if (!name || !email) return NextResponse.json({ error: "Name and email required." }, { status: 400 });

    const { error } = await supabase
      .from("users")
      .update({ name: name.trim(), email: email.toLowerCase().trim() })
      .eq("id", session.userId);

    if (error) return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });

    // Update session cookie
    const sessionData = Buffer.from(
      JSON.stringify({ ...session, name: name.trim(), email: email.toLowerCase().trim() })
    ).toString("base64");

    const response = NextResponse.json({ success: true });
    response.cookies.set("dc_session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  if (type === "password") {
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) return NextResponse.json({ error: "Both passwords required." }, { status: 400 });
    if (newPassword.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

    // Verify current password
    const { data: user } = await supabase.from("users").select("password_hash").eq("id", session.userId).single();
    if (!user || user.password_hash !== hashPassword(currentPassword)) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    const { error } = await supabase
      .from("users")
      .update({ password_hash: hashPassword(newPassword) })
      .eq("id", session.userId);

    if (error) return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid update type." }, { status: 400 });
}
