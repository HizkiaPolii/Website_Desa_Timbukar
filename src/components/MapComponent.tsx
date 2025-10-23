"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface MapComponentProps {
  lat: number;
  lng: number;
  title?: string;
  subtitle?: string;
}

export default function MapComponent({
  lat,
  lng,
  title = "Desa Timbukar",
  subtitle = "Kecamatan Sonder, Kabupaten Minahasa",
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainer.current) return;

    // Prevent multiple initializations
    if (map.current) return;

    try {
      // Initialize map dengan zoom level lebih tinggi untuk detail yang lebih baik
      map.current = L.map(mapContainer.current).setView([lat, lng], 16);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map.current);

      // Add marker
      const marker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          shadowSize: [41, 41],
        }),
      }).addTo(map.current);
      marker.bindPopup(
        `<div class="text-center"><h3 class="font-bold">${title}</h3><p class="text-sm">${subtitle}</p></div>`
      );
      marker.openPopup();
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      // Cleanup
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isClient, lat, lng, title, subtitle]);

  if (!isClient) {
    return (
      <div
        className="rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-200 bg-gray-100 flex items-center justify-center"
        style={{ height: "400px" }}
      >
        <p className="text-gray-600">Memuat peta...</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-200"
      style={{ height: "400px", width: "100%" }}
    />
  );
}
