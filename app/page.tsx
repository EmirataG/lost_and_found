import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MainScreen from "@/components/MainScreen";

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

  return <MainScreen userId={user.id} />;
};

export default Page;
