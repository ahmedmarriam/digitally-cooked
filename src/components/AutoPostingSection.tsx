"use client";

const platformList = [
  { name: "Instagram", icon: "📸", color: "#ec4899" },
  { name: "TikTok", icon: "🎵", color: "#8b5cf6" },
  { name: "Facebook", icon: "👥", color: "#3b82f6" },
  { name: "LinkedIn", icon: "💼", color: "#0ea5e9" },
  { name: "YouTube", icon: "▶️", color: "#ef4444" },
  { name: "Pinterest", icon: "📌", color: "#f97316" },
  { name: "Twitter/X", icon: "🐦", color: "#64748b" },
  { name: "Snapchat", icon: "👻", color: "#eab308" },
  { name: "Threads", icon: "🧵", color: "#a78bfa" },
  { name: "Reddit", icon: "🔴", color: "#f97316" },
  { name: "+ 5 more", icon: "✦", color: "#22c55e" },
];

const steps = [
  { number: "01", title: "Connect Once", description: "Link your social accounts in one click via secure OAuth. Takes 2 minutes total." },
  { number: "02", title: "We Generate", description: "Fill your brand profile. Our AI writes, designs, and schedules 40 posts in under 5 minutes." },
  { number: "03", title: "It Posts Itself", description: "Every post goes live at the optimal time, on every platform you've connected. Zero manual work." },
];

export default function AutoPostingSection() {
  return (
    <section
      style={{
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
        background: "rgba(139,92,246,0.03)",
        borderTop: "1px solid rgba(139,92,246,0.08)",
        borderBottom: "1px solid rgba(139,92,246,0.08)",
      }}
    >
      {/* BG */}
      <div
        className="glow-orb animate-orb"
        style={{
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          opacity: 0.05,
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            🚀 Auto-Posting Engine
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
            Set It and Forget It —{" "}
            <span className="gradient-text">We Post For You</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.05rem", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            Connect your social accounts once. Every post gets automatically scheduled and published at the perfect time. Across 15 platforms. Zero manual work.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}
          className="autopost-grid"
        >
          {/* Left — steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {steps.map(({ number, title, description }) => (
              <div key={number} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.1))",
                    border: "1px solid rgba(139,92,246,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: "#a78bfa",
                  }}
                >
                  {number}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>{title}</h3>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{description}</p>
                </div>
              </div>
            ))}

            <a
              href="/signup"
              className="btn-primary"
              style={{ marginTop: "8px", alignSelf: "flex-start", fontSize: "1rem", padding: "14px 28px" }}
            >
              Connect My Accounts →
            </a>
          </div>

          {/* Right — platforms visual */}
          <div>
            <div
              style={{
                background: "rgba(10,10,10,0.9)",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
              }}
            >
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "24px" }}>
                ● POSTING TO 15 PLATFORMS
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {platformList.map(({ name, icon, color }) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      background: `${color}10`,
                      border: `1px solid ${color}30`,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    <span>{icon}</span>
                    {name}
                  </div>
                ))}
              </div>

              {/* Status bar */}
              <div
                style={{
                  marginTop: "24px",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                  40 posts scheduled · Next post in <strong style={{ color: "#22c55e" }}>2h 14m</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .autopost-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
