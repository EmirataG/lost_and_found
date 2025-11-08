"use client";

const SideMenu = ({ openForm }: { openForm: () => void }) => {
  return (
    <aside className="w-64 bg-linear-to-b from-yaleBlue to-blue-400 text-white p-6 flex flex-col items-start space-y-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <button
        onClick={() => openForm()}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
      >
        New Post
      </button>
      <button
        onClick={() => console.log("Show your posts")}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
      >
        Your Posts
      </button>
    </aside>
  );
};

export default SideMenu;
