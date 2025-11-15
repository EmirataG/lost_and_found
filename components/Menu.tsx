"use client";

import Link from "next/link";
import PostForm from "./post_form/PostFrom";
import { useState } from "react";

const Menu = ({ userId, userName }: { userId: string; userName: string }) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const firstName =
    userName && userName !== "About" ? userName.split(" ")[0] : "there";
  return (
    <>
      {formOpen ? (
        <PostForm userId={userId} closeForm={() => setFormOpen(false)} />
      ) : null}
      <div className="p-4 w-full flex gap-4 bg-linear-to-r from-yaleBlue to-blue-200 md:h-full md:w-auto md:flex-col md:bg-linear-to-b">
        <h2 className="text-white text-lg font-bold ml-2 hidden md:block">{`Hey, ${firstName}`}</h2>
        <button
          onClick={() => setFormOpen(true)}
          className="w-full py-2.5 px-4 bg-gray-300 hover:bg-gray-200 text-yaleBlue font-semibold rounded-xl shadow transition-all cursor-pointer"
        >
          + New Post
        </button>

        <Link
          href="/"
          className="w-full py-2.5 px-4 bg-yaleBlue hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition-all text-center cursor-pointer"
        >
          Home
        </Link>

        <Link
          href="/my-posts"
          className="w-full py-2.5 px-4 bg-yaleBlue hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition-all text-center cursor-pointer"
        >
          Your Posts
        </Link>

        <Link
          href="/about"
          className="w-full py-2.5 px-4 bg-yaleBlue hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition-all text-center cursor-pointer"
        >
          About Lost @ Yale
        </Link>
      </div>
    </>
  );
};

export default Menu;
