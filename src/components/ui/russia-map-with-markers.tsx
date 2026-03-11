"use client";

import Russia from "@react-map/russia";

const MAP_MARKERS = [
  { id: "murmansk", city: "Мурманск", left: "21.2%", top: "22%" },
  { id: "moscow", city: "Москва", left: "11.5%", top: "42%" },
  { id: "lipetsk", city: "Липецк", left: "10%", top: "47%" },
  { id: "mirnyy", city: "Мирный", left: "57.6%", top: "54.5%" },
  { id: "ust-kamchatsk", city: "Усть-Камчатск", left: "87.4%", top: "57%" },
];

export function RussiaMapWithMarkers() {
  return (
    <div className="map map--inline relative mx-auto w-full max-w-4xl">
      <Russia
        type="select-single"
        size={640}
        mapColor="#4d91db"
        strokeColor="#fff"
        strokeWidth={0.75}
        disableClick
        disableHover
      />
      {MAP_MARKERS.map((m) => (
        <span
          key={m.id}
          className="map-marker"
          style={{ left: m.left, top: m.top }}
          title={m.city}
        >
          {m.city}
        </span>
      ))}
    </div>
  );
}
