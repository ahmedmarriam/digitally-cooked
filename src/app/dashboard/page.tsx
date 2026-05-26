"use client";

import AppSidebar from "@/components/AppSidebar";

const PLATFORMS = ["Instagram", "TikTok", "LinkedIn", "Twitter/X", "Facebook"] as const;
type Platform = (typeof PLATFORMS)[number];

interface Post {
  day: number;
  platform: Platform;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string[];
}

const SAMPLE_POSTS: Post[] = [
  {
    day: 1,
    platform: "Instagram",
    hook: "You're posting every day and still getting zero engagement. Here's why.",
    caption: "Most brands flood their feed with content that talks AT their audience instead of WITH them. The fix? Lead with a problem your ideal customer lies awake thinking about — then solve it in the caption.",
    cta: "Save this for your next content planning session 📌",
    hashtags: ["#ContentStrategy", "#InstagramGrowth", "#SocialMediaTips", "#BrandBuilding"],
  },
  {
    day: 2,
    platform: "LinkedIn",
    hook: "I doubled our organic reach in 30 days without spending a single dollar on ads.",
    caption: "The secret wasn't posting more. It was posting smarter. We stopped chasing trends and started owning one specific topic. Consistency + niche depth = algorithm love. Here's the exact framework we used.",
    cta: "Drop a 🔥 if you want the full breakdown.",
    hashtags: ["#LinkedInGrowth", "#MarketingStrategy", "#OrganicMarketing", "#ContentMarketing"],
  },
  {
    day: 3,
    platform: "TikTok",
    hook: "POV: Your content finally stops the scroll 👀",
    caption: "The first 2 seconds are everything on TikTok. If your hook doesn't spark curiosity, fear, or joy — you've already lost them. Here are 5 hook formulas that work in ANY niche.",
    cta: "Follow for daily content strategies that actually convert.",
    hashtags: ["#TikTokMarketing", "#ContentCreator", "#GrowthHacking", "#SocialMediaStrategy"],
  },
  {
    day: 4,
    platform: "Twitter/X",
    hook: "Unpopular opinion: Consistency beats creativity every single time.",
    caption: "The brands winning on social media aren't the most creative ones. They're the most consistent ones. Show up, deliver value, repeat. The algorithm rewards presence over perfection.",
    cta: "Retweet if you agree. Reply if you don't — I'll change your mind.",
    hashtags: ["#MarketingTips", "#ContentCreation", "#GrowthMindset"],
  },
  {
    day: 5,
    platform: "Instagram",
    hook: "Your brand has a voice. Does your audience actually recognise it?",
    caption: "Brand voice isn't just tone — it's the emotional fingerprint your content leaves behind. Think about the 3 words you want people to feel when they see your post. Now ask: does every caption, story, and reel actually deliver that?",
    cta: "Comment your 3 brand voice words below 👇",
    hashtags: ["#BrandVoice", "#BrandIdentity", "#ContentMarketing", "#InstagramStrategy"],
  },
  {
    day: 6,
    platform: "Facebook",
    hook: "The #1 reason your social media ads aren't converting (it's not the budget).",
    caption: "Most brands spend thousands on paid ads but forget the basics: the offer needs to be irresistible before the targeting even matters. Fix your value proposition first. Then scale.",
    cta: "Share this with a business owner who needs to hear it.",
    hashtags: ["#FacebookAds", "#DigitalMarketing", "#PaidAds", "#MarketingAdvice"],
  },
  {
    day: 7,
    platform: "LinkedIn",
    hook: "We went from 200 to 12,000 followers in 6 months. No paid ads. No viral moments.",
    caption: "Just a repeatable content system built on three pillars: education, entertainment, and empathy. Every post we create hits at least two of those three. That's it. That's the whole strategy.",
    cta: "Save this post and audit your last 10 pieces of content against these pillars.",
    hashtags: ["#LinkedInStrategy", "#ContentSystem", "#OrganicGrowth", "#SocialMediaMarketing"],
  },
  {
    day: 8,
    platform: "TikTok",
    hook: "What if your next viral video was already sitting in your drafts? 👀",
    caption: "Repurposing isn't lazy — it's leverage. That blog post? 5 TikToks. That podcast episode? 3 LinkedIn posts. That customer testimonial? Instagram carousel + story. One idea, infinite formats.",
    cta: "Comment 'REPURPOSE' and I'll send you my content multiplication framework.",
    hashtags: ["#ContentRepurposing", "#ContentStrategy", "#CreatorTips", "#TikTokGrowth"],
  },
];

