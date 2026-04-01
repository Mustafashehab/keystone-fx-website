'use client'

import Link from 'next/link'

const NODES = ['Order', 'Validate', 'Route', 'Liquidity', 'Confirm']
const MICRO_LABELS = ['FIX', 'API', 'LP', 'Route']

export function HeroSection({ lang }: { lang: string }) {
  return (
    <>
      <style jsx>{`
        /* ── Node pulse ── */
        @keyframes nodePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(201,168,76,0); }
          50%      { transform: scale(1.05); box-shadow: 0 0 12px 2px rgba(201,168,76,0.15); }
        }
        .node-box {
          animation: nodePulse 3s ease-in-out infinite;
        }
        .node-box:nth-child(2) .node-inner { animation-delay: 0.4s; }
        .node-box:nth-child(3) .node-inner { animation-delay: 0.8s; }
        .node-box:nth-child(4) .node-inner { animation-delay: 1.2s; }
        .node-box:nth-child(5) .node-inner { animation-delay: 1.6s; }

        /* ── Traveling dot along connection line ── */
        @keyframes travelDot {
          0%   { left: 0; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .connection-line {
          position: relative;
        }
        .connection-line::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 6px;
          height: 6px;
          margin-top: -3px;
          border-radius: 50%;
          background: #c9a84c;
          box-shadow: 0 0 8px 2px rgba(201,168,76,0.5);
          animation: travelDot 2s ease-in-out infinite;
        }
        .conn-delay-1::after { animation-delay: 0s; }
        .conn-delay-2::after { animation-delay: 0.5s; }
        .conn-delay-3::after { animation-delay: 1.0s; }
        .conn-delay-4::after { animation-delay: 1.5s; }

        /* ── Hero entry ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .hero-fade-2 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .hero-fade-3 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .hero-fade-4 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .hero-fade-5 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
        .hero-fade-6 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both; }

        /* ── Micro label float ── */
        @keyframes microFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        .micro-label {
          animation: microFloat 4s ease-in-out infinite;
        }
      `}</style>

      <section className="relative overflow-hidden bg-[#0c0f14] min-h-screen flex items-center">
        {/* Subtle background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #c9a84c 0.5px, transparent 0.5px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* ── Left Column: Copy ── */}
            <div>
              {/* Eyebrow */}
              <p className="hero-fade-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-5">
                Institutional Trading Infrastructure
              </p>

              {/* Headline */}
              <h1 className="hero-fade-2 text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.1] tracking-tight mb-6">
                Execution Infrastructure for Serious Market Access
              </h1>

              {/* Subheadline */}
              <p className="hero-fade-3 text-base md:text-lg text-white/60 leading-relaxed max-w-xl mb-10">
                Low-latency routing, resilient platform connectivity, and professional execution architecture built for modern trading environments.
              </p>

              {/* CTAs */}
              <div className="hero-fade-4 flex flex-wrap gap-4 mb-12">
                <Link
                  href={`/${lang}/execution`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#c9a84c] px-7 py-3.5 text-sm font-bold text-[#0c0f14] hover:bg-[#d4b65e] transition-all hover:shadow-lg hover:shadow-[#c9a84c]/20"
                >
                  Explore Execution
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href={`/${lang}/platforms`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white/80 hover:border-[#c9a84c]/50 hover:text-white transition-all"
                >
                  View Platforms
                </Link>
              </div>

              {/* Credibility bullets */}
              <div className="hero-fade-5 flex flex-wrap gap-x-8 gap-y-3">
                {['Low-Latency Routing', 'Resilient Connectivity', 'Infrastructure-Led Architecture'].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                    <span className="text-xs text-white/50 font-medium tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right Column: Execution Flow Visual ── */}
            <div className="hero-fade-6">
              <div
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 overflow-hidden"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              >
                {/* Flow label */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Execution Pipeline</span>
                </div>

                {/* Desktop: horizontal flow */}
                <div className="hidden md:block">
                  <div className="flex items-center justify-between">
                    {NODES.map((node, i) => (
                      <div key={node} className="flex items-center">
                        {/* Node */}
                        <div
                          className="node-box"
                          style={{ animationDelay: `${i * 0.4}s` }}
                        >
                          <div className="node-inner px-4 py-2.5 rounded-lg border border-[#c9a84c]/25 bg-[#c9a84c]/[0.06] text-center">
                            <span className="text-[11px] font-semibold text-[#c9a84c] tracking-wide">{node}</span>
                          </div>
                        </div>
                        {/* Connection line + micro label */}
                        {i < NODES.length - 1 && (
                          <div className="flex flex-col items-center mx-1.5">
                            <span
                              className="micro-label text-[8px] font-mono text-white/20 mb-1"
                              style={{ animationDelay: `${i * 0.6}s` }}
                            >
                              {MICRO_LABELS[i]}
                            </span>
                            <div className={`connection-line conn-delay-${i + 1} w-8 lg:w-12 h-[1px] bg-white/10`} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile: vertical flow */}
                <div className="md:hidden space-y-3">
                  {NODES.map((node, i) => (
                    <div key={node} className="flex items-center gap-3">
                      <div
                        className="node-box shrink-0"
                        style={{ animationDelay: `${i * 0.4}s` }}
                      >
                        <div className="node-inner px-4 py-2 rounded-lg border border-[#c9a84c]/25 bg-[#c9a84c]/[0.06]">
                          <span className="text-[11px] font-semibold text-[#c9a84c] tracking-wide">{node}</span>
                        </div>
                      </div>
                      {i < NODES.length - 1 && (
                        <span className="text-[8px] font-mono text-white/20">{MICRO_LABELS[i]}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom stats row */}
                <div className="mt-8 pt-5 border-t border-white/[0.05] grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-lg font-bold text-[#c9a84c] font-mono">8ms</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Avg Latency</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#c9a84c] font-mono">99.99%</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Uptime</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#c9a84c] font-mono">120K/s</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Throughput</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
