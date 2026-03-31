'use client'

import { useEffect, useRef } from 'react'

const NODES = [
  { id: 'kfx', x: 18, y: 42, label: 'Keystone FX',   sub: 'Execution Layer',        amber: true  },
  { id: 'r1',  x: 42, y: 22, label: 'Routing A',      sub: 'Latency Optimised',      amber: false },
  { id: 'r2',  x: 42, y: 62, label: 'Routing B',      sub: 'Redundant Path',         amber: false },
  { id: 'pm',  x: 78, y: 42, label: 'ProMarkets Ltd', sub: 'Infrastructure Support', amber: true  },
]

const PATHS = [
  { id: 'p1', d: 'M 18 42 Q 30 18 42 22' },
  { id: 'p2', d: 'M 18 42 Q 30 56 42 62' },
  { id: 'p3', d: 'M 42 22 Q 60 18 78 42' },
  { id: 'p4', d: 'M 42 62 Q 60 66 78 42' },
]

const PACKETS = [
  { pathId: 'p1', delay: '0s',   dur: '3.2s' },
  { pathId: 'p2', delay: '0.8s', dur: '3.6s' },
  { pathId: 'p3', delay: '1.6s', dur: '3.0s' },
  { pathId: 'p4', delay: '2.4s', dur: '3.8s' },
  { pathId: 'p1', delay: '2.0s', dur: '3.2s' },
  { pathId: 'p3', delay: '3.2s', dur: '3.0s' },
]

export default function InfrastructureFlow() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced || !svgRef.current) return
    svgRef.current.querySelectorAll('animateMotion').forEach((el) => {
      el.setAttribute('dur', '0s')
      el.setAttribute('repeatCount', '1')
    })
  }, [])

  return (
    <div
      className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-black"
      style={{ minHeight: '420px' }}
    >
      {/* Background radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/8 blur-3xl" />
        <div className="absolute left-[18%] top-[42%] h-24 w-24 -translate-y-1/2 rounded-full bg-amber-400/12 blur-2xl" />
        <div className="absolute left-[78%] top-[42%] h-24 w-24 -translate-y-1/2 rounded-full bg-amber-400/10 blur-2xl" />
      </div>

      {/* SVG infrastructure map */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 84"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {PATHS.map((p) => (
            <path key={p.id} id={p.id} d={p.d} fill="none" />
          ))}
        </defs>

        {/* Connection lines */}
        {PATHS.map((p) => (
          <g key={p.id} filter="url(#lineGlow)">
            <path
              d={p.d}
              fill="none"
              stroke="rgba(245,158,11,0.12)"
              strokeWidth="0.35"
            />
            <path
              d={p.d}
              fill="none"
              stroke="rgba(245,158,11,0.35)"
              strokeWidth="0.2"
              strokeDasharray="4 8"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-24"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        ))}

        {/* Moving packets */}
        {PACKETS.map((pk, i) => (
          <circle key={i} r="0.7" fill="#f59e0b" opacity="0.9" filter="url(#nodeGlow)">
            <animateMotion
              dur={pk.dur}
              begin={pk.delay}
              repeatCount="indefinite"
              rotate="none"
            >
              <mpath href={`#${pk.pathId}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0"
              keyTimes="0;0.1;0.85;1"
              dur={pk.dur}
              begin={pk.delay}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Nodes */}
        {NODES.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <circle
              r="3.2"
              fill="none"
              stroke={node.amber ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.10)'}
              strokeWidth="0.4"
            >
              <animate
                attributeName="r"
                values="3.2;4.2;3.2"
                dur={node.amber ? '2.8s' : '3.6s'}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.15;0.6"
                dur={node.amber ? '2.8s' : '3.6s'}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              r="2.2"
              fill={node.amber ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.06)'}
              stroke={node.amber ? 'rgba(245,158,11,0.55)' : 'rgba(255,255,255,0.20)'}
              strokeWidth="0.35"
              filter="url(#nodeGlow)"
            />
            <circle
              r="0.7"
              fill={node.amber ? '#f59e0b' : 'rgba(255,255,255,0.5)'}
            />
          </g>
        ))}
      </svg>

      {/* Node labels — HTML overlay for crisp text */}
      <div className="pointer-events-none absolute inset-0">
        {NODES.map((node) => (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className={`mt-8 rounded-xl border px-2.5 py-1.5 text-center backdrop-blur-sm ${
              node.amber
                ? 'border-amber-400/25 bg-amber-400/10'
                : 'border-white/10 bg-white/[0.05]'
            }`}>
              <p className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${
                node.amber ? 'text-amber-300/80' : 'text-white/45'
              }`}>
                {node.sub}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-white">
                {node.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom overlay text */}
      <div className="absolute inset-x-0 bottom-0 rounded-b-[28px] bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 pb-6 pt-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-400/70">
          Infrastructure Flow
        </p>
        <h3 className="mt-1 text-sm font-semibold text-white">
          Execution & Infrastructure Alignment
        </h3>
        <p className="mt-1.5 text-xs leading-5 text-white/55">
          Keystone FX operates as the execution layer, supported through
          strategic infrastructure collaboration with ProMarkets Ltd.
        </p>
      </div>

      {/* Top-right status badge */}
      <div className="absolute right-4 top-4 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
        Live Infrastructure
      </div>
    </div>
  )
}