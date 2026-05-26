"use client";

const smItems = [
  "Costs $2,000–$5,000/month",
  "Takes 2–4 weeks to onboard",
  "Inconsistent quality & output",
  "Needs briefing every single month",
  "Takes sick days, holidays, vacations",
  "Limited to a handful of platforms",
  "Requires approval rounds back & forth",
  "Zero memory of past brand decisions",
];

const dcItems = [
  "Just $49/month — flat, no surprises",
  "Ready in under 5 minutes",
  "Consistent, on-brand output every time",
  "Remembers your brand forever",
  "Always on — 24/7, 365 days a year",
  "Posts to 15 platforms simultaneously",
  "Fully automated, zero back-and-forth",
  "Gets smarter about your brand over time",
];

export default function ComparisonSection() {
  return (
    <section
      style={{
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG orbs */}
      <div
        className="glow-orb"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, #ef4444 0%, transparent 70%)",
          top: "20%",
          left: "-150px",
          opacity: 0.05,
        }}
      />
      <div
        className="glow-orb animate-orb"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          bottom: "10%",
          right: "-150px",
          opacity: 0.07,
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            💸 The Math Is Simple
          </div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Why Pay a Social Media Manager{" "}
            <span className="gradient-text">$2,000/Month?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>
            You&apos;re not paying for creativity. You&apos;re paying for time. We eliminate the time.
          </p>
        </div>

        {/* Comparison grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
          className="comparison-grid"
        >
          {/* Left — Social Media Manager */}
          <div
            style={{
              padding: "36px 32px",
              borderRadius: "24px",
              background: "rgba(239,68,68,0.04)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                👤
              </div>
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(239,68,68,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  TRADITIONAL APPROACH
                </p>
                <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Social Media Manager</p>
              </div>
            </div>

            <div
              style={{
                padding: "14px 20px",
                borderRadius: "12px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "2rem", fontWeight: 900, color: "#ef4444" }}>$2,000</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>/month</span>
              <p style={{ fontSize: "0.78rem", color: "rgba(239,68,68,0.6)", marginTop: "4px" }}>
                + benefits, onboarding, management overhead
              </p>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {smItems.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.9rem", color: "rgba(255,255,255,0.55)" }}>
                  <span style={{ color: "#ef4444", fontSize: "1rem", flexShrink: 0 }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Digitally Cooked */}
          <div
            style={{
              padding: "36px 32px",
              borderRadius: "24px",
              background: "linear-gradient(160deg, rgba(139,92,246,0.1), rgba(236,72,153,0.06))",
              border: "1.5px solid rgba(139,92,246,0.35)",
              boxShadow: "0 0 60px rgba(139,92,246,0.1)",
              position: "relative",
            }}
          >
            {/* Popular badge */}
            <div
              style={{
                position: "absolute",
                top: "-16px",
                right: "28px",
                padding: "6px 18px",
                borderRadius: "100px",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#fff",
                boxShadow: "0 4px 16px rgba(139,92,246,0.5)",
              }}
            >
              ✦ The Smart Choice
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  boxShadow: "0 4px 16px rgba(139,92,246,0.4)",
                }}
              >
                🍳
              </div>
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  THE BETTER WAY
                </p>
                <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Digitally Cooked</p>
              </div>
            </div>

            <div
              style={{
                padding: "14px 20px",
                borderRadius: "12px",
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.3)",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "2rem", fontWeight: 900, color: "#a78bfa" }}>$49</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>/month</span>
              <p style={{ fontSize: "0.78rem", color: "rgba(139,92,246,0.7)", marginTop: "4px" }}>
                97.5% cheaper. No contracts. Cancel anytime.
              </p>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {dcItems.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
                  <span style={{ color: "#22c55e", fontSize: "1rem", flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <a
            href="#pricing"
            className="btn-primary"
            style={{ fontSize: "1.05rem", padding: "16px 36px" }}
          >
            🍳 Start for $49/month →
          </a>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", marginTop: "14px" }}>
            No credit card required to start. First 7 days free.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .comparison-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
