import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabase } from "@/lib/supabase";

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "dc_salt_2026").digest("hex");
}

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  // Check if email already exists
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase())
    .single();

  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  // Create user in DB
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name,
      email: email.toLowerCase(),
      password_hash: hashPassword(password),
      plan: "starter",
    })
    .select()
    .single();

  if (error || !user) {
    console.error("Signup DB error:", error);
    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
  }

  // Set session cookie with real user ID
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
