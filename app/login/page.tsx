import { signInWithGoogle } from "./actions";
import WelcomeHero from "@/components/WelcomeHero";

export default function LoginPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-linear-to-b from-yaleBlue to-blue-200 text-white">
      <WelcomeHero />
      <form
        action={signInWithGoogle}
        className="m-6 flex flex-col items-center gap-6"
      >
        <button
          type="submit"
          className="w-64 rounded-xl bg-yaleBlue py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-500 hover:shadow-xl"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
