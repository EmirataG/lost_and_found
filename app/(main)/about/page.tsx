"use client";

import Image from "next/image";
import yaleLogo from "@/public/images/yale_logo.png";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaShieldAlt,
  FaLightbulb,
} from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto flex max-w-4xl flex-col items-center p-8 py-12">
        {/* Logo */}
        <div className="mb-8 transform transition-transform hover:scale-105">
          <Image
            src={yaleLogo}
            alt="Yale logo"
            width={100}
            className="opacity-90 drop-shadow-lg"
          />
        </div>

        {/* Title */}
        <h1 className="bg-linear-to-r from-yaleBlue to-blue-600 bg-clip-text p-2 text-center text-5xl font-bold text-transparent">
          Lost @ Yale
        </h1>
        <p className="mb-10 text-center text-xl font-medium text-gray-600">
          Reuniting Yalies with their belongings
        </p>

        {/* Mission Statement Card */}
        <div className="mb-8 w-full transform rounded-3xl border-2 border-blue-100 bg-white p-8 shadow-xl transition-all hover:shadow-2xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-yaleBlue">
            Our Mission
          </h2>
          <p className="text-center text-lg leading-relaxed text-gray-700">
            <span className="font-semibold text-yaleBlue">Lost @ Yale</span> is
            a student-built platform designed to help the Yale community
            reconnect with misplaced items quickly and easily. No more digging
            through Fizz posts, pinning up flyers everywhere, or spamming
            GroupMe chats.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mb-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {/* How It Works - Lost Item */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-3">
                <FaLightbulb className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Lost Something?
              </h3>
            </div>
            <p className="leading-relaxed text-gray-700">
              Post about your lost item with photos and details. Browse recent
              finds and connect directly with finders through secure Yale
              accounts.
            </p>
          </div>

          {/* How It Works - Found Item */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3">
                <FaMapMarkerAlt className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Found Something?
              </h3>
            </div>
            <p className="leading-relaxed text-gray-700">
              If you find an item, please bring it to an{" "}
              <span className="font-semibold text-yaleBlue">
                official Yale desk
              </span>
              —such as library circulation desks, residential college offices,
              or security guard stations. Then post it here and{" "}
              <span className="font-semibold">
                mention in the description where you left it
              </span>{" "}
              so the owner knows exactly where to go!
            </p>
          </div>

          {/* Community */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-3">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                By Students, For Students
              </h3>
            </div>
            <p className="leading-relaxed text-gray-700">
              This is an independent tool made by and for Yale students. We
              believe in building tools that make campus life easier and bring
              our community together.
            </p>
          </div>

          {/* Responsible Use */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 p-3">
                <FaShieldAlt className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Use Responsibly
              </h3>
            </div>
            <p className="leading-relaxed text-gray-700">
              By using this app, you agree to contact people only for
              communicating about lost and found items. Let's keep our community
              safe and respectful.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="w-full rounded-2xl bg-linear-to-r from-blue-400 to-yaleBlue p-8 text-center text-white shadow-xl">
          <h2 className="mb-3 text-2xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg opacity-90">
            Join fellow Bulldogs in making lost and found simple and efficient!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
