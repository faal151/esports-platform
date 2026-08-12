"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

export default function RegisterPlayerPage() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanUsername = username.trim().toLowerCase();
    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || !cleanFullName || !cleanEmail) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (cleanUsername.length < 3) {
      setError("Username minimal 3 karakter.");
      return;
    }

    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      setError(
        "Username hanya boleh menggunakan huruf kecil, angka, dan underscore."
      );
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          username: cleanUsername,
          full_name: cleanFullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Registrasi gagal. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    if (!data.session) {
      setSuccess(
        "Registrasi berhasil. Silakan cek email kamu untuk melakukan verifikasi."
      );
      setLoading(false);
      return;
    }

    setSuccess("Registrasi berhasil. Mengarahkan ke halaman player...");

    setTimeout(() => {
      router.push("/players");
      router.refresh();
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[150px]" />

          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-red-950/20 blur-[140px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-5 py-24 sm:px-8">
          <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 shadow-2xl shadow-black/40 lg:grid-cols-[0.9fr_1.1fr]">
            {/* LEFT */}
            <div className="relative hidden min-h-[680px] overflow-hidden border-r border-white/10 bg-[#080808] lg:flex lg:flex-col lg:justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,30,30,0.18),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(255,30,30,0.08),transparent_40%)]" />

              <div className="relative z-10 p-10">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
                  Join the community
                </p>

                <h1 className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-tight">
                  Build Your
                  <span className="block text-red-500">Legacy.</span>
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
                  Buat akun player dan mulai bangun perjalanan esports kamu
                  bersama PINTO ESPORTS.
                </p>
              </div>

              <div className="relative z-10 p-10">
                <div className="border-l-2 border-red-500 pl-5">
                  <p className="text-sm font-semibold text-white">
                    Your esports.
                  </p>
                  <p className="text-sm font-semibold text-red-500">
                    Your legacy.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
              <div className="w-full max-w-lg">
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
                    Player Registration
                  </p>

                  <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                    Create Account
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Daftar sebagai player untuk mulai membangun profil esports
                    kamu.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                    {success}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                  {/* USERNAME */}
                  <div>
                    <label
                      htmlFor="username"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300"
                    >
                      Username
                    </label>

                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="contoh: pinto_player"
                      autoComplete="username"
                      disabled={loading}
                      className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:bg-white/[0.05]"
                    />
                  </div>

                  {/* FULL NAME */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300"
                    >
                      Full Name
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama lengkap"
                      autoComplete="name"
                      disabled={loading}
                      className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:bg-white/[0.05]"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:bg-white/[0.05]"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      autoComplete="new-password"
                      disabled={loading}
                      className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:bg-white/[0.05]"
                    />
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300"
                    >
                      Confirm Password
                    </label>

                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      autoComplete="new-password"
                      disabled={loading}
                      className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:bg-white/[0.05]"
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Creating Account..." : "Create Player Account"}
                  </button>
                </form>

                <div className="mt-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs uppercase tracking-wider text-gray-600">
                    Already registered?
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <Link
                  href="/login"
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-sm font-bold uppercase tracking-wide text-white transition hover:border-red-500 hover:text-red-500"
                >
                  Login
                </Link>

                <p className="mt-6 text-center text-xs leading-5 text-gray-600">
                  Dengan membuat akun, kamu setuju untuk menggunakan platform
                  PINTO ESPORTS secara bertanggung jawab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}