"use client";

import { useState, useEffect, useRef } from "react";
import AppSidebar from "@/components/AppSidebar";
import ImageEditor from "@/components/ImageEditor";
import PostImageRenderer from "@/components/PostImageRenderer";

const PLATFORMS = ["Instagram", "TikTok", "LinkedIn", "Facebook", "YouTube"] as const;
type Platform = (typeof PLATFORMS)[number];

interface Post {
  id?: string;
  post_number?: number;
  post_group?: number;
  day?: number;
  platform: string;
  format?: string;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string[] | string;
  image_prompt?: string;
  image_url?: string;
  status?: string;
  is_bonus?: boolean;
}

interface Brand {
  id?: string;
  brand_name?: string;
  brand_colors?: string;
  content_tone?: string;
  visual_style?: string;
  business_type?: string;
  logo_url?: string | null;
  [key: string]: unknown;
}

const platformColors: Record<string, { bg: string; text: string; border: string }> = {
  Instagram: { bg: "rgba(236,72,153,0.12)", text: "#ec4899", border: "rgba(236,72,153,0.25)" },
  TikTok: { bg: "rgba(0,242,234,0.08)", text: "#00f2ea", border: "rgba(0,242,234,0.2)" },
  LinkedIn: { bg: "rgba(10,102,194,0.12)", text: "#60a5fa", border: "rgba(96,165,250,0.25)" },
  Facebook: { bg: "rgba(66,103,178,0.12)", text: "#818cf8", border: "rgba(129,140,248,0.25)" },
  Youtube: { bg: "rgba(239,68,68,0.1)", text: "#f87171", border: "rgba(248,113,113,0.25)" },
};

const socialPlatforms = [
  { name: "Instagram", icon: "📸", color: "#ec4899" },
  { name: "TikTok", icon: "🎵", color: "#00f2ea" },
  { name: "Facebook", icon: "👥", color: "#818cf8" },
  { name: "LinkedIn", icon: "💼", color: "#60a5fa" },
  { name: "YouTube", icon: "▶️", color: "#f87171" },
];

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function scorePost(post: Post): { score: number; color: string } {
  let score = 5;
  if (post.hook?.length > 20) score += 1;
  if (post.hook?.length > 50) score += 1;
  if (post.caption?.length > 100) score += 1;
  if (post.cta?.length > 5) score += 1;
  const hCount = Array.isArray(post.hashtags) ? post.hashtags.length : (post.hashtags?.split(/\s+/).length ?? 0);
  if (hCount >= 5) score += 1;
  score = Math.min(10, Math.max(1, score));
  return { score, color: score >= 8 ? "#10b981" : score >= 6 ? "#f59e0b" : "#ef4444" };
}

const PLATFORM_URLS: Record<string, string> = {
  instagram: "https://www.instagram.com/create/story",
  facebook:  "https://www.facebook.com/",
  linkedin:  "https://www.linkedin.com/post/new",
  tiktok:    "https://www.tiktok.com/upload",
  youtube:   "https://studio.youtube.com/channel/UC/videos/upload",
};

