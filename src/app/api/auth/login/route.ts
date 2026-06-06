import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabase } from "@/lib/supabase";

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "dc_salt_2026").digest("hex");
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // Look up user by email
  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, password_hash, plan")
    .eq("email", email.toLowerCase())
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  // Verify password
  if (user.password_hash !== hashPassword(password)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  // Set session cookie
  const sessionData = Buffer.from(
    JSON.stringify({ userId: user.id, name: user.name, email: user.email, plan: user.plan, loggedIn: true })
  ).toString("base64");

  const response = NextResponse.json({ success: true, userId: user.id });
  response.cookies.set("dc_session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
