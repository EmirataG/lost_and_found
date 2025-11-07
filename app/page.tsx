import { createClient } from "@/utils/supabase/server";
import PostForm from "./components/PostFrom";
import { redirect } from "next/navigation";
import MainScreen from "./components/MainScreen";

const Page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }
  const userData = user.user_metadata;
  console.log(userData);

  // return (
  //   <div className="p-4 min-h-screen bg-blue-100">
  //     <p className="text-center">Hello, {userData.name}</p>
  //     <PostForm userId={user.id} />
  //   </div>
  // );

  return <MainScreen userId={user.id} />;
};

export default Page;
