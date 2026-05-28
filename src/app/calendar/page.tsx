"use client";

import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "#ec4899",
  TikTok: "#00f2ea",
  LinkedIn: "#60a5fa",
  YouTube: "#f87171",
  Facebook: "#818cf8",
};

interface CalendarPost {
  day: number;
  platform: string;
  hook: string;
}

// Posts mapped to days 1-30
const POSTS: CalendarPost[] = [
  { day: 1, platform: "Instagram", hook: "You're posting every day and still getting zero engagement." },
  { day: 2, platform: "LinkedIn", hook: "I doubled our organic reach in 30 days without a single ad." },
  { day: 3, platform: "TikTok", hook: "POV: Your content finally stops the scroll 👀" },
  { day: 4, platform: "YouTube", hook: "This video format gets 3x more watch time than standard vlogs." },
  { day: 5, platform: "Instagram", hook: "Your brand has a voice. Does your audience recognise it?" },
  { day: 6, platform: "Facebook", hook: "The #1 reason your ads aren't converting (it's not budget)." },
  { day: 7, platform: "LinkedIn", hook: "We went from 200 to 12,000 followers in 6 months." },
  { day: 8, platform: "TikTok", hook: "What if your next viral video was already in your drafts?" },
  { day: 9, platform: "Instagram", hook: "3 caption mistakes that are killing your reach right now." },
  { day: 10, platform: "LinkedIn", hook: "The content format that generates 10x more engagement." },
  { day: 11, platform: "TikTok", hook: "Nobody talks about this part of the algorithm — until now." },
  { day: 12, platform: "YouTube", hook: "Stop creating content. Start building a content system." },
  { day: 13, platform: "Instagram", hook: "This one reel structure tripled our saves last month." },
  { day: 14, platform: "Facebook", hook: "Why your competitors are outranking you in the feed." },
  { day: 15, platform: "LinkedIn", hook: "I analysed 100 viral posts. Here's what they all had in common." },
  { day: 16, platform: "Instagram", hook: "The hook formula that works in every niche. Period." },
  { day: 17, platform: "TikTok", hook: "If your content isn't doing this in 2 seconds, you've lost them." },
  { day: 18, platform: "YouTube", hook: "Hot take: Your posting frequency means nothing." },
  { day: 19, platform: "LinkedIn", hook: "We almost gave up on organic. Then this happened." },
  { day: 20, platform: "Instagram", hook: "What a 50K account looks like vs what you imagine it does." },
  { day: 21, platform: "Facebook", hook: "The real cost of bad content strategy (it's not what you think)." },
  { day: 22, platform: "TikTok", hook: "This content type is getting pushed by every algorithm right now." },
  { day: 23, platform: "Instagram", hook: "Your audience doesn't care about your product — until you do this." },
  { day: 24, platform: "LinkedIn", hook: "The 80/20 rule of social media content that nobody applies." },
  { day: 25, platform: "YouTube", hook: "Broke: Chasing trends. Woke: Being the trend." },
  { day: 26, platform: "TikTok", hook: "Day 26 post — your most searched question, answered." },
  { day: 27, platform: "Instagram", hook: "Here's what a content audit actually looks like (real numbers)." },
  { day: 28, platform: "Facebook", hook: "We repurposed one blog post into 12 pieces of content." },
  { day: 29, platform: "LinkedIn", hook: "The frameworks behind every high-performing B2B post." },
  { day: 30, platform: "Instagram", hook: "You've made it 30 days. Here's what consistency actually builds." },
];

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
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null);

  const cells = getCalendarGrid(viewYear, viewMonth);
  const postMap: Record<number, CalendarPost[]> = {};
  POSTS.forEach((p) => {
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

        {/* Platform legend */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          {Object.entries(PLATFORM_COLORS).map(([name, color]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
              <span style={{ fontSize: "0.78rem", color: "rgba(241,241,241,0.5)", fontWeight: 500 }}>{name}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "20px", overflow: "hidden" }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {DAYS_OF_WEEK.map((d) => (
              <div
                key={d}
                style={{ padding: "14px 8px", textAlign: "center", fontSize: "0.75rem", fontWeight: 700, color: "rgba(241,241,241,0.35)", letterSpacing: "0.05em" }}
              >
                {d.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {cells.map((day, idx) => {
              const posts = day ? postMap[day] || [] : [];
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
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: isToday ? "#7B2FFF" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.78rem",
                          fontWeight: isToday ? 700 : 500,
                          color: isToday ? "#fff" : "rgba(241,241,241,0.45)",
                          marginBottom: "6px",
                        }}
                      >
                        {day}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        {posts.map((post, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedPost(post)}
                            style={{
                              padding: "3px 6px",
                              borderRadius: "5px",
                              fontSize: "0.68rem",
                              fontWeight: 600,
                              color: "#fff",
                              background: `${PLATFORM_COLORS[post.platform]}22`,
                              borderLeft: `3px solid ${PLATFORM_COLORS[post.platform]}`,
                              cursor: "pointer",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                            title={post.hook}
                          >
                            {post.platform}
                          </div>
                        ))}
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
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "24px",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            style={{
              background: "#1C1B2E",
              border: "1px solid rgba(123,47,255,0.3)",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: PLATFORM_COLORS[selectedPost.platform],
                    background: `${PLATFORM_COLORS[selectedPost.platform]}18`,
                    border: `1px solid ${PLATFORM_COLORS[selectedPost.platform]}33`,
                  }}
                >
                  {selectedPost.platform}
                </span>
                <span style={{ fontSize: "0.78rem", color: "rgba(241,241,241,0.35)", fontWeight: 600 }}>Day {selectedPost.day}</span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                style={{ background: "transparent", border: "none", color: "rgba(241,241,241,0.4)", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "8px" }}>
              HOOK
            </p>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "#F1F1F1", lineHeight: 1.5, marginBottom: "20px" }}>
              &ldquo;{selectedPost.hook}&rdquo;
            </p>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "rgba(123,47,255,0.15)", border: "1px solid rgba(123,47,255,0.3)", color: "#a78bfa", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
              >
                ✎ Edit Post
              </button>
              <button
                style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
              >
                ↗ Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
