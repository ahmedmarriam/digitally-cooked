"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "hidden" | "flying-in" | "perched" | "flying-away";

const SPARKS = ["#ec4899","#f97316","#fbbf24","#4ade80","#22d3ee","#a78bfa","#ef4444","#34d399"];

export default function BirdMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef  = useRef<Phase>("hidden");
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [phase, setPhase] = useState<Phase>("hidden");
  const [ready, setReady] = useState(false);
  const [vw,    setVw]    = useState(1440);

  /* helpers */
  const go = (p: Phase) => { setPhase(p); phaseRef.current = p; };
  const after = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => {
    setVw(window.innerWidth);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);

    /* ── strip white background via canvas ──────────────── */
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const cv = canvasRef.current;
      if (!cv) return;
      cv.width  = img.naturalWidth;
      cv.height = img.naturalHeight;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const id = ctx.getImageData(0, 0, cv.width, cv.height);
      const d  = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const bright = (d[i] + d[i + 1] + d[i + 2]) / 3;
        const sat    = Math.max(d[i], d[i+1], d[i+2]) - Math.min(d[i], d[i+1], d[i+2]);
        if (bright > 238 && sat < 18) {
          d[i + 3] = 0;
        } else if (bright > 215 && sat < 38) {
          d[i + 3] = Math.round(d[i + 3] * (1 - (bright - 215) / 23));
        }
      }
      ctx.putImageData(id, 0, 0);
      setReady(true);

      /* fly-in after image is ready */
      after(() => go("flying-in"), 500);
      after(() => { if (phaseRef.current === "flying-in") go("perched"); }, 2800);
    };
    img.onerror = () => setReady(true);
    img.src = "/Phoenix.png";

    /* scroll → fly away */
    const onScroll = () => {
      if (phaseRef.current === "perched" && window.scrollY > 80) {
        go("flying-away");
        after(() => go("hidden"), 1600);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      timers.current.forEach(clearTimeout);
      window.removeEventListener("scroll",  onScroll);
      window.removeEventListener("resize", onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* hide on mobile — single-column hero doesn't have space */
  if (vw < 900 || phase === "hidden") return null;

  const W = 310;
  const H = Math.round(W * 0.64);

  /* wings: spread in flight, folded when perched */
  const wingScaleX = phase === "perched" ? 0.66 : 1.0;

  return (
    <>
      <style>{`
        /* ── fly in: sweeps from bottom-left with a bouncy settle ── */
        @keyframes birdFlyIn {
          0%   { transform: translate(-420px, 300px) rotate(22deg) scale(0.12); opacity:0; }
          15%  { opacity: 1; }
          65%  { transform: translate(28px,-24px) rotate(-8deg) scale(1.08); }
          78%  { transform: translate(-12px,11px) rotate(3deg) scale(0.96); }
          89%  { transform: translate(5px,-5px) rotate(-1deg) scale(1.01); }
          100% { transform: translate(0,0) rotate(0deg) scale(1); opacity:1; }
        }

        /* ── fly away: bursts up-right and shrinks into distance ── */
        @keyframes birdFlyAway {
          0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity:1; }
          18%  { transform: translate(40px,-65px) rotate(-15deg) scale(1.14); opacity:1; }
          100% { transform: translate(560px,-780px) rotate(-24deg) scale(0.1); opacity:0; }
        }

        /* ── idle bob + sway when perched ── */
        @keyframes birdBob {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          30%     { transform: translateY(-11px) rotate(-2.5deg); }
          65%     { transform: translateY(-6px)  rotate(2deg); }
        }

        /* ── glow breathes when perched ── */
        @keyframes glowBreathe {
          0%,100% {
            filter: drop-shadow(0 0 14px rgba(236,72,153,.55))
                    drop-shadow(0 0  9px rgba(139,92,246,.40));
          }
          50% {
            filter: drop-shadow(0 0 36px rgba(236,72,153,.95))
                    drop-shadow(0 0 22px rgba(251,191,36,.60))
                    drop-shadow(0 0 16px rgba(139,92,246,.75))
                    drop-shadow(0 0 10px rgba(34,211,238,.45));
          }
        }

        /* ── sparkles radiate outward ── */
        ${SPARKS.map((c, i) => `
          @keyframes sp${i} {
            0%   { transform:translate(0,0) scale(1.3); opacity:0; }
            10%  { opacity:1; }
            100% { transform:translate(
                     ${Math.round(Math.cos((i / SPARKS.length) * Math.PI * 2) * 100)}px,
                     ${Math.round(Math.sin((i / SPARKS.length) * Math.PI * 2) * 76)}px
                   ) scale(0); opacity:0; }
          }
        `).join("")}
      `}</style>

      {/* ── OUTER: position + fly animations ─────────────────── */}
      <div
        style={{
          position:      "fixed",
          right:         "5%",
          top:           "28%",
          width:         `${W}px`,
          height:        `${H}px`,
          zIndex:        45,
          pointerEvents: "none",
          animation:
            phase === "flying-in"
              ? "birdFlyIn 2.2s cubic-bezier(0.34,1.2,0.64,1) forwards"
              : phase === "flying-away"
              ? "birdFlyAway 1.6s ease-in forwards"
              : "",
        }}
      >
        {/* ── GLOW WRAPPER: static during flight, breathes when perched ── */}
        <div
          style={{
            width:    "100%",
            height:   "100%",
            position: "relative",
            animation: phase === "perched" ? "glowBreathe 2.8s ease-in-out infinite" : "",
            filter:
              phase !== "perched"
                ? "drop-shadow(0 0 20px rgba(236,72,153,.75)) drop-shadow(0 0 12px rgba(139,92,246,.55))"
                : undefined,
          }}
        >
          {/* ── WING SCALE: folds smoothly on landing ────────── */}
          <div
            style={{
              width:           "100%",
              height:          "100%",
              transform:       `scaleX(${wingScaleX})`,
              transformOrigin: "center center",
              transition:      "transform 0.85s cubic-bezier(0.34,1.2,0.64,1)",
            }}
          >
            {/* ── BODY BOB: alive when perched ─────────────── */}
            <div
              style={{
                width:           "100%",
                height:          "100%",
                transformOrigin: "center bottom",
                animation:       phase === "perched" ? "birdBob 3.7s ease-in-out infinite" : "",
              }}
            >
              <canvas
                ref={canvasRef}
                style={{
                  width:   "100%",
                  height:  "100%",
                  display: ready ? "block" : "none",
                }}
              />
            </div>
          </div>

          {/* ── SPARKLES: only when perched ──────────────────── */}
          {phase === "perched" && SPARKS.map((color, i) => (
            <div
              key={i}
              style={{
                position:      "absolute",
                top:           "44%",
                left:          "50%",
                width:         "5px",
                height:        "5px",
                borderRadius:  "50%",
                background:    color,
                boxShadow:     `0 0 8px ${color}, 0 0 16px ${color}`,
                animation:     `sp${i} ${1.6 + i * 0.18}s ease-out ${i * 0.24}s infinite`,
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
