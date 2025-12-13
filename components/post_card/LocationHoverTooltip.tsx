"use client";

import { useState } from "react";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import { matchYaleLocation } from "@/utils/yale_locations";

/**
 * client component for location hover tooltip
 * handles hover state and displays tooltip for recognized Yale locations
 */
const LocationHoverTooltip = ({ location }: { location: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // check if location matches a known Yale location
  const matchedLocation = matchYaleLocation(location);
  const isRecognizedLocation = matchedLocation !== null;

  return (
    <span
      className={`relative inline-block cursor-default transition-all ${
        isRecognizedLocation ? "hover:text-yellow-200" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {location}
      {/* Map pin popup on hover for recognized locations */}
      {isRecognizedLocation && isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 pointer-events-none min-w-[200px]">
          {/* Location Image (if available) */}
          {matchedLocation.imageUrl && (
            <div className="relative w-full h-32 rounded-t-lg overflow-hidden">
              <Image
                src={matchedLocation.imageUrl}
                alt={matchedLocation.canonicalName}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          )}
          {/* Location Info */}
          <div className="flex items-center gap-2 p-2">
            <FaMapMarkerAlt className="text-red-500 flex-shrink-0" size={16} />
            <span className="text-xs text-gray-700 font-medium">
              {matchedLocation.canonicalName}
            </span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
        </div>
      )}
    </span>
  );
};

export default LocationHoverTooltip;

