import { NextRequest, NextResponse } from "next/server";

// Webhook URL kept server-side only — never expose to client
const WEBHOOK_URL = "https://hook.us2.make.com/aba6mfll6svmbqt1zdxrya28p6t4ac1d";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Make.com webhook error:", res.status, text);
      return NextResponse.json({ error: "Pipeline submission failed." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Brand profile submit error:", err);
    return NextResponse.json({ error: "Internal error submitting brand profile." }, { status: 500 });
  }
}
