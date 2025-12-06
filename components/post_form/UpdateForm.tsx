"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadBox from "./ImageUploadBox";
import { PostData } from "@/types"; // your merged post type
import { FaArrowAltCircleLeft } from "react-icons/fa";

const UpdatePostForm = ({
  post,
  closeForm,
}: {
  post: PostData;
  closeForm: () => void;
}) => {
  const router = useRouter();

  // Parse existing when string (could be "2025-01-15" or "2025-01-15 → 2025-01-20")
  const parseWhen = (whenString: string) => {
    const parts = whenString.split(" → ");
    return {
      start: parts[0] || "",
      end: parts[1] || "",
    };
  };

  const { start: initialStartDate, end: initialEndDate } = parseWhen(post.when);

  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [where, setWhere] = useState(post.where);
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>(
    post.photos || [],
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("post_id", post.id);
      formData.delete("photo");

      // Build when string for API (same as PostForm)
      const whenString = endDate
        ? `${startDate} → ${endDate}`
        : startDate;
      formData.set("when", whenString);

      // Append new photos
      photos.forEach((photo) => {
        formData.append("photo", photo);
      });

      const deletedPhotos = post.photos.filter(
        (photo) => !existingPhotos.includes(photo),
      );

      deletedPhotos.forEach((photoUrl) => {
        formData.append("deleted_photo", photoUrl);
      });

      const res = await fetch("/api/update-post", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Trigger refetch of server component data
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      closeForm();
    }
  }

  return (
    <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/30 p-8 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col items-center gap-4 overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <FaArrowAltCircleLeft
            size={32}
            className="cursor-pointer text-blue-900 transition-transform hover:scale-110 active:scale-95"
            onClick={closeForm}
          />
          <h1 className="flex-1 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Update Post
          </h1>
          <div className="w-8" />
        </div>

        {/* Hidden Fields (Unchangeable) */}
        <input
          type="hidden"
          name="post_id"
          value={post.id}
          readOnly
        />
        <input
          type="hidden"
          name="type"
          value={post.type}
          readOnly
        />
        <input
          type="hidden"
          name="user_id"
          value={post.user_id}
          readOnly
        />

        {/* Form Inputs */}
        <div className="flex w-full flex-col gap-2">
          {/* Title */}
          <label className="font-medium text-gray-700">Title</label>
          <input
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 p-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Description */}
          <label className="font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="h-24 w-full resize-none rounded-lg border border-gray-300 p-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Photos */}
          <label className="font-medium text-gray-700">Photos</label>
          <ImageUploadBox
            photos={photos}
            setPhotos={setPhotos}
            existingPhotos={existingPhotos}
            setExistingPhotos={setExistingPhotos}
          />

          {/* Where */}
          <label className="font-medium text-gray-700">Where</label>
          <input
            name="where"
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 p-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* When */}
          <label className="font-medium text-gray-700">When</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="start_date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <input
              type="date"
              name="end_date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <p className="text-xs text-gray-500">
            End date is optional. Leave blank if exact day is known.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-yaleBlue px-4 py-2 text-lg font-semibold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePostForm;
