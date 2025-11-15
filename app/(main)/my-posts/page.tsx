import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth_utils";

import { fetchUserPosts } from "./actions";

import PostCard from "@/components/post_card/PostCard";
import MyPostsBoard from "@/components/MyPostsBoard";

const MyPostsPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { posts, photos } = await fetchUserPosts(user.id);

  return (
    <div>
      <h1>{`Hey ${user.user_metadata.name}`}</h1>
      <MyPostsBoard posts={posts} photos={photos} />
    </div>
  );
};

export default MyPostsPage;
