"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import PostCard from "@/components/post_card/PostCard";
import { createClient } from "@/utils/supabase/client";

// types
import { type PostData } from "@/types";
import { User } from "@supabase/supabase-js";

import YaleSpinner from "../YaleSpinner";
import { FaInfoCircle } from "react-icons/fa";

type TypeFilter = "all" | "lost" | "found";

const MainScreen = ({ user }: { user: User }) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);

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
      post.title.toLowerCase().includes(titleFilter.toLowerCase())
    );
  }
  if (placeFilter) {
    postsDisplayed = postsDisplayed.filter((post) =>
      post.where.toLowerCase().includes(placeFilter.toLowerCase())
    );
  }
  if (startDateFilter) {
    postsDisplayed = postsDisplayed.filter(
      (post) => new Date(post.created_at) >= new Date(startDateFilter)
    );
  }
  if (endDateFilter) {
    postsDisplayed = postsDisplayed.filter(
      (post) => new Date(post.created_at) <= new Date(endDateFilter)
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
  `
        )
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
        <section className="bg-white p-4 rounded-xl max-w-4xl mx-auto shadow-lg border border-gray-300 flex flex-col items-center gap-2 mb-6">
          <TypeFilterToggle filter={typeFilter} setFilter={setTypeFilter} />

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Title */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-gray-700">Title</label>
              <input
                type="text"
                onChange={(e) => setTitleFilter(e.target.value.trim())}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Date Range Section */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <label className="font-medium text-gray-700">
                  When was the item lost / found?
                </label>
                <FaInfoCircle
                  className="text-gray-500 cursor-pointer"
                  title="If only one date is selected, an exact match is used. If both are given, it becomes a date range."
                  size={14}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="End Date (optional)"
                />
              </div>
            </div>

            {/* Place */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-gray-700">Place</label>
              <input
                type="text"
                onChange={(e) => setPlaceFilter(e.target.value.trim())}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
        </section>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <YaleSpinner />
          </div>
        ) : postsDisplayed.length === 0 ? (
          <p>No lost items found.</p>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {postsDisplayed.map((post) => (
              <PostCard key={post.id} post={post} />
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
      <button
        className={`transition-all duration-400 py-1 rounded-xl flex-1 ${
          filter === "all"
            ? "yale-blue-bg text-white"
            : "text-black hover:bg-gray-400"
        }`}
        onClick={() => {
          if (filter != "all") {
            setFilter("all");
          }
        }}
      >
        All
      </button>
      <button
        className={`transition-all py-1 rounded-xl flex-1 ${
          filter === "lost"
            ? "yale-blue-bg text-white"
            : "text-black hover:bg-gray-400"
        }`}
        onClick={() => {
          if (filter != "lost") {
            setFilter("lost");
          }
        }}
      >
        Lost
      </button>
      <button
        className={`transition-all duration-400 py-1 rounded-xl flex-1 ${
          filter === "found"
            ? "yale-blue-bg text-white"
            : "text-black hover:bg-gray-400"
        }`}
        onClick={() => {
          if (filter != "found") {
            setFilter("found");
          }
        }}
      >
        Found
      </button>
    </div>
  );
};

export default MainScreen;