// Tabbed card — one card per concept group, tabs per platform
function GroupedPostCard({ posts, copiedId, onCopy, onEdit, brand, onImageReady, cardIndex = 0, globalRegenCount = 0, onRegenUsed }: {
  posts: Post[];
  copiedId: string | null;
  onCopy: (post: Post) => void;
  onEdit: (post: Post) => void;
  brand: Brand | null;
  onImageReady?: (postGroup: number, url: string) => void;
  cardIndex?: number;
  globalRegenCount?: number;
  onRegenUsed?: () => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [localRenderKey, setLocalRenderKey] = useState(0);
  const [regening, setRegening] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState<string | null | undefined>(undefined);
  const [forceNextImage, setForceNextImage] = useState(false);

  const active = posts[activeTab] ?? posts[0];
  if (!active) return null;

  const displayPlatform = capitalize(active.platform);
  const colors = platformColors[displayPlatform] ?? platformColors.Instagram;
  const { score, color } = scorePost(active);
  const imageUrl = localImageUrl !== undefined ? localImageUrl : (active.image_url ?? null);
  const isCopied = copiedId === (active.id ?? "");
  const isPublished = publishedId === (active.id ?? "");
  const regensLeft = globalRegenCount ?? 0;

  const publishPost = (post: Post) => {
    const text = `${post.hook}\n\n${post.caption}\n\n${post.cta}\n\n${typeof post.hashtags === "string" ? post.hashtags : post.hashtags?.join(" ")}`;
    navigator.clipboard.writeText(text).then(() => {
      setPublishedId(post.id ?? "");
      const platformUrl = PLATFORM_URLS[post.platform?.toLowerCase()] ?? "https://www.instagram.com";
      setTimeout(() => window.open(platformUrl, "_blank"), 300);
      setTimeout(() => setPublishedId(null), 3000);
    });
  };

  const regenImage = async () => {
    if (globalRegenCount <= 0 || regening || !brand?.id) return;
    setRegening(true);
    try {
      await fetch("/api/posts/reset-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: brand.id, postGroup: active.post_group }),
      });
      onRegenUsed?.();
      setForceNextImage(true);  // always generate AI image on manual regenerate
      setLocalImageUrl(null);   // clear image so PostImageRenderer re-fires
      setLocalRenderKey((k) => k + 1);
    } catch {
      // silent fail
    } finally {
      setRegening(false);
    }
  };

  return (
    <div style={{ background: "#1C1B2E", border: `1px solid ${active.is_bonus ? "rgba(236,72,153,0.2)" : "rgba(123,47,255,0.15)"}`, borderRadius: "16px", overflow: "hidden", transition: "border-color 0.2s, transform 0.2s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = active.is_bonus ? "rgba(236,72,153,0.5)" : "rgba(123,47,255,0.4)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = active.is_bonus ? "rgba(236,72,153,0.2)" : "rgba(123,47,255,0.15)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      {/* Image */}
      {brand?.id && (
        <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden", background: "#13121f" }}>
          <PostImageRenderer
            key={`${active.id ?? active.post_group}-${localRenderKey}`}
            forceImage={forceNextImage}
            post={{
              id: active.id ?? String(active.post_group),
              post_group: active.post_group ?? 0,
              hook: active.hook ?? "",
              caption: active.caption ?? "",
              cta: active.cta ?? "",
              hashtags: typeof active.hashtags === "string" ? active.hashtags : (active.hashtags ?? []).join(" "),
              image_url: imageUrl,
              image_prompt: active.image_prompt ?? null,
              is_bonus: active.is_bonus ?? false,
              post_number: active.post_number,
            }}
            brand={{
              id: brand.id ?? "",
              brand_name: brand.brand_name ?? "",
              brand_colors: brand.brand_colors as string ?? "",
              content_tone: brand.content_tone as string ?? "",
              visual_style: brand.visual_style as string ?? "",
              business_type: brand.business_type as string ?? "",
              logo_url: brand.logo_url as string ?? null,
            }}
            cardIndex={cardIndex}
            onImageReady={(url) => {
              setLocalImageUrl(url);
              onImageReady?.(active.post_group ?? 0, url);
            }}
          />
          {/* Regenerate button — bottom-right corner of image */}
          <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
            {regensLeft > 0 ? (
              <button
                onClick={regenImage}
                disabled={regening}
                title={`Regenerate image (${regensLeft} left)`}
                style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "999px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "0.72rem", fontWeight: 600, cursor: regening ? "wait" : "pointer", transition: "all 0.2s" }}
              >
                <span style={{ display: "inline-block", animation: regening ? "spin 0.8s linear infinite" : "none" }}>↺</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                {regening ? "..." : `Regenerate · ${regensLeft} left`}
              </button>
            ) : (
              <span style={{ padding: "5px 10px", borderRadius: "999px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", fontWeight: 600 }}>
                ✗ Limit reached
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: "18px 20px 20px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "6px" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: "rgba(255,255,255,0.05)", color: "rgba(241,241,241,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>{active.format ?? "Post"}</span>
            <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, color: active.is_bonus ? "#ec4899" : "rgba(241,241,241,0.35)", background: active.is_bonus ? "rgba(236,72,153,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${active.is_bonus ? "rgba(236,72,153,0.25)" : "rgba(255,255,255,0.07)"}` }}>
              {active.is_bonus ? "🎁 Bonus" : `Day ${active.day}`}
            </span>
          </div>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color, background: `${color}15`, border: `1px solid ${color}40`, borderRadius: "999px", padding: "3px 8px" }}>⚡ {score}/10</span>
        </div>

        {/* Platform tabs */}
        {posts.length > 1 && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
            {posts.map((p, i) => {
              const tabPlatform = capitalize(p.platform);
              const tabColors = platformColors[tabPlatform] ?? platformColors.Instagram;
              return (
                <button key={i} onClick={() => setActiveTab(i)} style={{ padding: "5px 12px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", border: `1px solid ${i === activeTab ? tabColors.border : "rgba(255,255,255,0.08)"}`, background: i === activeTab ? tabColors.bg : "rgba(255,255,255,0.03)", color: i === activeTab ? tabColors.text : "rgba(241,241,241,0.4)", transition: "all 0.15s" }}>
                  {tabPlatform}
                </button>
              );
            })}
          </div>
        )}
        {posts.length === 1 && (
          <div style={{ marginBottom: "14px" }}>
            <span style={{ padding: "5px 12px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>{displayPlatform}</span>
          </div>
        )}

        {/* Hook */}
        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "5px" }}>HOOK</p>
          <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#F1F1F1", lineHeight: 1.5 }}>&ldquo;{active.hook}&rdquo;</p>
        </div>

        {/* Caption */}
        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "5px" }}>CAPTION</p>
          <p style={{ fontSize: "0.82rem", color: "rgba(241,241,241,0.65)", lineHeight: 1.6 }}>{active.caption}</p>
        </div>

        {/* CTA */}
        <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(123,47,255,0.08)", border: "1px solid rgba(123,47,255,0.15)", marginBottom: "12px" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "4px" }}>CALL TO ACTION</p>
          <p style={{ fontSize: "0.82rem", color: "#a78bfa", fontWeight: 500 }}>{active.cta}</p>
        </div>

        {/* Hashtags */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "7px" }}>HASHTAGS</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {(typeof active.hashtags === "string" ? active.hashtags.split(/\s+/) : active.hashtags ?? []).map((tag: string, i: number) => (
              <span key={i} style={{ fontSize: "0.72rem", color: "rgba(241,241,241,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "3px 8px" }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => onEdit(active)} style={{ flex: 1, padding: "8px", borderRadius: "8px", background: "rgba(123,47,255,0.12)", border: "1px solid rgba(123,47,255,0.25)", color: "#a78bfa", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>✎ Edit</button>
          <button onClick={() => onCopy(active)} style={{ flex: 1, padding: "8px", borderRadius: "8px", background: isCopied ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${isCopied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`, color: isCopied ? "#34d399" : "rgba(241,241,241,0.5)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            {isCopied ? "✓ Copied!" : "⎘ Copy"}
          </button>
          <button onClick={() => publishPost(active)} style={{ flex: 1, padding: "8px", borderRadius: "8px", background: isPublished ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.1)", border: `1px solid ${isPublished ? "rgba(16,185,129,0.5)" : "rgba(16,185,129,0.2)"}`, color: "#34d399", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            {isPublished ? "✓ Copied & opening..." : "↗ Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

const MAX_BRAND_REGENS = 10;  // Total regenerations per brand per month

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleMsg, setScheduleMsg] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [brandRegenCount, setBrandRegenCount] = useState(MAX_BRAND_REGENS);
  const imagePollerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPosts = (initial = false) => {
    const brandId = typeof window !== "undefined" ? localStorage.getItem("dc_selected_brand") : null;
    const url = brandId ? `/api/posts?brandId=${brandId}` : "/api/posts";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts);
        if (data.brand) setBrand(data.brand);
      })
      .catch(console.error)
      .finally(() => { if (initial) setLoading(false); });
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  // Auto-refresh images until all posts have image_url
  useEffect(() => {
    if (loading) return;
    const missingImages = posts.some((p) => !p.image_url);
    if (missingImages) {
      imagePollerRef.current = setInterval(() => fetchPosts(), 10000);
    } else {
      if (imagePollerRef.current) clearInterval(imagePollerRef.current);
    }
    return () => { if (imagePollerRef.current) clearInterval(imagePollerRef.current); };
  }, [posts, loading]);

  const copyPost = (post: Post) => {
    const text = `${post.hook}\n\n${post.caption}\n\n${post.cta}\n\n${post.hashtags}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(post.id ?? "");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };


  // Group posts by post_group, sort groups by day
  const groupPosts = (postList: Post[]) => {
    const groupMap: Record<number, Post[]> = {};
    for (const post of postList) {
      const key = post.post_group ?? post.post_number ?? 0;
      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(post);
    }
    return Object.values(groupMap).sort((a, b) => (a[0].day ?? 0) - (b[0].day ?? 0));
  };

  const regularPosts = posts.filter((p) => !p.is_bonus);
  const bonusPosts = posts.filter((p) => p.is_bonus);

  const filteredRegular = activeFilter === "All"
    ? regularPosts
    : regularPosts.filter((p) => capitalize(p.platform) === activeFilter);

  const filteredBonus = activeFilter === "All"
    ? bonusPosts
    : bonusPosts.filter((p) => capitalize(p.platform) === activeFilter);

  const regularGroups = groupPosts(filteredRegular);
  const bonusGroups = groupPosts(filteredBonus);

  const togglePlatform = (name: string) => {
    setConnectedPlatforms((prev) => prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]);
  };

  const scheduleAll = async () => {
    if (connectedPlatforms.length === 0) { setScheduleMsg("Connect at least one platform first."); return; }
    setScheduling(true);
    setScheduleMsg("");
    try {
      const today = new Date();
      const postsToSchedule = posts
        .filter((p) => !p.is_bonus && connectedPlatforms.map((c) => c.toLowerCase()).includes(p.platform.toLowerCase()))
        .map((p) => {
          const scheduledDate = new Date(today);
          scheduledDate.setDate(today.getDate() + (p.day ?? 1) - 1);
          return {
            platform: p.platform,
            content: `${p.hook}\n\n${p.caption}\n\n${p.cta}\n\n${p.hashtags}`,
            scheduledAt: scheduledDate.toISOString(),
            image_url: p.image_url ?? null,
          };
        });

      const res = await fetch("/api/zernio/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: postsToSchedule }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setScheduleMsg(`✓ ${data.scheduled} posts scheduled to ${connectedPlatforms.join(", ")}!`);
      } else {
        setScheduleMsg(data.error || "Scheduling failed. Check your Zernio connection.");
      }
    } catch {
      setScheduleMsg("Failed to connect to scheduling service.");
    } finally {
      setScheduling(false);
      setTimeout(() => setScheduleMsg(""), 6000);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F0E1A", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <AppSidebar />
      <main style={{ flex: 1, overflowY: "auto", padding: "36px 32px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "6px", letterSpacing: "-0.02em" }}>Your Content Pack 🍳</h1>
            <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.9rem" }}>
              {brand ? `${brand.brand_name} — 30-day content calendar` : "30-day content calendar — ready to publish"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(123,47,255,0.12)", border: "1px solid rgba(123,47,255,0.25)", color: "#a78bfa", fontSize: "0.82rem", fontWeight: 600 }}>
              ✦ {loading ? "Loading..." : `${regularGroups.length} Posts · ${bonusGroups.length} Bonus`}
            </div>
            <a href="/brand-profile" style={{ padding: "8px 16px", borderRadius: "10px", background: "linear-gradient(135deg, #7B2FFF, #ec4899)", color: "#fff", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>🍳 New Content</a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "14px", marginBottom: "32px" }}>
          {[
            { label: "TOTAL POSTS", value: loading ? "—" : String(regularGroups.length), icon: "◫" },
            { label: "CALENDAR DAYS", value: loading ? "—" : String(regularGroups.length), icon: "◎" },
            { label: "BONUS POSTS", value: loading ? "—" : String(bonusGroups.length), icon: "🎁" },
            { label: "PLATFORMS", value: loading ? "—" : String([...new Set(posts.map(p => p.platform))].length), icon: "✓" },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ padding: "16px 20px", borderRadius: "14px", background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)" }}>
              <p style={{ color: "rgba(241,241,241,0.4)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "6px" }}>{icon} {label}</p>
              <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F1F1F1" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Connect platforms */}
        <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.2)", borderRadius: "16px", padding: "24px 28px", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "18px" }}>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "4px" }}>Connect Your Accounts</h2>
              <p style={{ fontSize: "0.82rem", color: "rgba(241,241,241,0.4)" }}>Select platforms to enable auto-posting</p>
            </div>
            <button onClick={scheduleAll} disabled={scheduling} style={{ padding: "10px 20px", borderRadius: "10px", background: scheduling ? "rgba(123,47,255,0.4)" : "linear-gradient(135deg, #7B2FFF, #ec4899)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: scheduling ? "not-allowed" : "pointer", boxShadow: "0 4px 18px rgba(123,47,255,0.35)" }}>
              {scheduling ? "Scheduling..." : "🚀 Schedule All Posts"}
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {socialPlatforms.map(({ name, icon, color }) => {
              const connected = connectedPlatforms.includes(name);
              return (
                <button key={name} onClick={() => togglePlatform(name)} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 16px", borderRadius: "10px", background: connected ? `${color}18` : "rgba(255,255,255,0.03)", border: `1px solid ${connected ? color + "50" : "rgba(255,255,255,0.08)"}`, color: connected ? color : "rgba(241,241,241,0.45)", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  <span>{icon}</span>{name}{connected && <span style={{ fontSize: "10px" }}>●</span>}
                </button>
              );
            })}
          </div>
          {scheduleMsg && (
            <div style={{ marginTop: "14px", padding: "10px 16px", borderRadius: "10px", background: scheduleMsg.startsWith("✓") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${scheduleMsg.startsWith("✓") ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`, color: scheduleMsg.startsWith("✓") ? "#34d399" : "#ef4444", fontSize: "0.85rem" }}>
              {scheduleMsg}
            </div>
          )}
        </div>

        {/* Platform filter — only show platforms in actual posts */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {["All", ...[...new Set(posts.map(p => capitalize(p.platform)))].sort()].map((p) => (
            <button key={p} onClick={() => setActiveFilter(p)} style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, background: activeFilter === p ? "#7B2FFF" : "rgba(255,255,255,0.04)", color: activeFilter === p ? "#fff" : "rgba(241,241,241,0.5)", border: `1px solid ${activeFilter === p ? "#7B2FFF" : "rgba(255,255,255,0.08)"}`, cursor: "pointer" }}>{p}</button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(241,241,241,0.35)", fontSize: "0.9rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🍳</div>
            Loading your content...
          </div>
        )}

        {/* Empty */}
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#1C1B2E", borderRadius: "16px", border: "1px solid rgba(123,47,255,0.15)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>📭</div>
            <h3 style={{ color: "#F1F1F1", fontWeight: 700, marginBottom: "8px" }}>No posts yet</h3>
            <p style={{ color: "rgba(241,241,241,0.4)", fontSize: "0.88rem", marginBottom: "20px" }}>Fill in your brand profile and we&apos;ll generate your content pack.</p>
            <a href="/brand-profile" style={{ padding: "12px 24px", borderRadius: "12px", background: "#7B2FFF", color: "#fff", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>🍳 Generate My Content</a>
          </div>
        )}

        {/* 30-Day Calendar */}
        {!loading && regularGroups.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {regularGroups.map((group, i) => (
              <GroupedPostCard key={i} posts={group} copiedId={copiedId} onCopy={copyPost} onEdit={setEditingPost} brand={brand} cardIndex={i} globalRegenCount={brandRegenCount} onRegenUsed={() => setBrandRegenCount(c => Math.max(0, c - 1))} onImageReady={(pg, url) => setPosts(prev => prev.map(p => p.post_group === pg ? { ...p, image_url: url } : p))} />
            ))}
          </div>
        )}

        {/* Bonus Section */}
        {!loading && bonusGroups.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(123,47,255,0.2)" }} />
              <div style={{ padding: "8px 20px", borderRadius: "999px", background: "linear-gradient(135deg, rgba(123,47,255,0.2), rgba(236,72,153,0.2))", border: "1px solid rgba(123,47,255,0.3)", color: "#a78bfa", fontSize: "0.85rem", fontWeight: 700 }}>
                🎁 {bonusGroups.length} Bonus Posts
              </div>
              <div style={{ flex: 1, height: "1px", background: "rgba(123,47,255,0.2)" }} />
            </div>
            <p style={{ color: "rgba(241,241,241,0.35)", fontSize: "0.82rem", textAlign: "center", marginBottom: "24px" }}>Extra content — use as replacements, special campaigns, or when inspiration strikes.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
              {bonusGroups.map((group, i) => (
                <GroupedPostCard key={i} posts={group} copiedId={copiedId} onCopy={copyPost} onEdit={setEditingPost} brand={brand} cardIndex={i} globalRegenCount={brandRegenCount} onRegenUsed={() => setBrandRegenCount(c => Math.max(0, c - 1))} onImageReady={(pg, url) => setPosts(prev => prev.map(p => p.post_group === pg ? { ...p, image_url: url } : p))} />
              ))}
            </div>
          </div>
        )}

        <div style={{ height: "48px" }} />
      </main>

      {/* Floating image generation pill */}
      {!loading && posts.some((p) => !p.image_url) && (
        <div style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 50,
          display: "flex", alignItems: "center", gap: "10px",
          padding: "12px 20px", borderRadius: "999px",
          background: "linear-gradient(135deg, rgba(123,47,255,0.9), rgba(236,72,153,0.9))",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(123,47,255,0.4)",
          animation: "pillFadeIn 0.4s ease",
        }}>
          <style>{`
            @keyframes pillFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
          <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700, whiteSpace: "nowrap" }}>
            ✦ Cooking your images... {posts.filter((p) => p.image_url).length} / {[...new Set(posts.map((p) => p.post_group))].length}
          </span>
        </div>
      )}

      {editingPost && (
        <ImageEditor
          post={editingPost}
          brand={brand}
          onClose={() => setEditingPost(null)}
          onSave={(edited: any) => {
            setPosts(prev => prev.map(p => p.id === edited.id ? { ...p, image_url: edited.image_url } : p));
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}
