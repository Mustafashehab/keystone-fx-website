"use client";

import { useEffect, useState } from "react";

export default function InteractiveHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // subtle parallax
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const move = (e: MouseEvent) => {
      setOffset({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 6,
      });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0a0e17] text-white">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e17] via-[#0d1321] to-[#111827]" />

      {/* Subtle grid hint */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />

      {/* Infrastructure lanes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${offset.x * 0.3}px, ${offset.y * 0.3}px)`,
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-[-40%] w-[65%] h-px
              bg-gradient-to-r from-transparent via-white/20 to-transparent
              animate-data-flow"
            style={{
              top: `${18 + i * 10}%`,
              animationDuration: `${18 + i * 3}s`,
              opacity: 0.25,
            }}
          />
        ))}
      </div>

      {/* Execution packets (single direction – stable baseline) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-[-12px] h-[5px] w-[5px] rounded-full
              bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.6)]
              animate-packet-flow"
            style={{
              top: `${20 + (i % 6) * 10}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Content - RESPONSIVE PADDING */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-6 py-16 md:py-32 lg:py-44 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
          {title}
        </h1>

        <div className="mx-auto my-4 md:my-6 h-px w-20 md:w-28 bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />

        <p className="mx-auto max-w-2xl text-slate-300 text-sm md:text-base lg:text-lg leading-relaxed px-4">
          {subtitle}
        </p>
      </div>
    </section>
  );
}