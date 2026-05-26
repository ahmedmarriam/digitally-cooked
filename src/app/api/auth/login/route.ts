import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const sessionData = Buffer.from(
    JSON.stringify({ email, loggedIn: true, ts: Date.now() })
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
