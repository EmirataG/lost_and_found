"use client";
import { useState } from "react";
import PostForm from "./PostFrom";
import SideMenu from "./SideMenu";

const MainScreen = ({ userId }: { userId: string }) => {
  const [postFormOpen, setPostFormOpen] = useState<boolean>(false);
  return (
    <>
      <SideMenu openForm={() => setPostFormOpen(true)} />
      {postFormOpen ? (
        <PostForm userId={userId} closeForm={() => setPostFormOpen(false)} />
      ) : null}
    </>
  );
};

export default MainScreen;
