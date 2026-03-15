"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Review } from "@/types/content";

const CARD_HEIGHT = 420;
const TRANSITION_MS = 520;
const STACK_PEEK = 20;
const STACK_OFFSET = 12;

const AVATAR_COLORS = [
  "#38bdf8",
  "#22d3ee",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#f59e0b",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function pickAvatarColor(seed: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const safeIndex = Math.abs(hash + index) % AVATAR_COLORS.length;
  return AVATAR_COLORS[safeIndex];
}

function TestimonialCard({
  review,
  index,
}: {
  review: Review;
  index: number;
}) {
  return (
    <article className="flex min-h-[380px] w-full overflow-hidden rounded-2xl bg-white text-[#111] shadow-[0_10px_32px_rgba(0,0,0,0.22)] sm:min-h-[420px]">
      <div className="flex w-[min(48%,360px)] shrink-0 flex-col items-center justify-center border-r border-[#e5e7eb] px-8 py-10 sm:px-10 sm:py-12">
        {review.logoSrc ? (
          <Image
            src={review.logoSrc}
            alt={review.company}
            width={300}
            height={56}
            className="h-auto w-full max-w-[280px] object-contain"
          />
        ) : (
          <span
            className="inline-flex h-24 w-24 items-center justify-center rounded-full text-xl font-semibold text-white sm:h-28 sm:w-28 sm:text-2xl"
            style={{ backgroundColor: pickAvatarColor(review.name, index) }}
            aria-hidden
          >
            {initials(review.name)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center p-6 sm:p-10">
        <p className="mt-4 text-base leading-8 text-[#111] sm:text-lg sm:leading-9">
          {review.quote}
        </p>
        <p className="mt-8 text-base font-semibold text-[#111] sm:text-lg">
          {review.name}
        </p>
        <p className="mt-1 text-sm text-[#4b5563] sm:text-base">
          {review.role ? `${review.company} · ${review.role}` : review.company}
        </p>
      </div>
    </article>
  );
}

const SliderArrowsVertical = ({
  onPrev,
  onNext,
  className,
}: {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) => (
  <div className={`flex flex-col gap-3 ${className ?? ""}`}>
    <button
      type="button"
      onClick={onPrev}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#5a5e80] bg-[#1a1d42] text-white transition-colors hover:bg-[#22254d] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      aria-label="Предыдущий отзыв"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
    <button
      type="button"
      onClick={onNext}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#5a5e80] bg-[#1a1d42] text-white transition-colors hover:bg-[#22254d] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      aria-label="Следующий отзыв"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
);

export function TestimonialsStack({
  reviews,
  index,
  animating,
  resetting,
}: {
  reviews: Review[];
  index: number;
  animating: "next" | "prev" | null;
  resetting: boolean;
}) {
  const count = reviews.length;
  const prevIndex = (index - 1 + count) % count;
  const nextIndex = (index + 1) % count;
  const next2Index = (index + 2) % count;

  if (!count) return null;

  const transition = resetting
    ? "none"
    : `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${TRANSITION_MS}ms ease-out`;

  const getPrevStyle = (): { transform: string; opacity: number } => {
    if (resetting) return { transform: "translateY(-100%) scale(0.98)", opacity: 1 };
    if (animating === "prev") return { transform: "translateY(0) scale(1)", opacity: 1 };
    return { transform: "translateY(-100%) scale(0.98)", opacity: 1 };
  };
  const getCurrentStyle = (): { transform: string; opacity: number } => {
    if (resetting) return { transform: "translateY(0) scale(1)", opacity: 1 };
    if (animating === "next") return { transform: "translateY(100%) scale(0.92)", opacity: 0 };
    if (animating === "prev") return { transform: "translateY(-100%) scale(0.92)", opacity: 0 };
    return { transform: "translateY(0) scale(1)", opacity: 1 };
  };
  const getNextStyle = (): { transform: string; opacity: number } => {
    if (resetting) return { transform: `translateY(${STACK_PEEK}px) scale(0.98)`, opacity: 1 };
    if (animating === "next") return { transform: "translateY(0) scale(1)", opacity: 1 };
    if (animating === "prev") return { transform: `translateY(${STACK_PEEK}px) scale(0.98)`, opacity: 1 };
    return { transform: `translateY(${STACK_PEEK}px) scale(0.98)`, opacity: 1 };
  };
  const getNext2Style = (): { transform: string; opacity: number } => {
    const y = STACK_PEEK + STACK_OFFSET;
    if (resetting) return { transform: `translateY(${y}px) scale(0.96)`, opacity: 1 };
    if (animating === "next") return { transform: `translateY(${STACK_PEEK}px) scale(0.98)`, opacity: 1 };
    if (animating === "prev") return { transform: `translateY(${y}px) scale(0.96)`, opacity: 1 };
    return { transform: `translateY(${y}px) scale(0.96)`, opacity: 1 };
  };

  const stackSlotClass = "absolute left-0 right-0";
  const containerHeight = CARD_HEIGHT + STACK_PEEK + STACK_OFFSET;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ height: containerHeight }}
    >
      {/* Третий слой стопки (дальше всего) */}
      <div
        data-slot="next2"
        className={stackSlotClass}
        style={{
          ...getNext2Style(),
          top: 0,
          zIndex: 0,
          transition,
        }}
      >
        <TestimonialCard review={reviews[next2Index]} index={next2Index} />
      </div>
      {/* Второй слой стопки */}
      <div
        data-slot="next"
        className={stackSlotClass}
        style={{
          ...getNextStyle(),
          top: 0,
          zIndex: 1,
          transition,
        }}
      >
        <TestimonialCard review={reviews[nextIndex]} index={nextIndex} />
      </div>
      {/* Верхняя карточка */}
      <div
        data-slot="current"
        className={stackSlotClass}
        style={{
          ...getCurrentStyle(),
          top: 0,
          zIndex: 3,
          transition,
        }}
      >
        <TestimonialCard review={reviews[index]} index={index} />
      </div>
      {/* Предыдущая (над верхней, скрыта) */}
      <div
        data-slot="prev"
        className={stackSlotClass}
        style={{
          ...getPrevStyle(),
          top: 0,
          zIndex: 2,
          transition,
        }}
      >
        <TestimonialCard review={reviews[prevIndex]} index={prevIndex} />
      </div>
    </div>
  );
}

export function TestimonialsSlider({
  reviews,
  index,
  onPrev,
  onNext,
  showArrowsBelow = true,
}: {
  reviews: Review[];
  index?: number;
  onPrev?: () => void;
  onNext?: () => void;
  showArrowsBelow?: boolean;
}) {
  const [internalIndex, setInternalIndex] = useState(0);
  const count = reviews.length;
  const isControlled = typeof index === "number" && typeof onPrev === "function" && typeof onNext === "function";
  const currentIndex = isControlled ? index : internalIndex;
  const goPrev = isControlled ? onPrev! : () => setInternalIndex((i) => (i - 1 + count) % count);
  const goNext = isControlled ? onNext! : () => setInternalIndex((i) => (i + 1) % count);
  const review = reviews[currentIndex];

  if (!count) return null;

  return (
    <div className="flex flex-col gap-4">
      <TestimonialCard review={review} index={currentIndex} />
      {showArrowsBelow && <SliderArrowsVertical onPrev={goPrev} onNext={goNext} className="justify-center" />}
    </div>
  );
}

export function TestimonialsSliderWithHeader({
  title,
  description,
  reviews,
}: {
  title: string;
  description: string;
  reviews: Review[];
}) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState<"next" | "prev" | null>(null);
  const [resetting, setResetting] = useState(false);
  const count = reviews.length;

  const goNext = useCallback(() => {
    if (count <= 1 || animating) return;
    setAnimating("next");
  }, [count, animating]);

  const goPrev = useCallback(() => {
    if (count <= 1 || animating) return;
    setAnimating("prev");
  }, [count, animating]);

  useEffect(() => {
    if (!animating) return;
    const t = setTimeout(() => {
      if (animating === "next") setIndex((i) => (i + 1) % count);
      else setIndex((i) => (i - 1 + count) % count);
      setAnimating(null);
      setResetting(true);
    }, TRANSITION_MS);
    return () => clearTimeout(t);
  }, [animating, count]);

  useEffect(() => {
    if (!resetting) return;
    const raf = requestAnimationFrame(() => setResetting(false));
    return () => cancelAnimationFrame(raf);
  }, [resetting]);

  if (!count) return null;

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div className="section-heading space-y-2">
          <h2>{title}</h2>
          <p className="max-w-2xl text-left text-sm leading-7 text-[var(--color-muted)] sm:text-base">
            {description}
          </p>
        </div>
        <div className="flex items-end justify-end">
          <SliderArrowsVertical onPrev={goPrev} onNext={goNext} />
        </div>
      </div>
      <div className="mt-10">
        <TestimonialsStack
          reviews={reviews}
          index={index}
          animating={animating}
          resetting={resetting}
        />
      </div>
    </>
  );
}
