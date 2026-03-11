"use client";

import Link from "next/link";
import { useState } from "react";
import type { CaseSummary } from "@/types/content";

export function CaseGallery({ cases }: { cases: CaseSummary[] }) {
  const [index, setIndex] = useState(0);
  const item = cases[index];
  if (!item) return null;

  const goPrev = () => setIndex((i) => (i === 0 ? cases.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === cases.length - 1 ? 0 : i + 1));

  return (
    <div className="relative">
      <Link
        href={item.href ?? `/cases/${item.slug}`}
        className="group relative flex aspect-[21/9] min-h-[280px] w-full flex-col overflow-hidden rounded-2xl border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 shadow-lg transition duration-300 hover:border-[var(--color-accent)]/30 hover:shadow-xl md:aspect-[3/1] md:min-h-[320px]"
      >
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[var(--color-primary)]/98 via-[var(--color-primary)]/50 to-transparent p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {item.client}
          </p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-white md:text-3xl">
            {item.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">
            {item.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {item.metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl bg-white/15 px-4 py-2">
                <span className="text-lg font-semibold text-white">{metric.value}</span>
                <span className="ml-2 text-xs uppercase tracking-wider text-white/80">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary)]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-lg bg-[var(--color-accent)] px-6 py-3 text-base font-semibold text-[#1c2338]">
            Смотреть кейс
          </span>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-primary)]/20 bg-white shadow-md transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[#1c2338]"
          aria-label="Предыдущий кейс"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm text-[var(--color-muted)]">
          {index + 1} / {cases.length}
        </span>
        <button
          type="button"
          onClick={goNext}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-primary)]/20 bg-white shadow-md transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[#1c2338]"
          aria-label="Следующий кейс"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
