"use client";

/**
 * Анимированные концентрические треугольники.
 * Первый (большой) — жёлтый, последний (маленький) — синий как фон, середина — градиент между ними.
 * У каждого треугольника свой цвет из этого градиента.
 */
function lerpColor(t: number): string {
  const yellow = { r: 251, g: 215, b: 1 };
  const blue = { r: 28, g: 35, b: 56 };
  const r = Math.round(yellow.r + (blue.r - yellow.r) * t);
  const g = Math.round(yellow.g + (blue.g - yellow.g) * t);
  const b = Math.round(yellow.b + (blue.b - yellow.b) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function HeroTriangle({ className }: { className?: string }) {
  const rings = 18;
  const size = 240;
  const strokeWidth = 3;

  return (
    <div className={`hero-triangle pointer-events-none flex items-center justify-center ${className ?? ""}`.trim()}>
      <div className="hero-triangle-inner hero-triangle-inner--shimmer">
        {Array.from({ length: rings }, (_, idx) => {
          const i = rings - 1 - idx;
          const r = (size * (i + 1)) / rings;
          const x = r * (Math.sqrt(3) / 2);
          const y = r / 2;
          const isSmallest = i === 0;
          const t = rings > 1 ? (rings - 1 - i) / (rings - 1) : 0;
          const color = lerpColor(t);
          return (
            <svg
              key={i}
              className="hero-triangle-ring absolute inset-0 m-auto"
              viewBox={`${-size} ${-size} ${size * 2} ${size * 2}`}
              style={{
                width: r * 2.2,
                height: r * 2.2,
                animationDelay: `${i * 0.06}s`,
              }}
              aria-hidden
            >
              <path
                d={`M 0 ${-r} L ${-x} ${y} L ${x} ${y} Z`}
                fill="none"
                stroke={isSmallest ? "#c53030" : color}
                strokeWidth={strokeWidth}
                className="hero-triangle-stroke"
              />
            </svg>
          );
        })}
      </div>
    </div>
  );
}
