"use client";
import { useState } from "react";

const PostForm = ({ userId }: { userId: string }) => {
  const [postType, setPostType] = useState<"lost" | "found">("lost");
  const isLost = postType === "lost";

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
    } finally {
      setTitle("");
      setDescription("");
      setWhen("");
      setWhere("");
      setPhotos([]);
    }
  }

  return (
    <div className="flex justify-center">
      <form
        className="flex flex-col p-4 items-center bg-white rounded-md shadow-md w-3xl"
        onSubmit={handleSubmit}
      >
        <input name="type" value={postType} hidden readOnly />
        <input name="user_id" value={userId} hidden readOnly />
        <div className="flex flex-col gap-2 items-stretch w-full pb-6">
          <label htmlFor="title">
            {isLost ? "What did you lose?" : "What did you find"}
          </label>
          <input
            className="border border-black"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="description">Describe it as best as you can.</label>
          <textarea
            className="border border-black"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label htmlFor="photo">Photos can help a lot!</label>
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
          <label htmlFor="where">
            {isLost
              ? "Where do you recall last seeing it?"
              : "Where did you find it?"}
          </label>
          <input
            className="border border-black"
            name="where"
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            required
          />
          <label htmlFor="when">
            {isLost
              ? "When do you recall last seeing it?"
              : "When did you find it"}
          </label>
          <input
            className="border border-black"
            name="when"
            type="text"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            required
          />
        </div>
        <button className="bg-blue-400 py-2 px-4 rounded-md" type="submit">
          Upload
        </button>
      </form>
    </div>
  );
};

export default PostForm;
