"use client";
import { useState } from "react";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [when, setWhen] = useState("");
  const [where, setWhere] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("api/upload-post", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload faild");
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="p-4">
      <form
        className="flex flex-col gap-2 items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="border border-black"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="border border-black"
          name="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="border border-black"
          name="photo"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPhotos(e.target.files ? Array.from(e.target.files) : [])
          }
          multiple
        />
        <input
          className="border border-black"
          name="where"
          type="text"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          required
        />
        <input
          className="border border-black"
          name="when"
          type="text"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          required
        />
        <button className="bg-blue-400" type="submit">
          Upload
        </button>
      </form>
    </div>
  );
};

export default PostForm;
