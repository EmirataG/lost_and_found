"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;
      // Try to load from users table; if not present, populate from auth user
      const { data, error } = await supabase
        .from("users")
        .select("id,name,email,phone,bio,avatar_url")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setName(data.name || "");
        setEmail(data.email || user.email || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
      } else {
        // no row in users table — fall back to auth data
        setName(user.user_metadata?.name || "");
        setEmail(user.email || "");
        setPhone("");
        setBio("");
        setAvatarUrl(user.user_metadata?.avatar_url || "");
      }
    }
    load();
  }, []);

  const uploadAvatar = async (file?: File) => {
    if (!file) return null;
    const fileName = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;
    const path = `avatars/${fileName}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });
    if (error) {
      console.error(error);
      return null;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e && typeof (e as any).preventDefault === "function") (e as any).preventDefault();
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not authenticated");

      // Upsert to ensure a row exists in `users` table for this user
      const { data: upserted, error } = await supabase
        .from("users")
        .upsert(
          {
            id: user.id,
            name: name || null,
            email: user.email || email || null,
            phone: phone || null,
            bio: bio || null,
            avatar_url: avatarUrl || null,
          },
          { returning: "representation" }
        )
        .select()
        .single();

      if (error) throw error;

      // update local state with canonical values
      setName(upserted.name || "");
      setEmail(upserted.email || user.email || "");
      setPhone(upserted.phone || "");
      setBio(upserted.bio || "");
      setAvatarUrl(upserted.avatar_url || "");

      setEditing(false);
      alert("Profile updated");
    } catch (err: any) {
      console.error("Profile save error:", err);
      // Show more helpful error details to the user
      const msg = err?.message || (typeof err === "object" ? JSON.stringify(err) : String(err)) || "Failed to update profile";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setLoading(true);
    const url = await uploadAvatar(file);
    if (url) setAvatarUrl(url);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">{editing ? "Edit Profile" : "Profile"}</h2>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Name</label>
        <div>
          {editing ? (
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
          ) : (
            <div className="p-2">{name || "—"}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Email</label>
        <div className="p-2 bg-gray-50 rounded">{email || "—"}</div>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Phone</label>
        <div>
          {editing ? (
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded" />
          ) : (
            <div className="p-2">{phone || "—"}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Bio</label>
        <div>
          {editing ? (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 border rounded h-32" />
          ) : (
            <div className="p-2">{bio || "—"}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Avatar</label>
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200" />
          )}
          {editing && <input type="file" accept="image/*" onChange={onFileChange} />}
        </div>
      </div>

      <div className="flex gap-2">
        {editing ? (
          <>
            <button disabled={loading} onClick={onSubmit} className="px-4 py-2 bg-yaleBlue text-white rounded">
              {loading ? "Saving..." : "Save"}
            </button>
            <button disabled={loading} onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="px-4 py-2 bg-yaleBlue text-white rounded">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
