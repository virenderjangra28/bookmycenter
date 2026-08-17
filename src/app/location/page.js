"use client";

import { useEffect, useState } from "react";

const PHOTO_SECTIONS = [
  { key: "entrance", label: "Entrance" },
  { key: "hall", label: "Hall" },
  { key: "washroom", label: "Washroom" },
];

function parseCoords(latitude, longitude) {
  const lat = latitude === "" || latitude == null ? null : Number(latitude);
  const lng = longitude === "" || longitude == null ? null : Number(longitude);

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return { lat, lng };
}

function LocationMap({ latitude, longitude, title }) {
  const coords = parseCoords(latitude, longitude);

  if (!coords) {
    return <p className="text-sm text-slate-400">Map location is not available.</p>;
  }

  const query = `${coords.lat},${coords.lng}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}`;

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#0b1a33]">
          Coordinates:{" "}
          <span className="font-semibold text-[#0a7ea4]">
            {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </span>
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center text-sm font-semibold text-[#0056D2] hover:underline"
        >
          Open in Google Maps
        </a>
      </div>
      <iframe
        title={title || "Location map"}
        src={embedUrl}
        className="h-80 w-full rounded-xl border border-slate-200"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

function PhotoGrid({ photos, label }) {
  if (!photos?.length) {
    return <p className="text-sm text-slate-400">No {label.toLowerCase()} photos</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((src, index) => (
        <img
          key={`${label}-${index}`}
          src={src}
          alt={`${label} ${index + 1}`}
          className="h-36 w-full rounded-lg border border-slate-200 object-cover"
        />
      ))}
    </div>
  );
}

export default function LocationPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.result || data.error || "Failed to fetch locations");
        }

        setLocations(Array.isArray(data.result) ? data.result : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[#0b1a33]">Locations</h1>
      <p className="mt-1 text-sm text-slate-500">Centre photos stored for each registered location.</p>

      {loading ? <p className="mt-8 text-sm text-slate-500">Loading locations...</p> : null}
      {error ? <p className="mt-8 text-sm text-red-600">{error}</p> : null}

      {!loading && !error && locations.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No locations found.</p>
      ) : null}

      <div className="mt-8 space-y-8">
        {locations.map((location) => (
          <article
            key={location._id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-[#0b1a33]">
              {[location.city, location.state, location.country].filter(Boolean).join(", ") || "Unnamed location"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{location.fullAddress || "No address provided"}</p>
            {location.pinCode ? <p className="mt-1 text-xs text-slate-400">PIN {location.pinCode}</p> : null}

            <section className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-[#0b1a33]">Map</h3>
              <LocationMap
                latitude={location.latitude}
                longitude={location.longitude}
                title={[location.city, location.fullAddress].filter(Boolean).join(" — ")}
              />
            </section>

            <div className="mt-6 space-y-6">
              {PHOTO_SECTIONS.map(({ key, label }) => (
                <section key={key}>
                  <h3 className="mb-3 text-sm font-semibold text-[#0b1a33]">{label} photos</h3>
                  <PhotoGrid photos={location.locationPhotos?.[key]} label={label} />
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
