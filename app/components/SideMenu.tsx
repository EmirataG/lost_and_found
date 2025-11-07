"use client";

const SideMenu = ({ openForm }: { openForm: () => void }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Menu</h2>
      <button
        onClick={openForm}
        className="w-full py-3 px-4 bg-blue-900 text-white font-semibold rounded-xl shadow hover:bg-blue-800 transition-colors active:scale-95"
      >
        + New Post
      </button>
    </div>
  );
};

export default SideMenu;
