import { signInWithGoogle } from "./actions";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <form
        action={signInWithGoogle}
        className="rounded-md shadow-md p-4 flex flex-col gap-2 items-center"
      >
        <p className="text-xl text-center">Your keys could be here...</p>
        <button type="submit" className="p-2 rounded-md bg-blue-600 text-white">
          Continue with CAS
        </button>
      </form>
    </div>
  );
}
