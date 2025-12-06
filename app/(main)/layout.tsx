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

  return <div className="min-h-screen">{children}</div>;
}
