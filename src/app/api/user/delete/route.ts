import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function getSessionUser(request: NextRequest) {
  const cookie = request.cookies.get("dc_session")?.value;
  if (!cookie) return null;
  try { return JSON.parse(Buffer.from(cookie, "base64").toString()); } catch { return null; }
}

export async function DELETE(request: NextRequest) {
  const session = getSessionUser(request);
  if (!session?.userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const userId = session.userId;

  try {
    // 1. Delete all posts belonging to the user's brands
    const { data: brands } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", userId);

    if (brands && brands.length > 0) {
      const brandIds = brands.map((b) => b.id);
      await supabase.from("posts").delete().in("brand_id", brandIds);
    }

    // 2. Delete all brands
    await supabase.from("brands").delete().eq("user_id", userId);

    // 3. Delete the user account
    const { error: userDeleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (userDeleteError) {
      console.error("User delete error:", userDeleteError);
      return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
    }

    // 4. Clear session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("dc_session", "", { maxAge: 0, path: "/" });
    return response;
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Internal error deleting account." }, { status: 500 });
  }
}
