"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const steps = [
  "Brand profile analysed",
  "Generating your posts...",
  "Creating AI images...",
  "Building your calendar...",
  "Finalising content pack...",
];

export default function ProcessingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, 8000);

    const poll = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        const allPosts = data?.posts ?? [];
        const status = data?.brand?.generation_status ?? "";
        // Count unique concept groups (not raw rows) for accurate batch progress
        const uniqueGroups = new Set(allPosts.filter((p: { is_bonus?: boolean }) => !p.is_bonus).map((p: { post_group?: number }) => p.post_group)).size;
        setPostCount(uniqueGroups);
        if (status === "complete") {
          clearInterval(intervalRef.current!);
          clearInterval(stepInterval);
          router.push("/dashboard");
        }
      } catch {
        // network blip — keep polling
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 4000);

    return () => {
      clearInterval(stepInterval);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router]);

  const TOTAL_BATCHES = 5;
  const CONCEPTS_PER_BATCH = 6;
  const batchesDone = Math.min(Math.floor(postCount / CONCEPTS_PER_BATCH), TOTAL_BATCHES);
  const progress = Math.min((postCount / 30) * 100, 95);

  return (
    <div style={{ minHeight: "100vh", background: "#0F0E1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-geist-sans), Arial, sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes spinRing { to { transform: rotate(360deg); } }
        @keyframes spinRingReverse { to { transform: rotate(-360deg); } }
        @keyframes pulseCore { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.75; } }
        @keyframes fadeStep { 0% { opacity: 0; transform: translateY(8px); } 20% { opacity: 1; transform: translateY(0); } 80% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-8px); } }
        @keyframes orbDrift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }
        .spin-ring-1 { animation: spinRing 2s linear infinite; }
        .spin-ring-2 { animation: spinRingReverse 3s linear infinite; }
        .pulse-core { animation: pulseCore 2s ease-in-out infinite; }
        .fade-step { animation: fadeStep 8s ease-in-out infinite; }
        .orb-drift { animation: orbDrift 8s ease-in-out infinite; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div className="orb-drift" style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, #7B2FFF 0%, transparent 70%)", top: "-200px", right: "-200px", opacity: 0.1, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, #ec4899 0%, transparent 70%)", bottom: "-100px", left: "-100px", opacity: 0.08, filter: "blur(80px)" }} />
      </div>

      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "24px" }}>
        <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 48px" }}>
          <div className="spin-ring-1" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#7B2FFF", borderRightColor: "rgba(123,47,255,0.3)" }} />
          <div className="spin-ring-2" style={{ position: "absolute", inset: "12px", borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#ec4899", borderLeftColor: "rgba(236,72,153,0.3)" }} />
          <div className="spin-ring-1" style={{ position: "absolute", inset: "24px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#f97316", borderBottomColor: "rgba(249,115,22,0.2)", animationDuration: "1.5s" }} />
          <div className="pulse-core" style={{ position: "absolute", inset: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #7B2FFF, #ec4899, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 30px rgba(123,47,255,0.6)" }}>🍳</div>
        </div>

        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "#F1F1F1", marginBottom: "12px", letterSpacing: "-0.02em" }}>
          AI is cooking your content
          <span style={{ background: "linear-gradient(90deg, #a78bfa, #ec4899, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}> ✦</span>
        </h1>

        <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.95rem", marginBottom: "32px" }}>
          Your 30-day content calendar is being generated — this takes 2–3 minutes.
        </p>

        {postCount > 0 && (
          <div style={{ marginBottom: "24px", padding: "10px 20px", borderRadius: "999px", background: "rgba(123,47,255,0.15)", border: "1px solid rgba(123,47,255,0.3)", display: "inline-block", color: "#a78bfa", fontSize: "0.88rem", fontWeight: 600 }}>
            ✦ Batch {batchesDone} of {TOTAL_BATCHES} complete · {postCount} concepts ready
          </div>
        )}

        <div style={{ height: "28px", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p key={stepIndex} className="fade-step" style={{ color: "rgba(167,139,250,0.9)", fontSize: "0.9rem", fontWeight: 500, margin: 0 }}>
            ⚡ {steps[stepIndex]}
          </p>
        </div>

        <div style={{ width: "min(400px, 90vw)", margin: "0 auto" }}>
          <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #7B2FFF, #ec4899, #f97316)", borderRadius: "999px", transition: "width 0.6s ease", boxShadow: "0 0 12px rgba(123,47,255,0.6)" }} />
          </div>
          <p style={{ color: "rgba(241,241,241,0.3)", fontSize: "0.78rem", textAlign: "right" }}>
            {postCount > 0 ? `${postCount} / 30 concepts done` : "Waiting for AI..."}
          </p>
        </div>

        <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "10px", width: "min(360px, 90vw)", margin: "48px auto 0" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", background: i < stepIndex ? "rgba(123,47,255,0.1)" : i === stepIndex ? "rgba(123,47,255,0.15)" : "rgba(255,255,255,0.02)", border: `1px solid ${i < stepIndex ? "rgba(123,47,255,0.25)" : i === stepIndex ? "rgba(123,47,255,0.4)" : "rgba(255,255,255,0.05)"}`, transition: "all 0.4s ease" }}>
              <span style={{ fontSize: "14px", flexShrink: 0 }}>{i < stepIndex ? "✓" : i === stepIndex ? "⚡" : "○"}</span>
              <span style={{ fontSize: "0.83rem", color: i < stepIndex ? "rgba(167,139,250,0.9)" : i === stepIndex ? "#F1F1F1" : "rgba(241,241,241,0.25)", fontWeight: i === stepIndex ? 600 : 400, transition: "color 0.4s ease" }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
