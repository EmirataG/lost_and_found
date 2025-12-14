"use client";

import { useEffect } from "react";

type PlaceAidProps = {
  onSelect: (value: string, latLng?: { lat: number; lng: number }) => void;
};

export default function PlaceAid({ onSelect }: PlaceAidProps) {
  useEffect(() => {
    if (!window.google?.maps?.places) return;

    const autocomplete =
      new google.maps.places.PlaceAutocompleteElement({
        types: ["geocode"],
      });

    autocomplete.style.width = "100%";

    autocomplete.addEventListener("gmp-placeselect", async (event: any) => {
      const place = event.place;

      await place.fetchFields({
        fields: ["formattedAddress", "location"],
      });

      const address = place.formattedAddress ?? "";
      const location = place.location
        ? { lat: place.location.lat(), lng: place.location.lng() }
        : undefined;

      onSelect(address, location);
    });

    const container = document.getElementById("place-autocomplete");
    if (container) container.appendChild(autocomplete);

    return () => {
      autocomplete.remove();
    };
  }, [onSelect]);

  return (
    <div
      id="place-autocomplete"
      className="border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 transition"
    />
  );
}
