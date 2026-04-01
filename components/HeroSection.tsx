'use client';

import Link from 'next/link';
import { useEffect, useId, useMemo, useRef } from 'react';

type HeroSectionProps = {
  lang: string;
};

type NodeDef = {
  key: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export default function HeroSection({ lang }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);
  const sectionId = useId().replace(/:/g, '');
  const isEnglish = lang === 'en';

  const hrefs = useMemo(
    () => ({
      execution: isEnglish ? '/en/execution' : `/${lang}/execution`,
      platforms: isEnglish ? '/en/platforms' : `/${lang}/platforms`,
    }),
    [isEnglish, lang]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const mediaQuery =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    let reducedMotion = mediaQuery?.matches ?? false;

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };

    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleMotionChange);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleMotionChange);
      }
    }

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    const nodes: NodeDef[] = [
      { key: 'order', label: 'Order', x: 0.08, y: 0.28, w: 0.17, h: 0.16 },
      { key: 'validate', label: 'Validate', x: 0.29, y: 0.54, w: 0.19, h: 0.16 },
      { key: 'route', label: 'Route', x: 0.51, y: 0.24, w: 0.16, h: 0.16 },
      { key: 'liquidity', label: 'Liquidity', x: 0.69, y: 0.54, w: 0.2, h: 0.16 },
      { key: 'confirm', label: 'Confirm', x: 0.83, y: 0.28, w: 0.14, h: 0.16 },
    ];

    const badges = [
      { label: 'FIX', x: 0.21, y: 0.22 },
      { label: 'API', x: 0.41, y: 0.73 },
      { label: 'Route', x: 0.62, y: 0.13 },
      { label: 'LP', x: 0.78, y: 0.76 },
    ];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const roundedRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    const getRect = (node: NodeDef, width: number, height: number) => ({
      x: node.x * width,
      y: node.y * height,
      w: node.w * width,
      h: node.h * height,
    });

    const getCenter = (node: NodeDef, width: number, height: number) => {
      const rect = getRect(node, width, height);
      return {
        x: rect.x + rect.w / 2,
        y: rect.y + rect.h / 2,
      };
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;

      const gap = Math.max(26, Math.min(44, width / 14));
      for (let x = 0; x <= width; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawConnection = (
      ctx: CanvasRenderingContext2D,
      from: { x: number; y: number },
      to: { x: number; y: number },
      progress: number
    ) => {
      const cp1 = { x: from.x + (to.x - from.x) * 0.4, y: from.y };
      const cp2 = { x: from.x + (to.x - from.x) * 0.6, y: to.y };

      const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
      gradient.addColorStop(0, 'rgba(201,168,76,0.18)');
      gradient.addColorStop(0.5, 'rgba(245,158,11,0.38)');
      gradient.addColorStop(1, 'rgba(201,168,76,0.18)');

      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, to.x, to.y);
      ctx.stroke();

      const dotCount = reducedMotion ? 1 : 2;
      for (let i = 0; i < dotCount; i += 1) {
        const t = reducedMotion ? 0.5 : (progress + i * 0.42) % 1;
        const point = cubicBezierPoint(from, cp1, cp2, to, t);
        const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 12);
        glow.addColorStop(0, 'rgba(245,158,11,0.95)');
        glow.addColorStop(0.4, 'rgba(245,158,11,0.4)');
        glow.addColorStop(1, 'rgba(245,158,11,0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,244,214,0.95)';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawNode = (
      ctx: CanvasRenderingContext2D,
      node: NodeDef,
      width: number,
      height: number,
      time: number,
      index: number
    ) => {
      const rect = getRect(node, width, height);
      const pulse = reducedMotion ? 0.5 : (Math.sin(time * 0.001 + index * 0.9) + 1) / 2;
      const glowAlpha = 0.08 + pulse * 0.1;

      ctx.save();

      const outerGlow = ctx.createRadialGradient(
        rect.x + rect.w / 2,
        rect.y + rect.h / 2,
        6,
        rect.x + rect.w / 2,
        rect.y + rect.h / 2,
        rect.w * 0.7
      );
      outerGlow.addColorStop(0, `rgba(245,158,11,${glowAlpha})`);
      outerGlow.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.ellipse(
        rect.x + rect.w / 2,
        rect.y + rect.h / 2,
        rect.w * 0.72,
        rect.h * 0.95,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      const fillGradient = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
      fillGradient.addColorStop(0, 'rgba(255,255,255,0.035)');
      fillGradient.addColorStop(1, 'rgba(255,255,255,0.015)');

      roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 16);
      ctx.fillStyle = fillGradient;
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(201,168,76,${0.65 + pulse * 0.2})`;
      ctx.shadowColor = 'rgba(245,158,11,0.25)';
      ctx.shadowBlur = 14;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.font = `600 ${Math.max(13, rect.h * 0.22)}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, rect.x + rect.w / 2, rect.y + rect.h / 2);

      ctx.restore();
    };

    const drawBadge = (
      ctx: CanvasRenderingContext2D,
      label: string,
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      const px = x * width;
      const py = y * height;
      const padX = 10;
      const padY = 6;

      ctx.save();
      ctx.font = '500 11px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const textWidth = ctx.measureText(label).width;
      const w = textWidth + padX * 2;
      const h = 24;

      roundedRect(ctx, px - w / 2, py - h / 2, w, h, 12);
      ctx.fillStyle = 'rgba(15,15,15,0.9)';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(201,168,76,0.34)';
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,247,230,0.86)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, px, py + 0.5);

      ctx.restore();
    };

    const drawAmbient = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      ctx.save();

      const leftGlow = ctx.createRadialGradient(
        width * 0.18,
        height * 0.22,
        0,
        width * 0.18,
        height * 0.22,
        width * 0.35
      );
      leftGlow.addColorStop(0, `rgba(245,158,11,${reducedMotion ? 0.08 : 0.1 + Math.sin(time * 0.0007) * 0.02})`);
      leftGlow.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = leftGlow;
      ctx.fillRect(0, 0, width, height);

      const rightGlow = ctx.createRadialGradient(
        width * 0.82,
        height * 0.72,
        0,
        width * 0.82,
        height * 0.72,
        width * 0.36
      );
      rightGlow.addColorStop(
        0,
        `rgba(201,168,76,${reducedMotion ? 0.06 : 0.08 + Math.cos(time * 0.0006) * 0.015})`
      );
      rightGlow.addColorStop(1, 'rgba(201,168,76,0)');
      ctx.fillStyle = rightGlow;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();
    };

    const render = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      context.clearRect(0, 0, width, height);

      const bg = context.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, 'rgba(10,10,10,1)');
      bg.addColorStop(1, 'rgba(14,14,14,1)');
      context.fillStyle = bg;
      context.fillRect(0, 0, width, height);

      drawGrid(context, width, height);
      drawAmbient(context, width, height, time);

      const centers = nodes.map((node) => getCenter(node, width, height));
      for (let i = 0; i < centers.length - 1; i += 1) {
        const from = centers[i];
        const to = centers[i + 1];
        const progress = reducedMotion ? 0.5 : (time * 0.00015 + i * 0.18) % 1;
        drawConnection(context, from, to, progress);
      }

      badges.forEach((badge) => drawBadge(context, badge.label, badge.x, badge.y, width, height));
      nodes.forEach((node, index) => drawNode(context, node, width, height, time, index));

      rafRef.current = window.requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        resizeCanvas();
      }, 50);
    };

    resizeCanvas();
    rafRef.current = window.requestAnimationFrame(render);
    window.addEventListener('resize', handleResize);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);

      if (mediaQuery) {
        if (typeof mediaQuery.removeEventListener === 'function') {
          mediaQuery.removeEventListener('change', handleMotionChange);
        } else if (typeof mediaQuery.removeListener === 'function') {
          mediaQuery.removeListener(handleMotionChange);
        }
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(201,168,76,0.07),transparent_32%)]" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center rounded-full border border-[#c9a84c]/30 bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#f2d187]">
              Institutional Trading Infrastructure
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
              Execution Infrastructure for Serious Market Access
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Low-latency routing, resilient platform connectivity, and professional execution architecture
              built for modern trading environments.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={hrefs.execution}
                className="inline-flex items-center justify-center rounded-2xl border border-[#f59e0b]/70 bg-[#f59e0b] px-6 py-3.5 text-sm font-semibold text-black transition duration-200 hover:bg-[#ffb01f] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/60 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              >
                Explore Execution
              </Link>
              <Link
                href={hrefs.platforms}
                className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:border-[#c9a84c]/50 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              >
                View Platforms
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                'Low-Latency Routing',
                'Resilient Connectivity',
                'Infrastructure-Led Architecture',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 backdrop-blur-sm"
                >
                  <span className="block h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                  <span className="mt-2 block leading-6">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative min-h-[300px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_rgba(0,0,0,0.35)] sm:min-h-[360px] lg:min-h-[460px]">
              <div className="pointer-events-none absolute inset-0 rounded-[24px] border border-[#c9a84c]/10" />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              />
              <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/35 sm:inset-x-6 sm:top-5">
                <span>Execution Layer</span>
                <span>Routing Sequence</span>
              </div>
              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/30 sm:inset-x-6 sm:bottom-5">
                <span>Connectivity</span>
                <span>Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .reduced-motion-safe {
            animation: none !important;
            transition: none !important;
          }
        }

        section :global(a) {
          -webkit-tap-highlight-color: transparent;
        }

        section :global(*) {
          box-sizing: border-box;
        }

        #hero-${sectionId} {
          position: relative;
        }
      `}</style>
    </section>
  );
}

function cubicBezierPoint(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;

  const x =
    p0.x * mt2 * mt +
    3 * p1.x * mt2 * t +
    3 * p2.x * mt * t2 +
    p3.x * t2 * t;

  const y =
    p0.y * mt2 * mt +
    3 * p1.y * mt2 * t +
    3 * p2.y * mt * t2 +
    p3.y * t2 * t;

  return { x, y };
}
