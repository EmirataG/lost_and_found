import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth_utils";

import { fetchUserPosts } from "./actions";

import MyPostsBoard from "@/components/MyPostsBoard";

const MyPostsPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const posts = await fetchUserPosts(user.id);
  const firstName =
    user.user_metadata.name.split(" ")[0] ?? user.user_metadata.name;

  return (
    <div className="flex h-full flex-col">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-yaleBlue">
          Hey, {firstName}!
        </h1>
        <h2 className="text-2xl font-medium text-gray-600">
          You can find your posts here 🐶
        </h2>
      </header>
      <MyPostsBoard posts={posts} />
    </div>
  );
};

export default MyPostsPage;
