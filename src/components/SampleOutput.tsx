const samplePosts = [
  {
    platform: "Instagram",
    platformColor: "#e1306c",
    platformIcon: "📸",
    day: "Day 1 — Mon",
    type: "Feed Post",
    hook: '"Most businesses are invisible online. Here\'s what\'s actually stopping you from being seen..."',
    caption:
      "You show up. You post. You wait. But the results never come — and you don't know why. The truth is, it's not about posting more. It's about posting with strategy. Here's what that looks like 👇",
    cta: "Save this for your next content session.",
    hashtags: "#SmallBusiness #SocialMediaStrategy #ContentMarketing #InstagramGrowth #DigitalMarketing",
    imagePrompt: "A determined entrepreneur at a sleek desk at golden hour, soft bokeh, editorial lighting, professional lifestyle photography",
  },
  {
    platform: "TikTok",
    platformColor: "#8b5cf6",
    platformIcon: "🎵",
    day: "Day 3 — Wed",
    type: "Short-form Video Hook",
    hook: '"POV: You stop guessing what to post and let AI do the thinking for you."',
    caption:
      "Stop the content burnout. Stop the mental block. Stop staring at a blank screen every Sunday night. There's a better way → link in bio",
    cta: "Follow for daily marketing tips that actually work.",
    hashtags: "#ContentCreator #MarketingTips #AIContent #BusinessOwner #SocialMediaMarketing",
    imagePrompt: "Close-up of hands typing on a glowing laptop, dark moody background, purple and orange accent lighting, cinematic",
  },
  {
    platform: "LinkedIn",
    platformColor: "#0ea5e9",
    platformIcon: "💼",
    day: "Day 5 — Fri",
    type: "Thought Leadership",
    hook: '"The businesses that will win in 2025 already know this secret about content."',
    caption:
      "It's not about going viral. It's about showing up consistently with content that builds trust. Most entrepreneurs skip this because it takes time — or so they think. What if you could automate the entire process without losing your voice?",
    cta: "Comment 'CONTENT' and I'll send you how we do it.",
    hashtags: "#Entrepreneurship #ContentStrategy #BusinessGrowth #Marketing #LinkedInMarketing",
    imagePrompt: "Clean professional office with city views, person in business attire reviewing analytics on a large monitor, natural daylight",
  },
];

export default function SampleOutput() {
  return (
    <section
      style={{
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.04) 50%, transparent 100%)",
      }}
    >
      {/* Orb */}
      <div
        className="glow-orb animate-orb-2"
        style={{
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
          bottom: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.07,
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            👀 Sample Output
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
            See What Gets{" "}
            <span className="gradient-text">Cooked for You</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto" }}>
            These are real examples of the posts Digitally Cooked generates — hook, caption, CTA, hashtags, and image prompt.
          </p>
        </div>

        {/* Post cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {samplePosts.map((post) => (
            <div
              key={post.platform}
              className="card-glow"
              style={{
                borderRadius: "22px",
                overflow: "hidden",
                borderColor: `${post.platformColor}25`,
              }}
            >
              {/* Platform header */}
              <div
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: `${post.platformColor}12`,
                  borderBottom: `1px solid ${post.platformColor}20`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{post.platformIcon}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: post.platformColor }}>
                    {post.platform}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(255,255,255,0.4)",
                      padding: "3px 8px",
                      borderRadius: "100px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {post.type}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: post.platformColor,
                      padding: "3px 8px",
                      borderRadius: "100px",
                      border: `1px solid ${post.platformColor}35`,
                      background: `${post.platformColor}10`,
                    }}
                  >
                    {post.day}
                  </span>
                </div>
              </div>

              {/* Image area */}
              <div
                style={{
                  height: "120px",
                  background: `linear-gradient(135deg, ${post.platformColor}20, rgba(139,92,246,0.15))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  borderBottom: "1px solid rgba(139,92,246,0.1)",
                }}
              >
                <div style={{ textAlign: "center", padding: "0 20px" }}>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    AI Image Prompt
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.65)",
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    "{post.imagePrompt}"
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "rgba(139,92,246,0.2)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    fontSize: "0.65rem",
                    color: "#a78bfa",
                    fontWeight: 600,
                  }}
                >
                  🖼️ Ideogram
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "20px" }}>
                {/* Hook */}
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: post.platformColor, letterSpacing: "0.08em", marginBottom: "5px", textTransform: "uppercase" }}>
                    🎣 Hook
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "#fff", fontWeight: 600, lineHeight: 1.5, fontStyle: "italic" }}>
                    {post.hook}
                  </p>
                </div>

                {/* Caption */}
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", marginBottom: "5px", textTransform: "uppercase" }}>
                    ✍️ Caption
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                    {post.caption}
                  </p>
                </div>

                {/* CTA */}
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#22c55e", letterSpacing: "0.08em", marginBottom: "5px", textTransform: "uppercase" }}>
                    📣 CTA
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                    {post.cta}
                  </p>
                </div>

                {/* Hashtags */}
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: "rgba(139,92,246,0.07)",
                    border: "1px solid rgba(139,92,246,0.15)",
                    fontSize: "0.72rem",
                    color: "#a78bfa",
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "4px", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    #️⃣ Hashtags
                  </span>
                  {post.hashtags}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
            Every post is tailored to your brand — these are illustrative examples.{" "}
            <a href="#pricing" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600 }}>
              Get yours →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
