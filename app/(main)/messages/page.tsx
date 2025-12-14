import MessagesLayout from "@/components/MessagesLayout";

export const metadata = {
  title: "Messages",
};

export default function MessagesPage() {
  return (
    <main className="h-full overflow-hidden">
      <MessagesLayout />
    </main>
  );
}
