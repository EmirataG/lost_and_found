import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import SuggestionsList from "./components/SuggestionsList";
import type { Suggestion } from "@/types";

const Page = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("suggestions")
    .select()
    .overrideTypes<Array<Suggestion>, { merge: false }>();

  return (
    <div className="p-4 min-h-screen bg-blue-100">
      <header className="text-center mb-4 p-4">
        <h2 className="text-2xl font-semibold">
          Thoughts on Next.js + Supabase + Tailwind?
        </h2>
        <p className="text-center">
          Also, let's meet this week and plan doing some work on the project
          over the break!
        </p>
      </header>
      <SuggestionsList suggestions={data ? data : []} />
    </div>
  );
};

export default Page;
