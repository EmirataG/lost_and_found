import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth_utils";

import { fetchUserPosts } from "./actions";

import MyPostsBoard from "@/components/MyPostsBoard";

const MyPostsPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { posts, photos } = await fetchUserPosts(user.id);
  const firstName =
    user.user_metadata.name.split(" ")[0] ?? user.user_metadata.name;

  return (
    <div className="p-4 h-full flex flex-col">
      <MyPostsBoard posts={posts} photos={photos} />
    </div>
  );
};

export default MyPostsPage;
