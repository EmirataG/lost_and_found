"use client";

import Link from "next/link";
import PostForm from "./post_form/PostFrom";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const Menu = ({ userId, userName }: { userId: string; userName: string }) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error(error);
        alert("Error signing out");
        return;
      }
      router.push("/");
    } catch (e) {
      console.error(e);
      alert("Error signing out");
    }
  };
  return (
    <>
      {formOpen ? (
        <PostForm userId={userId} closeForm={() => setFormOpen(false)} />
      ) : null}
      <div className="p-4 w-full overflow-scroll flex gap-4 bg-linear-to-r to-blue-200 from-yaleBlue md:h-full md:w-auto md:flex-col md:bg-linear-to-b">
        <h2 className="text-transparent text-2xl font-semibold ml-2 text-center bg-linear-to-r from-white to-blue-200 bg-clip-text">
          Lost @ <span className="font-bold">Yale</span>
        </h2>
        <button
          onClick={() => setFormOpen(true)}
          className="w-full py-2.5 px-4 bg-yaleBlue hover:bg-white hover:text-yaleBlue text-white font-semibold rounded-xl shadow transition-all cursor-pointer"
        >
          + New Post
        </button>

        <div className="border-l border-white md:border-l-0 md:border-t" />

        <MenuLink href="/" name="Home" />
        <MenuLink href="/my-posts" name="My Posts" />
        <MenuLink href="/profile" name="Profile" />
        <MenuLink href="/messages" name="Messages" />
        <MenuLink href="/about" name="About Lost @ Yale" />
        {userId ? (
          <button onClick={logout} className="w-full py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow transition-all cursor-pointer mt-4">
            Log out
          </button>
        ) : null}
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
      className={`flex justify-center items-center w-full py-2.5 px-4 font-semibold rounded-xl shadow transition-all text-center cursor-pointer ${colors}`}
    >
      {name}
    </Link>
  );
};

export default Menu;
