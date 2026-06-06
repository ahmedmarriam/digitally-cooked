"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#ec4899",
  tiktok: "#00f2ea",
  linkedin: "#60a5fa",
  youtube: "#f87171",
  facebook: "#818cf8",
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface Post {
  id: string;
  day: number;
  platform: string;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string;
  format: string;
  image_url?: string;
  post_group?: number;
  is_bonus: boolean;
}

function getCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState<Post[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const brandId = typeof window !== "undefined" ? localStorage.getItem("dc_selected_brand") : null;
    const url = brandId ? `/api/posts?brandId=${brandId}` : "/api/posts";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const fetched: Post[] = data?.posts ?? [];
        // Only calendar posts (not bonus)
        const calendarPosts = fetched.filter((p) => !p.is_bonus);
        setPosts(calendarPosts);

        // Derive unique platforms from actual posts
        const uniquePlatforms = [...new Set(calendarPosts.map((p) => p.platform.toLowerCase()))];
        setPlatforms(uniquePlatforms);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cells = getCalendarGrid(viewYear, viewMonth);

  // Map day → posts (only regular calendar posts, day 1-30 mapped to current month)
  const postMap: Record<number, Post[]> = {};
  posts.forEach((p) => {
    if (!p.day) return;
    if (!postMap[p.day]) postMap[p.day] = [];
    postMap[p.day].push(p);
  });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F0E1A", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <AppSidebar />

      <main style={{ flex: 1, overflowY: "auto", padding: "36px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "6px", letterSpacing: "-0.02em" }}>
              Content Calendar
            </h1>
            <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.9rem" }}>
              Your 30-day publishing schedule at a glance
            </p>
          </div>

          {/* Month navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={prevMonth}
              style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F1F1F1", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ‹
            </button>
            <span style={{ color: "#F1F1F1", fontWeight: 700, fontSize: "1rem", minWidth: "160px", textAlign: "center" }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F1F1F1", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Platform legend — only platforms in actual posts */}
        {!loading && platforms.length > 0 && (
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            {platforms.map((p) => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: PLATFORM_COLORS[p] ?? "#a78bfa" }} />
                <span style={{ fontSize: "0.78rem", color: "rgba(241,241,241,0.5)", fontWeight: 500 }}>{capitalize(p)}</span>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <p style={{ color: "rgba(241,241,241,0.4)", fontSize: "0.9rem", marginBottom: "24px" }}>Loading your content...</p>
        )}

        {/* Calendar grid */}
        <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "20px", overflow: "hidden" }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} style={{ padding: "14px 8px", textAlign: "center", fontSize: "0.75rem", fontWeight: 700, color: "rgba(241,241,241,0.35)", letterSpacing: "0.05em" }}>
                {d.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {cells.map((day, idx) => {
              const dayPosts = day ? (postMap[day] || []) : [];
              const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

              return (
                <div
                  key={idx}
                  style={{
                    minHeight: "100px",
                    padding: "10px 8px",
                    borderRight: (idx + 1) % 7 === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                    borderBottom: idx < cells.length - 7 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    background: isToday ? "rgba(123,47,255,0.08)" : "transparent",
                    position: "relative",
                  }}
                >
                  {day && (
                    <>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: isToday ? "#7B2FFF" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: isToday ? 700 : 500, color: isToday ? "#fff" : "rgba(241,241,241,0.45)", marginBottom: "6px" }}>
                        {day}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        {dayPosts.map((post, i) => {
                          const color = PLATFORM_COLORS[post.platform.toLowerCase()] ?? "#a78bfa";
                          return (
                            <div
                              key={i}
                              onClick={() => setSelectedPost(post)}
                              style={{ padding: "3px 6px", borderRadius: "5px", fontSize: "0.68rem", fontWeight: 600, color: "#fff", background: `${color}22`, borderLeft: `3px solid ${color}`, cursor: "pointer", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                              title={post.hook}
                            >
                              {capitalize(post.platform)}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ height: "48px" }} />
      </main>

      {/* Post detail modal */}
      {selectedPost && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px", backdropFilter: "blur(4px)" }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.3)", borderRadius: "20px", padding: "32px", maxWidth: "520px", width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.7)", maxHeight: "80vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ padding: "4px 12px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700, color: PLATFORM_COLORS[selectedPost.platform.toLowerCase()] ?? "#a78bfa", background: `${PLATFORM_COLORS[selectedPost.platform.toLowerCase()] ?? "#a78bfa"}18`, border: `1px solid ${PLATFORM_COLORS[selectedPost.platform.toLowerCase()] ?? "#a78bfa"}33` }}>
                  {capitalize(selectedPost.platform)}
                </span>
                <span style={{ fontSize: "0.78rem", color: "rgba(241,241,241,0.35)", fontWeight: 600 }}>Day {selectedPost.day}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(241,241,241,0.25)", fontWeight: 500 }}>{selectedPost.format}</span>
              </div>
              <button onClick={() => setSelectedPost(null)} style={{ background: "transparent", border: "none", color: "rgba(241,241,241,0.4)", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>×</button>
            </div>

            {selectedPost.image_url && (
              <img src={selectedPost.image_url} alt="Post visual" style={{ width: "100%", borderRadius: "12px", marginBottom: "20px", objectFit: "cover", maxHeight: "200px" }} />
            )}

            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "6px" }}>HOOK</p>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "#F1F1F1", lineHeight: 1.5, marginBottom: "16px" }}>&ldquo;{selectedPost.hook}&rdquo;</p>

            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "6px" }}>CAPTION</p>
            <p style={{ fontSize: "0.88rem", color: "rgba(241,241,241,0.75)", lineHeight: 1.6, marginBottom: "16px" }}>{selectedPost.caption}</p>

            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "6px" }}>CTA</p>
            <p style={{ fontSize: "0.88rem", color: "rgba(241,241,241,0.75)", marginBottom: "16px" }}>{selectedPost.cta}</p>

            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "6px" }}>HASHTAGS</p>
            <p style={{ fontSize: "0.82rem", color: "rgba(167,139,250,0.6)", marginBottom: "20px" }}>{selectedPost.hashtags}</p>

            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "rgba(123,47,255,0.15)", border: "1px solid rgba(123,47,255,0.3)", color: "#a78bfa", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
                ✎ Edit Post
              </button>
              <button style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
                ↗ Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
