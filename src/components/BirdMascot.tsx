"use client";

import { useEffect, useRef, useState } from "react";

const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ss    = (t: number) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c); };

const SPARK_COLORS = [
  "#ec4899","#f97316","#fbbf24","#4ade80",
  "#22d3ee","#a78bfa","#ef4444","#34d399",
];

export default function BirdMascot() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [prog,     setProg]    = useState(0);
  const [entered,  setEntered] = useState(false);
  const [ready,    setReady]   = useState(false);
  const [vw,       setVw]      = useState(1440);

  /* ── setup ─────────────────────────────────────────────── */
  useEffect(() => {
    setVw(window.innerWidth);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);

    /* fly-in */
    const flyTimer = setTimeout(() => setEntered(true), 350);

    /* scroll */
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProg(max > 0 ? clamp(window.scrollY / max, 0, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* strip white background via canvas */
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
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const brightness  = (r + g + b) / 3;
        const saturation  = Math.max(r, g, b) - Math.min(r, g, b);
        if (brightness > 238 && saturation < 18) {
          d[i + 3] = 0;
        } else if (brightness > 215 && saturation < 38) {
          d[i + 3] = Math.round(d[i + 3] * (1 - (brightness - 215) / 23));
        }
      }
      ctx.putImageData(id, 0, 0);
      setReady(true);
    };
    img.onerror = () => setReady(true);
    img.src = "/Phoenix.png";

    return () => {
      clearTimeout(flyTimer);
      window.removeEventListener("scroll",  onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const isMobile = vw < 768;
  const spread   = ss(prog);
  const atBottom = prog > 0.88;

  /* size — grows as wings "spread" */
  const minW = isMobile ? 160 : Math.min(Math.round(vw * 0.17), 240);
  const maxW = isMobile ? 380 : Math.min(Math.round(vw * 0.50), 640);
  const width  = Math.round(lerp(minW, maxW, spread));
  const height = Math.round(width * 0.64);

  /* opacity — fades so text stays readable */
  const opacity = lerp(0.92, 0.11, spread);

  /* glow — starts soft, becomes a full rainbow blaze */
  const g  = Math.round(lerp(8,  55, spread));
  const gA = lerp(0.25, 0.90, spread).toFixed(2);
  const gB = lerp(0.15, 0.65, spread).toFixed(2);
  const gC = lerp(0.10, 0.55, spread).toFixed(2);
  const glowFilter = [
    `drop-shadow(0 0 ${g}px rgba(236,72,153,${gA}))`,
    `drop-shadow(0 0 ${Math.round(g * 0.7)}px rgba(139,92,246,${gB}))`,
    `drop-shadow(0 0 ${Math.round(g * 0.5)}px rgba(251,191,36,${gC}))`,
    `drop-shadow(0 0 ${Math.round(g * 0.35)}px rgba(34,211,238,${gC}))`,
  ].join(" ");

  /* position */
  const topPx  = atBottom
    ? `calc(100vh - ${height + 30}px)`
    : entered ? "10px" : "-600px";
  const leftPx = atBottom
    ? "10px"
    : `calc(100vw - ${width + 15}px)`;

  /* sparkle visibility threshold */
  const showSparks = spread > 0.28;

  return (
    <>
      {/* keyframes injected once */}
      <style>{`
        @keyframes birdBreath {
          0%,100% { transform: scaleY(1.00) scaleX(1.00); }
          40%     { transform: scaleY(0.96) scaleX(1.02); }
          70%     { transform: scaleY(1.03) scaleX(0.99); }
        }
        @keyframes birdBob {
          0%,100% { transform: translateY(0px)   rotate(0deg); }
          35%     { transform: translateY(-5px)  rotate(-1.5deg); }
          65%     { transform: translateY(-3px)  rotate(1deg); }
        }
        ${SPARK_COLORS.map((c, i) => `
          @keyframes spark${i} {
            0%   { transform: translate(0,0)   scale(1);   opacity:0; }
            20%  { opacity: 0.9; }
            100% { transform: translate(${Math.cos(i/8*Math.PI*2)*70}px,
                                        ${Math.sin(i/8*Math.PI*2)*55}px)
                               scale(0); opacity:0; }
          }
        `).join("")}
      `}</style>

      {/* outer wrapper — position + size + glow */}
      <div
        style={{
          position:      "fixed",
          top:           topPx,
          left:          leftPx,
          width:         `${width}px`,
          height:        `${height}px`,
          opacity,
          pointerEvents: "none",
          zIndex:        50,
          filter:        glowFilter,
          transition:
            "top 1.2s cubic-bezier(0.34,1.56,0.64,1), " +
            "left 1.2s cubic-bezier(0.34,1.56,0.64,1), " +
            "width 0.28s ease, height 0.28s ease, " +
            "opacity 0.28s ease, filter 0.4s ease",
        }}
      >
        {/* inner wrapper — idle life animation */}
        <div
          style={{
            width:           "100%",
            height:          "100%",
            animation:       "birdBob 3.8s ease-in-out infinite, birdBreath 2.4s ease-in-out infinite",
            transformOrigin: "center bottom",
            position:        "relative",
          }}
        >
          {/* the actual phoenix */}
          <canvas
            ref={canvasRef}
            style={{
              width:   "100%",
              height:  "100%",
              display: ready ? "block" : "none",
            }}
          />

          {/* sparkles — radiate out as wings spread */}
          {showSparks && SPARK_COLORS.map((color, i) => (
            <div
              key={i}
              style={{
                position:        "absolute",
                top:             "40%",
                left:            "50%",
                width:           `${lerp(3, 7, spread)}px`,
                height:          `${lerp(3, 7, spread)}px`,
                borderRadius:    "50%",
                background:      color,
                boxShadow:       `0 0 ${Math.round(lerp(4, 14, spread))}px ${color}`,
                animation:       `spark${i} ${1.4 + i * 0.18}s ease-out infinite`,
                animationDelay:  `${i * 0.22}s`,
                opacity:         spread * 0.85,
                pointerEvents:   "none",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
