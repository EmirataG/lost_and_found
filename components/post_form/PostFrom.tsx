"use client";
import { useState } from "react";
import { type PostType } from "@/types";
import { FaArrowAltCircleLeft } from "react-icons/fa";

import PostTypeToggle from "./PostTypeToggle";
import ImageUploadBox from "./ImageUploadBox";

import PlaceAid from "../main_screen/PlaceAid";

const PostForm = ({
  userId,
  closeForm,
}: {
  userId: string;
  closeForm: () => void;
}) => {
  const [postType, setPostType] = useState<PostType>("lost");
  const isLost = postType === "lost";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Track place and coordinates
  const [where, setWhere] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [photos, setPhotos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Replace photo input to avoid duplicates
      formData.delete("photo");
      photos.forEach((photo) => formData.append("photo", photo));

      // Append date string
      const whenString = endDate ? `${startDate} → ${endDate}` : startDate;
      formData.append("when", whenString);
      formData.append("where", where);
      
      // Append coordinates if available
      if (coords) {
        formData.append("lat", coords.lat.toString());
        formData.append("lng", coords.lng.toString());
      }

      const response = await fetch("/api/upload-post", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
    } catch (error: any) {
      console.error(error);
    } finally {
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setWhere("");
      setCoords(null);
      setPhotos([]);
      closeForm();
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed top-0 p-8 flex justify-center items-center h-screen w-screen backdrop-blur-sm bg-black/20 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex-1 rounded-2xl shadow-2xl w-full max-w-2xl p-8 flex flex-col items-center gap-4 overflow-y-auto max-h-[calc(100vh-2rem)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <FaArrowAltCircleLeft
            size={32}
            className="text-blue-900 cursor-pointer transition-transform hover:scale-110 active:scale-95"
            onClick={closeForm}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center flex-1">
            {isLost ? "Report a Lost Item" : "Report a Found Item"}
          </h1>
          <div className="w-8" />
        </div>

        {/* Post Type Toggle */}
        <PostTypeToggle isLost={isLost} changePostType={setPostType} />

        {/* Form Inputs */}
        <div className="flex flex-col gap-2 w-full">
          <input name="type" value={postType} type="hidden" readOnly />
          <input name="user_id" value={userId} type="hidden" readOnly />

          <label className="font-medium text-gray-700">
            {isLost ? "What did you lose?" : "What did you find?"}
          </label>
          <input
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          <label className="font-medium text-gray-700">
            Describe it as best as you can
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          <label className="font-medium text-gray-700">Photos can help a lot!</label>
          <ImageUploadBox photos={photos} setPhotos={setPhotos} />

          <label className="font-medium text-gray-700">
            {isLost ? "Where did you last see it?" : "Where did you find it?"}
          </label>

          {/* Google Places input */}
          <PlaceAid
            onSelect={(place, latLng) => {
              setWhere(place);
              if (latLng) setCoords(latLng);
            }}
          />

          <label className="font-medium text-gray-700">
            {isLost ? "When did you last see it?" : "When did you find it?"}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="start_date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <input
              type="date"
              name="end_date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
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
          className="bg-yaleBlue px-4 py-2 text-white rounded-xl font-semibold text-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
