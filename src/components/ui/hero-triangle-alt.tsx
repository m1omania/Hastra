"use client";

/**
 * Альтернативная реализация концентрических треугольников:
 * один SVG, все пути в нём, анимация прорисовки контура (stroke-dashoffset).
 */
function lerpColor(t: number): string {
  const yellow = { r: 251, g: 215, b: 1 };
  const blue = { r: 28, g: 35, b: 56 };
  const r = Math.round(yellow.r + (blue.r - yellow.r) * t);
  const g = Math.round(yellow.g + (blue.g - yellow.g) * t);
  const b = Math.round(yellow.b + (blue.b - yellow.b) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function HeroTriangleAlt({ className }: { className?: string }) {
  const rings = 18;
  const size = 240;
  const strokeWidth = 3;
  const viewSize = size * 2.2;

  const paths = Array.from({ length: rings }, (_, idx) => {
    const i = rings - 1 - idx;
    const r = (size * (i + 1)) / rings;
    const x = r * (Math.sqrt(3) / 2);
    const y = r / 2;
    const d = `M 0 ${-r} L ${-x} ${y} L ${x} ${y} Z`;
    const t = rings > 1 ? (rings - 1 - i) / (rings - 1) : 0;
    const color = i === 0 ? "#c53030" : lerpColor(t);
    return { d, color, i, delay: i * 0.08 };
  });

  return (
    <div
      className={`hero-triangle pointer-events-none flex items-center justify-center ${className ?? ""}`.trim()}
    >
      <svg
        className="hero-triangle-alt-svg"
        viewBox={`${-size} ${-size} ${size * 2} ${size * 2}`}
        style={{ width: 540, height: 540 }}
        aria-hidden
      >
        <g className="hero-triangle-alt-group">
          {paths.map(({ d, color, i, delay }) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              className="hero-triangle-alt-path"
              style={{
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
