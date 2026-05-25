"use client";

import { useState } from "react";

export default function DemoVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      style={{
        padding: "80px 0 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow behind the video */}
      <div
        className="glow-orb"
        style={{
          width: "700px",
          height: "400px",
          background: "radial-gradient(ellipse, #8b5cf6 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          opacity: 0.12,
          borderRadius: "50%",
        }}
      />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            ▶ Watch It Work
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "14px",
            }}
          >
            See Your Content{" "}
            <span className="gradient-text">Getting Cooked Live</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", maxWidth: "440px", margin: "0 auto" }}>
            Fill a form. Watch AI generate 40 posts in real time. It's that fast.
          </p>
        </div>

        {/* Video frame */}
        <div
          style={{
            position: "relative",
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid rgba(139,92,246,0.3)",
            boxShadow: "0 0 80px rgba(139,92,246,0.2), 0 40px 100px rgba(0,0,0,0.7)",
            cursor: "pointer",
            aspectRatio: "16/9",
            background: "#060606",
          }}
          onClick={() => setPlaying(true)}
          className="animate-pulse-glow"
        >
          {/* Browser chrome bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40px",
              background: "rgba(15,15,15,0.95)",
              borderBottom: "1px solid rgba(139,92,246,0.15)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: "8px",
              zIndex: 2,
            }}
          >
            {["#ef4444", "#eab308", "#22c55e"].map((c) => (
              <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
            ))}
            <div
              style={{
                marginLeft: "12px",
                flex: 1,
                height: "22px",
                borderRadius: "6px",
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.15)",
                display: "flex",
                alignItems: "center",
                paddingLeft: "10px",
                maxWidth: "340px",
              }}
            >
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
                app.digitallycookedai.com/generate
              </span>
            </div>
          </div>

          {/* Placeholder thumbnail content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              paddingTop: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(0,0,0,0) 50%, rgba(249,115,22,0.06) 100%)",
            }}
          >
            {/* Decorative mock UI in background */}
            <div style={{ position: "absolute", inset: "40px 0 0", opacity: 0.15, display: "flex", gap: "20px", padding: "30px", overflow: "hidden" }}>
              {/* Left: form mockup */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Brand Name", "Industry / Niche", "Tone of Voice", "Target Audience"].map((label) => (
                  <div key={label}>
                    <div style={{ height: "10px", width: "80px", borderRadius: "4px", background: "rgba(139,92,246,0.4)", marginBottom: "6px" }} />
                    <div style={{ height: "32px", borderRadius: "8px", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }} />
                  </div>
                ))}
              </div>
              {/* Right: output mockup */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ borderRadius: "10px", padding: "12px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
                    <div style={{ height: "8px", width: "60%", borderRadius: "4px", background: "rgba(255,255,255,0.15)", marginBottom: "6px" }} />
                    <div style={{ height: "8px", width: "90%", borderRadius: "4px", background: "rgba(255,255,255,0.08)", marginBottom: "4px" }} />
                    <div style={{ height: "8px", width: "75%", borderRadius: "4px", background: "rgba(255,255,255,0.08)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Play button */}
            {!playing && (
              <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    boxShadow: "0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.3)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.1)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 60px rgba(139,92,246,0.8), 0 0 120px rgba(139,92,246,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.3)";
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginLeft: "4px" }}>
                    <path d="M8 5l16 9-16 9V5z" fill="white" />
                  </svg>
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", fontWeight: 500 }}>
                  Watch 2-min demo
                </p>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem", marginTop: "6px" }}>
                  {/* PLACEHOLDER — swap src with your real video URL below */}
                  Coming soon — drop your demo recording here
                </p>
              </div>
            )}

            {/* When playing — swap the src below with your real video */}
            {playing && (
              <video
                autoPlay
                controls
                style={{ position: "absolute", inset: "40px 0 0", width: "100%", height: "calc(100% - 40px)", objectFit: "cover" }}
                src=""
                /* ↑ REPLACE src="" WITH YOUR VIDEO URL e.g. src="/demo.mp4" or a YouTube embed */
              />
            )}
          </div>
        </div>

        {/* Below video: key moments */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginTop: "32px",
            flexWrap: "wrap",
          }}
        >
          {[
            { time: "0:00", label: "Fill brand profile" },
            { time: "0:45", label: "AI generates 40 posts" },
            { time: "1:20", label: "Download your calendar" },
          ].map(({ time, label }) => (
            <div key={time} style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "100px",
                  background: "rgba(139,92,246,0.12)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  color: "#a78bfa",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  fontFamily: "monospace",
                }}
              >
                {time}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
