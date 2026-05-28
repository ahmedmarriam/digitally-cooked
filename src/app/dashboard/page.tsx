"use client";

import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";

const PLATFORMS = ["Instagram", "TikTok", "LinkedIn", "Facebook", "YouTube"] as const;
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
  { day: 1, platform: "Instagram", hook: "You're posting every day and still getting zero engagement. Here's why.", caption: "Most brands flood their feed with content that talks AT their audience instead of WITH them. The fix? Lead with a problem your ideal customer lies awake thinking about — then solve it in the caption.", cta: "Save this for your next content planning session 📌", hashtags: ["#ContentStrategy", "#InstagramGrowth", "#SocialMediaTips", "#BrandBuilding"] },
  { day: 2, platform: "LinkedIn", hook: "I doubled our organic reach in 30 days without spending a single dollar on ads.", caption: "The secret wasn't posting more. It was posting smarter. We stopped chasing trends and started owning one specific topic. Consistency + niche depth = algorithm love.", cta: "Drop a 🔥 if you want the full breakdown.", hashtags: ["#LinkedInGrowth", "#MarketingStrategy", "#OrganicMarketing", "#ContentMarketing"] },
  { day: 3, platform: "TikTok", hook: "POV: Your content finally stops the scroll 👀", caption: "The first 2 seconds are everything on TikTok. If your hook doesn't spark curiosity, fear, or joy — you've already lost them. Here are 5 hook formulas that work in ANY niche.", cta: "Follow for daily content strategies that actually convert.", hashtags: ["#TikTokMarketing", "#ContentCreator", "#GrowthHacking", "#SocialMediaStrategy"] },
  { day: 4, platform: "Facebook", hook: "Unpopular opinion: Consistency beats creativity every single time.", caption: "The brands winning on social media aren't the most creative ones. They're the most consistent ones. Show up, deliver value, repeat. The algorithm rewards presence over perfection.", cta: "Share this with someone who needs the reminder.", hashtags: ["#MarketingTips", "#ContentCreation", "#GrowthMindset"] },
  { day: 5, platform: "Instagram", hook: "Your brand has a voice. Does your audience actually recognise it?", caption: "Brand voice isn't just tone — it's the emotional fingerprint your content leaves behind. Think about the 3 words you want people to feel when they see your post.", cta: "Comment your 3 brand voice words below 👇", hashtags: ["#BrandVoice", "#BrandIdentity", "#ContentMarketing", "#InstagramStrategy"] },
  { day: 6, platform: "Facebook", hook: "The #1 reason your social media ads aren't converting (it's not the budget).", caption: "Most brands spend thousands on paid ads but forget the basics: the offer needs to be irresistible before the targeting even matters. Fix your value proposition first. Then scale.", cta: "Share this with a business owner who needs to hear it.", hashtags: ["#FacebookAds", "#DigitalMarketing", "#PaidAds", "#MarketingAdvice"] },
  { day: 7, platform: "LinkedIn", hook: "We went from 200 to 12,000 followers in 6 months. No paid ads. No viral moments.", caption: "Just a repeatable content system built on three pillars: education, entertainment, and empathy. Every post we create hits at least two of those three. That's it. That's the whole strategy.", cta: "Save this post and audit your last 10 pieces of content against these pillars.", hashtags: ["#LinkedInStrategy", "#ContentSystem", "#OrganicGrowth", "#SocialMediaMarketing"] },
  { day: 8, platform: "TikTok", hook: "What if your next viral video was already sitting in your drafts? 👀", caption: "Repurposing isn't lazy — it's leverage. That blog post? 5 TikToks. That podcast episode? 3 LinkedIn posts. One idea, infinite formats.", cta: "Comment 'REPURPOSE' and I'll send you my content multiplication framework.", hashtags: ["#ContentRepurposing", "#ContentStrategy", "#CreatorTips", "#TikTokGrowth"] },
  { day: 9, platform: "YouTube", hook: "This YouTube format gets 3x more watch time than standard vlogs.", caption: "The 'problem-solve-proof' structure. Open with a relatable problem, deliver the solution, then show real proof. Watch time skyrockets because viewers stick around for the payoff.", cta: "Subscribe for weekly video strategy breakdowns.", hashtags: ["#YouTubeGrowth", "#VideoMarketing", "#ContentCreation", "#YouTubeTips"] },
  { day: 10, platform: "Instagram", hook: "Stop creating content. Start building a content system.", caption: "Random posting = random results. The brands that consistently grow don't 'find inspiration' — they run a process. Here's the 3-step system I use every month.", cta: "Save this and build your system this week 🗓️", hashtags: ["#ContentSystem", "#InstagramStrategy", "#SocialMediaMarketing", "#BrandGrowth"] },
];

