"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ss    = (t: number) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c); };

export default function BirdMascot() {
  const [prog,    setprog]    = useState(0);
  const [entered, setEntered] = useState(false);
  const [vw,      setVw]      = useState(1440);

  useEffect(() => {
    setVw(window.innerWidth);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);

    /* fly-in delay */
    const t = setTimeout(() => setEntered(true), 350);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setprog(max > 0 ? clamp(window.scrollY / max, 0, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll",  onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const isMobile = vw < 768;
  const spread   = ss(prog);
  const atBottom = prog > 0.88;

  /* size — small when "perched", big when spread */
  const minSz = isMobile ? 110 : Math.min(Math.round(vw * 0.13), 190);
  const maxSz = isMobile ? 320 : Math.min(Math.round(vw * 0.46), 600);
  const size  = Math.round(lerp(minSz, maxSz, spread));

  /* phoenix image is landscape (wider than tall) */
  const imgH = Math.round(size * 0.62);

  /* fade out as wings spread so text stays readable */
  const opacity = lerp(0.92, 0.10, spread);

  /* slight downward tilt when perched, levels when spread */
  const tilt = lerp(-6, 2, spread);

  /* glow: grows + brightens as wings open */
  const g1 = Math.round(lerp(6,  40, spread));
  const g2 = Math.round(lerp(4,  22, spread));
  const gA = lerp(0.25, 0.80, spread).toFixed(2);
  const gB = lerp(0.15, 0.55, spread).toFixed(2);
  const filter = [
    `drop-shadow(0 0 ${g1}px rgba(236,72,153,${gA}))`,
    `drop-shadow(0 0 ${g2}px rgba(139,92,246,${gB}))`,
    `drop-shadow(0 0 ${Math.round(g2*0.6)}px rgba(251,191,36,${gB}))`,
  ].join(" ");

  /* position: top-right → bottom-left */
  const topPx  = atBottom
    ? `calc(100vh - ${imgH + 28}px)`
    : entered ? "10px" : "-500px";
  const leftPx = atBottom
    ? "10px"
    : `calc(100vw - ${size + 14}px)`;

  return (
    <div
      style={{
        position:      "fixed",
        top:           topPx,
        left:          leftPx,
        width:         `${size}px`,
        height:        `${imgH}px`,
        opacity,
        pointerEvents: "none",
        zIndex:        50,
        transform:     `rotate(${tilt}deg)`,
        filter,
        transition:
          "top 1.25s cubic-bezier(0.34,1.56,0.64,1), " +
          "left 1.25s cubic-bezier(0.34,1.56,0.64,1), " +
          "width 0.3s ease, height 0.3s ease, " +
          "opacity 0.3s ease, transform 0.5s ease, filter 0.4s ease",
      }}
    >
      <Image
        src="/Phoenix.png"
        alt="Digitally Cooked Phoenix"
        fill
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  );
}
