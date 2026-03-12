/**
 * Пункты «лесенкой»: сетка 4 + 3 + 2 + 1 (ступени сверху вниз).
 */
export function PartnerProblemsLadder({ items }: { items: string[] }) {
  const list = items.slice(0, 10);
  // Ряд 0 — 4 ячейки, ряд 1 — 3, ряд 2 — 2, ряд 3 — 1
  const rows: number[][] = [[], [], [], []];
  let idx = 0;
  for (let r = 0; r < 4 && idx < list.length; r++) {
    const count = 4 - r;
    for (let c = 0; c < count && idx < list.length; c++) {
      rows[r].push(idx++);
    }
  }

  return (
    <div className="partner-problems-ladder">
      {[...rows].reverse().map((rowIndices, rowIndex) => (
        <div key={rowIndex} className="partner-problems-ladder__row">
          {rowIndices.map((i) => (
            <div key={i} className="partner-problems-ladder__cell">
              <span className="partner-problems-ladder__text">{list[i]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
