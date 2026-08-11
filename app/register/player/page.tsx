"use client";

import { useRef, useState } from "react";

const gameRoles: Record<string, string[]> = {
  "mobile-legends": [
    "Jungler",
    "Gold Lane",
    "Mid Lane",
    "EXP Lane",
    "Roamer",
  ],

  "free-fire": [
    "Rusher",
    "Support",
    "Sniper",
    "IGL",
    "Fragger",
    "Flex",
  ],

  valorant: [
    "Duelist",
    "Initiator",
    "Controller",
    "Sentinel",
    "Flex",
  ],

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
  // Game & Role
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [ignError, setIgnError] = useState("");
  const [gameError, setGameError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [regionError, setRegionError] = useState("");
  const [photoError, setPhotoError] = useState("");

  // Photo
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoName, setPhotoName] = useState("");

  // Refs
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const ignRef = useRef<HTMLInputElement>(null);
  const gameRef = useRef<HTMLSelectElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);
  const regionRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const availableRoles = selectedGame
    ? gameRoles[selectedGame] ?? []
    : [];

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setPhotoError(
        "Format foto harus JPG, JPEG, PNG, atau WebP."
      );

      setPhotoPreview("");
      setPhotoName("");
      event.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Ukuran foto maksimal 5 MB.");

      setPhotoPreview("");
      setPhotoName("");
      event.target.value = "";

      return;
    }

    setPhotoError("");
    setPhotoName(file.name);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview("");
    setPhotoName("");
    setPhotoError("");

    if (photoRef.current) {
      photoRef.current.value = "";
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Reset all errors
    setEmailError("");
    setPasswordError("");
    setNameError("");
    setIgnError("");
    setGameError("");
    setRoleError("");
    setRegionError("");
    setPhotoError("");

    const formData = new FormData(event.currentTarget);

    const email = String(
      formData.get("email") ?? ""
    ).trim();

    const password = String(
      formData.get("password") ?? ""
    );

    const name = String(
      formData.get("name") ?? ""
    ).trim();

    const ign = String(
      formData.get("ign") ?? ""
    ).trim();

    const game = String(
      formData.get("game") ?? ""
    ).trim();

    const role = String(
      formData.get("role") ?? ""
    ).trim();

    const region = String(
      formData.get("region") ?? ""
    ).trim();

    let hasError = false;

    /*
     * ACCOUNT
     */

    if (!email) {
      setEmailError("Email wajib diisi.");
      hasError = true;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setEmailError(
        "Masukkan alamat email yang valid."
      );
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password wajib diisi.");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError(
        "Password minimal 8 karakter."
      );
      hasError = true;
    }

    /*
     * PLAYER IDENTITY
     */

    if (!name) {
      setNameError("Nama lengkap wajib diisi.");
      hasError = true;
    }

    if (!ign) {
      setIgnError("IGN wajib diisi.");
      hasError = true;
    }

    if (!game) {
      setGameError("Game wajib dipilih.");
      hasError = true;
    }

    if (!role) {
      setRoleError(
        "Competitive Role wajib dipilih."
      );
      hasError = true;
    } else if (
      !gameRoles[game]?.includes(role)
    ) {
      setRoleError(
        "Role tidak sesuai dengan game yang dipilih."
      );
      hasError = true;
    }

    if (!region) {
      setRegionError("Region wajib diisi.");
      hasError = true;
    }

    /*
     * AUTO SCROLL TO FIRST ERROR
     */

    if (hasError) {
      if (
        !email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        emailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        emailRef.current?.focus();

        return;
      }

      if (
        !password ||
        password.length < 8
      ) {
        passwordRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        passwordRef.current?.focus();

        return;
      }

      if (!name) {
        nameRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        nameRef.current?.focus();

        return;
      }

      if (!ign) {
        ignRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        ignRef.current?.focus();

        return;
      }

      if (!game) {
        gameRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        gameRef.current?.focus();

        return;
      }

      if (
        !role ||
        !gameRoles[game]?.includes(role)
      ) {
        roleRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        roleRef.current?.focus();

        return;
      }

      if (!region) {
        regionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        regionRef.current?.focus();

        return;
      }

      return;
    }

    /*
     * TEMPORARY SUCCESS
     *
     * Database belum terhubung.
     */

    alert(
      "Player information valid. PINTO ID akan dibuat oleh sistem."
    );
  };

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
            Buat identitas esports kamu dan mulai
            membangun competitive record di PINTO.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ========================= */}
          {/* STEP 01 — ACCOUNT */}
          {/* ========================= */}

          <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Step 01
              </p>

              <h2 className="mt-2 text-2xl font-black uppercase">
                Account
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Data ini digunakan untuk login ke
                akun PINTO.
              </p>
            </div>

            <div className="mt-6 space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Email
                </label>

                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500"
                />

                {emailError && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    ⚠ {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Password
                </label>

                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500"
                />

                {passwordError && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    ⚠ {passwordError}
                  </p>
                )}
              </div>

            </div>
          </section>

          {/* ========================= */}
          {/* STEP 02 — PLAYER IDENTITY */}
          {/* ========================= */}

          <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Step 02
              </p>

              <h2 className="mt-2 text-2xl font-black uppercase">
                Player Identity
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Identitas kompetitif yang akan
                ditampilkan pada Player Profile kamu.
              </p>
            </div>

            <div className="mt-6 space-y-5">

              {/* ========================= */}
              {/* PLAYER PHOTO */}
              {/* ========================= */}

              <div>
                <label
                  htmlFor="photo"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Player Photo
                </label>

                <input
                  ref={photoRef}
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="mt-2 block w-full cursor-pointer rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:text-white"
                />

                {/* Preview */}
                {photoPreview && (
                  <div className="mt-4 flex items-center gap-4 rounded-xl border border-white/10 bg-black p-4">

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10">
                      <img
                        src={photoPreview}
                        alt="Player preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Selected Photo
                      </p>

                      <p className="mt-1 truncate text-sm text-gray-300">
                        {photoName}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-black uppercase tracking-wide text-red-500 transition hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {photoError && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    ⚠ {photoError}
                  </p>
                )}

                <p className="mt-2 text-xs text-gray-700">
                  Optional · JPG, PNG, WebP · Max 5 MB
                </p>
              </div>

              {/* ========================= */}
              {/* FULL NAME */}
              {/* ========================= */}

              <div>
                <label
                  htmlFor="name"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Full Name
                </label>

                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500"
                />

                {nameError && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    ⚠ {nameError}
                  </p>
                )}
              </div>

              {/* ========================= */}
              {/* IGN */}
              {/* ========================= */}

              <div>
                <label
                  htmlFor="ign"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  In-Game Name / IGN
                </label>

                <input
                  ref={ignRef}
                  id="ign"
                  name="ign"
                  type="text"
                  placeholder="Your IGN"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500"
                />

                {ignError && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    ⚠ {ignError}
                  </p>
                )}
              </div>

              {/* ========================= */}
              {/* MAIN GAME */}
              {/* ========================= */}

              <div>
                <label
                  htmlFor="game"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Main Game
                </label>

                <select
                  ref={gameRef}
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

                  <option value="mobile-legends">
                    Mobile Legends
                  </option>

                  <option value="free-fire">
                    Free Fire
                  </option>

                  <option value="valorant">
                    Valorant
                  </option>

                  <option value="pubg-mobile">
                    PUBG Mobile
                  </option>
                </select>

                {gameError && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    ⚠ {gameError}
                  </p>
                )}
              </div>

              {/* ========================= */}
              {/* COMPETITIVE ROLE */}
              {/* ========================= */}

              <div>
                <label
                  htmlFor="role"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Competitive Role
                </label>

                <select
                  ref={roleRef}
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
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  ))}
                </select>

                {roleError && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    ⚠ {roleError}
                  </p>
                )}
              </div>

              {/* ========================= */}
              {/* REGION */}
              {/* ========================= */}

              <div>
                <label
                  htmlFor="region"
                  className="text-xs font-bold uppercase tracking-widest text-gray-500"
                >
                  Region
                </label>

                <input
                  ref={regionRef}
                  id="region"
                  name="region"
                  type="text"
                  placeholder="Kabupaten / Kota"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500"
                />

                {regionError && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    ⚠ {regionError}
                  </p>
                )}
              </div>

            </div>
          </section>

          {/* ========================= */}
          {/* STEP 03 — SQUAD */}
          {/* ========================= */}

          <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Step 03
              </p>

              <h2 className="mt-2 text-2xl font-black uppercase">
                Squad
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Kamu tidak wajib memiliki squad untuk
                mendaftar sebagai player PINTO.
              </p>
            </div>

            <div className="mt-6 space-y-4">

              {/* Free Agent */}
              <label className="flex cursor-pointer gap-4 rounded-xl border border-red-500/30 bg-red-500/5 p-5">
                <input
                  type="radio"
                  name="squadStatus"
                  value="free-agent"
                  defaultChecked
                  className="mt-1 accent-red-600"
                />

                <div>
                  <p className="font-black uppercase">
                    Free Agent
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Saya belum tergabung dalam squad.
                  </p>
                </div>
              </label>

              {/* Has Squad */}
              <label className="flex cursor-pointer gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-red-500/30">
                <input
                  type="radio"
                  name="squadStatus"
                  value="has-squad"
                  className="mt-1 accent-red-600"
                />

                <div>
                  <p className="font-black uppercase">
                    I Have a Squad
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Saya sudah memiliki squad dan akan
                    menghubungkan profile saya setelah
                    proses membership.
                  </p>
                </div>
              </label>

            </div>
          </section>

          {/* ========================= */}
          {/* PINTO ID */}
          {/* ========================= */}

          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-red-500">
              PINTO ID
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              PINTO ID akan dibuat otomatis oleh sistem
              setelah profile berhasil dibuat. Kamu tidak
              perlu menentukan PINTO ID sendiri.
            </p>
          </div>

          {/* ========================= */}
          {/* SUBMIT */}
          {/* ========================= */}

          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-widest transition hover:bg-red-500 hover:shadow-[0_0_35px_rgba(255,30,30,0.2)]"
          >
            Create Player Profile
          </button>

          <p className="pb-12 text-center text-xs text-gray-700">
            Dengan membuat profile, kamu menyetujui
            ketentuan PINTO ESPORT.
          </p>

        </form>
      </div>
    </main>
  );
}