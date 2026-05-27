"use client";

import { useRef, useState } from "react";

export default function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: x * 10, y: y * -10 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "100px",
        paddingBottom: "80px",
        overflow: "hidden",
        background: "transparent",  /* canvas shows through */
      }}
    >
      {/* Gradient overlay so headline stays readable over the 3D canvas */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,14,26,0.55) 0%, rgba(15,14,26,0.3) 60%, transparent 100%)", zIndex: 1, pointerEvents: "none" }} />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
        className="hero-grid"
      >
        {/* LEFT — Copy */}
        <div>
          {/* Badge */}
          <div className="section-label animate-fade-in-up" style={{ marginBottom: "24px", animationDelay: "0.1s" }}>
            <span style={{ color: "#22c55e" }}>●</span>
            AI-Powered · Social Media Department
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              marginBottom: "24px",
              animationDelay: "0.2s",
            }}
          >
            Your Complete Social Media{" "}
            <span className="gradient-text">Department. Automated.</span>
          </h1>

          {/* Sub */}
          <p
            className="animate-fade-in-up"
            style={{
              fontSize: "1.15rem",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.7,
              marginBottom: "36px",
              maxWidth: "520px",
              animationDelay: "0.3s",
            }}
          >
            We write it. We design it. We schedule it.{" "}
            <strong style={{ color: "#fff" }}>We post it.</strong> You just show up.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-in-up"
            style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "48px", animationDelay: "0.4s" }}
          >
            <a href="/signup" className="btn-primary" style={{ fontSize: "1.05rem", padding: "16px 32px" }}>
              🍳 Get Started Free
            </a>
            <a href="#how-it-works" className="btn-secondary" style={{ fontSize: "1.05rem", padding: "16px 32px" }}>
              See How It Works →
            </a>
          </div>

          {/* Stats row */}
          <div
            className="animate-fade-in-up"
            style={{ display: "flex", gap: "32px", flexWrap: "wrap", animationDelay: "0.5s" }}
          >
            {[
              { number: "40", label: "Posts per Month" },
              { number: "15", label: "Platforms Supported" },
              { number: "<5", label: "Minutes to Generate" },
            ].map(({ number, label }) => (
              <div key={label}>
                <div className="gradient-text" style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>
                  {number}
                </div>
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — 3D Dashboard mockup */}
        <div
          ref={visualRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="animate-scale-in hero-visual"
          style={{
            position: "relative",
            animationDelay: "0.3s",
            cursor: "default",
            perspective: "1200px",
          }}
        >
          {/* 3D wrapper */}
          <div style={{
            transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateZ(0)`,
            transition: "transform 0.15s ease-out",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}>
            {/* Main dashboard card */}
            <div
              style={{
                background: "rgba(6,6,6,0.96)",
                border: "1px solid rgba(139,92,246,0.4)",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              {/* Titlebar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "7px" }}>
                  {["#ef4444", "#eab308", "#22c55e"].map((c) => (
                    <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#a78bfa", fontWeight: 600 }}>
                  June 2026 — Content Calendar
                </div>
                <div style={{ padding: "5px 12px", borderRadius: "100px", background: "linear-gradient(135deg,#8b5cf6,#ec4899)", fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>
                  ✓ 40 Posts Ready
                </div>
              </div>

              {/* Calendar grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "14px" }}>
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                  <div key={d} style={{ textAlign: "center", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", paddingBottom: "4px" }}>{d}</div>
                ))}
                {Array.from({ length: 31 }, (_, i) => {
                  const dotColors = ["#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#eab308", "#3b82f6"];
                  const isWeekend = i % 7 === 5 || i % 7 === 6;
                  const hasPost = i < 30 && !isWeekend;
                  return (
                    <div key={i} style={{ textAlign: "center", padding: "5px 2px", borderRadius: "6px", background: hasPost ? "rgba(139,92,246,0.07)" : "transparent", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)" }}>{i + 1}</span>
                      {hasPost && <div style={{ width: "6px", height: "6px", borderRadius: "50%", marginTop: "3px", background: dotColors[i % dotColors.length], boxShadow: `0 0 5px ${dotColors[i % dotColors.length]}` }} />}
                    </div>
                  );
                })}
              </div>

              {/* Post previews */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { platform: "IG", color: "#ec4899", day: "Mon, Jun 2", hook: '"Stop wasting hours..."' },
                  { platform: "TK", color: "#8b5cf6", day: "Wed, Jun 4", hook: '"Here\'s what nobody..."' },
                  { platform: "LI", color: "#3b82f6", day: "Fri, Jun 6", hook: '"The truth about..."' },
                ].map(({ platform, color, day, hook }) => (
                  <div key={platform} style={{ borderRadius: "12px", padding: "10px", background: "rgba(139,92,246,0.06)", border: `1px solid ${color}30`, transform: "translateZ(8px)" }}>
                    <div style={{ borderRadius: "8px", height: "64px", marginBottom: "8px", background: `linear-gradient(135deg, ${color}25, rgba(0,0,0,0.3))`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                      <span style={{ fontSize: "1.3rem", fontWeight: 900, color, opacity: 0.7 }}>{platform}</span>
                      <div style={{ position: "absolute", bottom: "4px", right: "4px", width: "14px", height: "14px", borderRadius: "3px", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "8px", color: "#fff" }}>✦</span>
                      </div>
                    </div>
                    <div style={{ height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.15)", marginBottom: "5px" }} />
                    <div style={{ height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.1)", marginBottom: "5px", width: "70%" }} />
                    <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", marginTop: "5px", fontStyle: "italic" }}>{hook}</div>
                    <div style={{ fontSize: "0.58rem", color, marginTop: "4px", fontWeight: 600 }}>{day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges — translateZ for 3D pop */}
            <div className="animate-badge-pop" style={{ position: "absolute", top: "-18px", right: "-18px", padding: "9px 16px", borderRadius: "14px", background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 6px 25px rgba(34,197,94,0.45)", fontSize: "0.78rem", fontWeight: 700, color: "#fff", animationDelay: "0.8s", transform: "translateZ(24px)" }}>
              ✓ 40 Posts Generated
            </div>
            <div className="animate-badge-pop" style={{ position: "absolute", bottom: "-18px", left: "-18px", padding: "9px 16px", borderRadius: "14px", background: "linear-gradient(135deg, #f97316, #eab308)", boxShadow: "0 6px 25px rgba(249,115,22,0.45)", fontSize: "0.78rem", fontWeight: 700, color: "#fff", animationDelay: "1s", transform: "translateZ(24px)" }}>
              ⚡ Ready in under 5 mins
            </div>
            <div className="animate-badge-pop" style={{ position: "absolute", bottom: "40%", right: "-22px", padding: "9px 16px", borderRadius: "14px", background: "rgba(14,12,46,0.9)", border: "1px solid rgba(139,92,246,0.4)", boxShadow: "0 6px 25px rgba(0,0,0,0.4)", fontSize: "0.78rem", fontWeight: 700, color: "#a78bfa", animationDelay: "1.2s", backdropFilter: "blur(10px)", transform: "translateZ(24px)" }}>
              🤖 AI-Powered Pipeline
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", animation: "float 3s ease-in-out infinite", zIndex: 2 }}>
        <span>scroll down</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-visual { display: none; }
        }
      `}</style>
    </section>
  );
}
