import { NextRequest, NextResponse } from "next/server";

const ZERNIO_BASE = "https://zernio.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    const { posts, bearerToken } = await request.json();

    if (!bearerToken) {
      return NextResponse.json({ error: "No Zernio token provided." }, { status: 400 });
    }

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ error: "No posts to schedule." }, { status: 400 });
    }

    const results = await Promise.allSettled(
      posts.map(async (post: { platform: string; content: string; scheduledAt: string }) => {
        const res = await fetch(`${ZERNIO_BASE}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            platform: post.platform,
            content: post.content,
            scheduled_at: post.scheduledAt,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Zernio error for ${post.platform}: ${err}`);
        }

        return res.json();
      })
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      scheduled: succeeded,
      failed,
      message: `${succeeded} posts scheduled successfully via Zernio.`,
    });
  } catch (err) {
    console.error("Zernio schedule error:", err);
    return NextResponse.json({ error: "Failed to schedule posts." }, { status: 500 });
  }
}
