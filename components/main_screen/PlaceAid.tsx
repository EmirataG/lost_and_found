"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";

type PlaceAidProps = {
  onSelect: (
    place: string,
    latLng: { lat: number; lng: number } | null
  ) => void;
};

export default function PlaceAid({ onSelect }: PlaceAidProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadGoogleMaps()
      .then(() => setReady(true))
      .catch((err) => console.error("Google Maps failed to load", err));
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const formattedAddress = place.formatted_address || place.name || "";
      const latLng = place.geometry?.location
        ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }
        : null;

      onSelect(formattedAddress, latLng);
    });
  }, [ready, onSelect]);

  return (
    <input
      ref={inputRef}
      placeholder="Enter a place"
      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition"
    />
  );
}
