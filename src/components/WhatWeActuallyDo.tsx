"use client";

const benefits = [
  {
    icon: "🤖",
    title: "AI Writes 40 Posts",
    description: "Hooks, captions, CTAs, hashtags. Platform-specific. On-brand. Done.",
    color: "#8b5cf6",
  },
  {
    icon: "🖼️",
    title: "AI Designs Your Visuals",
    description: "Every post gets a custom AI-generated image. No Canva needed.",
    color: "#ec4899",
  },
  {
    icon: "📅",
    title: "Auto-Schedules Everything",
    description: "Your 40 posts get mapped to a full monthly calendar automatically.",
    color: "#3b82f6",
  },
  {
    icon: "🚀",
    title: "Auto-Posts to 15 Platforms",
    description: "Instagram, TikTok, Facebook, LinkedIn, YouTube and 10 more. One click.",
    color: "#f97316",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description: "See what's working. Track reach, impressions, engagement across all platforms.",
    color: "#22c55e",
  },
  {
    icon: "⚡",
    title: "Done in Under 5 Minutes",
    description: "What a social media manager takes a month to do, we do in 5 minutes.",
    color: "#eab308",
  },
];

export default function WhatWeActuallyDo() {
  return (
    <section
      id="features"
      style={{
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG orb */}
      <div
        className="glow-orb animate-orb-2"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          top: "50%",
          right: "-200px",
          opacity: 0.07,
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            ✦ What We Actually Do
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "18px",
            }}
          >
            One tool.{" "}
            <span className="gradient-text">Everything handled.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto" }}>
            We're not a content tool. We're your entire social media department, automated.
          </p>
        </div>

        {/* Benefits grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {benefits.map(({ icon, title, description, color }) => (
            <div
              key={title}
              style={{
                padding: "28px 26px",
                borderRadius: "20px",
                background: "rgba(10,10,10,0.8)",
                border: `1px solid ${color}20`,
                backdropFilter: "blur(10px)",
                transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-5px)";
                el.style.borderColor = `${color}50`;
                el.style.boxShadow = `0 16px 50px ${color}15`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0)";
                el.style.borderColor = `${color}20`;
                el.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginBottom: "18px",
                }}
              >
                {icon}
              </div>

              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: "10px",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.92rem", lineHeight: 1.65 }}>
                {description}
              </p>

              {/* Bottom accent */}
              <div
                style={{
                  marginTop: "20px",
                  height: "2px",
                  borderRadius: "999px",
                  background: `linear-gradient(90deg, ${color}60, transparent)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
