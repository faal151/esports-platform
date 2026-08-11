"use client";

import { useState } from "react";

const gameRoles: Record<string, string[]> = {
  "mobile-legends": ["Jungler", "Gold Lane", "Mid Lane", "EXP Lane", "Roamer"],

  "free-fire": ["Rusher", "Support", "Sniper", "IGL", "Fragger", "Flex"],

  valorant: ["Duelist", "Initiator", "Controller", "Sentinel", "Flex"],

  "pubg-mobile": [
    "IGL",
    "Entry Fragger",
    "Support",
    "Scout",
    "Sniper",
    "Assaulter",
    "Flex",
  ],
};

export default function PlayerRegistrationPage() {
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const availableRoles = selectedGame ? (gameRoles[selectedGame] ?? []) : [];

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
            PINTO ESPORT
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-5xl">
            Create Player Profile
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500">
            Buat identitas esports kamu dan mulai membangun competitive record
            di PINTO.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-8">
          {/* Account */}
          <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Step 01
              </p>

              <h2 className="mt-2 text-2xl font-black uppercase">Account</h2>

              <p className="mt-2 text-sm text-gray-600">
                Data ini digunakan untuk login ke akun PINTO.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500"
                />
              </div>
            </div>
          </section>

          {/* Identity */}
          <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Step 02
              </p>

              <h2 className="mt-2 text-2xl font-black uppercase">
                Player Identity
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Identitas kompetitif yang akan ditampilkan pada Player Profile
                kamu.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {/* Photo */}
              <div>
                <label
                  htmlFor="photo"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Player Photo
                </label>

                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="mt-2 block w-full cursor-pointer rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:text-white"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500"
                />
              </div>

              {/* IGN */}
              <div>
                <label
                  htmlFor="ign"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  In-Game Name / IGN
                </label>

                <input
                  id="ign"
                  name="ign"
                  type="text"
                  placeholder="Your IGN"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500"
                />
              </div>

              {/* Game */}
              <div>
                <label
                  htmlFor="game"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Main Game
                </label>

                <select
                  id="game"
                  name="game"
                  value={selectedGame}
                  onChange={(event) => {
                    setSelectedGame(event.target.value);
                    setSelectedRole("");
                  }}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                >
                  <option value="" disabled>
                    Select your game
                  </option>

                  <option value="mobile-legends">Mobile Legends</option>

                  <option value="free-fire">Free Fire</option>

                  <option value="valorant">Valorant</option>

                  <option value="pubg-mobile">PUBG Mobile</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Competitive Role
                </label>

                <select
                  id="role"
                  name="role"
                  disabled={!selectedGame}
                  value={selectedRole}
                  onChange={(event) => {
                    setSelectedRole(event.target.value);
                  }}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <option value="">
                    {selectedGame
                      ? "Select your role"
                      : "Select your game first"}
                  </option>

                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region */}
              <div>
                <label
                  htmlFor="region"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Region
                </label>

                <input
                  id="region"
                  name="region"
                  type="text"
                  placeholder="Kabupaten / Kota"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500"
                />
              </div>
            </div>
          </section>

          {/* Squad */}
          <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Step 03
              </p>

              <h2 className="mt-2 text-2xl font-black uppercase">Squad</h2>

              <p className="mt-2 text-sm text-gray-600">
                Kamu tidak wajib memiliki squad untuk mendaftar sebagai player
                PINTO.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer gap-4 rounded-xl border border-red-500/30 bg-red-500/5 p-5">
                <input
                  type="radio"
                  name="squadStatus"
                  value="free-agent"
                  defaultChecked
                  className="mt-1 accent-red-600"
                />

                <div>
                  <p className="font-black uppercase">Free Agent</p>

                  <p className="mt-1 text-sm text-gray-600">
                    Saya belum tergabung dalam squad.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-red-500/30">
                <input
                  type="radio"
                  name="squadStatus"
                  value="has-squad"
                  className="mt-1 accent-red-600"
                />

                <div>
                  <p className="font-black uppercase">I Have a Squad</p>

                  <p className="mt-1 text-sm text-gray-600">
                    Saya sudah memiliki squad dan akan menghubungkan profile
                    saya setelah proses membership.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* PINTO ID Notice */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-red-500">
              PINTO ID
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              PINTO ID akan dibuat otomatis oleh sistem setelah profile berhasil
              dibuat. Kamu tidak perlu menentukan PINTO ID sendiri.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-widest transition hover:bg-red-500 hover:shadow-[0_0_35px_rgba(255,30,30,0.2)]"
          >
            Create Player Profile
          </button>

          <p className="pb-12 text-center text-xs text-gray-700">
            Dengan membuat profile, kamu menyetujui ketentuan PINTO ESPORT.
          </p>
        </form>
      </div>
    </main>
  );
}