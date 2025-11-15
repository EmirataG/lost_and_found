"use client";

import Image from "next/image";
import yaleLogo from "@/public/images/yale_logo.png";
import SideMenu from "@/components/main_screen/SideMenu";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const AboutPage = () => {
  const [menuShown, setMenuShown] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserName(data.user.user_metadata.name || "");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto p-6 flex flex-col items-center">
          {/* Logo */}
          <Image
            src={yaleLogo}
            alt="Yale logo"
            width={90}
            className="opacity-80 mb-6"
          />

          {/* Title */}
          <h1 className="text-3xl font-semibold text-center">
            Lost @ <span className="text-yaleBlue font-bold">Yale</span>
          </h1>

          {/* Centered box */}
          <div className="w-full bg-white/70 backdrop-blur-sm shadow-md rounded-2xl p-8 text-center space-y-4 border border-gray-200">
            <p className="text-lg text-gray-700 leading-relaxed">
              <span className="font-semibold">Lost @ Yale</span> is a student
              built lost and found platform designed to help the Yale community
              reconnect with misplaced items quickly and easily.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Students can post lost items, upload photos, browse recent finds,
              and contact each other securely through Yale accounts.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              This project is an independent tool made by and for Yale students.
              No more digging through Fizz posts, pinning up flyers everywhere,
              or spamming GroupMe chats.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Please use this app responsibly. By using this app you are
              agreeing to contact people only under the basis of communicating
              about lost items.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
