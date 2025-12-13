"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";

type PlaceAidProps = {
  prevValue?: string;
  onSelect: (
    place: string,
    latLng: { lat: number; lng: number } | null,
  ) => void;
};

export default function PlaceAid({ onSelect, prevValue }: PlaceAidProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState(prevValue || "");

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
      },
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

      setValue(formattedAddress);
      onSelect(formattedAddress, latLng);
    });
  }, [ready, onSelect]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter a place"
      className="rounded-lg border border-gray-300 p-2 transition focus:ring-2 focus:ring-blue-500"
    />
  );
}
