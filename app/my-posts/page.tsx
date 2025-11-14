import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MainScreen from "@/components/main_screen/MainScreen";
import { getCurrentUser } from "@/utils/auth_utils";

const MyPostsPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>{`Hey ${user.user_metadata.name}`}</h1>
    </div>
  );
};

export default MyPostsPage;
