"use client";

/**
 * Разноцветные светящиеся линии-частицы, расходящиеся из правого верхнего угла.
 * Цвета: фуксия, синий, белый.
 */
const LINE_COUNT = 64;
const COLORS = [
  "rgba(255, 0, 255, 0.5)",   // fuchsia
  "rgba(255, 100, 255, 0.45)",
  "rgba(0, 191, 255, 0.5)",   // electric blue
  "rgba(100, 150, 255, 0.45)",
  "rgba(255, 255, 255, 0.4)",  // white
  "rgba(200, 180, 255, 0.4)",
] as const;

/** Углы: веер от 90° (вниз) до 270° (вверх через влево) — лучи из правого верхнего угла в экран */
function getLineStyle(i: number) {
  const angle = 90 + (i / LINE_COUNT) * 180 + (i % 3) * 4;
  const color = COLORS[i % COLORS.length];
  const length = 35 + (i % 5) * 8 + (i % 3) * 15;
  const width = 1.5 + (i % 3) * 0.5;
  const delay = (i * 0.08) % 4;
  return { angle, color, length, width, delay };
}

export function ParticleLines({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`.trim()}
      aria-hidden
    >
      <div className="particle-lines-origin absolute right-0 top-0 h-0 w-0">
        {Array.from({ length: LINE_COUNT }, (_, i) => {
          const { angle, color, length, width, delay } = getLineStyle(i);
          return (
            <div
              key={i}
              className="particle-line"
              style={{
                "--particle-line-color": color,
                "--particle-line-length": `${length}vh`,
                "--particle-line-width": `${width}px`,
                "--particle-line-angle": `${angle}deg`,
                "--particle-line-delay": `${delay}s`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>
    </div>
  );
}
