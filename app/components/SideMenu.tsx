"use client";

import { useState } from "react";

type Props = {
  openForm: () => void;
};

const SideMenu = ({ openForm }: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`fixed left-0 top-0 h-full shadow-lg flex flex-col items-start transition-all duration-300 ease-in-out z-20
        ${collapsed ? "w-0 p-2" : "w-64 p-5"} bg-gray-800`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-2 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-gray-700 transition-all z-30 text-sm"
        aria-label="Toggle sidebar"
      >
        {collapsed ? "›" : "‹"}
      </button>

      {/* Expanded Content */}
      {!collapsed && (
        <>
          <h2 className="text-lg font-bold text-white mb-5 ml-2">Menu</h2>

          <div className="flex flex-col w-full space-y-3">
            <button
              onClick={openForm}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow transition-all"
            >
              + New Post
            </button>

            <button
              onClick={() => console.log("TODO: show user posts")}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow transition-all"
            >
              Your Posts
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SideMenu;
