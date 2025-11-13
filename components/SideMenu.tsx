"use client";

import { AiOutlineMenuFold } from "react-icons/ai";

type Props = {
  openForm: () => void;
  closeMenu: () => void;
  menuShown: boolean;
};

const SideMenu = ({ openForm, closeMenu, menuShown }: Props) => {
  return (
    <div
      className={`h-full shadow-lg flex flex-col items-start transition-all duration-300 ease-in-out
        bg-linear-to-b from-yaleBlue to-blue-200 ${
          menuShown ? "w-64 p-4" : "w-0 p-0"
        }       
      md:w-64 md:p-4
      md:z-0
      fixed top-0 left-0 z-40 md:static`}
    >
      {/* Expanded Content */}
      {menuShown && (
        <>
          <div className="flex justify-between items-center text-white w-full mb-4">
            <h2 className="text-lg font-bold ml-2">Menu</h2>
            <AiOutlineMenuFold
              size={28}
              className="md:invisible hover:scale-105 active:scale-95 transition-all duration-400"
              onClick={closeMenu}
            />
          </div>
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
