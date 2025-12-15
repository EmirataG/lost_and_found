"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import PostCard from "@/components/post_card/PostCard";
import { createClient } from "@/utils/supabase/client";

// types
import { type PostData } from "@/types";
import { User } from "@supabase/supabase-js";

import YaleSpinner from "../YaleSpinner";
import { FaInfoCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

import PlaceAid from "./PlaceAid";

type TypeFilter = "all" | "lost" | "found";

const MainScreen = ({ user }: { user: User }) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true); // Start expanded

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [placeFilter, setPlaceFilter] = useState<string>("");

  const userId = user.id;

  // Helper function to parse post.when field (can be "2025-01-15" or "2025-01-15 → 2025-01-20")
  const parsePostWhen = (whenString: string) => {
    const parts = whenString.split(" → ");
    return {
      start: parts[0] || "",
      end: parts[1] || parts[0] || "", // If no end date, use start date
    };
  };

  // Clear all filters
  const clearFilters = () => {
    setTypeFilter("all");
    setTitleFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setPlaceFilter("");
  };

  let postsDisplayed = posts;

  if (typeFilter !== "all") {
    postsDisplayed = postsDisplayed.filter((post) => post.type === typeFilter);
  }
  if (titleFilter.trim()) {
    postsDisplayed = postsDisplayed.filter((post) =>
      post.title.toLowerCase().includes(titleFilter.trim().toLowerCase()),
    );
  }
  if (placeFilter) {
    postsDisplayed = postsDisplayed.filter(
      (post) =>
        typeof post.where === "string" &&
        post.where.toLowerCase().includes(placeFilter.toLowerCase()),
    );
  }

  // Date filtering - checks if post.when overlaps with filter date range
  if (startDateFilter || endDateFilter) {
    postsDisplayed = postsDisplayed.filter((post) => {
      if (!post.when) return false;

      const { start: postStart, end: postEnd } = parsePostWhen(post.when);
      const postStartDate = new Date(postStart);
      const postEndDate = new Date(postEnd);

      // If only start filter is set
      if (startDateFilter && !endDateFilter) {
        const filterDate = new Date(startDateFilter);
        // Post date range must include or be after the filter date
        return postEndDate >= filterDate;
      }

      // If only end filter is set
      if (!startDateFilter && endDateFilter) {
        const filterDate = new Date(endDateFilter);
        // Post date range must include or be before the filter date
        return postStartDate <= filterDate;
      }

      // Both filters set - check if date ranges overlap
      const filterStart = new Date(startDateFilter);
      const filterEnd = new Date(endDateFilter);
      // Ranges overlap if: post.start <= filter.end AND post.end >= filter.start
      return postStartDate <= filterEnd && postEndDate >= filterStart;
    });
  }

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      setLoading(true);

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(
          `
    *,
    user:user_id (name, email),
    photos:photos!photos_post_id_fkey (
      url
    )
  `,
        )
        .eq("resolved", false)
        .order("created_at", { ascending: false });

      if (postsError) {
        setLoading(false);
        return;
      }
      const formattedPosts = postsData.map((post) => ({
        ...post,
        photos: post.photos?.map((p: any) => p.url) || [],
      }));

      setPosts(formattedPosts);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6">
      <section className="mb-6 flex max-w-5xl flex-col items-center gap-2 rounded-xl border border-gray-300 bg-white p-4 shadow-lg">
        {/* Collapsible Filter Header */}
        <div className="mb-2 flex w-full items-center justify-between">
          <button
            onClick={clearFilters}
            className="flex w-20 items-center justify-center rounded-lg px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
            aria-label="Clear all filters"
          >
            <span className="font-medium">Clear</span>
          </button>
          <TypeFilterToggle
            filter={typeFilter}
            setFilter={setTypeFilter}
          />
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="flex w-20 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
            aria-label={filtersExpanded ? "Collapse filters" : "Expand filters"}
          >
            <span className="font-medium">Filters</span>
            {filtersExpanded ? (
              <FaChevronUp size={14} />
            ) : (
              <FaChevronDown size={14} />
            )}
          </button>
        </div>

        {/* Collapsible Filter Content */}
        <div
          className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
            filtersExpanded
              ? "max-h-[500px] p-2 opacity-100"
              : "max-h-0 p-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-stretch">
            {/* Title */}
            <div className="flex flex-1 flex-col">
              <label className="mb-1 font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                className="rounded-lg border border-gray-300 p-2 transition focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Range Section */}
            <div className="flex flex-1 flex-col">
              <div className="mb-1 flex items-center gap-2">
                <label className="font-medium text-gray-700">
                  When was the item lost / found?
                </label>
                <FaInfoCircle
                  className="cursor-pointer text-gray-500"
                  title="Filter posts by when the item was lost/found. Select a date range to find items lost/found within that period. Overlapping date ranges will be included."
                  size={14}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 p-2 transition focus:ring-2 focus:ring-blue-500"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 p-2 transition focus:ring-2 focus:ring-blue-500"
                  placeholder="End Date (optional)"
                />
              </div>
            </div>

            {/* Place */}
            <div className="flex flex-1 flex-col">
              <label className="mb-1 font-medium text-gray-700">Place</label>
              <PlaceAid
                prevValue={placeFilter}
                onSelect={(place) => {
                  setPlaceFilter(place);
                }}
              />
            </div>
          </div>
        </div>
      </section>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <YaleSpinner />
        </div>
      ) : postsDisplayed.length === 0 ? (
        <NoPostsFound />
      ) : (
        <div className="mx-auto w-full max-w-5xl flex-1 space-y-6">
          {postsDisplayed.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}
    </main>
  );
};

const TypeFilterToggle = ({
  filter,
  setFilter,
}: {
  filter: TypeFilter;
  setFilter: Dispatch<SetStateAction<TypeFilter>>;
}) => {
  return (
    <div className="flex w-84 rounded-xl bg-gray-300 duration-400">
      {(["all", "lost", "found"] as TypeFilter[]).map((type) => (
        <button
          key={type}
          className={`flex-1 rounded-xl py-1 transition-all duration-400 ${
            filter === type
              ? "yale-blue-bg text-white"
              : "text-black hover:bg-gray-400"
          }`}
          onClick={() => setFilter(type)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
};

const NoPostsFound = () => {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="mx-auto mb-4 size-32 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle
          cx="11"
          cy="11"
          r="8"
        />
        <line
          x1="21"
          y1="21"
          x2="16.65"
          y2="16.65"
        />
      </svg>

      <span className="text-center text-gray-400">No posts to see here...</span>
    </div>
  );
};

export default MainScreen;
