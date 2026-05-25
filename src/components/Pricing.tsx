"use client";

const tiers = [
  {
    name: "Starter",
    price: "29",
    period: "/mo",
    tagline: "Perfect for solo entrepreneurs & new businesses",
    color: "#8b5cf6",
    highlight: false,
    features: [
      "1 Brand Profile",
      "40 AI-generated posts/month",
      "30 calendar posts + 10 bonus",
      "Hooks, captions, CTAs, hashtags",
      "AI image prompts (Ideogram-ready)",
      "Instagram, TikTok & Facebook",
      "Monthly content calendar",
      "Email support",
    ],
    cta: "Start Cooking",
    ctaHref: "#",
  },
  {
    name: "Growth",
    price: "79",
    period: "/mo",
    tagline: "For businesses serious about scaling their presence",
    color: "#ec4899",
    highlight: true,
    badge: "Most Popular",
    features: [
      "3 Brand Profiles",
      "40 posts per brand/month",
      "30 calendar posts + 10 bonus",
      "Hooks, captions, CTAs, hashtags",
      "AI image prompts (Ideogram-ready)",
      "All 5 platforms included",
      "Priority processing",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Start Growing",
    ctaHref: "#",
  },
  {
    name: "Agency",
    price: "199",
    period: "/mo",
    tagline: "For agencies & teams managing multiple clients",
    color: "#f97316",
    highlight: false,
    features: [
      "10 Brand Profiles",
      "40 posts per brand/month",
      "30 calendar posts + 10 bonus",
      "Hooks, captions, CTAs, hashtags",
      "AI image prompts (Ideogram-ready)",
      "All 5 platforms included",
      "White-label ready output",
      "API access (coming soon)",
      "Dedicated account support",
      "Custom onboarding",
    ],
    cta: "Scale Your Agency",
    ctaHref: "#",
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      style={{
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orbs */}
      <div
        className="glow-orb animate-orb"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          opacity: 0.06,
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            💳 Simple Pricing
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
            Pick Your Plan.{" "}
            <span className="gradient-text">Start Creating.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.05rem", maxWidth: "460px", margin: "0 auto" }}>
            No hidden fees. Cancel anytime. Cheaper than a single sponsored post — and infinitely more sustainable.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "22px",
            alignItems: "start",
          }}
        >
          {tiers.map((tier) => (
            <div
              key={tier.name}
              style={{
                borderRadius: "24px",
                padding: tier.highlight ? "36px 30px" : "32px 28px",
                position: "relative",
                background: tier.highlight
                  ? `linear-gradient(160deg, rgba(236,72,153,0.12), rgba(139,92,246,0.1))`
                  : "rgba(10, 10, 10, 0.9)",
                border: `1.5px solid ${tier.highlight ? tier.color + "50" : "rgba(139,92,246,0.2)"}`,
                backdropFilter: "blur(14px)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: tier.highlight
                  ? `0 0 60px ${tier.color}20, 0 30px 80px rgba(0,0,0,0.4)`
                  : "none",
                transform: tier.highlight ? "scale(1.03)" : "scale(1)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = tier.highlight ? "scale(1.05)" : "translateY(-5px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = tier.highlight ? "scale(1.03)" : "scale(1)"; }}
            >
              {/* Badge */}
              {tier.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "-16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "6px 20px",
                    borderRadius: "100px",
                    background: `linear-gradient(135deg, ${tier.color}, #8b5cf6)`,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#fff",
                    whiteSpace: "nowrap",
                    boxShadow: `0 4px 16px ${tier.color}50`,
                  }}
                >
                  ⭐ {tier.badge}
                </div>
              )}

              {/* Name */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: tier.color,
                    boxShadow: `0 0 8px ${tier.color}`,
                  }}
                />
                <span style={{ fontSize: "1rem", fontWeight: 700, color: tier.color, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {tier.name}
                </span>
              </div>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>$</span>
                <span
                  style={{
                    fontSize: "3.2rem",
                    fontWeight: 900,
                    lineHeight: 1,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {tier.price}
                </span>
                <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                  {tier.period}
                </span>
              </div>

              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "24px", lineHeight: 1.5 }}>
                {tier.tagline}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${tier.color}40, transparent)`,
                  marginBottom: "24px",
                }}
              />

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "rgba(255,255,255,0.75)" }}>
                    <span style={{ color: tier.color, fontSize: "1rem", flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={tier.ctaHref}
                style={
                  tier.highlight
                    ? {
                        display: "block",
                        textAlign: "center",
                        padding: "16px",
                        borderRadius: "14px",
                        background: `linear-gradient(135deg, ${tier.color}, #8b5cf6)`,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "1rem",
                        textDecoration: "none",
                        boxShadow: `0 6px 25px ${tier.color}45`,
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                      }
                    : {
                        display: "block",
                        textAlign: "center",
                        padding: "16px",
                        borderRadius: "14px",
                        background: "transparent",
                        border: `1.5px solid ${tier.color}50`,
                        color: tier.color,
                        fontWeight: 700,
                        fontSize: "1rem",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }
                }
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
              >
                {tier.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <div style={{ textAlign: "center", marginTop: "48px", color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
          🔒 Secure checkout &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; No contracts &nbsp;·&nbsp; Content delivered within minutes
        </div>
      </div>
    </section>
  );
}
