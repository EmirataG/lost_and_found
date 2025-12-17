import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all posts with their locations
    const { data: posts, error } = await supabase
      .from("posts")
      .select("where")
      .not("where", "is", null);

    if (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json(
        { error: "Failed to fetch location data" },
        { status: 500 }
      );
    }

    // Count frequency of each location with case-insensitive grouping
    // Keep the first observed casing as the display name
    const locationFrequency: Record<string, { displayName: string; count: number }> = {};
    
    posts?.forEach((post) => {
      const location = post.where?.trim();
      if (location) {
        const normalizedKey = location.toLowerCase();
        
        if (locationFrequency[normalizedKey]) {
          locationFrequency[normalizedKey].count += 1;
        } else {
          locationFrequency[normalizedKey] = {
            displayName: location,
            count: 1
          };
        }
      }
    });

    // Convert to array and sort by frequency (descending)
    const sortedLocations = Object.values(locationFrequency)
      .map(({ displayName, count }) => ({ location: displayName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Get top 10

    return NextResponse.json({ locations: sortedLocations });
  } catch (error) {
    console.error("Error in location stats API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
