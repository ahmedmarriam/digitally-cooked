export default function FinalCTA() {
  return (
    <section
      style={{
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(236,72,153,0.06) 50%, rgba(249,115,22,0.08) 100%)",
          borderTop: "1px solid rgba(139,92,246,0.2)",
          borderBottom: "1px solid rgba(139,92,246,0.2)",
        }}
      />

      {/* Orbs */}
      <div
        className="glow-orb animate-orb"
        style={{
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          opacity: 0.1,
        }}
      />
      <div
        className="glow-orb animate-orb-2"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
          bottom: "-100px",
          right: "-100px",
          opacity: 0.08,
        }}
      />

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: "4rem", marginBottom: "24px", display: "block" }}>🍳</div>

        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            marginBottom: "24px",
          }}
        >
          Stop Stressing About Content.{" "}
          <span className="gradient-text">Let AI Cook.</span>
        </h2>

        {/* Sub */}
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "1.15rem",
            lineHeight: 1.7,
            marginBottom: "48px",
            maxWidth: "580px",
            margin: "0 auto 48px",
          }}
        >
          Your competitors are already using AI to show up consistently and build audiences on autopilot.
          One brand profile, 40 posts, under 5 minutes.{" "}
          <strong style={{ color: "#fff" }}>What are you waiting for?</strong>
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "48px",
          }}
        >
          <a href="#pricing" className="btn-primary" style={{ fontSize: "1.1rem", padding: "18px 36px" }}>
            🍳 Start Cooking Free
          </a>
          <a href="#how-it-works" className="btn-secondary" style={{ fontSize: "1.1rem", padding: "18px 36px" }}>
            See How It Works →
          </a>
        </div>

        {/* Trust signals */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "24px",
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.82rem",
          }}
        >
          {[
            "🔒 Secure & Private",
            "⚡ Instant Generation",
            "🚫 No Credit Card Required",
            "❌ Cancel Anytime",
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
