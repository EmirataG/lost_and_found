import { redirect } from "next/navigation";
import MainScreen from "@/components/main_screen/MainScreen";

import { getCurrentUser } from "@/utils/auth_utils";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <MainScreen user={user} />;
};

export default Page;
