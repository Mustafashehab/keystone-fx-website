"use client";

import { motion } from "framer-motion";

export default function ExecutionAISection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <h2 className="text-3xl font-semibold text-slate-900 text-center mb-16">
        Intelligent Execution Flow
      </h2>

      <div className="relative rounded-3xl border bg-white p-12 shadow-xl">
        <div className="absolute left-6 right-6 top-1/2 h-[2px] bg-yellow-400/40" />

        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 h-3 w-3 rounded-full bg-yellow-400"
            style={{ left: "5%" }}
            animate={{ left: ["5%", "95%"] }}
            transition={{
              duration: 4,
              delay: i * 0.9,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        <div className="relative z-10 flex justify-between text-sm text-slate-600">
          {["Order", "Routing", "Risk", "Execution", "Confirm"].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
