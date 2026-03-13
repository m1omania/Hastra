/**
 * Один блок текста: предложения через точку, по центру; span для анимации по скроллу.
 */
export function PartnerProblemsLadder({ items }: { items: string[] }) {
  const sentences = items
    .slice(0, 10)
    .map((s) => s.trim().replace(/\.+$/, ""))
    .filter(Boolean);

  return (
    <div className="partner-problems-ladder">
      <p className="partner-problems-ladder__text">
        {sentences.map((sentence, i) => (
          <span key={i} className="partner-problems-ladder__sentence">
            {sentence}.{i < sentences.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </div>
  );
}
