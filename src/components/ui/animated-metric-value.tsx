"use client";

import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type NumericToken = {
  start: number;
  end: number;
  target: number;
  decimals: number;
  decimalSeparator: "." | ",";
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function formatToken(value: number, token: NumericToken): string {
  const rounded = token.decimals > 0 ? value.toFixed(token.decimals) : Math.round(value).toString();
  return token.decimalSeparator === "," ? rounded.replace(".", ",") : rounded;
}

export function AnimatedMetricValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [started, setStarted] = useState(false);

  const tokens = useMemo<NumericToken[]>(() => {
    const matches = [...value.matchAll(/\d+(?:[.,]\d+)?/g)];
    return matches.map((match) => {
      const raw = match[0];
      const start = match.index ?? 0;
      const end = start + raw.length;
      const decimalSeparator = raw.includes(",") ? "," : ".";
      const normalized = raw.replace(",", ".");
      const parts = normalized.split(".");
      const decimals = parts[1]?.length ?? 0;

      return {
        start,
        end,
        target: Number.parseFloat(normalized),
        decimals,
        decimalSeparator,
      };
    });
  }, [value]);

  useEffect(() => {
    if (!tokens.length) return;
    setNumbers(tokens.map(() => 0));
  }, [tokens]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !tokens.length || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setStarted(true);
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [tokens, started]);

  useEffect(() => {
    if (!started || !tokens.length) return;

    const duration = 1100;
    const begin = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - begin) / duration, 1);
      const eased = easeOutCubic(progress);
      setNumbers(tokens.map((token) => token.target * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, tokens]);

  if (!tokens.length) {
    return <span ref={ref}>{value}</span>;
  }

  let cursor = 0;
  const parts: Array<string | ReactElement> = [];

  tokens.forEach((token, i) => {
    if (token.start > cursor) {
      parts.push(value.slice(cursor, token.start));
    }
    const current = numbers[i] ?? 0;
    parts.push(
      <span key={`${token.start}-${token.end}`}>
        {formatToken(current, token)}
      </span>
    );
    cursor = token.end;
  });

  if (cursor < value.length) {
    parts.push(value.slice(cursor));
  }

  return <span ref={ref}>{parts}</span>;
}
