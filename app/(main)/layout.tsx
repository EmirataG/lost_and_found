import Menu from "@/components/Menu";

import { getCurrentUser } from "@/utils/auth_utils";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="flex h-screen flex-col bg-gray-100 md:flex-row">
      <Menu
        userId={user.id}
        userName={user.user_metadata.name}
      />
      <div className="bg flex flex-1 flex-col overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}
