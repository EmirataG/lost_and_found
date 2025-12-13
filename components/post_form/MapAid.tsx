"use client";

import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";

const libraries = ["places"] as ("places")[];

export default function LocationPicker({
  where,
  setWhere,
  setCoordinates,
}: {
  where: string;
  setWhere: (s: string) => void;
  setCoordinates: (coords: { lat: number; lng: number }) => void;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  if (!isLoaded) return <input className="..." placeholder="Loading…" disabled />;

  function onLoad(autocomplete: google.maps.places.Autocomplete) {
    autocompleteRef.current = autocomplete;
  }

  function onPlaceChanged() {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;

    const formatted = place.formatted_address || place.name || "";
    setWhere(formatted);

    if (place.geometry?.location) {
      setCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  }

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input
        type="text"
        value={where}
        onChange={(e) => setWhere(e.target.value)}
        placeholder="Search for a place"
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />
    </Autocomplete>
  );
}
