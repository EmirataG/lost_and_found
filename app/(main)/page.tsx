import { redirect } from "next/navigation";
import MainScreen from "@/components/main_screen/MainScreen";

import { getCurrentUser } from "@/utils/auth_utils";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <header className="text-center mb-6">
        <h1 className="text-3xl text-yaleBlue font-semibold">
          Welcome to the Lost & Found board!
        </h1>
        <h2 className="text-2xl text-gray-600 font-medium">
          Let’s help each other out 💙
        </h2>
      </header>
      <MainScreen user={user} />
    </div>
  );
};

export default Page;