const platformColors: Record<Platform, { bg: string; text: string; border: string }> = {
  Instagram: { bg: "rgba(236,72,153,0.12)", text: "#ec4899", border: "rgba(236,72,153,0.25)" },
  TikTok: { bg: "rgba(0,242,234,0.08)", text: "#00f2ea", border: "rgba(0,242,234,0.2)" },
  LinkedIn: { bg: "rgba(10,102,194,0.12)", text: "#60a5fa", border: "rgba(96,165,250,0.25)" },
  "Twitter/X": { bg: "rgba(241,241,241,0.06)", text: "#e2e8f0", border: "rgba(241,241,241,0.15)" },
  Facebook: { bg: "rgba(66,103,178,0.12)", text: "#818cf8", border: "rgba(129,140,248,0.25)" },
};

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F0E1A", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <AppSidebar />

      <main style={{ flex: 1, overflowY: "auto", padding: "36px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "6px", letterSpacing: "-0.02em" }}>
                Your Content Pack 🍳
              </h1>
              <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.9rem" }}>
                30-day content calendar — ready to publish
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(123,47,255,0.12)", border: "1px solid rgba(123,47,255,0.25)", color: "#a78bfa", fontSize: "0.82rem", fontWeight: 600 }}>
                ✦ {SAMPLE_POSTS.length} Posts Generated
              </div>
              <a
                href="/brand-profile"
                style={{ padding: "8px 16px", borderRadius: "10px", background: "linear-gradient(135deg, #7B2FFF, #ec4899)", color: "#fff", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
              >
                🍳 Regenerate
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
            {[
              { label: "Total Posts", value: "30", icon: "◫" },
              { label: "Platforms", value: "5", icon: "◎" },
              { label: "This Week", value: "7", icon: "⚡" },
              { label: "Scheduled", value: "30", icon: "✓" },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                style={{ flex: "1", minWidth: "120px", padding: "16px 20px", borderRadius: "14px", background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)" }}
              >
                <p style={{ color: "rgba(241,241,241,0.4)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", marginBottom: "6px" }}>
                  {icon} {label.toUpperCase()}
                </p>
                <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F1F1F1" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform filter (display only) */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
          {["All", ...PLATFORMS].map((p) => (
            <span
              key={p}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 600,
                background: p === "All" ? "#7B2FFF" : "rgba(255,255,255,0.04)",
                color: p === "All" ? "#fff" : "rgba(241,241,241,0.5)",
                border: `1px solid ${p === "All" ? "#7B2FFF" : "rgba(255,255,255,0.08)"}`,
                cursor: "pointer",
              }}
            >
              {p}
            </span>
          ))}
        </div>

        {/* Post cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {SAMPLE_POSTS.map((post) => {
            const colors = platformColors[post.platform];
            return (
              <div
                key={post.day}
                style={{
                  background: "#1C1B2E",
                  border: "1px solid rgba(123,47,255,0.15)",
                  borderRadius: "16px",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  transition: "border-color 0.2s, transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(123,47,255,0.4)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(123,47,255,0.15)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Card header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      background: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {post.platform}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "rgba(241,241,241,0.3)",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "999px",
                      padding: "4px 10px",
                    }}
                  >
                    Day {post.day}
                  </span>
                </div>

                {/* Hook */}
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "6px" }}>
                    HOOK
                  </p>
                  <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#F1F1F1", lineHeight: 1.5 }}>
                    &ldquo;{post.hook}&rdquo;
                  </p>
                </div>

                {/* Caption */}
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "6px" }}>
                    CAPTION
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "rgba(241,241,241,0.65)", lineHeight: 1.6 }}>
                    {post.caption}
                  </p>
                </div>

                {/* CTA */}
                <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(123,47,255,0.08)", border: "1px solid rgba(123,47,255,0.15)" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "4px" }}>
                    CALL TO ACTION
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "#a78bfa", fontWeight: 500 }}>{post.cta}</p>
                </div>

                {/* Hashtags */}
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "8px" }}>
                    HASHTAGS
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {post.hashtags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.72rem",
                          color: "rgba(241,241,241,0.45)",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "6px",
                          padding: "3px 8px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "8px",
                      background: "rgba(123,47,255,0.12)",
                      border: "1px solid rgba(123,47,255,0.25)",
                      color: "#a78bfa",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ✎ Edit
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(241,241,241,0.5)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ⎘ Copy
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "8px",
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      color: "#34d399",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ↗ Publish
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom spacer */}
        <div style={{ height: "48px" }} />
      </main>
    </div>
  );
}
