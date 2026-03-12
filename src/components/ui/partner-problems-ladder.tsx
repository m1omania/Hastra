/**
 * Пункты в раскладке 4 — 4 — 2 (три ряда).
 */
export function PartnerProblemsLadder({ items }: { items: string[] }) {
  const list = items.slice(0, 10);
  const rowCounts = [4, 4, 2];
  const rows: number[][] = [];
  let idx = 0;
  for (const count of rowCounts) {
    const row: number[] = [];
    for (let c = 0; c < count && idx < list.length; c++) {
      row.push(idx++);
    }
    if (row.length) rows.push(row);
  }

  return (
    <div className="partner-problems-ladder">
      {rows.map((rowIndices, rowIndex) => (
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
