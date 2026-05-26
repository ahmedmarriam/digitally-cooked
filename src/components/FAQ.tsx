"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How exactly does Digitally Cooked work?",
    a: "You fill out a brand profile form with details about your business — name, industry, tone of voice, target audience, visual style, and which platforms you post on. Our AI pipeline then processes this information to generate 40 fully-written posts tailored to your brand. Each post includes a hook, full caption, call-to-action, hashtag set, and an AI image prompt. The whole process takes less than 5 minutes.",
  },
  {
    q: "Will the content actually sound like my brand?",
    a: "Yes. The more detail you provide in your brand profile, the more closely the output mirrors your voice and style. You choose your tone (professional, casual, humorous, authoritative, etc.), your niche, and your audience — and our AI crafts every post to match. You can always edit the output to add a personal touch.",
  },
  {
    q: "What do I get exactly?",
    a: "Each monthly package includes: 30 calendar posts mapped day-by-day across your chosen platforms, plus 10 bonus posts (5 Story formats + 5 alternate versions). Every single post includes: a scroll-stopping hook, a full caption, a clear call-to-action, a hashtag set optimised for your platform, and an AI-generated image prompt. That's 40 complete, ready-to-post pieces of content.",
  },
  {
    q: "Which platforms are supported?",
    a: "We currently generate platform-specific content for Instagram, TikTok, Facebook, LinkedIn, and YouTube. Each post is adapted for the tone, length, and format expectations of that specific platform — TikTok hooks are different from LinkedIn posts, and we handle that automatically.",
  },
  {
    q: "Do I need any technical skills to use it?",
    a: "None at all. You fill out a form, submit it, and your 40-post content package appears on your dashboard. You copy, paste, and post. That's it. No technical knowledge, no design skills, no writing experience required.",
  },
  {
    q: "Can I edit the posts after they're generated?",
    a: "Absolutely. All generated content lives on your dashboard and you can edit any post before publishing. Think of it as a fully-drafted starting point — perfectly usable as-is, but easy to personalise further.",
  },
  {
    q: "What happens if I manage multiple brands?",
    a: "The Growth plan covers 3 brand profiles and the Agency plan covers 10 — each getting their own 40-post monthly package. If you need more than 10 brands, reach out and we'll sort you out with a custom arrangement.",
  },
  {
    q: "Is there a free trial?",
    a: "We're working on a free trial option. In the meantime, you can get started with our Starter plan and cancel at any time if it's not the right fit. No contracts, no lock-in.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      style={{
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(139,92,246,0.1)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            ❓ FAQ
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Got Questions?{" "}
            <span className="gradient-text">We've Got Answers.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem" }}>
            Everything you need to know before you start cooking.
          </p>
        </div>

        {/* FAQ list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  borderRadius: "16px",
                  border: `1px solid ${isOpen ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.15)"}`,
                  background: isOpen ? "rgba(139,92,246,0.07)" : "rgba(10,10,10,0.9)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {/* Question */}
                <div
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "0.98rem",
                      color: isOpen ? "#fff" : "rgba(255,255,255,0.8)",
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.q}
                  </span>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      background: isOpen ? "rgba(139,92,246,0.25)" : "rgba(139,92,246,0.1)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        color: "#a78bfa",
                      }}
                    >
                      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Answer */}
                <div
                  style={{
                    maxHeight: isOpen ? "400px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                  }}
                >
                  <div
                    style={{
                      padding: "0 24px 22px",
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.92rem",
                      lineHeight: 1.75,
                      borderTop: "1px solid rgba(139,92,246,0.1)",
                      paddingTop: "16px",
                    }}
                  >
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div
          style={{
            marginTop: "48px",
            padding: "28px",
            borderRadius: "20px",
            background: "rgba(139,92,246,0.07)",
            border: "1px solid rgba(139,92,246,0.2)",
            textAlign: "center",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "16px" }}>
            Still have questions? We'd love to help.
          </p>
          <a
            href="mailto:hello@digitallycookedai.com"
            style={{
              color: "#a78bfa",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            📧 hello@digitallycookedai.com →
          </a>
        </div>
      </div>
    </section>
  );
}
