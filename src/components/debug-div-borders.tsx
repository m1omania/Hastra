"use client";

import { useEffect } from "react";

/** Палитра цветов без повторов (для отладки рамок у каждого div) */
const PALETTE = [
  "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0",
  "#f032e6", "#bcf60c", "#fabebe", "#008080", "#e6beff", "#9a6324", "#fffac8",
  "#800000", "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080", "#ffffff",
  "#000000", "#e6192b", "#3cb43b", "#ffe129", "#4363e8", "#f58241", "#911ec4",
  "#46f0e0", "#f032f6", "#bcf61c", "#fabede", "#008090", "#e6beef", "#9a6334",
  "#fffad8", "#800010", "#aaffd3", "#808010", "#ffd8c1", "#000085", "#808090",
  "#c6194b", "#5cb44b", "#dfe119", "#5363d8", "#e58231", "#a11eb4", "#56f0f0",
  "#e032e6", "#acf60c", "#ebebee", "#018080", "#d6beff", "#8a6324", "#efeac8",
  "#700000", "#baffc3", "#708000", "#efd8b1", "#100075", "#708080",
];

export function DebugDivBorders() {
  useEffect(() => {
    const divs = document.querySelectorAll("div");
    divs.forEach((el, i) => {
      (el as HTMLElement).style.setProperty(
        "border",
        `1px solid ${PALETTE[i % PALETTE.length]}`,
        "important"
      );
    });
    return () => {
      divs.forEach((el) => {
        (el as HTMLElement).style.removeProperty("border");
      });
    };
  }, []);
  return null;
}
