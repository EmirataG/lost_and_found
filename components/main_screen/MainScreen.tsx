"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import PostCard from "@/components/post_card/PostCard";
import { createClient } from "@/utils/supabase/client";

// types
import { type PostData } from "@/types";
import { User } from "@supabase/supabase-js";

import YaleSpinner from "../YaleSpinner";
import { FaInfoCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

import PlaceAid from "./PlaceAid"

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

  let postsDisplayed = posts;

  if (typeFilter !== "all") {
    postsDisplayed = postsDisplayed.filter((post) => post.type === typeFilter);
  }
  if (titleFilter) {
    postsDisplayed = postsDisplayed.filter((post) =>
      post.title.toLowerCase().includes(titleFilter.toLowerCase()),
    );
  }
  if (placeFilter) {
    postsDisplayed = postsDisplayed.filter((post) =>
      post.where.toLowerCase().includes(placeFilter.toLowerCase()),
    );
  }
  
  if (startDateFilter) {
    postsDisplayed = postsDisplayed.filter(
      (post) => new Date(post.created_at) >= new Date(startDateFilter),
    );
  }
  if (endDateFilter) {
    postsDisplayed = postsDisplayed.filter(
      (post) => new Date(post.created_at) <= new Date(endDateFilter),
    );
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

      console.log(JSON.stringify(postsData, null, 2));

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
    <>
      <main className="flex-1 overflow-y-auto">
        <section className="mx-auto mb-6 flex max-w-4xl flex-col items-center gap-2 rounded-xl border border-gray-300 bg-white p-4 shadow-lg">
          {/* Collapsible Filter Header */}
          <div className="mb-2 flex w-full items-center justify-between">
            <div className="w-20" />
            <TypeFilterToggle
              filter={typeFilter}
              setFilter={setTypeFilter}
            />
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="flex w-20 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
              aria-label={
                filtersExpanded ? "Collapse filters" : "Expand filters"
              }
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
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-stretch">
              {/* Title */}
              <div className="flex flex-1 flex-col">
                <label className="mb-1 font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  onChange={(e) => setTitleFilter(e.target.value.trim())}
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
                    title="If only one date is selected, an exact match is used. If both are given, it becomes a date range."
                    size={14}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 p-2 transition focus:ring-2 focus:ring-blue-500"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 p-2 transition focus:ring-2 focus:ring-blue-500"
                    placeholder="End Date (optional)"
                  />
                </div>
              </div>

              {/* Place */}
              <div className="flex flex-1 flex-col">
                <label className="mb-1 font-medium text-gray-700">Place</label>
                <input
                  type="text"
                  onChange={(e) => setPlaceFilter(e.target.value.trim())}
                  className="rounded-lg border border-gray-300 p-2 transition focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Place */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-gray-700">Place</label>
              <PlaceAid
                onSelect={(place, latLng) => {
                  setPlaceFilter(place);
                  // You could optionally store coords if you want
                  // setCoords(latLng);
                }}
              />
            </div>
          </div>
        </section>
        {loading ? (
          <div className="flex h-screen items-center justify-center">
            <YaleSpinner />
          </div>
        ) : postsDisplayed.length === 0 ? (
          <p>No lost items found.</p>
        ) : (
          <div className="mx-auto w-full max-w-5xl space-y-6 px-4">
            {postsDisplayed.map((post) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))}
          </div>
        )}
      </main>
    </>
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
    <div className="bg-gray-300 duration-400 rounded-xl flex w-84">
      {(["all", "lost", "found"] as TypeFilter[]).map((type) => (
        <button
          key={type}
          className={`transition-all duration-400 py-1 rounded-xl flex-1 ${
            filter === type ? "yale-blue-bg text-white" : "text-black hover:bg-gray-400"
          }`}
          onClick={() => setFilter(type)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default MainScreen;
