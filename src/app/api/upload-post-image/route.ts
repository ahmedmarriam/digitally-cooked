import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BUCKET = "post-images";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const brandId = formData.get("brandId") as string;
    const postGroup = formData.get("postGroup") as string;

    if (!file || !brandId || !postGroup) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `posts/${brandId}/pg${postGroup}-${Date.now()}.jpg`;

    // Ensure bucket exists
    await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {});

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: "image/jpeg", upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    // Update all posts with this post_group
    await supabase
      .from("posts")
      .update({ image_url: data.publicUrl })
      .eq("brand_id", brandId)
      .eq("post_group", parseInt(postGroup));

    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
