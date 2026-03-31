"use client";

import { useEffect, useState } from "react";

type Metric = {
  label: string;
  value: number;
  suffix?: string;
  duration?: number;
};

const METRICS: Metric[] = [
  { label: "Latency",      value: 8,      suffix: " ms",     duration: 1200 },
  { label: "Stability",    value: 99.98,  suffix: " %",      duration: 1800 },
  { label: "Availability", value: 99.99,  suffix: " %",      duration: 2000 },
  { label: "Throughput",   value: 120000, suffix: " / sec",  duration: 1500 },
];

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

function MetricCard({ label, value, suffix, duration }: Metric) {
  const v = useCountUp(value, duration);
  const display = value % 1 === 0 ? Math.round(v).toLocaleString() : v.toFixed(2);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white px-6 py-8 shadow-sm">
      <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent animate-metric-pulse" />
      <div className="text-sm uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tabular-nums">{display}</span>
        <span className="text-sm text-slate-500">{suffix}</span>
      </div>
    </div>
  );
}

export default function ExecutionMetrics() {
  return (
    <section className="relative bg-[#faf9f7] text-[#0b1220]">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Execution Metrics</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Measured continuously across infrastructure layers to ensure consistency, resilience, and operational integrity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}