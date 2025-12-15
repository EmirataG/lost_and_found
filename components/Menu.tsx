"use client";

import Link from "next/link";
import PostForm from "./post_form/PostFrom";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Menu = ({ userId, userName }: { userId: string; userName: string }) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  return (
    <>
      {formOpen ? (
        <PostForm
          userId={userId}
          closeForm={() => setFormOpen(false)}
        />
      ) : null}
      <div className="flex w-full flex-col gap-4 bg-linear-to-b from-yaleBlue to-blue-200 p-4 md:h-full md:w-auto md:gap-4 md:overflow-scroll">
        <h2 className="bg-linear-to-r from-white to-blue-200 bg-clip-text text-center text-2xl font-bold text-transparent">
          Lost @ Yale
        </h2>

        <div className="flex flex-row gap-4 overflow-x-auto md:flex-col md:overflow-x-visible">
          <button
            onClick={() => setFormOpen(true)}
            className="shrink-0 cursor-pointer rounded-xl bg-yaleBlue px-4 py-2.5 font-semibold whitespace-nowrap text-white shadow transition-all hover:bg-white hover:text-yaleBlue md:w-full"
          >
            + New Post
          </button>

          <div className="border-l border-white md:border-t md:border-l-0" />

          <MenuLink
            href="/"
            name="Home"
          />
          <MenuLink
            href="/my-posts"
            name="My Posts"
          />
          {/* <MenuLink
            href="/profile"
            name="Profile"
          /> */}
          <MenuLink
            href="/messages"
            name="Messages"
          />
          <MenuLink
            href="/about"
            name="About Lost @ Yale"
          />
        </div>
      </div>
    </>
  );
};

const MenuLink = ({ href, name }: { href: string; name: string }) => {
  const pathname = usePathname();
  const colors =
    pathname === href
      ? "bg-white hover:bg-gray-200 text-yaleBlue"
      : "bg-yaleBlue hover:bg-white text-white hover:text-yaleBlue";
  return (
    <Link
      href={href}
      className={`flex shrink-0 cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-center font-semibold whitespace-nowrap shadow transition-all md:w-full ${colors}`}
    >
      {name}
    </Link>
  );
};

export default Menu;
