"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

    if (loginError) {
  console.error("Supabase login error:", loginError);

  setError(loginError.message);
  setLoading(false);
  return;
}

if (!data.user) {
  setError("Login gagal. Silakan coba lagi.");
  setLoading(false);
  return;
}

const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", data.user.id)
  .maybeSingle();

if (profileError) {
  console.error("Profile lookup error:", profileError);

  setError("Profil akun tidak dapat dimuat.");
  setLoading(false);
  return;
}

if (profile?.role === "admin") {
  router.push("/admin");
} else {
  router.push("/player");
}

router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[150px]" />

          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-red-950/20 blur-[140px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-5 py-24 sm:px-8">
          <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 shadow-2xl shadow-black/40 lg:grid-cols-[0.9fr_1.1fr]">
            {/* LEFT */}
            <div className="relative hidden min-h-[620px] overflow-hidden border-r border-white/10 bg-[#080808] lg:flex lg:flex-col lg:justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,30,30,0.18),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(255,30,30,0.08),transparent_40%)]" />

              <div className="relative z-10 p-10">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
                  PINTO ESPORTS
                </p>

                <h1 className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-tight">
                  Welcome
                  <span className="block text-red-500">Back.</span>
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
                  Masuk kembali ke akun kamu dan lanjutkan perjalanan esports
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
                    Player Login
                  </p>

                  <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                    Welcome Back
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Login untuk mengakses akun dan profil esports kamu.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
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
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:bg-white/[0.05]"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-300"
                      >
                        Password
                      </label>
                    </div>

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
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
                    {loading ? "Signing In..." : "Login"}
                  </button>
                </form>

                <div className="mt-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />

                  <span className="text-xs uppercase tracking-wider text-gray-600">
                    New player?
                  </span>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <Link
                  href="/register/player"
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-sm font-bold uppercase tracking-wide text-white transition hover:border-red-500 hover:text-red-500"
                >
                  Create Player Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}