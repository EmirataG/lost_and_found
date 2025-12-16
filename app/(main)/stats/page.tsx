"use client";

import { useEffect, useState } from "react";
import YaleSpinner from "@/components/YaleSpinner";

type LocationStat = {
  location: string;
  count: number;
};

const StatsPage = () => {
  const [locations, setLocations] = useState<LocationStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationStats = async () => {
      try {
        const response = await fetch("/api/stats/locations");
        if (!response.ok) {
          throw new Error("Failed to fetch location stats");
        }
        const data = await response.json();
        setLocations(data.locations);
      } catch (err) {
        console.error("Error fetching location stats:", err);
        setError("Failed to load location statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <YaleSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-yaleBlue">
          Location Statistics
        </h1>
        <h2 className="text-xl font-medium text-gray-600">
          Top 10 Most Common Lost & Found Locations
        </h2>
      </header>

      <div className="mx-auto w-full max-w-3xl">
        {locations.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-gray-600">No location data available yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {locations.map((stat, index) => (
              <div
                key={stat.location}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : index === 2
                            ? "bg-amber-600"
                            : "bg-yaleBlue"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {stat.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yaleBlue">
                      {stat.count}
                    </p>
                    <p className="text-sm text-gray-500">
                      {stat.count === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="h-12 w-2 rounded-full bg-yaleBlue/20">
                    <div
                      className="w-full rounded-full bg-yaleBlue transition-all"
                      style={{
                        height: `${(stat.count / locations[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