const platformColors: Record<Platform | string, { bg: string; text: string; border: string }> = {
  Instagram: { bg: "rgba(236,72,153,0.12)", text: "#ec4899", border: "rgba(236,72,153,0.25)" },
  TikTok: { bg: "rgba(0,242,234,0.08)", text: "#00f2ea", border: "rgba(0,242,234,0.2)" },
  LinkedIn: { bg: "rgba(10,102,194,0.12)", text: "#60a5fa", border: "rgba(96,165,250,0.25)" },
  Facebook: { bg: "rgba(66,103,178,0.12)", text: "#818cf8", border: "rgba(129,140,248,0.25)" },
  YouTube: { bg: "rgba(239,68,68,0.1)", text: "#f87171", border: "rgba(248,113,113,0.25)" },
};

const socialPlatforms = [
  { name: "Instagram", icon: "📸", color: "#ec4899" },
  { name: "TikTok", icon: "🎵", color: "#00f2ea" },
  { name: "Facebook", icon: "👥", color: "#818cf8" },
  { name: "LinkedIn", icon: "💼", color: "#60a5fa" },
  { name: "YouTube", icon: "▶️", color: "#f87171" },
];

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleMsg, setScheduleMsg] = useState("");

  const filteredPosts = activeFilter === "All"
    ? SAMPLE_POSTS
    : SAMPLE_POSTS.filter((p) => p.platform === activeFilter);

  const copyPost = (post: Post, idx: number) => {
    const text = `${post.hook}\n\n${post.caption}\n\n${post.cta}\n\n${post.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const togglePlatform = (name: string) => {
    setConnectedPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const scheduleAll = async () => {
    if (connectedPlatforms.length === 0) {
      setScheduleMsg("Connect at least one platform first.");
      return;
    }
    setScheduling(true);
    setScheduleMsg("");
    // Simulate scheduling (real implementation sends to /api/zernio/schedule)
    await new Promise((r) => setTimeout(r, 2000));
    setScheduling(false);
    setScheduleMsg(`✓ ${SAMPLE_POSTS.length} posts scheduled to ${connectedPlatforms.join(", ")}!`);
    setTimeout(() => setScheduleMsg(""), 5000);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F0E1A", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <AppSidebar />

      <main style={{ flex: 1, overflowY: "auto", padding: "36px 32px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "6px", letterSpacing: "-0.02em" }}>
              Your Content Pack 🍳
            </h1>
            <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.9rem" }}>30-day content calendar — ready to publish</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(123,47,255,0.12)", border: "1px solid rgba(123,47,255,0.25)", color: "#a78bfa", fontSize: "0.82rem", fontWeight: 600 }}>
              ✦ {SAMPLE_POSTS.length} Posts Generated
            </div>
            <a href="/brand-kit" style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(241,241,241,0.7)", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
              ✦ Build Brand Kit
            </a>
            <a href="/brand-profile" style={{ padding: "8px 16px", borderRadius: "10px", background: "linear-gradient(135deg, #7B2FFF, #ec4899)", color: "#fff", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
              🍳 Regenerate
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "14px", marginBottom: "32px" }}>
          {[
            { label: "TOTAL POSTS", value: "30", icon: "◫" },
            { label: "PLATFORMS CONNECTED", value: String(connectedPlatforms.length) || "0", icon: "◎" },
            { label: "POSTS SCHEDULED", value: scheduleMsg.startsWith("✓") ? String(SAMPLE_POSTS.length) : "0", icon: "⚡" },
            { label: "THIS MONTH", value: "30", icon: "✓" },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ padding: "16px 20px", borderRadius: "14px", background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)" }}>
              <p style={{ color: "rgba(241,241,241,0.4)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "6px" }}>{icon} {label}</p>
              <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F1F1F1" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Connect Your Accounts ── */}
        <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.2)", borderRadius: "16px", padding: "24px 28px", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "18px" }}>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "4px" }}>Connect Your Accounts</h2>
              <p style={{ fontSize: "0.82rem", color: "rgba(241,241,241,0.4)" }}>Select platforms to enable auto-posting via our scheduling engine</p>
            </div>
            <button
              onClick={scheduleAll}
              disabled={scheduling}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                background: scheduling ? "rgba(123,47,255,0.4)" : "linear-gradient(135deg, #7B2FFF, #ec4899)",
                border: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: scheduling ? "not-allowed" : "pointer",
                boxShadow: "0 4px 18px rgba(123,47,255,0.35)",
                transition: "opacity 0.2s",
              }}
            >
              {scheduling ? "Scheduling..." : "🚀 Schedule All Posts"}
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {socialPlatforms.map(({ name, icon, color }) => {
              const connected = connectedPlatforms.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => togglePlatform(name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "9px 16px",
                    borderRadius: "10px",
                    background: connected ? `${color}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${connected ? color + "50" : "rgba(255,255,255,0.08)"}`,
                    color: connected ? color : "rgba(241,241,241,0.45)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{icon}</span>
                  {name}
                  {connected && <span style={{ fontSize: "10px", marginLeft: "2px" }}>●</span>}
                </button>
              );
            })}
          </div>

          {scheduleMsg && (
            <div style={{ marginTop: "14px", padding: "10px 16px", borderRadius: "10px", background: scheduleMsg.startsWith("✓") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${scheduleMsg.startsWith("✓") ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`, color: scheduleMsg.startsWith("✓") ? "#34d399" : "#ef4444", fontSize: "0.85rem", fontWeight: 500 }}>
              {scheduleMsg}
            </div>
          )}
        </div>

        {/* Platform filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {["All", ...PLATFORMS].map((p) => (
            <button
              key={p}
              onClick={() => setActiveFilter(p)}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 600,
                background: activeFilter === p ? "#7B2FFF" : "rgba(255,255,255,0.04)",
                color: activeFilter === p ? "#fff" : "rgba(241,241,241,0.5)",
                border: `1px solid ${activeFilter === p ? "#7B2FFF" : "rgba(255,255,255,0.08)"}`,
                cursor: "pointer",
                transition: "all 0.18s",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Post cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredPosts.map((post, idx) => {
            const colors = platformColors[post.platform] ?? platformColors.Instagram;
            return (
              <div
                key={`${post.day}-${post.platform}`}
                style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px", transition: "border-color 0.2s, transform 0.2s", cursor: "default" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(123,47,255,0.4)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(123,47,255,0.15)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>{post.platform}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(241,241,241,0.3)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "999px", padding: "4px 10px" }}>Day {post.day}</span>
                </div>

                {/* Hook */}
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "6px" }}>HOOK</p>
                  <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#F1F1F1", lineHeight: 1.5 }}>&ldquo;{post.hook}&rdquo;</p>
                </div>

                {/* Caption */}
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "6px" }}>CAPTION</p>
                  <p style={{ fontSize: "0.82rem", color: "rgba(241,241,241,0.65)", lineHeight: 1.6 }}>{post.caption}</p>
                </div>

                {/* CTA */}
                <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(123,47,255,0.08)", border: "1px solid rgba(123,47,255,0.15)" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "4px" }}>CALL TO ACTION</p>
                  <p style={{ fontSize: "0.82rem", color: "#a78bfa", fontWeight: 500 }}>{post.cta}</p>
                </div>

                {/* Hashtags */}
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "8px" }}>HASHTAGS</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {post.hashtags.map((tag) => (
                      <span key={tag} style={{ fontSize: "0.72rem", color: "rgba(241,241,241,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "3px 8px" }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button style={{ flex: 1, padding: "8px", borderRadius: "8px", background: "rgba(123,47,255,0.12)", border: "1px solid rgba(123,47,255,0.25)", color: "#a78bfa", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                    ✎ Edit
                  </button>
                  <button
                    onClick={() => copyPost(post, idx)}
                    style={{ flex: 1, padding: "8px", borderRadius: "8px", background: copiedIndex === idx ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${copiedIndex === idx ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`, color: copiedIndex === idx ? "#34d399" : "rgba(241,241,241,0.5)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                  >
                    {copiedIndex === idx ? "✓ Copied!" : "⎘ Copy"}
                  </button>
                  <button style={{ flex: 1, padding: "8px", borderRadius: "8px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                    ↗ Publish
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ height: "48px" }} />
      </main>
    </div>
  );
}
