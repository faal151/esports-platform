"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  bio: string | null;
};

export default function PlayerProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, username, full_name, avatar_url, role, bio"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile loading error:", profileError);
        setError("Profil gagal dimuat.");
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Data profil tidak ditemukan.");
        setLoading(false);
        return;
      }

      setProfile(data);
      setUsername(data.username ?? "");
      setFullName(data.full_name ?? "");
      setBio(data.bio ?? "");
      setAvatarUrl(data.avatar_url ?? "");

      setLoading(false);
    }

    loadProfile();
  }, [router, supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const cleanUsername = username.trim();
    const cleanFullName = fullName.trim();
    const cleanBio = bio.trim();
    const cleanAvatarUrl = avatarUrl.trim();

    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({
        username: cleanUsername || null,
        full_name: cleanFullName || null,
        bio: cleanBio || null,
        avatar_url: cleanAvatarUrl || null,
      })
      .eq("id", userId)
      .select(
        "id, username, full_name, avatar_url, role, bio"
      )
      .single();

    if (updateError) {
      console.error("Profile update error:", updateError);
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setProfile(data);
    setUsername(data.username ?? "");
    setFullName(data.full_name ?? "");
    setBio(data.bio ?? "");
    setAvatarUrl(data.avatar_url ?? "");

    setMessage("Profile berhasil diperbarui.");
    setSaving(false);

    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-red-500" />

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
              Loading Profile
            </p>
          </div>
        </div>
      </main>
    );
  }

  const displayName =
    fullName ||
    username ||
    email.split("@")[0] ||
    "Player";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[140px]" />

        <div className="absolute right-0 top-[40%] h-[400px] w-[400px] rounded-full bg-red-900/5 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/player"
              className="text-xs font-black uppercase tracking-[0.25em] text-gray-600 transition hover:text-red-500"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-red-500">
              Player Account
            </p>

            <h1 className="mt-2 text-4xl font-black uppercase tracking-tight md:text-5xl">
              My Profile
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Kelola informasi publik dan identitas esports kamu.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
              Account Role
            </p>

            <p className="mt-1 text-sm font-black uppercase text-red-500">
              {profile?.role || "player"}
            </p>
          </div>
        </div>

        {/* Profile */}
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Identity Card */}
            <aside className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                Identity
              </p>

              <div className="mt-6 flex flex-col items-center text-center">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-black text-red-500">
                      {initial}
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-xl font-black uppercase">
                  {displayName}
                </h2>

                <p className="mt-1 text-xs text-gray-600">
                  {username ? `@${username}` : "No username"}
                </p>

                <div className="mt-5 w-full border-t border-white/10 pt-5 text-left">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Email
                  </p>

                  <p className="mt-2 break-all text-sm text-gray-400">
                    {email}
                  </p>
                </div>

                <div className="mt-5 w-full border-t border-white/10 pt-5 text-left">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Role
                  </p>

                  <p className="mt-2 text-sm font-black uppercase text-red-500">
                    {profile?.role || "player"}
                  </p>
                </div>
              </div>
            </aside>

            {/* Form */}
            <section className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                  Personal Information
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase">
                  Profile Details
                </h2>
              </div>

              <div className="mt-8 space-y-6">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    placeholder="your_username"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                  />

                  <p className="mt-2 text-[10px] text-gray-600">
                    Username akan digunakan sebagai identitas publik kamu.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Nama lengkap"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>

                {/* Avatar URL */}
                <div>
                  <label
                    htmlFor="avatarUrl"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                  >
                    Avatar URL
                  </label>

                  <input
                    id="avatarUrl"
                    type="url"
                    value={avatarUrl}
                    onChange={(event) =>
                      setAvatarUrl(event.target.value)
                    }
                    placeholder="https://..."
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                  />

                  <p className="mt-2 text-[10px] text-gray-600">
                    Untuk tahap awal gunakan URL gambar. Upload avatar
                    langsung akan kita buat menggunakan Supabase Storage.
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label
                    htmlFor="bio"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                  >
                    Bio
                  </label>

                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(event) =>
                      setBio(event.target.value)
                    }
                    placeholder="Ceritakan sedikit tentang perjalanan esports kamu..."
                    rows={6}
                    maxLength={300}
                    className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-[#050505] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-gray-700 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                  />

                  <p className="mt-2 text-right text-[10px] text-gray-600">
                    {bio.length}/300
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="mt-2 w-full cursor-not-allowed rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3.5 text-sm text-gray-600"
                  />

                  <p className="mt-2 text-[10px] text-gray-600">
                    Email akun dikelola oleh authentication system.
                  </p>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-semibold text-red-400">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-6 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-xs font-semibold text-green-400">
                  {message}
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/player"
                  className="rounded-lg border border-white/10 px-6 py-3 text-center text-xs font-black uppercase tracking-wide text-gray-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-red-600 px-7 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}