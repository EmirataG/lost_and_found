"use client";

import { useState } from "react";
import { FaArrowAltCircleLeft, FaTrash } from "react-icons/fa";
import ImageUploadBox from "./ImageUploadBox";
import Image from "next/image";

interface UpdatePostFormProps {
  post: {
    id: string;
    type: string;
    title: string;
    description: string;
    when: string;
    where: string;
    photos: { id: string; url: string }[];
  };
  closeForm: () => void;
}

const UpdatePostForm = ({ post, closeForm }: UpdatePostFormProps) => {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [when, setWhen] = useState(post.when);
  const [where, setWhere] = useState(post.where);
  const [newPhotos, setNewPhotos] = useState<File[]>([]); // new uploads
  const [removePhotos, setRemovePhotos] = useState<string[]>([]); // URLs to delete
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("post_id", post.id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("when", when);
      formData.append("where", where);

      // remove old photos if clicked
      removePhotos.forEach((url) => formData.append("remove_photos", url));

      // add new photos
      newPhotos.forEach((photo) => formData.append("photo", photo));

      const res = await fetch("/api/update-post", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      closeForm();
    }
  }

  return (
    <div className="fixed inset-0 p-8 flex justify-center items-center h-screen w-screen backdrop-blur-sm bg-black/20 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex-1 rounded-2xl shadow-2xl w-full max-w-2xl p-8 flex flex-col items-center gap-4 overflow-y-auto max-h-[calc(100vh-2rem)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <FaArrowAltCircleLeft
            size={32}
            onClick={closeForm}
            className="text-blue-900 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center flex-1">
            Update Post
          </h1>
          <div className="w-8" />
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium">Title</label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-3 rounded-lg w-full"
            required
          />

          <label className="font-medium">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-3 rounded-lg w-full h-24 resize-none"
            required
          />

          <label className="font-medium">Existing Photos</label>
          <div className="grid grid-cols-3 gap-2">
            {post.photos.map((photo, index) => (
              <div key={photo.id} className="relative">
                <Image
                  src={photo.url}
                  alt="existing"
                  width={200}
                  height={200}
                  className="rounded-md object-cover h-24 w-full"
                />
                <FaTrash
                  size={18}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full cursor-pointer"
                  onClick={() =>
                    setRemovePhotos((prev) => [...prev, photo.url])
                  }
                />
              </div>
            ))}
          </div>

          <label className="font-medium mt-2">Add New Photos</label>
          <ImageUploadBox photos={newPhotos} setPhotos={setNewPhotos} />

          <label className="font-medium">Where</label>
          <input
            name="where"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            className="border p-3 rounded-lg w-full"
            required
          />

          <label className="font-medium">When</label>
          <input
            name="when"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="border p-3 rounded-lg w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-yaleBlue text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 active:scale-95 transition disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePostForm;
