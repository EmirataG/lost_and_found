import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import SuggestionsList from "./components/SuggestionsList";
import type { Suggestion } from "@/types";

import PostForm from "./components/PostFrom";

const Page = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  return (
    <div className="p-4 min-h-screen bg-blue-100">
      <PostForm />
    </div>
  );
};

export default Page;
