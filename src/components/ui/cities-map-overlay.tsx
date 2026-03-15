"use client";

import Russia from "@react-map/russia";
import { useMemo, useState } from "react";

const COLUMNS = 4;
const ROWS_PER_COLUMN = 8;
const PAGE_SIZE = COLUMNS * ROWS_PER_COLUMN;

function chunkCities(cities: string[]) {
  const pages: string[][] = [];
  for (let i = 0; i < cities.length; i += PAGE_SIZE) {
    pages.push(cities.slice(i, i + PAGE_SIZE));
  }
  return pages;
}

function splitToColumns(cities: string[]) {
  const result: string[][] = [];
  for (let c = 0; c < COLUMNS; c += 1) {
    const start = c * ROWS_PER_COLUMN;
    result.push(cities.slice(start, start + ROWS_PER_COLUMN));
  }
  return result;
}

export function CitiesMapOverlay({
  title,
  cities,
}: {
  title: string;
  cities: string[];
}) {
  const pages = useMemo(() => chunkCities(cities), [cities]);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, pages.length);
  const pageCities = pages[page] ?? [];
  const columns = splitToColumns(pageCities);

  return (
    <div className="relative min-h-[700px] overflow-hidden rounded-[1.5rem] bg-[var(--color-primary-darker)] px-20 py-8 sm:px-24 lg:min-h-[760px] lg:px-28">
      <div className="relative z-20 mt-20">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
      </div>

      <div className="pointer-events-none absolute inset-x-8 top-12 bottom-6 z-0 opacity-[0.28]">
        <div className="absolute inset-0 flex items-center justify-center">
          <Russia
            type="select-single"
            size={980}
            mapColor="#0C0E4A"
            strokeColor="rgba(255,255,255,0.22)"
            strokeWidth={0.9}
            disableClick
            disableHover
          />
        </div>
      </div>

      <div className="relative z-20 mt-[8.5rem] grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-2">
            {column.map((city) => (
              <div key={city} className="flex items-center gap-2.5 text-white">
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.14 6.23 12.09 6.5 12.38a.7.7 0 0 0 1 0C12.77 21.09 19 14.14 19 9c0-3.86-3.14-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                  </svg>
                </span>
                <span className="text-base font-semibold leading-6 underline decoration-white/35 underline-offset-2">
                  {city}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {totalPages > 1 ? (
        <>
          <button
            type="button"
            onClick={() => setPage((prev) => (prev - 1 + totalPages) % totalPages)}
            className="absolute left-4 top-[58%] z-30 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#5a5e80] bg-[#1a1d42] text-white transition-colors hover:bg-[#22254d] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Предыдущая страница городов"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setPage((prev) => (prev + 1) % totalPages)}
            className="absolute right-4 top-[58%] z-30 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#5a5e80] bg-[#1a1d42] text-white transition-colors hover:bg-[#22254d] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Следующая страница городов"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      ) : null}
    </div>
  );
}
