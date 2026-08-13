"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function getLaneIcon(lane: string | null) {
  const laneIcons: Record<string, string> = {
    jungler: "/roles/mobile-legends/jungler.png",
    "gold lane": "/roles/mobile-legends/gold-lane.png",
    "mid lane": "/roles/mobile-legends/mid-lane.png",
    "exp lane": "/roles/mobile-legends/exp-lane.png",
    roamer: "/roles/mobile-legends/roamer.png",
  };

  if (!lane) {
    return null;
  }

  return (
    laneIcons[lane.toLowerCase().trim()] ??
    null
  );
}

type Squad = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

type Game = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  visual_config: Record<string, unknown> | null;
};

type SquadGame = {
  id: string;
  squad_id: string;
  game_id: string;
  leader_id: string;
  status: string;
};

type SquadMember = {
  id: string;
  squad_game_id: string;
  player_game_profile_id: string;
  role: string;
  status: string;
};

type PlayerGameProfile = {
  id: string;
  player_id: string;
  game_id: string;
  in_game_name: string;
  game_uid: string | null;
  rank: string | null;
  main_lane: string | null;
};

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type RosterPlayer = {
  playerId: string;
  gameProfileId: string;
  name: string;
  ign: string;
  avatar: string | null;
  role: string;
  rank: string;
  mainLane: string | null;
};

