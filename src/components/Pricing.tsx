"use client";

import { useState } from "react";

const PLAN_KEYS: Record<string, string> = {
  "Start Cooking":    "starter",
  "Start Growing":    "growth",
  "Scale Your Agency":"agency",
};

const tiers = [
  {
    name: "Starter",
    price: "49",
    period: "/mo",
    tagline: "Perfect for solo entrepreneurs & new businesses",
    color: "#8b5cf6",
    highlight: false,
    features: [
      "1 Brand Profile",
      "40 AI-generated posts/month",
      "Auto-post to Instagram, TikTok & Facebook",
      "Hooks, captions, CTAs, hashtags",
      "AI-generated visuals for every post",
      "Monthly content calendar",
      "Basic analytics dashboard",
      "Email support",
    ],
    cta: "Start Cooking",
    ctaHref: "/signup",
  },
  {
    name: "Growth",
    price: "99",
    period: "/mo",
    tagline: "For businesses serious about scaling their presence",
    color: "#ec4899",
    highlight: true,
    badge: "Most Popular",
    features: [
      "3 Brand Profiles",
      "40 posts per brand/month",
      "All 5 platforms + auto-post to 15",
      "Hooks, captions, CTAs, hashtags",
      "AI-generated visuals for every post",
      "Full analytics dashboard",
      "Priority processing",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Start Growing",
    ctaHref: "/signup",
  },
  {
    name: "Agency",
    price: "249",
    period: "/mo",
    tagline: "For agencies & teams managing multiple clients",
    color: "#f97316",
    highlight: false,
    features: [
      "10 Brand Profiles",
      "40 posts per brand/month",
      "All 5 platforms + auto-post to 15",
      "White-label output",
      "AI-generated visuals for every post",
      "Full analytics dashboard",
      "Dedicated account support",
      "Custom onboarding session",
    ],
    cta: "Scale Your Agency",
    ctaHref: "/signup",
  },
];

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState("");

  const handleCheckout = async (ctaLabel: string) => {
    const plan = PLAN_KEYS[ctaLabel];
    if (!plan) return;
    setStripeError("");
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setStripeError(data.error ?? "Checkout failed. Please try again.");
        setLoadingPlan(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      setStripeError("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

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

        <style>{`
          @keyframes cardFloat0 { 0%,100%{transform:translateY(0px)}  50%{transform:translateY(-9px)} }
          @keyframes cardFloat1 { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)}  }
          @keyframes cardFloat2 { 0%,100%{transform:translateY(0px)}  50%{transform:translateY(-11px)}}
        `}</style>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "22px",
            alignItems: "start",
          }}
        >
          {tiers.map((tier, tIdx) => (
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
                transition: "box-shadow 0.3s ease",
                boxShadow: tier.highlight
                  ? `0 0 60px ${tier.color}20, 0 30px 80px rgba(0,0,0,0.4)`
                  : "none",
                animation: `cardFloat${tIdx} ${4 + tIdx * 0.8}s ease-in-out infinite`,
              }}
              onMouseMove={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
                const y = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
                el.style.animation = "none";
                el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${y * -7}deg) translateY(-12px)`;
                el.style.boxShadow = `0 24px 60px ${tier.color}30`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "";
                el.style.boxShadow = tier.highlight ? `0 0 60px ${tier.color}20, 0 30px 80px rgba(0,0,0,0.4)` : "none";
                el.style.animation = `cardFloat${tIdx} ${4 + tIdx * 0.8}s ease-in-out infinite`;
              }}
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
              <button
                onClick={() => handleCheckout(tier.cta)}
                disabled={loadingPlan !== null}
                style={
                  tier.highlight
                    ? {
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        padding: "16px",
                        borderRadius: "14px",
                        background: loadingPlan === PLAN_KEYS[tier.cta] ? "rgba(139,92,246,0.5)" : `linear-gradient(135deg, ${tier.color}, #8b5cf6)`,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "1rem",
                        border: "none",
                        cursor: loadingPlan ? "not-allowed" : "pointer",
                        boxShadow: `0 6px 25px ${tier.color}45`,
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                      }
                    : {
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        padding: "16px",
                        borderRadius: "14px",
                        background: "transparent",
                        border: `1.5px solid ${tier.color}50`,
                        color: tier.color,
                        fontWeight: 700,
                        fontSize: "1rem",
                        cursor: loadingPlan ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                      }
                }
                onMouseEnter={(e) => { if (!loadingPlan) { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
              >
                {loadingPlan === PLAN_KEYS[tier.cta] ? "Redirecting..." : `${tier.cta} →`}
              </button>
            </div>
          ))}
        </div>

        {/* Stripe error */}
        {stripeError && (
          <div style={{ textAlign: "center", marginTop: "24px", padding: "12px 20px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: "0.88rem" }}>
            {stripeError}
          </div>
        )}

        {/* Trust note */}
        <div style={{ textAlign: "center", marginTop: "48px", color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
          🔒 Secure checkout &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; No contracts &nbsp;·&nbsp; Content delivered within minutes
        </div>
      </div>
    </section>
  );
}
