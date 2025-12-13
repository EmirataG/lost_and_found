import ConversationView from "@/components/ConversationView";

type Props = {
  params: { id: string };
};

export default function ConversationPage({ params }: Props) {
  return (
    <main className="p-6">
      <ConversationView conversationId={params.id} />
    </main>
  );
}
