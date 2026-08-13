"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
};

type Game = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
};

type PlayerGameProfile = {
  id: string;
  player_id: string;
  game_id: string;
  in_game_name: string;
  game_uid: string | null;
  rank: string | null;
  status: string;
  game: Game | null;
};

type Squad = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [profile, setProfile] =
    useState<Profile | null>(null);

    const [gameProfiles, setGameProfiles] =
  useState<PlayerGameProfile[]>([]);

  const [mySquads, setMySquads] =
  useState<Squad[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        // =====================================================
        // 1. AMBIL USER YANG SEDANG LOGIN
        // =====================================================

        const {
          data: {
            user,
          },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error(
            "Auth user error:",
            userError
          );

          setError(
            "Sesi login tidak dapat diperiksa."
          );

          return;
        }

        // Tidak ada user yang login
        if (!user) {
          setError(
            "Silakan login terlebih dahulu."
          );

          return;
        }

        // =====================================================
        // 2. AMBIL PROFILE BERDASARKAN USER.ID
        // =====================================================

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(
            `
              id,
              username,
              full_name,
              avatar_url,
              bio,
              role
            `
          )
          .eq(
            "id",
            user.id
          )
          .maybeSingle();

        if (profileError) {
          console.error(
            "Dashboard profile error:",
            profileError
          );

          setError(
            "Profile kamu belum dapat dimuat."
          );

          return;
        }

        if (!profileData) {
  setError(
    "Profile player belum ditemukan."
  );

  return;
}

setProfile(profileData);

// =====================================================
// 3. AMBIL GAME PROFILE MILIK USER
// =====================================================

const {
  data: gameProfileData,
  error: gameProfileError,
} = await supabase
  .from("player_game_profiles")
  .select(
    `
      id,
      player_id,
      game_id,
      in_game_name,
      game_uid,
      rank,
      status,
      games (
        id,
        name,
        slug,
        logo_url
      )
    `
  )
  .eq(
    "player_id",
    user.id
  )
  .eq(
    "status",
    "active"
  );

if (gameProfileError) {
  console.error(
    "Game profile error:",
    gameProfileError
  );

  setError(
    "Data game profile belum dapat dimuat."
  );

  return;
}

const normalizedGameProfiles =
  (gameProfileData ?? []).map(
    (item: any) => ({
      id: item.id,
      player_id: item.player_id,
      game_id: item.game_id,
      in_game_name:
        item.in_game_name,
      game_uid:
        item.game_uid,
      rank:
        item.rank,
      status:
        item.status,
      game:
        Array.isArray(item.games)
          ? item.games[0] ?? null
          : item.games ?? null,
    })
  ) as PlayerGameProfile[];

setGameProfiles(
  normalizedGameProfiles
);

console.log(
  "GAME PROFILE IDS:",
  normalizedGameProfiles.map(
    (item) => item.id
  )
);

const {
  data: squadMemberData,
  error: squadMemberError,
} = await supabase
  .from("squad_members")
  .select(`
    id,
    squad_game_id,
    player_game_profile_id,
    role,
    status
  `)
  .in(
    "player_game_profile_id",
    normalizedGameProfiles.map(
      (item) => item.id
    )
  )
  .eq(
    "status",
    "active"
  );

console.log(
  "SQUAD MEMBER DATA:",
  squadMemberData
);

console.log(
  "SQUAD MEMBER ERROR:",
  squadMemberError
);

const squadGameId =
  squadMemberData?.[0]?.squad_game_id;

console.log(
  "SQUAD GAME ID:",
  squadGameId
);

const {
  data: squadGameData,
  error: squadGameError,
} = await supabase
  .from("squad_games")
  .select(`
    id,
    squad_id,
    game_id,
    leader_id,
    status
  `)
  .eq(
    "id",
    squadGameId
  )
  .maybeSingle();

console.log(
  "SQUAD GAME DATA:",
  squadGameData
);

console.log(
  "SQUAD GAME ERROR:",
  squadGameError
);

const squadId =
  squadGameData?.squad_id;

console.log(
  "SQUAD ID:",
  squadId
);

const {
  data: squadData,
  error: squadError,
} = await supabase
  .from("squads")
  .select(`
    id,
    name,
    slug,
    logo_url,
    description,
    status
  `)
  .eq(
    "id",
    squadId
  )
  .maybeSingle();

console.log(
  "SQUAD DATA:",
  squadData
);

if (squadData) {
  setMySquads([
    {
      id: squadData.id,
      name: squadData.name,
      slug: squadData.slug,
      logo_url: squadData.logo_url,
    },
  ]);
}

console.log(
  "SQUAD ERROR:",
  squadError
);

      } catch (err) {
        console.error(
          "Unexpected dashboard error:",
          err
        );

        setError(
          "Terjadi kesalahan saat memuat dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">

          <div className="animate-pulse">

            <div className="h-72 rounded-3xl border border-white/10 bg-white/[0.03]" />

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <div className="h-28 rounded-2xl bg-white/[0.03]" />

              <div className="h-28 rounded-2xl bg-white/[0.03]" />

              <div className="h-28 rounded-2xl bg-white/[0.03]" />

            </div>

          </div>

        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-10 text-white sm:px-6">

        <div className="mx-auto max-w-3xl">

          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">

            <div className="flex gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-xl font-black text-red-400">
                !
              </div>

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                  Player Dashboard
                </p>

                <h1 className="mt-2 text-2xl font-black">
                  Dashboard tidak dapat dibuka
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {error}
                </p>

              </div>

            </div>

          </div>

        </div>

      </main>
    );
  }

  const displayName =
    profile.full_name ||
    profile.username ||
    "Player";

  const username =
    profile.username
      ? `@${profile.username}`
      : "";

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Player Command Center
          </p>

          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Dashboard
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            Kelola profile game, squad, dan perjalanan kompetitif kamu.
          </p>

        </div>

        {/* =================================================
            PLAYER HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909]">

          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-600/10 blur-[120px]" />

          <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize:
                  "40px 40px",
              }}
            />
          </div>

          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">

            {/* PHOTO */}

            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] sm:h-36 sm:w-36">

              {profile.avatar_url ? (
                <img
                  src={
                    profile.avatar_url
                  }
                  alt={
                    displayName
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-red-500/5 text-4xl font-black text-red-500">
                  {displayName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

            </div>

            {/* PLAYER INFO */}

            <div className="min-w-0 flex-1">

              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Pinto Esport · Private Dashboard
              </p>

              <h2 className="mt-2 break-words text-4xl font-black uppercase leading-none sm:text-5xl">
                {displayName}
              </h2>

              {username && (
                <p className="mt-3 text-sm font-bold text-gray-500">
                  {username}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">

                <span className="rounded-lg bg-red-500/10 px-4 py-2 text-[9px] font-black uppercase tracking-wide text-red-400">
                  {profile.role ||
                    "PLAYER"}
                </span>

                <span className="rounded-lg border border-white/10 px-4 py-2 text-[9px] font-black uppercase tracking-wide text-gray-500">
                  Account Active
                </span>

              </div>

              {profile.bio && (
                <p className="mt-5 max-w-2xl text-sm leading-6 text-gray-500">
                  {profile.bio}
                </p>
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK STATS
        ================================================= */}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <DashboardStat
  value={String(gameProfiles.length)}
  label="Game Profiles"
/>


        </section>

{/* =================================================
    MY SQUAD
================================================= */}

{mySquads.length > 0 && (
  <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#090909] p-6 sm:p-8">

    <div className="flex items-center justify-between gap-4">

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
          Competitive Identity
        </p>

        <h2 className="mt-2 text-2xl font-black uppercase">
          My Squad
        </h2>
      </div>

    </div>

    <div className="mt-6">

      {mySquads.map((squad) => (
        <a
          key={squad.id}
          href={`/squads/${squad.slug}`}
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-red-500/30 hover:bg-white/[0.04]"
        >

          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

            {squad.logo_url ? (
              <img
                src={squad.logo_url}
                alt={squad.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-black text-red-500">
                {squad.name.charAt(0).toUpperCase()}
              </span>
            )}

          </div>

          <div className="min-w-0 flex-1">

            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
              Squad
            </p>

            <h3 className="mt-1 truncate text-lg font-black uppercase">
              {squad.name}
            </h3>

          </div>

          <div className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-red-500">
            →
          </div>

        </a>
      ))}

    </div>

  </section>
)}

        {/* =================================================
            COMING SECTIONS
        ================================================= */}

        <section className="mt-12">

          <SectionHeading
            eyebrow="Competitive Identity"
            title="My Games"
            description="Game profile yang terdaftar pada akun kamu."
          />

          {gameProfiles.length === 0 ? (
  <EmptyPanel
    title="Belum memiliki game profile"
    description="Daftarkan profile game kamu agar dapat mengikuti squad dan kompetisi."
  />
) : (
  <div className="mt-5 grid gap-4 md:grid-cols-2">
    {gameProfiles.map((gameProfile) => (
      <GameProfileCard
        key={gameProfile.id}
        profile={gameProfile}
      />
    ))}
  </div>
)}

        </section>

        <section className="mt-12">

          <SectionHeading
            eyebrow="Team Identity"
            title="My Squads"
            description="Squad yang kamu ikuti sebagai leader atau member."
          />

          <EmptyPanel
            title="Squad akan muncul di sini"
            description="Data squad akan kita hubungkan setelah game profile selesai ditampilkan."
          />

        </section>

      </div>

    </main>
  );
}

// ===========================================================
// COMPONENTS
// ===========================================================

function GameProfileCard({
  profile,
}: {
  profile: PlayerGameProfile;
}) {
  const game = profile.game;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#090909] p-6 transition duration-300 hover:border-red-500/30">

      {/* GAME WATERMARK */}

      {game?.logo_url && (
        <img
          src={game.logo_url}
          alt=""
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 object-contain opacity-[0.035] grayscale transition duration-500 group-hover:scale-110"
        />
      )}

      <div className="relative">

        {/* GAME */}

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">

            {game?.logo_url ? (
              <img
                src={game.logo_url}
                alt={game.name}
                className="h-9 w-9 object-contain"
              />
            ) : (
              <span className="text-xl font-black text-red-500">
                {game?.name
                  ?.charAt(0) ||
                  "G"}
              </span>
            )}

          </div>

          <div className="min-w-0">

            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-red-500">
              Game Profile
            </p>

            <h3 className="mt-1 truncate text-xl font-black uppercase">
              {game?.name ||
                "Game"}
            </h3>

          </div>

        </div>

        {/* IGN */}

        <div className="mt-6">

          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
            In-Game Name
          </p>

          <p className="mt-1 text-2xl font-black uppercase">
            {profile.in_game_name}
          </p>

        </div>

        {/* DATA */}

        <div className="mt-6 grid grid-cols-2 gap-3">

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">

            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-gray-600">
              Game ID
            </p>

            <p className="mt-2 truncate text-sm font-bold text-gray-300">
              {profile.game_uid ||
                "Belum ada data"}
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">

            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-gray-600">
              Rank
            </p>

            <p className="mt-2 truncate text-sm font-bold text-gray-300">
              {profile.rank ||
                "Belum ada data"}
            </p>

          </div>

        </div>

        {/* ACTION */}

        <button
          type="button"
          className="mt-5 w-full rounded-xl border border-white/10 px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
        >
          Kelola Profile
        </button>

      </div>

    </div>
  );
}


function DashboardStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#090909] p-5">

      <p className="text-3xl font-black">
        {value}
      </p>

      <p className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>

      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-black uppercase">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
        {description}
      </p>

    </div>
  );
}

function EmptyPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-5 rounded-3xl border border-dashed border-white/10 bg-[#090909] p-8">

      <h3 className="font-black uppercase text-gray-400">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>

    </div>
  );
}