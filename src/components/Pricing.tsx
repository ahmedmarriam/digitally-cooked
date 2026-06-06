"use client";

import { useState } from "react";

const tiers = [
  {
    name: "Starter",
    monthlyPrice: "49",
    yearlyPrice: "490",
    yearlySaving: "Save $98",
    period: "/mo",
    tagline: "Perfect for solo entrepreneurs & new businesses",
    color: "#8b5cf6",
    highlight: false,
    trialNote: "7-day free trial",
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
    monthlyUrl: "https://digitally-cooked.lemonsqueezy.com/checkout/buy/13f5219a-fa8e-4a8c-81dd-3883794e92cf",
    yearlyUrl:  "https://digitally-cooked.lemonsqueezy.com/checkout/buy/9e93b8f2-e457-485e-95e3-fb193805eb2d",
  },
  {
    name: "Growth",
    monthlyPrice: "99",
    yearlyPrice: "990",
    yearlySaving: "Save $198",
    period: "/mo",
    tagline: "For businesses serious about scaling their presence",
    color: "#ec4899",
    highlight: true,
    badge: "Most Popular",
    trialNote: "7-day free trial",
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
    monthlyUrl: "https://digitally-cooked.lemonsqueezy.com/checkout/buy/fc446352-aa44-4d7f-a51c-2b4dc437f80d",
    yearlyUrl:  "https://digitally-cooked.lemonsqueezy.com/checkout/buy/c18c91ff-ea4f-4478-9a13-58a771ea8627",
  },
  {
    name: "Agency",
    monthlyPrice: "249",
    yearlyPrice: "2,490",
    yearlySaving: "Save $498",
    period: "/mo",
    tagline: "For agencies & teams managing multiple clients",
    color: "#f97316",
    highlight: false,
    trialNote: "No trial — book a demo",
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
    monthlyUrl: "https://digitally-cooked.lemonsqueezy.com/checkout/buy/e2d78a8e-6e14-4eb0-a52a-5288606f5272",
    yearlyUrl:  "https://digitally-cooked.lemonsqueezy.com/checkout/buy/5c7ca6c0-8fa7-4e99-a7a9-31402d949d34",
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

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
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.05rem", maxWidth: "460px", margin: "0 auto 32px" }}>
            No hidden fees. Cancel anytime. Cheaper than a single sponsored post — and infinitely more sustainable.
          </p>

          {/* Monthly / Yearly toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "999px", padding: "6px 8px" }}>
            <button
              onClick={() => setIsYearly(false)}
              style={{ padding: "8px 20px", borderRadius: "999px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.88rem", background: !isYearly ? "#7B2FFF" : "transparent", color: !isYearly ? "#fff" : "rgba(255,255,255,0.45)", transition: "all 0.2s" }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              style={{ padding: "8px 20px", borderRadius: "999px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.88rem", background: isYearly ? "#7B2FFF" : "transparent", color: isYearly ? "#fff" : "rgba(255,255,255,0.45)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px" }}
            >
              Yearly
              <span style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>2 months free</span>
            </button>
          </div>
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
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>$</span>
                <span style={{ fontSize: "3.2rem", fontWeight: 900, lineHeight: 1, color: "#fff", letterSpacing: "-0.03em" }}>
                  {isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                </span>
                <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                  {isYearly ? "/yr" : "/mo"}
                </span>
              </div>

              {isYearly && (
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "999px", padding: "2px 10px" }}>
                    {tier.yearlySaving}
                  </span>
                </div>
              )}

              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>
                {tier.trialNote}
              </p>

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
                href={isYearly ? tier.yearlyUrl : tier.monthlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={
                  tier.highlight
                    ? {
                        display: "block",
                        width: "100%",
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
                        boxSizing: "border-box",
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
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
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
