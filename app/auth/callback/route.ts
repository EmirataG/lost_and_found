import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { id, email, user_metadata } = user;
        const name = user_metadata.name;
        const avatar_url = user_metadata.avatar_url;
        console.log("UPSERTING");
        const { error: upsertError } = await supabase.from("users").upsert(
          {
            id: id,
            name: name,
            email: email,
            avatat_url: avatar_url,
          },
          { onConflict: "id" }
        );

        if (upsertError) {
          console.error(`Error saving user! ${upsertError}`);
        }
      }
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
