const comparisons = [
  {
    label: "Caption",
    before: {
      title: "What you'd write at 11pm on a Sunday",
      content: "Check out our new product! We work really hard and our team is dedicated to helping customers. Follow us for more updates and don't forget to like and share! #business #marketing #smallbusiness",
      issues: ["Generic & forgettable", "No hook", "Weak CTA", "Boring hashtags"],
    },
    after: {
      title: "What Digitally Cooked writes for you",
      content: 'Most business owners are invisible online — not because they\'re not trying, but because they\'re posting without strategy. Here\'s the shift that changes everything 👇\n\nYour content should do one job: make someone stop scrolling. And the way you do that is with a hook that hits before they even read the caption.\n\nWe built a tool that does this for you. 40 posts. Every month. Zero burnout.',
      cta: "Save this and read it before your next post.",
      hashtags: "#ContentStrategy #SmallBusinessMarketing #SocialMediaTips #BusinessGrowth",
    },
  },
];

export default function BeforeAfter() {
  return (
    <section
      style={{
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.03) 50%, transparent 100%)",
      }}
    >
      <div
        className="glow-orb animate-orb"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          top: "50%",
          left: "-150px",
          opacity: 0.08,
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            ⚡ The Difference Is Night & Day
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Generic Content vs.{" "}
            <span className="gradient-text">Digitally Cooked</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", maxWidth: "460px", margin: "0 auto" }}>
            The same business. The same niche. Completely different results.
          </p>
        </div>

        {comparisons.map((comparison, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "0",
              alignItems: "stretch",
            }}
            className="before-after-grid"
          >
            {/* BEFORE */}
            <div
              style={{
                borderRadius: "20px 0 0 20px",
                padding: "32px",
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRight: "none",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <div
                  style={{
                    padding: "4px 14px",
                    borderRadius: "100px",
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#ef4444",
                    letterSpacing: "0.06em",
                  }}
                >
                  ✕ BEFORE
                </div>
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                {comparison.before.title}
              </p>

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  padding: "18px",
                  borderRadius: "12px",
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.12)",
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                "{comparison.before.content}"
              </div>

              {/* Issues */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {comparison.before.issues.map((issue) => (
                  <div key={issue} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "rgba(239,68,68,0.7)" }}>
                    <span style={{ color: "#ef4444", fontWeight: 700 }}>✕</span>
                    {issue}
                  </div>
                ))}
              </div>
            </div>

            {/* VS divider */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
                position: "relative",
                zIndex: 2,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "0.8rem",
                  color: "#fff",
                  boxShadow: "0 0 25px rgba(139,92,246,0.5)",
                  flexShrink: 0,
                }}
              >
                VS
              </div>
            </div>

            {/* AFTER */}
            <div
              style={{
                borderRadius: "0 20px 20px 0",
                padding: "32px",
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.3)",
                borderLeft: "none",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                position: "relative",
              }}
            >
              {/* Glow accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "200px",
                  height: "200px",
                  background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
                  borderRadius: "0 20px 0 0",
                  pointerEvents: "none",
                }}
              />

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <div
                  style={{
                    padding: "4px 14px",
                    borderRadius: "100px",
                    background: "rgba(139,92,246,0.2)",
                    border: "1px solid rgba(139,92,246,0.4)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#a78bfa",
                    letterSpacing: "0.06em",
                  }}
                >
                  ✓ DIGITALLY COOKED
                </div>
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                {comparison.after.title}
              </p>

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  padding: "18px",
                  borderRadius: "12px",
                  background: "rgba(139,92,246,0.07)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.75,
                  whiteSpace: "pre-line",
                }}
              >
                {comparison.after.content}
              </div>

              {/* CTA + Hashtags */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "#22c55e", fontWeight: 700, fontSize: "0.82rem", flexShrink: 0 }}>📣 CTA</span>
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{comparison.after.cta}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "#a78bfa", fontWeight: 700, fontSize: "0.82rem", flexShrink: 0 }}>#️⃣</span>
                  <span style={{ fontSize: "0.78rem", color: "#a78bfa" }}>{comparison.after.hashtags}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Bottom nudge */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginBottom: "20px" }}>
            This is the quality difference between winging it and using AI that knows your brand.
          </p>
          <a href="#pricing" className="btn-primary" style={{ fontSize: "1rem", padding: "15px 32px" }}>
            Get This Quality Every Month →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .before-after-grid {
            grid-template-columns: 1fr !important;
          }
          .before-after-grid > div:first-child {
            border-radius: 20px 20px 0 0 !important;
            border-right: 1px solid rgba(239,68,68,0.2) !important;
            border-bottom: none !important;
          }
          .before-after-grid > div:last-child {
            border-radius: 0 0 20px 20px !important;
            border-left: 1px solid rgba(139,92,246,0.3) !important;
            border-top: none !important;
          }
        }
      `}</style>
    </section>
  );
}
