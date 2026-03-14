"use client";

import Russia from "@react-map/russia";

type GeoMarker = {
  id: string;
  city: string;
  lat: number;
  lon: number;
};

// Координаты городов в формате WGS84 (широта/долгота).
const MAP_MARKERS: GeoMarker[] = [
  { id: "murmansk", city: "Мурманск", lat: 68.9707, lon: 33.0749 },
  { id: "saint-petersburg", city: "Санкт-Петербург", lat: 59.9311, lon: 30.3609 },
  { id: "moscow", city: "Москва", lat: 55.7558, lon: 37.6176 },
  { id: "nizhny-novgorod", city: "Нижний Новгород", lat: 56.2965, lon: 43.9361 },
  { id: "kazan", city: "Казань", lat: 55.7961, lon: 49.1064 },
  { id: "voronezh", city: "Воронеж", lat: 51.6608, lon: 39.2003 },
  { id: "rostov", city: "Ростов-на-Дону", lat: 47.2357, lon: 39.7015 },
  { id: "sochi", city: "Сочи", lat: 43.5855, lon: 39.7231 },
  { id: "yekaterinburg", city: "Екатеринбург", lat: 56.8389, lon: 60.6057 },
  { id: "chelyabinsk", city: "Челябинск", lat: 55.1644, lon: 61.4368 },
  { id: "omsk", city: "Омск", lat: 54.9885, lon: 73.3242 },
  { id: "novosibirsk", city: "Новосибирск", lat: 55.0084, lon: 82.9357 },
  { id: "krasnoyarsk", city: "Красноярск", lat: 56.0153, lon: 92.8932 },
  { id: "irkutsk", city: "Иркутск", lat: 52.2864, lon: 104.305 },
  { id: "yakutsk", city: "Якутск", lat: 62.0355, lon: 129.6755 },
  { id: "vladivostok", city: "Владивосток", lat: 43.1155, lon: 131.8855 },
  { id: "khabarovsk", city: "Хабаровск", lat: 48.4808, lon: 135.0928 },
  { id: "petropavlovsk-kamchatsky", city: "Петропавловск-Камчатский", lat: 53.0369, lon: 158.6519 },
];

// Калибровка для подложки @react-map/russia (проценты внутри контейнера).
const LON_MIN = 19;
const LON_MAX = 191;
const LAT_MIN = 41;
const LAT_MAX = 82;
const X_MIN = 6;
const X_MAX = 94;
const Y_MIN = 15;
const Y_MAX = 87;

function projectToMap(lat: number, lon: number) {
  const worldLon = lon < 0 ? lon + 360 : lon;
  const xNorm = (worldLon - LON_MIN) / (LON_MAX - LON_MIN);
  const yNorm = 1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN);

  const x = X_MIN + xNorm * (X_MAX - X_MIN);
  const y = Y_MIN + yNorm * (Y_MAX - Y_MIN);

  return {
    left: `${Math.max(0, Math.min(100, x))}%`,
    top: `${Math.max(0, Math.min(100, y))}%`,
  };
}

export function RussiaMapWithMarkers() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="relative">
        <Russia
          type="select-single"
          size={820}
          mapColor="#4d91db"
          strokeColor="#fff"
          strokeWidth={0.75}
          disableClick
          disableHover
        />
        {MAP_MARKERS.map((m) => {
          const point = projectToMap(m.lat, m.lon);
          return (
            <span
              key={m.id}
              className="absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] ring-2 ring-[#0c0e4a] sm:h-3 sm:w-3"
              style={{ left: point.left, top: point.top }}
              title={m.city}
              aria-label={m.city}
            />
          );
        })}
      </div>
    </div>
  );
}
