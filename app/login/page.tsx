import { signInWithGoogle } from "./actions";
import WelcomeHero from "@/components/WelcomeHero";

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-linear-to-b from-yaleBlue to-blue-200 text-white">
      <WelcomeHero />
      <form
        action={signInWithGoogle}
        className="m-6 flex flex-col gap-6 items-center"
      >
        <button
          type="submit"
          className="w-64 py-4 bg-yaleBlue text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-500 hover:shadow-xl transition-all"
        >
          Continue with CAS
        </button>
      </form>
    </div>
  );
}
