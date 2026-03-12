"use client";

/**
 * SVG: 8 маленьких треугольников по кругу (без центрального).
 * Для вставки в блок услуг — стабильно отображается без WebGL.
 */
const COLORS = [
  "#66d9f2", // cyan
  "#9966ff", // purple
  "#33e680", // green
  "#ff8040", // orange
  "#ffbf33", // yellow
  "#40a6ff", // blue
  "#80ff99", // mint
  "#ff6699", // pink
];

export function HeroTrianglesInline({ className }: { className?: string }) {
  const num = 8;
  const radius = 68;
  const size = 22; // размер треугольника
  const h = size * (Math.sqrt(3) / 2);

  const triangles = Array.from({ length: num }, (_, i) => {
    const angle = (i / num) * Math.PI * 2 - Math.PI / 2;
    const cx = radius * Math.cos(angle);
    const cy = radius * Math.sin(angle);
    // Вершина вверх: p0 верх, p1/p2 низ
    const p0 = `${cx},${cy - size}`;
    const p1 = `${cx - h},${cy + size / 2}`;
    const p2 = `${cx + h},${cy + size / 2}`;
    const points = `${p0} ${p1} ${p2}`;
    return { points, color: COLORS[i % COLORS.length] };
  });

  const viewSize = (radius + size) * 2.2;
  const viewBox = `${-viewSize / 2} ${-viewSize / 2} ${viewSize} ${viewSize}`;

  return (
    <svg
      viewBox={viewBox}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden
    >
      {triangles.map(({ points, color }, i) => (
        <polygon
          key={i}
          points={points}
          fill={color}
          fillOpacity={0.85}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
}
