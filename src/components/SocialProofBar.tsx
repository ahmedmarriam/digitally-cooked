"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Businesses Trust Us", icon: "🏢" },
  { value: 40, suffix: "", label: "Posts Per Month", icon: "📅" },
  { value: 5, suffix: "", label: "Platforms Supported", icon: "📲" },
  { value: 5, suffix: " min", label: "Generation Time", icon: "⚡" },
  { value: 30, suffix: "+", label: "Countries Reached", icon: "🌍" },
];

const platforms = [
  "Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube",
  "Pinterest", "Twitter/X", "Snapchat", "Threads", "Reddit",
  "Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube",
  "Pinterest", "Twitter/X", "Snapchat", "Threads", "Reddit",
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="gradient-text" style={{ fontSize: "2.2rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em" }}>
      {count}{suffix}
    </div>
  );
}

export default function SocialProofBar() {
  return (
    <section
      style={{
        position: "relative",
        padding: "70px 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(139,92,246,0.1)",
        borderBottom: "1px solid rgba(139,92,246,0.1)",
      }}
    >
      {/* Trust headline */}
      <div style={{ textAlign: "center", marginBottom: "48px", padding: "0 24px" }}>
        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "rgba(139,92,246,0.8)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
          ● TRUSTED WORLDWIDE
        </p>
        <h3 style={{ fontSize: "clamp(1.3rem, 3vw, 1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
          Trusted by{" "}
          <span style={{ background: "linear-gradient(90deg,#a78bfa,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            500+ businesses
          </span>{" "}
          across 30 countries
        </h3>
      </div>

      {/* Stats grid */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "32px",
          marginBottom: "56px",
        }}
      >
        {stats.map(({ value, suffix, label, icon }) => (
          <div key={label} style={{ textAlign: "center", flex: "1", minWidth: "120px" }}>
            <div style={{ fontSize: "2.4rem", marginBottom: "6px" }}>{icon}</div>
            <AnimatedCounter target={value} suffix={suffix} />
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", marginTop: "6px", fontWeight: 500 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          maxWidth: "200px",
          margin: "0 auto 40px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)",
        }}
      />

      {/* Marquee — platform names */}
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(90deg, var(--dc-bg), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(-90deg, var(--dc-bg), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div className="animate-marquee" style={{ display: "flex", gap: "48px", width: "max-content" }}>
          {platforms.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 24px",
                borderRadius: "100px",
                border: "1px solid rgba(139,92,246,0.2)",
                background: "rgba(14,12,46,0.5)",
                whiteSpace: "nowrap",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <PlatformIcon name={p} />
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    Instagram: "📸",
    TikTok: "🎵",
    Facebook: "👥",
    LinkedIn: "💼",
    YouTube: "▶️",
    Pinterest: "📌",
    "Twitter/X": "🐦",
    Snapchat: "👻",
    Threads: "🧵",
    Reddit: "🔴",
  };
  return <span style={{ fontSize: "1rem" }}>{icons[name] ?? "📱"}</span>;
}
