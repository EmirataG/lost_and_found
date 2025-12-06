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
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-yaleBlue">
          Welcome to the Lost & Found board!
        </h1>
        <h2 className="text-2xl font-medium text-gray-600">
          Let’s help each other out 💙
        </h2>
      </header>
      <MainScreen user={user} />
    </div>
  );
};

export default Page;
