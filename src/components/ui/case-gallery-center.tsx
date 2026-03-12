"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CaseSummary } from "@/types/content";

export function CaseGalleryCenterMode({
  cases,
  title,
  eyebrow,
  description,
}: {
  cases: CaseSummary[];
  title: string;
  eyebrow?: string;
  description?: string;
}) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const isMobile = () => (typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false);

  const scrollToCenter = useCallback(
    (i: number) => {
      const track = trackRef.current;
      const wrap = wrapRef.current;
      if (!track || !wrap) return;
      const card = track.children[i] as HTMLElement;
      if (!card) return;
      if (isMobile()) {
        const top = card.offsetTop - (wrap.clientHeight / 2 - card.clientHeight / 2);
        wrap.scrollTo({ top, behavior: "smooth" });
      } else {
        const left = card.offsetLeft - (wrap.clientWidth / 2 - card.clientWidth / 2);
        wrap.scrollTo({ left, behavior: "smooth" });
      }
    },
    []
  );

  const activate = useCallback(
    (i: number, doScroll = true) => {
      if (i === current) return;
      setCurrent(i);
      if (doScroll) scrollToCenter(i);
    },
    [current, scrollToCenter]
  );

  const go = useCallback(
    (step: number) => {
      const next = Math.min(Math.max(current + step, 0), cases.length - 1);
      activate(next, true);
    },
    [current, cases.length, activate]
  );

  useEffect(() => {
    scrollToCenter(current);
  }, [current, scrollToCenter]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onResize = () => scrollToCenter(current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [current, scrollToCenter]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
    };
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const touchStart = useRef({ x: 0, y: 0 });
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60) {
      go((isMobile() ? dy : dx) > 0 ? -1 : 1);
    }
  };

  if (!cases.length) return null;

  return (
    <div className="case-gallery-center">
      <div className="case-gallery-center__head">
        <div>
          <h2 className="case-gallery-center__title">{title}</h2>
          {description && (
            <p className="case-gallery-center__desc">{description}</p>
          )}
        </div>
        <div className="case-gallery-center__controls">
          <button
            type="button"
            className="case-gallery-center__nav"
            onClick={() => go(-1)}
            disabled={current === 0}
            aria-label="Предыдущий"
          >
            ‹
          </button>
          <button
            type="button"
            className="case-gallery-center__nav"
            onClick={() => go(1)}
            disabled={current === cases.length - 1}
            aria-label="Следующий"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="case-gallery-center__slider"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div ref={trackRef} className="case-gallery-center__track">
          {cases.map((item, i) => (
            <article
              key={item.slug}
              className="case-gallery-center__card"
              data-active={i === current ? "" : undefined}
              onClick={() => activate(i, true)}
              onMouseEnter={() => {
                if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) activate(i, true);
              }}
            >
              <div
                className="case-gallery-center__bg"
                style={{
                  background: `linear-gradient(135deg, var(--color-primary) 0%, rgba(28,35,56,0.95) 50%, rgba(251,215,1,0.12) 100%)`,
                }}
              />
              <div className="case-gallery-center__content">
                <h3 className="case-gallery-center__card-title">{item.title}</h3>
                <p className="case-gallery-center__card-desc">{item.excerpt}</p>
                <div className="case-gallery-center__card-metrics">
                  {item.metrics.slice(0, 2).map((m) => (
                    <span key={m.label} className="case-gallery-center__metric">
                      {m.value} {m.label}
                    </span>
                  ))}
                </div>
                <Link
                  href={item.href ?? `/cases/${item.slug}`}
                  className="case-gallery-center__btn"
                >
                  Смотреть кейс
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="case-gallery-center__dots">
        {cases.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`case-gallery-center__dot ${i === current ? "active" : ""}`}
            onClick={() => activate(i, true)}
            aria-label={`Кейс ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
