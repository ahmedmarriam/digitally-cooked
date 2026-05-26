"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  "Analysing your brand profile...",
  "Crafting content strategy...",
  "Writing hooks & captions...",
  "Generating image prompts...",
  "Scheduling to your calendar...",
  "Finalising your content pack...",
];

export default function ProcessingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through steps
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2200);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 0.8;
      });
    }, 100);

    // Redirect after ~14s
    const redirect = setTimeout(() => {
      router.push("/dashboard");
    }, 14000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0E1A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Keyframe styles */}
      <style>{`
        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }
        @keyframes spinRingReverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes pulseCore {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.75; }
        }
        @keyframes fadeStep {
          0% { opacity: 0; transform: translateY(8px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes orbDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .spin-ring-1 { animation: spinRing 2s linear infinite; }
        .spin-ring-2 { animation: spinRingReverse 3s linear infinite; }
        .pulse-core { animation: pulseCore 2s ease-in-out infinite; }
        .fade-step { animation: fadeStep 2.2s ease-in-out infinite; }
        .orb-drift { animation: orbDrift 8s ease-in-out infinite; }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div
          className="orb-drift"
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #7B2FFF 0%, transparent 70%)",
            top: "-200px",
            right: "-200px",
            opacity: 0.1,
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
            bottom: "-100px",
            left: "-100px",
            opacity: 0.08,
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.05,
            filter: "blur(60px)",
          }}
        />
      </div>

      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "24px" }}>
        {/* Spinner rings */}
        <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 48px" }}>
          {/* Outer ring */}
          <div
            className="spin-ring-1"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "3px solid transparent",
              borderTopColor: "#7B2FFF",
              borderRightColor: "rgba(123,47,255,0.3)",
            }}
          />
          {/* Middle ring */}
          <div
            className="spin-ring-2"
            style={{
              position: "absolute",
              inset: "12px",
              borderRadius: "50%",
              border: "3px solid transparent",
              borderTopColor: "#ec4899",
              borderLeftColor: "rgba(236,72,153,0.3)",
            }}
          />
          {/* Inner ring */}
          <div
            className="spin-ring-1"
            style={{
              position: "absolute",
              inset: "24px",
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#f97316",
              borderBottomColor: "rgba(249,115,22,0.2)",
              animationDuration: "1.5s",
            }}
          />
          {/* Core */}
          <div
            className="pulse-core"
            style={{
              position: "absolute",
              inset: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7B2FFF, #ec4899, #f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              boxShadow: "0 0 30px rgba(123,47,255,0.6)",
            }}
          >
            🍳
          </div>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 800,
            color: "#F1F1F1",
            marginBottom: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          AI is cooking your content
          <span
            style={{
              background: "linear-gradient(90deg, #a78bfa, #ec4899, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {" "}✦
          </span>
        </h1>

        <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.95rem", marginBottom: "40px" }}>
          Sit tight — your 30-day content calendar is being generated.
        </p>

        {/* Step message */}
        <div
          style={{
            height: "28px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            key={stepIndex}
            className="fade-step"
            style={{
              color: "rgba(167,139,250,0.9)",
              fontSize: "0.9rem",
              fontWeight: 500,
              margin: 0,
            }}
          >
            ⚡ {steps[stepIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "min(400px, 90vw)",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              height: "6px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "999px",
              overflow: "hidden",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, #7B2FFF, #ec4899, #f97316)",
                borderRadius: "999px",
                transition: "width 0.1s linear",
                boxShadow: "0 0 12px rgba(123,47,255,0.6)",
              }}
            />
          </div>
          <p style={{ color: "rgba(241,241,241,0.3)", fontSize: "0.78rem", textAlign: "right" }}>
            {Math.min(Math.round(progress), 100)}%
          </p>
        </div>

        {/* Steps checklist */}
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "min(360px, 90vw)",
            margin: "48px auto 0",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "10px",
                background:
                  i < stepIndex
                    ? "rgba(123,47,255,0.1)"
                    : i === stepIndex
                    ? "rgba(123,47,255,0.15)"
                    : "rgba(255,255,255,0.02)",
                border: `1px solid ${
                  i < stepIndex
                    ? "rgba(123,47,255,0.25)"
                    : i === stepIndex
                    ? "rgba(123,47,255,0.4)"
                    : "rgba(255,255,255,0.05)"
                }`,
                transition: "all 0.4s ease",
              }}
            >
              <span style={{ fontSize: "14px", flexShrink: 0 }}>
                {i < stepIndex ? "✓" : i === stepIndex ? "⚡" : "○"}
              </span>
              <span
                style={{
                  fontSize: "0.83rem",
                  color:
                    i < stepIndex
                      ? "rgba(167,139,250,0.9)"
                      : i === stepIndex
                      ? "#F1F1F1"
                      : "rgba(241,241,241,0.25)",
                  fontWeight: i === stepIndex ? 600 : 400,
                  transition: "color 0.4s ease",
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
