import { signInWithGoogle } from "./actions";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        action={signInWithGoogle}
        className="rounded-2xl shadow-xl p-8 flex flex-col gap-6 items-center bg-white"
      >
        <p className="text-2xl font-semibold text-gray-800 text-center">
          Your keys could be here...
        </p>
        <button
          type="submit"
          className="w-64 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-500 hover:shadow-xl transition-all"
        >
          Continue with CAS
        </button>
      </form>
    </div>
  );
}
