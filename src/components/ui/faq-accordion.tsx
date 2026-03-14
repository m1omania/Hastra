"use client";

import { useState } from "react";

import type { FAQItem } from "@/types/content";

export function FaqAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#e5e7eb]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="py-5 first:pt-0">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-start gap-4 text-left"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              id={`faq-question-${index}`}
            >
              <span
                className={`shrink-0 text-base font-bold tabular-nums sm:text-lg ${
                  isOpen ? "text-[var(--color-accent)]" : "text-[#9ca3af]"
                }`}
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 text-base font-semibold text-[#111] sm:text-lg">
                {item.question}
              </span>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d1d5db] bg-white text-[#374151]"
                aria-hidden
              >
                {isOpen ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </span>
            </button>
            <div
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              className={`overflow-hidden pl-11 pr-12 transition-all duration-200 sm:pl-[4.5rem] ${
                isOpen ? "visible opacity-100" : "invisible h-0 opacity-0"
              }`}
            >
              <p className="pt-2 text-sm leading-7 text-[#4b5563]">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
