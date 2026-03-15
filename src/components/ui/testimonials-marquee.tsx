"use client";

import { useEffect, useMemo, useRef } from "react";

import type { Review } from "@/types/content";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

const AVATAR_COLORS = [
  "#38bdf8",
  "#22d3ee",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#f59e0b",
];

function pickAvatarColor(seed: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const safeIndex = Math.abs(hash + index) % AVATAR_COLORS.length;
  return AVATAR_COLORS[safeIndex];
}

function wrapNegative(value: number, width: number): number {
  if (width <= 0) return value;
  let next = value;
  while (next <= -width) next += width;
  while (next > 0) next -= width;
  return next;
}

function wrapPositive(value: number, width: number): number {
  if (width <= 0) return value;
  let next = value;
  while (next >= 0) next -= width;
  while (next < -width) next += width;
  return next;
}

export function TestimonialsMarquee({ reviews }: { reviews: Review[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);
  const rowAWidthRef = useRef(0);
  const rowBWidthRef = useRef(0);
  const offsetARef = useRef(0);
  const offsetBRef = useRef(0);
  const velocityRef = useRef(0);
  const hoverPausedRef = useRef(false);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragXRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  const [rowA, rowB] = useMemo(() => {
    const a: Review[] = [];
    const b: Review[] = [];
    reviews.forEach((r, i) => {
      if (i % 2 === 0) a.push(r);
      else b.push(r);
    });
    return [a.length ? a : reviews, b.length ? b : reviews];
  }, [reviews]);

  useEffect(() => {
    const elA = rowARef.current;
    const elB = rowBRef.current;
    if (!elA || !elB) return;

    const measure = () => {
      rowAWidthRef.current = elA.scrollWidth / 2;
      rowBWidthRef.current = elB.scrollWidth / 2;
      offsetARef.current = wrapNegative(offsetARef.current, rowAWidthRef.current);
      offsetBRef.current = wrapPositive(offsetBRef.current, rowBWidthRef.current);
      elA.style.transform = `translate3d(${offsetARef.current}px,0,0)`;
      elB.style.transform = `translate3d(${offsetBRef.current}px,0,0)`;
    };

    const ro = new ResizeObserver(measure);
    ro.observe(elA);
    ro.observe(elB);
    measure();

    const tick = (ts: number) => {
      if (lastTsRef.current === 0) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;

      if (!hoverPausedRef.current && !draggingRef.current) {
        const autoSpeed = 24; // px/s
        const inertial = velocityRef.current;
        velocityRef.current *= 0.92;
        if (Math.abs(velocityRef.current) < 0.02) velocityRef.current = 0;

        const delta = ((autoSpeed + inertial) * dt) / 1000;
        offsetARef.current = wrapNegative(offsetARef.current - delta, rowAWidthRef.current);
        offsetBRef.current = wrapPositive(offsetBRef.current + delta * 0.92, rowBWidthRef.current);
        elA.style.transform = `translate3d(${offsetARef.current}px,0,0)`;
        elB.style.transform = `translate3d(${offsetBRef.current}px,0,0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [rowA.length, rowB.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      const impulse = (e.deltaY || e.deltaX) * 0.06;
      velocityRef.current = clamp(velocityRef.current + impulse, -180, 180);
    };

    container.addEventListener("wheel", onWheel, { passive: true });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden bg-transparent select-none"
      onMouseEnter={() => {
        hoverPausedRef.current = true;
      }}
      onMouseLeave={() => {
        hoverPausedRef.current = false;
      }}
      onPointerDown={(e) => {
        draggingRef.current = true;
        pointerIdRef.current = e.pointerId;
        dragXRef.current = e.clientX;
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current || pointerIdRef.current !== e.pointerId) return;
        const dx = e.clientX - dragXRef.current;
        dragXRef.current = e.clientX;
        offsetARef.current = wrapNegative(offsetARef.current + dx, rowAWidthRef.current);
        offsetBRef.current = wrapPositive(offsetBRef.current + dx, rowBWidthRef.current);
        if (rowARef.current) rowARef.current.style.transform = `translate3d(${offsetARef.current}px,0,0)`;
        if (rowBRef.current) rowBRef.current.style.transform = `translate3d(${offsetBRef.current}px,0,0)`;
        velocityRef.current = clamp(dx * 3.4, -180, 180);
      }}
      onPointerUp={(e) => {
        if (pointerIdRef.current === e.pointerId) {
          draggingRef.current = false;
          pointerIdRef.current = null;
          (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
        }
      }}
      onPointerCancel={(e) => {
        if (pointerIdRef.current === e.pointerId) {
          draggingRef.current = false;
          pointerIdRef.current = null;
        }
      }}
    >
      <div className="space-y-6">
        <div ref={rowARef} className="flex w-max gap-6">
          {[...rowA, ...rowA].map((review, i) => (
            <article
              key={`a-${review.name}-${i}`}
              className="w-[320px] shrink-0 rounded-2xl bg-[#0C0E4A] p-6 text-white shadow-[0_10px_32px_rgba(0,0,0,0.22)]"
            >
              <div className="text-5xl leading-none text-[var(--color-accent)]">“</div>
              <p className="mt-3 text-sm leading-7 text-white line-clamp-5">{review.quote}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/20 pt-4">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: pickAvatarColor(review.name, i) }}
                >
                  {initials(review.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{review.name}</p>
                  <p className="text-xs text-white/75">{review.company} · {review.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div ref={rowBRef} className="flex w-max gap-6">
          {[...rowB, ...rowB].map((review, i) => (
            <article
              key={`b-${review.name}-${i}`}
              className="w-[320px] shrink-0 rounded-2xl bg-[#0C0E4A] p-6 text-white shadow-[0_10px_32px_rgba(0,0,0,0.22)]"
            >
              <div className="text-5xl leading-none text-[var(--color-accent)]">“</div>
              <p className="mt-3 text-sm leading-7 text-white line-clamp-5">{review.quote}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/20 pt-4">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: pickAvatarColor(review.name, i + 37) }}
                >
                  {initials(review.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{review.name}</p>
                  <p className="text-xs text-white/75">{review.company} · {review.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