export default function PublicSquadPage() {
  const params = useParams();
  const supabase = createClient();

  const squadId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [squad, setSquad] =
    useState<Squad | null>(null);

  const [game, setGame] =
    useState<Game | null>(null);

  const [squadGame, setSquadGame] =
    useState<SquadGame | null>(null);

  const [roster, setRoster] =
    useState<RosterPlayer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!squadId) {
      setError("Squad tidak ditemukan.");
      setLoading(false);
      return;
    }

    async function loadSquad() {
      setLoading(true);
      setError("");

      try {
        // =====================================================
        // 1. AMBIL SQUAD
        // =====================================================

        const {
          data: squadData,
          error: squadError,
        } = await supabase
          .from("squads")
          .select(`
            id,
            name,
            slug,
            status
          `)
          .eq("slug", squadId)
          .eq("status", "active")
          .maybeSingle();

        if (squadError) {
          console.error(
            "Squad error:",
            squadError
          );

          setError(
            "Informasi squad tidak dapat dimuat."
          );

          return;
        }

        if (!squadData) {
          setError(
            "Squad tidak ditemukan atau sudah tidak aktif."
          );

          return;
        }

        setSquad(squadData);

        // =====================================================
        // 2. AMBIL SQUAD GAME
        // =====================================================

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
          .eq("squad_id", squadData.id)
          .eq("status", "active")
          .limit(1)
          .maybeSingle();

        if (squadGameError) {
          console.error(
            "Squad game error:",
            squadGameError
          );

          setError(
            "Informasi game squad tidak dapat dimuat."
          );

          return;
        }

        if (!squadGameData) {
          setError(
            "Squad belum memiliki game aktif."
          );

          return;
        }

        setSquadGame(
          squadGameData
        );

        // =====================================================
        // 3. AMBIL GAME
        // =====================================================

        const {
          data: gameData,
          error: gameError,
        } = await supabase
          .from("games")
          .select(`
            id,
            name,
            slug,
            logo_url,
            visual_config
          `)
          .eq("id", squadGameData.game_id)
          .eq("status", "active")
          .maybeSingle();

        if (gameError) {
          console.error(
            "Game error:",
            gameError
          );

          setError(
            "Informasi game tidak dapat dimuat."
          );

          return;
        }

        setGame(gameData);

// =====================================================
// 4. AMBIL MEMBER SQUAD
// =====================================================

const {
  data: memberData,
  error: memberError,
} = await supabase
  .from("squad_members")
  .select(`
    id,
    squad_game_id,
    player_game_profile_id,
    role,
    status
  `)
  .eq(
    "squad_game_id",
    squadGameData.id
  )
  .eq(
    "status",
    "active"
  );

if (memberError) {
  console.error(
    "Roster member error:",
    memberError
  );

  setError(
    "Roster squad tidak dapat dimuat."
  );

  return;
}

const members =
  memberData ?? [];

console.log(
  "PUBLIC ROSTER MEMBERS:",
  members
);


// =====================================================
// 5. AMBIL GAME PROFILES
// =====================================================

const gameProfileIds =
  members
    .map(
      (member) =>
        member.player_game_profile_id
    )
    .filter(Boolean);

console.log(
  "GAME PROFILE IDS:",
  gameProfileIds
);

let gameProfiles:
  PlayerGameProfile[] = [];

if (
  gameProfileIds.length > 0
) {
  const {
    data: gameProfileData,
    error: gameProfileError,
  } = await supabase
    .from(
      "player_game_profiles"
    )
    .select(`
      id,
      player_id,
      game_id,
      in_game_name,
      game_uid,
      rank,
      main_lane
      
    `)
    .in(
      "id",
      gameProfileIds
    );

  if (gameProfileError) {
    console.error(
      "Game profile error:",
      gameProfileError
    );

    setError(
      "Profile game player tidak dapat dimuat."
    );

    return;
  }

  gameProfiles =
    (gameProfileData ??
      []) as PlayerGameProfile[];
}

console.log(
  "GAME PROFILES:",
  gameProfiles
);


// =====================================================
// 6. AMBIL PROFILE PLAYER
// =====================================================

const playerIds =
  gameProfiles
    .map(
      (gameProfile) =>
        gameProfile.player_id
    )
    .filter(Boolean);

console.log(
  "PLAYER IDS:",
  playerIds
);

let profiles:
  Profile[] = [];

if (
  playerIds.length > 0
) {
  const {
    data: profileData,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      full_name,
      avatar_url
    `)
    .in(
      "id",
      playerIds
    );

  if (profileError) {
    console.error(
      "Profile error:",
      profileError
    );

    setError(
      "Profile player tidak dapat dimuat."
    );

    return;
  }

  profiles =
    (profileData ??
      []) as Profile[];
}

console.log(
  "PROFILES:",
  profiles
);


// =====================================================
// 7. BUAT MAP
// =====================================================

const profileMap =
  new Map(
    profiles.map(
      (profile) => [
        profile.id,
        profile,
      ]
    )
  );

const memberMap =
  new Map(
    members.map(
      (member) => [
        member.player_game_profile_id,
        member,
      ]
    )
  );


// =====================================================
// 8. BENTUK ROSTER
// =====================================================

const rosterData:
  RosterPlayer[] = [];

gameProfiles.forEach(
  (gameProfile) => {

    const profile =
      profileMap.get(
        gameProfile.player_id
      );

    const member =
      memberMap.get(
        gameProfile.id
      );

    if (!profile || !member) {
      return;
    }

    rosterData.push({
      playerId:
        profile.id,

      gameProfileId:
        gameProfile.id,

      name:
        profile.full_name ||
        profile.username ||
        gameProfile.in_game_name ||
        "PLAYER",

      ign:
        gameProfile.in_game_name ||
        "PLAYER",

      avatar:
        profile.avatar_url,

      role:
        member.role ||
        "member",
        mainLane:
  gameProfile.main_lane,

      rank:
        gameProfile.rank ||
        "",
    });
  }
);


// =====================================================
// 9. URUTKAN LEADER KE ATAS
// =====================================================

rosterData.sort(
  (a, b) => {

    const aLeader =
      a.role.toLowerCase() ===
      "leader";

    const bLeader =
      b.role.toLowerCase() ===
      "leader";

    if (
      aLeader &&
      !bLeader
    ) {
      return -1;
    }

    if (
      !aLeader &&
      bLeader
    ) {
      return 1;
    }

    return a.name.localeCompare(
      b.name
    );
  }
);

console.log(
  "FINAL PUBLIC ROSTER:",
  rosterData
);

console.log(
  "ROSTER LANE DEBUG:",
  rosterData.map((player) => ({
    name: player.name,
    mainLane: player.mainLane,
  }))
);

setRoster(
  rosterData
);

      } catch (err) {
        console.error(
          "Unexpected squad error:",
          err
        );

        setError(
          "Terjadi kesalahan saat memuat squad."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSquad();
  }, [squadId]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-10 text-white sm:px-6">

        <div className="mx-auto max-w-6xl">

          <div className="animate-pulse space-y-6">

            <div className="h-80 rounded-[2rem] bg-white/[0.03]" />

            <div className="h-10 w-48 rounded-xl bg-white/[0.03]" />

            <div className="grid gap-4 md:grid-cols-2">
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

  if (
    error ||
    !squad ||
    !squadGame
  ) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-12 text-white sm:px-6">

        <div className="mx-auto max-w-3xl">

          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">

            <div className="flex gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-xl font-black text-red-400">
                !
              </div>

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                  Public Squad
                </p>

                <h1 className="mt-2 text-2xl font-black">
                  Squad tidak dapat ditampilkan
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {error ||
                    "Data squad belum tersedia."}
                </p>

              </div>

            </div>

          </div>

        </div>

      </main>
    );
  }

  // =========================================================
  // GAME VISUAL
  // =========================================================

  const visual =
    game?.visual_config ?? {};

  const accent =
    typeof visual.accent ===
    "string"
      ? visual.accent
      : "#ef4444";

  const accentSoft =
    typeof visual.accent_soft ===
    "string"
      ? visual.accent_soft
      : "rgba(239,68,68,0.12)";

  const background =
    typeof visual.background ===
    "string"
      ? visual.background
      : "#050505";

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background,
      }}
    >

      {/* =====================================================
          BACKGROUND ORNAMENT
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div
          className="absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full blur-[160px]"
          style={{
            background:
              accentSoft,
          }}
        />

        <div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-[160px]"
          style={{
            background:
              accentSoft,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              `linear-gradient(135deg, ${accent} 1px, transparent 1px)`,
            backgroundSize:
              "48px 48px",
          }}
        />

      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-[2rem] border border-red-500/40 bg-[#090909]">

          <div
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-[120px]"
            style={{
              background:
                accentSoft,
            }}
          />

          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-[120px]"
            style={{
              background:
                accentSoft,
            }}
          />

          <div className="relative flex flex-col gap-8 p-8 sm:p-10 lg:flex-row lg:items-center">

            {/* =================================================
                SQUAD LOGO
            ================================================= */}

            <div className="flex h-44 w-44 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]">

              {/* 
                Belum mengubah database.
                Gunakan initial squad sebagai fallback.
              */}

              <div
                className="flex h-full w-full items-center justify-center text-6xl font-black"
                style={{
                  color: accent,
                  background:
                    accentSoft,
                }}
              >
                {squad.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

            </div>

            {/* =================================================
                SQUAD INFO
            ================================================= */}

            <div className="min-w-0 flex-1">

              {/* STATUS + GAME */}

              <div className="flex flex-wrap items-center gap-3">

                <span
                  className="rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em]"
                  style={{
                    color: accent,
                    background:
                      accentSoft,
                  }}
                >
                  {squad.status}
                </span>

                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">
                  {game?.name ||
                    "GAME"}
                </span>

              </div>

              {/* NAME */}

              <h1 className="mt-5 break-words text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-7xl">
                {squad.name}
              </h1>

              {/* DESCRIPTION */}

              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500">
                {/*
                  Tidak ada dummy description.
                  Jika tabel squads belum memiliki description,
                  kita gunakan informasi game.
                */}

                {game?.name
                  ? `Competitive ${game.name} squad.`
                  : "Competitive esports squad."}
              </p>

              {/* INFO */}

              <div className="mt-7 flex flex-wrap gap-3">

                <div className="rounded-xl border border-white/10 px-4 py-3">

                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Roster
                  </p>

                  <p className="mt-1 text-sm font-black">
                    {roster.length} Players
                  </p>

                </div>

                <div className="rounded-xl border border-white/10 px-4 py-3">

                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Game
                  </p>

                  <p className="mt-1 text-sm font-black uppercase">
                    {game?.name ||
                      "Belum ada data"}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            ROSTER
        ================================================= */}

        <section className="mt-14">

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Competitive Roster
          </p>

          <h2 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Roster
          </h2>

          <p className="mt-3 text-sm text-gray-600">
            Player yang terdaftar dalam squad ini.
          </p>

          {roster.length ===
          0 ? (
            <div className="mt-7 rounded-3xl border border-dashed border-white/10 bg-[#090909] p-8">

              <h3 className="font-black uppercase text-gray-400">
                Roster belum tersedia
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Belum ada player aktif dalam squad ini.
              </p>

            </div>
          ) : (
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {roster.map(
                (player) => (
                  <Link
                    key={
                      player.gameProfileId
                    }
                    href={`/players/${player.playerId}`}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#090909] p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/30"
                  >

                    <div className="relative flex items-center gap-5">
  {/* ACCENT LINE */}
  <div
    className="absolute left-0 top-1 bottom-1 w-1 rounded-full"
    style={{
      background: accent,
    }}
  />

  {/* PHOTO */}
  <div className="ml-3 h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:h-24 sm:w-24">
    {player.avatar ? (
      <img
        src={player.avatar}
        alt={player.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    ) : (
      <div
        className="flex h-full w-full items-center justify-center text-2xl font-black"
        style={{
          color: accent,
          background: accentSoft,
        }}
      >
        {player.name
          .charAt(0)
          .toUpperCase()}
      </div>
    )}
  </div>

  {/* PLAYER INFO */}
  <div className="min-w-0 flex-1">

    <div className="flex items-center gap-2">
      <h3 className="truncate text-xl font-black uppercase tracking-tight text-white transition group-hover:text-red-400">
        {player.name}
      </h3>

      {getLaneIcon(player.mainLane) && (
  <div
    className="flex h-8 w-8 shrink-0 items-center justify-center"
    title={player.mainLane ?? ""}
  >
    <img
      src={getLaneIcon(player.mainLane) ?? ""}
      alt={player.mainLane ?? "Lane"}
      className="h-7 w-7 object-contain"
    />
  </div>
)}

      {/* LEADER BADGE */}
      {player.role?.toLowerCase() === "leader" && (
        <span
          className="shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider"
          style={{
            color: accent,
            background: accentSoft,
            border: `1px solid ${accent}33`,
          }}
        >
          Leader
        </span>
      )}
    </div>

    <p className="mt-1 text-sm font-black uppercase tracking-wider text-red-500">
      {player.role || "Member"}
    </p>

    <p className="mt-2 truncate text-xs font-bold text-gray-500">
      {player.ign}
    </p>

    {player.rank && (
      <p className="mt-1 truncate text-[9px] font-black uppercase tracking-[0.15em] text-gray-700">
        {player.rank}
      </p>
    )}

    {/* VIEW PROFILE */}
    <div className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-gray-600 transition group-hover:text-red-500">
      <span>View Profile</span>

      <span className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </div>

  </div>
</div>

</Link>
                )
              )}

            </div>
          )}

        </section>

        {/* =================================================
            TOURNAMENT HISTORY
        ================================================= */}

        <section className="mt-16">

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Competitive Record
          </p>

          <h2 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Tournament History
          </h2>

          <div className="mt-7 rounded-3xl border border-white/10 bg-[#090909] p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-xl">
                🏆
              </div>

              <div>

                <h3 className="font-black uppercase text-gray-400">
                  Belum ada tournament history
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Riwayat tournament akan muncul setelah squad mengikuti kompetisi yang tercatat di PINTO ESPORT.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            ACHIEVEMENTS
        ================================================= */}

        <section className="mt-16">

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Squad Legacy
          </p>

          <h2 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Achievements
          </h2>

          <div className="mt-7 rounded-3xl border border-white/10 bg-[#090909] p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-xl">
                🏅
              </div>

              <div>

                <h3 className="font-black uppercase text-gray-400">
                  Belum ada achievement
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Achievement squad akan muncul berdasarkan hasil tournament yang telah divalidasi.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="mt-16 border-t border-white/10 pt-8 text-center">

          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-gray-700">
            PINTO ESPORT · PUBLIC SQUAD PROFILE
          </p>

        </footer>

      </div>

    </main>
  );
}