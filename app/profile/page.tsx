import ProfileForm from "@/components/ProfileForm";

export const metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <main className="p-6">
      <ProfileForm />
    </main>
  );
}
