const features = [
  {
    icon: "📅",
    title: "30 Calendar Posts",
    description: "A full month of content mapped day-by-day across your chosen platforms. Never stare at a blank screen again.",
    color: "#8b5cf6",
    highlight: false,
  },
  {
    icon: "⭐",
    title: "10 Bonus Posts",
    description: "5 Story-format posts and 5 alternate versions — more variety, more flexibility, more reach.",
    color: "#ec4899",
    highlight: false,
  },
  {
    icon: "🎣",
    title: "Scroll-Stopping Hooks",
    description: "Every post opens with a high-impact hook designed to stop the scroll and pull the reader in within 3 seconds.",
    color: "#f97316",
    highlight: false,
  },
  {
    icon: "✍️",
    title: "Full Captions & CTAs",
    description: "On-brand captions written in your voice, with clear calls-to-action that convert followers into customers.",
    color: "#22c55e",
    highlight: true,
    badge: "Core Feature",
  },
  {
    icon: "#️⃣",
    title: "Hashtag Sets",
    description: "Platform-optimised hashtag bundles for every post. Researched, grouped, and ready to copy-paste.",
    color: "#eab308",
    highlight: false,
  },
  {
    icon: "🖼️",
    title: "AI Image Prompts",
    description: "Every post includes a detailed Ideogram-ready image prompt — just submit and get a stunning visual generated for you.",
    color: "#3b82f6",
    highlight: false,
  },
  {
    icon: "📱",
    title: "Platform-Specific Content",
    description: "Each post is adapted for its platform — Instagram carousels, TikTok hooks, LinkedIn thought-leadership, and more.",
    color: "#a78bfa",
    highlight: false,
  },
  {
    icon: "🔄",
    title: "Fresh Content Monthly",
    description: "Subscribe and get a brand-new batch of 40 posts every month. Always fresh, always on-trend, always on-brand.",
    color: "#ec4899",
    highlight: false,
  },
];

export default function WhatYouGet() {
  return (
    <section
      id="features"
      style={{ padding: "100px 0", position: "relative", overflow: "hidden" }}
    >
      {/* BG orbs */}
      <div
        className="glow-orb animate-orb"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          top: "10%",
          right: "-150px",
          opacity: 0.1,
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            🎁 Everything Included
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
            40 Posts.{" "}
            <span className="gradient-text">Everything Baked In.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto" }}>
            Not just a caption. Every single post comes fully loaded — from hook to hashtag to image.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="card-glow"
              style={{
                borderRadius: "20px",
                padding: "28px",
                position: "relative",
                borderColor: f.highlight ? `${f.color}40` : "rgba(139,92,246,0.2)",
                boxShadow: f.highlight ? `0 0 30px ${f.color}15` : "none",
              }}
            >
              {f.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    right: "20px",
                    padding: "4px 12px",
                    borderRadius: "0 0 10px 10px",
                    background: `linear-gradient(135deg, ${f.color}, #ec4899)`,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.05em",
                  }}
                >
                  {f.badge}
                </div>
              )}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}35`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "16px",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  marginBottom: "10px",
                  color: "#fff",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.65,
                }}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px",
              borderRadius: "16px",
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🍳</span>
            All of this — from <strong style={{ color: "#fff" }}>one form</strong>, in under 5 minutes.
            <a href="#pricing" className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.88rem", marginLeft: "8px" }}>
              Get Started →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
