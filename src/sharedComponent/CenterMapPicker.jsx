"use client";

import { useEffect, useRef, useState } from "react";
import markerIconAsset from "leaflet/dist/images/marker-icon.png";
import markerIcon2xAsset from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowAsset from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [28.6139, 77.209];
const DEFAULT_ZOOM = 5;
const LOCATION_ZOOM = 16;

function resolveAssetUrl(asset) {
  if (typeof asset === "string") {
    return asset;
  }

  if (asset?.src) {
    return asset.src;
  }

  if (typeof asset?.default === "string") {
    return asset.default;
  }

  if (asset?.default?.src) {
    return asset.default.src;
  }

  return "";
}

const MARKER_ICON_URL =
  resolveAssetUrl(markerIconAsset) ||
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const MARKER_ICON_2X_URL =
  resolveAssetUrl(markerIcon2xAsset) ||
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const MARKER_SHADOW_URL =
  resolveAssetUrl(markerShadowAsset) ||
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

function parseCoords(latitude, longitude) {
  const lat = latitude === "" || latitude == null ? null : Number(latitude);
  const lng = longitude === "" || longitude == null ? null : Number(longitude);

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return [lat, lng];
}

function formatCoords(lat, lng) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function safeInvalidateSize(map) {
  if (!map || mapRefIsDetached(map)) {
    return;
  }

  try {
    map.invalidateSize({ animate: false });
  } catch {
    // Ignore teardown races from React Strict Mode remounts.
  }
}

function mapRefIsDetached(map) {
  const container = map.getContainer?.();
  return !container || !container.isConnected;
}

async function loadLeaflet() {
  const { default: L } = await import("leaflet");

  return {
    L,
    markerIcon: L.icon({
      iconUrl: MARKER_ICON_URL,
      iconRetinaUrl: MARKER_ICON_2X_URL,
      shadowUrl: MARKER_SHADOW_URL,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
  };
}

export default function CenterMapPicker({
  latitude,
  longitude,
  onLocationChange,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const leafletRef = useRef(null);
  const onLocationChangeRef = useRef(onLocationChange);
  const [mapReady, setMapReady] = useState(false);
  const [displayCoords, setDisplayCoords] = useState("");

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  const applyLocation = (coords, shouldNotify = false) => {
    const map = mapRef.current;
    const marker = markerRef.current;
    const circle = circleRef.current;

    if (!map || !marker || mapRefIsDetached(map)) {
      return;
    }

    try {
      if (coords) {
        marker.setLatLng(coords);
        circle?.setLatLng(coords);
        marker.bindPopup(formatCoords(coords[0], coords[1])).openPopup();
        map.setView(coords, LOCATION_ZOOM, { animate: false });
        setDisplayCoords(formatCoords(coords[0], coords[1]));

        if (shouldNotify) {
          onLocationChangeRef.current(coords[0], coords[1]);
        }
      } else {
        marker.setLatLng(DEFAULT_CENTER);
        circle?.setLatLng(DEFAULT_CENTER);
        marker.closePopup();
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: false });
        setDisplayCoords("");
      }

      window.setTimeout(() => safeInvalidateSize(map), 0);
    } catch {
      // Ignore map updates during teardown.
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!containerRef.current || mapRef.current) {
        return;
      }

      const { L, markerIcon } = await loadLeaflet();

      if (cancelled || !containerRef.current || mapRef.current) {
        return;
      }

      leafletRef.current = L;

      const coords = parseCoords(latitude, longitude);
      const center = coords ?? DEFAULT_CENTER;

      const map = L.map(containerRef.current, {
        center,
        zoom: coords ? LOCATION_ZOOM : DEFAULT_ZOOM,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker(center, {
        draggable: true,
        icon: markerIcon,
      }).addTo(map);

      const circle = L.circle(center, {
        radius: 120,
        color: "#0a7ea4",
        fillColor: "#0a7ea4",
        fillOpacity: 0.15,
        weight: 2,
      }).addTo(map);

      if (coords) {
        marker.bindPopup(formatCoords(coords[0], coords[1])).openPopup();
        setDisplayCoords(formatCoords(coords[0], coords[1]));
      }

      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        circle.setLatLng([lat, lng]);
        marker.bindPopup(formatCoords(lat, lng)).openPopup();
        setDisplayCoords(formatCoords(lat, lng));
        onLocationChangeRef.current(lat, lng);
      });

      map.on("click", (event) => {
        const { lat, lng } = event.latlng;
        marker.setLatLng(event.latlng);
        circle.setLatLng(event.latlng);
        marker.bindPopup(formatCoords(lat, lng)).openPopup();
        setDisplayCoords(formatCoords(lat, lng));
        onLocationChangeRef.current(lat, lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
      circleRef.current = circle;
      setMapReady(true);

      map.whenReady(() => {
        if (cancelled || mapRef.current !== map) {
          return;
        }

        window.setTimeout(() => {
          if (cancelled || mapRef.current !== map) {
            return;
          }

          safeInvalidateSize(map);

          if (coords) {
            map.setView(coords, LOCATION_ZOOM, { animate: false });
          }
        }, 0);
      });
    }

    initMap();

    return () => {
      cancelled = true;
      const map = mapRef.current;
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
      leafletRef.current = null;

      if (map) {
        map.off();
        map.remove();
      }

      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady) {
      return;
    }

    applyLocation(parseCoords(latitude, longitude));
  }, [latitude, longitude, mapReady]);

  useEffect(() => {
    if (!mapReady || !containerRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      safeInvalidateSize(mapRef.current);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mapReady]);

  const handleClearLocation = () => {
    onLocationChangeRef.current(null, null);
    applyLocation(null);
  };

  return (
    <>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#0b1a33]">
          {displayCoords ? (
            <>
              Selected location:{" "}
              <span className="font-semibold text-[#0a7ea4]">{displayCoords}</span>
            </>
          ) : (
            <span className="text-[#6b7280]">No location selected yet</span>
          )}
        </p>
        {displayCoords ? (
          <button
            type="button"
            onClick={handleClearLocation}
            className="inline-flex w-fit items-center justify-center rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#0b1a33] transition hover:bg-[#f9fafb]"
          >
            Clear location
          </button>
        ) : null}
      </div>

      <div
        ref={containerRef}
        className="z-0 h-80 w-full overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f3f4f6]"
      />

      {!mapReady ? (
        <p className="mt-2 text-xs text-[#6b7280]">Loading map...</p>
      ) : (
        <p className="mt-2 text-xs text-[#6b7280]">
          Click on the map or drag the marker to set your center location coordinates.
        </p>
      )}
    </>
  );
}
