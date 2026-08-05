"use client";

import { useI18n } from "@/components/I18nProvider";
import { wedding } from "@/lib/wedding-data";
import { GoogleMapsIcon, WazeIcon, ArrowUpRightIcon } from "@/components/Icons";

export function MapSection() {
  const { t } = useI18n();

  return (
    <div className="space-y-10">
      <header className="text-center space-y-2">
        <div className="divider-ornament" aria-hidden>
          <span>🍋</span>
          <span>✦</span>
          <span>🌿</span>
        </div>
        <h2 className="section-title">{t.map.title}</h2>
        <p className="section-subtitle">{t.map.subtitle}</p>
      </header>

      <iframe
        title={wedding.venue.name}
        src={wedding.venue.googleMapsUrl}
        width="100%"
        height="380"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="border-0 w-full block"
        style={{ background: "var(--leaf-50)", borderRadius: "12px" }}
      />

      <div className="space-y-3">
        <p
          className="text-center italic text-3xl"
          style={{ color: "var(--highlight)", fontFamily: "var(--font-serif)" }}
        >
          {t.map.videoTitle}
        </p>
        <div
          className="w-full overflow-hidden"
          style={{
            background: "var(--leaf-50)",
            borderRadius: "12px",
            aspectRatio: "16 / 9",
          }}
        >
          <iframe
            title={t.map.videoTitle}
            src="https://www.youtube.com/embed/ry6zyjr92xo"
            width="100%"
            height="100%"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="border-0 w-full h-full block"
          />
        </div>
      </div>

      <div className="text-center space-y-4">
        <div>
          <p
            className="italic text-4xl"
            style={{ color: "var(--highlight)", fontFamily: "var(--font-serif)" }}
          >
            {wedding.venue.name}
          </p>
          <p className="mt-1" style={{ color: "var(--text-body)" }}>
            {wedding.venue.address}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={wedding.venue.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary inline-flex"
          >
            <GoogleMapsIcon size={18} />
            Google Maps
            <ArrowUpRightIcon size={16} />
          </a>
          <a
            href={`https://waze.com/ul?ll=${wedding.venue.lat},${wedding.venue.lng}&navigate=yes`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline inline-flex"
          >
            <WazeIcon size={18} />
            Waze
            <ArrowUpRightIcon size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
