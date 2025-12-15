'use client'

import { createClient } from "@/utils/supabase/client";
import WelcomeHero from "@/components/WelcomeHero";

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-linear-to-b from-yaleBlue to-blue-200 text-white">
      <WelcomeHero />
      <div className="m-6 flex flex-col items-center gap-6">
        <button
          onClick={handleGoogleSignIn}
          className="w-64 rounded-xl bg-yaleBlue py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-500 hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
