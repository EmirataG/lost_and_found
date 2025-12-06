import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Menu from "@/components/Menu";
import { getCurrentUser } from "@/utils/auth_utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lost @ Yale",
  description: "Lost and found app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen bg-gray-100">
          <aside className="hidden md:block md:w-64">
            <Menu userId={user?.id || ""} userName={(user as any)?.user_metadata?.name || user?.name || ""} />
          </aside>

          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
