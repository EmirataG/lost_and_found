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
    <div className="flex flex-col h-screen md:flex-row">
      <Menu userId={user.id} userName={user.user_metadata.name} />
      <main className="flex-1 overflow-scroll">{children}</main>
    </div>
  );
}
