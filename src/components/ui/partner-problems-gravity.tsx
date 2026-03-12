"use client";

/**
 * Пункты в видимой сетке 5×2: одна ячейка — один пункт.
 */
export function PartnerProblemsGravity({ items }: { items: string[] }) {
  return (
    <div className="partner-problems-grid">
      {items.slice(0, 10).map((text, i) => (
        <div key={`${text}-${i}`} className="partner-problems-grid__cell">
          <span className="partner-problems-grid__text">{text}</span>
        </div>
      ))}
    </div>
  );
}
