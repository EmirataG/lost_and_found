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

  return <MainScreen user={user} />;
};

export default Page;
