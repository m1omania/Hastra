"use client";

import type { ReactNode } from "react";

/**
 * Слой с фигурами hero: треугольники остаются на месте при скролле (без parallax-сдвига).
 */
export function HeroFiguresScroll({ children }: { children: ReactNode }) {
  return <div className="hero-figures">{children}</div>;
}
