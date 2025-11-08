"use client";
import { useState } from "react";
import { type PostType } from "@/types";
import { FaArrowAltCircleLeft } from "react-icons/fa";

import PostTypeToggle from "./PostTypeToggle";

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
  const [when, setWhen] = useState("");
  const [where, setWhere] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmShown, setIsConfirmShown] = useState<boolean>(false);

  function handleBack() {
    if (title != "" || description != "" || when != "" || where != "") {
      setIsConfirmShown(true);
    } else {
      closeForm();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
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
      setWhen("");
      setWhere("");
      setPhotos([]);
      closeForm();
      setIsLoading(false);
    }
  }

  return (
    <div className="absolute top-0 flex justify-center items-center h-screen w-screen backdrop-blur-sm bg-black/20">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 flex flex-col items-center gap-4"
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
          <div className="w-8" /> {/* placeholder to balance flex */}
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

          <label className="font-medium text-gray-700">
            Photos can help a lot!
          </label>
          <input
            name="photo"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setPhotos(e.target.files ? Array.from(e.target.files) : [])
            }
            className="w-full text-gray-700"
          />

          <label className="font-medium text-gray-700">
            {isLost ? "Where did you last see it?" : "Where did you find it?"}
          </label>
          <input
            name="where"
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          <label className="font-medium text-gray-700">
            {isLost ? "When did you last see it?" : "When did you find it?"}
          </label>
          <input
            name="when"
            type="text"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
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
