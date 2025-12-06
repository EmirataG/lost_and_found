/**
 * Common Yale locations with their various name variations
 * Used for location matching and recognition
 */

export type YaleLocation = {
  canonicalName: string; // official name
  aliases: string[]; // alternative names, abbreviations, etc.
  imageUrl?: string; // optional path to location image (e.g., "/images/locations/sterling.jpg")
};

export const YALE_LOCATIONS: YaleLocation[] = [
  // Residential Colleges
  {
    canonicalName: "Berkeley College",
    aliases: ["Berkeley", "BK", "Berkeley College"],
  },
  {
    canonicalName: "Branford College",
    aliases: ["Branford", "BR", "Branford College"],
  },
  {
    canonicalName: "Davenport College",
    aliases: ["Davenport", "DC", "DPort", "Davenport College"],
  },
  {
    canonicalName: "Ezra Stiles College",
    aliases: ["Ezra Stiles", "Stiles", "ES", "Ezra Stiles College"],
  },
  {
    canonicalName: "Benjamin Franklin College",
    aliases: ["Benjamin Franklin", "Franklin", "Ben Frank", "Ezra Stiles College"],
  },
  {
    canonicalName: "Grace Hopper College",
    aliases: ["Grace Hopper", "Hopper", "GH", "Grace Hopper College"],
  },
  {
    canonicalName: "Jonathan Edwards College",
    aliases: ["Jonathan Edwards", "JE", "J.E.", "Jonathan Edwards College"],
  },
  {
    canonicalName: "Morse College",
    aliases: ["Morse", "MC", "Morse College"],
  },
  {
    canonicalName: "Pauli Murray College",
    aliases: ["Pauli Murray", "Murray", "PM", "Pauli Murray College"],
  },
  {
    canonicalName: "Pierson College",
    aliases: ["Pierson", "PC", "Pierson College"],
  },
  {
    canonicalName: "Saybrook College",
    aliases: ["Saybrook", "SY", "Saybrook College"],
  },
  {
    canonicalName: "Silliman College",
    aliases: ["Silliman", "SM", "Silliman College"],
  },
  {
    canonicalName: "Timothy Dwight College",
    aliases: ["Timothy Dwight", "TD", "T.D.", "Timothy Dwight College"],
  },
  {
    canonicalName: "Trumbull College",
    aliases: ["Trumbull", "TC", "Trumbull College"],
  },

  // Libraries
  {
    canonicalName: "Sterling Memorial Library",
    aliases: ["Sterling", "Sterling Library", "SML", "Sterling Memorial Library"],
    imageUrl: "/images/locations/sterling.jpg", // Add your image to public/images/locations/
  },
  {
    canonicalName: "Beinecke Rare Book & Manuscript Library",
    aliases: ["Beinecke", "Beinecke Library"],
  },
  {
    canonicalName: "Bass Library",
    aliases: ["Bass", "Bass Library"],
  },

  // Academic Buildings
  {
    canonicalName: "Yale Commons",
    aliases: ["Commons", "The Commons", "Yale Commons"],
  },
  {
    canonicalName: "Woolsey Hall",
    aliases: ["Woolsey", "Woolsey Hall"],
  },
  {
    canonicalName: "Yale Law School",
    aliases: ["Law School", "YLS", "Yale Law"],
  },
  {
    canonicalName: "Yale School of Management",
    aliases: ["SOM", "School of Management", "Yale SOM"],
  },
  {
    canonicalName: "Kroon Hall",
    aliases: ["Kroon", "Kroon Hall"],
  },
  {
    canonicalName: "Kline Biology Tower",
    aliases: ["Kline", "Kline Tower", "Kline Biology Tower"],
  },
  {
    canonicalName: "Yale Art Gallery",
    aliases: ["Art Gallery", "YAG", "Yale Art Gallery"],
  },
  {
    canonicalName: "Yale Center for British Art",
    aliases: ["British Art", "YCBA", "Yale Center for British Art"],
  },
  {
    canonicalName: "Old Campus",
    aliases: ["Old Campus", "OC"],
  },
  {
    canonicalName: "Cross Campus",
    aliases: ["Cross Campus", "Cross Campus Library", "XC"],
  },
  {
    canonicalName: "Science Hill",
    aliases: ["Science Hill"],
  },
  {
    canonicalName: "Payne Whitney Gymnasium",
    aliases: ["Payne Whitney", "Gym", "PWG", "Payne Whitney Gym"],
  },
  {
    canonicalName: "Yale Bowl",
    aliases: ["Yale Bowl", "The Bowl"],
  },
  {
    canonicalName: "Humanities Quadrangle",
    aliases: ["HQ", "Humanities Quad", "HQ Quad"],
  }
];

/**
 * Normalizes a location string for matching
 * - Converts to lowercase
 * - Removes extra whitespace
 * - Removes common punctuation
 */
function normalizeLocation(location: string): string {
  return location.toLowerCase().trim().replace(/[.,;:!?'"]/g, "").replace(/\s+/g, " "); // remove punctuation and normalize whitespace
}

/**
 * checks if a location string matches any known Yale location
 * returns the full location object if matched, null otherwise
 */
export function matchYaleLocation(location: string): YaleLocation | null {
  if (!location || location.trim().length === 0) {
    return null;
  }

  const normalized = normalizeLocation(location);

  // check each location and its aliases
  for (const yaleLocation of YALE_LOCATIONS) {
    // check canonical name
    if (normalized === normalizeLocation(yaleLocation.canonicalName)) {
      return yaleLocation;
    }

    // check all aliases
    for (const alias of yaleLocation.aliases) {
      if (normalized === normalizeLocation(alias)) {
        return yaleLocation;
      }
    }

    // Also check if the location string contains the canonical name or any alias
    const allLocationWords = normalized.split(/\s+/);
    const canonicalWords = normalizeLocation(yaleLocation.canonicalName).split(/\s+/);
    
    // check if all words of canonical name are present
    if (canonicalWords.every(word => allLocationWords.includes(word))) {
      return yaleLocation;
    }

    // check aliases
    for (const alias of yaleLocation.aliases) {
      const aliasWords = normalizeLocation(alias).split(/\s+/);
      if (aliasWords.length > 1 && aliasWords.every(word => allLocationWords.includes(word))) {
        return yaleLocation;
      }
    }
  }

  return null;
}

