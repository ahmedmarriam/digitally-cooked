const steps = [
  {
    number: "01",
    icon: "📋",
    title: "Fill Your Brand Profile",
    description:
      "Answer a quick form about your business — your name, industry, tone of voice, target audience, visual style, and which platforms you want to post on.",
    color: "#8b5cf6",
    tags: ["Brand Name", "Niche", "Tone", "Audience", "Platforms"],
  },
  {
    number: "02",
    icon: "🤖",
    title: "AI Cooks Your Content",
    description:
      "Our pipeline powered by Claude AI crafts 40 unique, on-brand posts tailored specifically to your business. Every post gets a hook, caption, CTA, hashtags, and an AI image prompt.",
    color: "#ec4899",
    tags: ["Claude AI", "Ideogram Images", "Platform-Specific", "On-Brand"],
  },
  {
    number: "03",
    icon: "🚀",
    title: "Download & Post",
    description:
      "Your 40-post content calendar lands on your dashboard — ready to copy, paste, and schedule. 30 calendar posts mapped day-by-day, plus 10 bonus Story and alternate formats.",
    color: "#f97316",
    tags: ["Dashboard", "Calendar", "Stories", "Instant Download"],
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orb */}
      <div
        className="glow-orb"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
          top: "50%",
          left: "-200px",
          opacity: 0.07,
          transform: "translateY(-50%)",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            ⚙️ Simple Process
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
            From Zero to{" "}
            <span className="gradient-text">40 Posts in 3 Steps</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.1rem", maxWidth: "520px", margin: "0 auto" }}>
            No content team. No creative burnout. No guessing. Just fill in your details and let the AI do the heavy lifting.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {steps.map((step, index) => (
            <div key={step.number}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: "0 40px",
                  alignItems: "stretch",
                }}
                className="step-row"
              >
                {/* Left — number + connector line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: `${step.color}18`,
                      border: `2px solid ${step.color}60`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.6rem",
                      flexShrink: 0,
                      boxShadow: `0 0 20px ${step.color}25`,
                    }}
                  >
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      style={{
                        width: "2px",
                        flex: 1,
                        minHeight: "60px",
                        background: `linear-gradient(to bottom, ${step.color}60, ${steps[index + 1].color}30)`,
                        margin: "8px 0",
                      }}
                    />
                  )}
                </div>

                {/* Right — content */}
                <div
                  className="card-glow"
                  style={{
                    borderRadius: "20px",
                    padding: "32px",
                    marginBottom: index < steps.length - 1 ? "24px" : "0",
                    borderColor: `${step.color}22`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: step.color, letterSpacing: "0.1em", marginBottom: "6px" }}>
                        STEP {step.number}
                      </div>
                      <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "12px", letterSpacing: "-0.01em" }}>
                        {step.title}
                      </h3>
                      <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "18px", maxWidth: "520px" }}>
                        {step.description}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {step.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              padding: "4px 12px",
                              borderRadius: "100px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              background: `${step.color}15`,
                              border: `1px solid ${step.color}35`,
                              color: step.color,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .step-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
