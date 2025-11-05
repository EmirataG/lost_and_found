"use client";

const SideMenu = ({ openForm }: { openForm: () => void }) => {
  return (
    <div>
      <button onClick={openForm}>New Post</button>
    </div>
  );
};

export default SideMenu;
