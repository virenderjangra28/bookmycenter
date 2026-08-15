"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [28.6139, 77.209];

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function parseCoords(latitude, longitude) {
  const lat = latitude === "" ? null : Number(latitude);
  const lng = longitude === "" ? null : Number(longitude);

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return [lat, lng];
}

export default function CenterMapPicker({
  latitude,
  longitude,
  onLocationChange,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onLocationChangeRef = useRef(onLocationChange);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const coords = parseCoords(latitude, longitude);
    const center = coords ?? DEFAULT_CENTER;

    const map = L.map(containerRef.current, {
      center,
      zoom: coords ? 15 : 5,
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

    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng();
      onLocationChangeRef.current(lat, lng);
    });

    map.on("click", (event) => {
      marker.setLatLng(event.latlng);
      onLocationChangeRef.current(event.latlng.lat, event.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) {
      return;
    }

    const coords = parseCoords(latitude, longitude);
    if (!coords) {
      return;
    }

    markerRef.current.setLatLng(coords);
    mapRef.current.setView(coords, 15);
  }, [latitude, longitude]);

  return (
    <>
      <div
        ref={containerRef}
        className="z-0 h-80 w-full overflow-hidden rounded-xl border border-[#e5e7eb]"
      />
      <p className="mt-2 text-xs text-[#6b7280]">
        Click on the map or drag the marker to set your center location coordinates.
      </p>
    </>
  );
}
