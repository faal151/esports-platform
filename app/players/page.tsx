"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Game = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
};

type GameProfile = {
  id: string;
  player_id: string;
  game_id: string;
  in_game_name: string | null;
  game_uid: string | null;
  rank: string | null;
  main_lane: string | null;
  status: string;
  created_at?: string;
};

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type SquadMember = {
  player_game_profile_id: string;
  squad_game_id: string;
  role: string | null;
  status: string;
};

type SquadGame = {
  id: string;
  squad_id: string;
  game_id: string;
  status: string;
};

type Squad = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
};

type PublicPlayer = {
  playerId: string;
  gameProfileId: string;
  name: string;
  ign: string;
  avatar: string | null;
  lane: string | null;
  gameName: string;
  gameSlug: string;
  gameLogo: string | null;
  squadName: string | null;
  squadSlug: string | null;
  squadLogo: string | null;
  squadRole: string | null;
  achievements: number;
  wins: number;
  matches: number;
};

const LANE_ICONS: Record<string, string> = {
  jungler: "/roles/mobile-legends/jungler.png",
  "gold lane": "/roles/mobile-legends/gold-lane.png",
  "mid lane": "/roles/mobile-legends/mid-lane.png",
  "exp lane": "/roles/mobile-legends/exp-lane.png",
  roamer: "/roles/mobile-legends/roamer.png",
};

function getLaneIcon(lane: string | null) {
  if (!lane) {
    return null;
  }

  return (
    LANE_ICONS[lane.toLowerCase().trim()] ??
    null
  );
}

function formatLane(lane: string | null) {
  if (!lane) {
    return "Lane belum ditentukan";
  }

  return lane
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export default function PlayersPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [players, setPlayers] = useState<
    PublicPlayer[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadPlayers() {
      setLoading(true);
      setError("");

      try {
        // =====================================================
        // 1. GAME PROFILES
        // =====================================================

        const {
          data: gameProfiles,
          error: gameProfilesError,
        } = await supabase
          .from("player_game_profiles")
          .select(`
            id,
            player_id,
            game_id,
            in_game_name,
            game_uid,
            rank,
            main_lane,
            status,
            created_at
          `)
          .eq("status", "active")
          .order("created_at", {
            ascending: true,
          });

        if (gameProfilesError) {
          console.error(
            "Public players game profiles error:",
            gameProfilesError
          );

          setError(
            "Data player tidak dapat dimuat."
          );

          return;
        }

        if (
          !gameProfiles ||
          gameProfiles.length === 0
        ) {
          setPlayers([]);
          return;
        }

        // =====================================================
        // 2. PROFILES
        // =====================================================

        const playerIds = [
          ...new Set(
            gameProfiles.map(
              (item) => item.player_id
            )
          ),
        ];

        const {
          data: profiles,
          error: profilesError,
        } = await supabase
          .from("profiles")
          .select(`
            id,
            username,
            full_name,
            avatar_url
          `)
          .in("id", playerIds);

        if (profilesError) {
          console.error(
            "Public players profiles error:",
            profilesError
          );

          setError(
            "Profil player tidak dapat dimuat."
          );

          return;
        }

        // =====================================================
        // 3. GAMES
        // =====================================================

        const gameIds = [
          ...new Set(
            gameProfiles.map(
              (item) => item.game_id
            )
          ),
        ];

        const {
          data: games,
          error: gamesError,
        } = await supabase
          .from("games")
          .select(`
            id,
            name,
            slug,
            logo_url
          `)
          .in("id", gameIds);

        if (gamesError) {
          console.error(
            "Public players games error:",
            gamesError
          );

          setError(
            "Data game tidak dapat dimuat."
          );

          return;
        }

        // =====================================================
        // 4. SQUAD MEMBERS
        // =====================================================

        const gameProfileIds =
          gameProfiles.map(
            (item) => item.id
          );

        const {
          data: members,
          error: membersError,
        } = await supabase
          .from("squad_members")
          .select(`
            player_game_profile_id,
            squad_game_id,
            role,
            status
          `)
          .in(
            "player_game_profile_id",
            gameProfileIds
          )
          .eq("status", "active");

        if (membersError) {
          console.error(
            "Public players members error:",
            membersError
          );

          // Squad bukan data wajib.
          // Player tetap ditampilkan.
        }

        // =====================================================
        // 5. SQUAD GAMES
        // =====================================================

        const squadGameIds = [
          ...new Set(
            (members ?? []).map(
              (member) =>
                member.squad_game_id
            )
          ),
        ];

        let squadGames:
          SquadGame[] = [];

        if (squadGameIds.length > 0) {
          const {
            data,
            error: squadGamesError,
          } = await supabase
            .from("squad_games")
            .select(`
              id,
              squad_id,
              game_id,
              status
            `)
            .in(
              "id",
              squadGameIds
            )
            .eq("status", "active");

          if (squadGamesError) {
            console.error(
              "Public players squad games error:",
              squadGamesError
            );
          }

          squadGames =
            (data ?? []) as SquadGame[];
        }

        // =====================================================
        // 6. SQUADS
        // =====================================================

        const squadIds = [
          ...new Set(
            squadGames.map(
              (item) => item.squad_id
            )
          ),
        ];

        let squads: Squad[] = [];

        if (squadIds.length > 0) {
          const {
  data,
  error: squadsError,
} = await supabase
  .from("squads")
  .select(`
    id,
    name,
    slug,
    logo_url
  `)
  .in("id", squadIds);

          if (squadsError) {
            console.error(
              "Public players squads error:",
              squadsError
            );
          }

          squads =
            (data ?? []) as Squad[];
        }

        // =====================================================
        // 7. MAP DATA
        // =====================================================

        const profileMap =
          new Map(
            (profiles ?? []).map(
              (profile) => [
                profile.id,
                profile,
              ]
            )
          );

        const gameMap =
          new Map(
            (games ?? []).map(
              (game) => [
                game.id,
                game,
              ]
            )
          );

        const memberMap =
          new Map(
            (members ?? []).map(
              (member) => [
                member.player_game_profile_id,
                member,
              ]
            )
          );

        const squadGameMap =
          new Map(
            squadGames.map(
              (item) => [
                item.id,
                item,
              ]
            )
          );

        const squadMap =
          new Map(
            squads.map(
              (squad) => [
                squad.id,
                squad,
              ]
            )
          );

        // =====================================================
        // 8. BUILD PUBLIC PLAYERS
        // =====================================================

        const result: PublicPlayer[] =
          gameProfiles
            .map((gameProfile) => {
              const profile =
                profileMap.get(
                  gameProfile.player_id
                );

              const game =
                gameMap.get(
                  gameProfile.game_id
                );

              if (!profile || !game) {
                return null;
              }

              const member =
                memberMap.get(
                  gameProfile.id
                );

              const squadGame =
                member
                  ? squadGameMap.get(
                      member.squad_game_id
                    )
                  : null;

              const squad =
                squadGame
                  ? squadMap.get(
                      squadGame.squad_id
                    )
                  : null;

              return {
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
                  profile.username ||
                  "PLAYER",

                avatar:
                  profile.avatar_url,

                lane:
                  gameProfile.main_lane,

                gameName:
                  game.name,

                gameSlug:
                  game.slug,

                gameLogo:
                  game.logo_url,

                squadName:
                  squad?.name ??
                  null,

                squadSlug:
                  squad?.slug ??
                  null,

                squadLogo:
                  squad?.logo_url ??
                  null,

                squadRole:
                  member?.role ??
                  null,

                // Belum ada sumber statistik publik
                // di struktur yang kita gunakan.
                achievements: 0,
                wins: 0,
                matches: 0,
              };
            })
            .filter(
              (
                player
              ): player is PublicPlayer =>
                Boolean(player)
            );

        setPlayers(result);
      } catch (err) {
        console.error(
          "Unexpected public players error:",
          err
        );

        setError(
          "Terjadi kesalahan saat memuat player."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlayers();
  }, [supabase]);

  // ===========================================================
  // LOADING
  // ===========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-white/10" />

            <div className="mt-4 h-12 w-64 rounded bg-white/10" />

            <div className="mt-4 h-4 w-96 max-w-full rounded bg-white/5" />

            <div className="mt-12 h-[330px] rounded-3xl bg-white/[0.03]" />
          </div>
        </div>
      </main>
    );
  }

  // ===========================================================
  // ERROR
  // ===========================================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
              PINTO ESPORT
            </p>

            <h1 className="mt-3 text-3xl font-black uppercase">
              Players
            </h1>

            <p className="mt-4 text-sm text-gray-500">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ===========================================================
  // EMPTY
  // ===========================================================

  if (players.length === 0) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            PINTO ESPORT
          </p>

          <h1 className="mt-3 text-5xl font-black uppercase tracking-tight">
            Players
          </h1>

          <div className="mt-12 rounded-3xl border border-dashed border-white/10 bg-[#090909] p-12 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-600">
              Player Roster
            </p>

            <h2 className="mt-3 text-2xl font-black uppercase text-gray-400">
              Belum ada player
            </h2>

            <p className="mt-3 text-sm text-gray-600">
              Belum ada player aktif yang terdaftar di PINTO ESPORT.
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Duplikasi dua kali agar marquee selalu mempunyai
   * cukup isi untuk desktop maupun mobile.
   */
  const marqueePlayers = [
    ...players,
    ...players,
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[150px]" />

        <div className="absolute right-0 top-[35%] h-[500px] w-[500px] rounded-full bg-red-900/5 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize:
              "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-16 md:py-24">

        {/* ===================================================
            HEADER
        =================================================== */}

        <section className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
            Player Identity
          </p>

          <h1 className="mt-3 text-5xl font-black uppercase tracking-tight md:text-7xl">
            Players
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
            Kenali player yang terdaftar di PINTO ESPORT
            dan lihat perjalanan kompetitif mereka.
          </p>
        </section>

        {/* ===================================================
            MARQUEE
        =================================================== */}

        <section className="relative mt-14">

          {/* LEFT FADE */}

          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-16 bg-gradient-to-r from-[#050505] to-transparent md:w-32" />

          {/* RIGHT FADE */}

          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-16 bg-gradient-to-l from-[#050505] to-transparent md:w-32" />

          <div className="overflow-hidden py-5">

            <div className="players-marquee flex w-max gap-5">

              {marqueePlayers.map(
                (player, index) => (
                  <PlayerPublicCard
                    key={`${player.gameProfileId}-${index}`}
                    player={player}
                  />
                )
              )}

            </div>

          </div>
        </section>

        {/* ===================================================
            COUNT
        =================================================== */}

        <section className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700">
                Registered Players
              </p>

              <p className="mt-2 text-sm font-bold text-gray-500">
                {players.length} player
                {players.length !== 1
                  ? "s"
                  : ""}{" "}
                terdaftar
              </p>
            </div>

            <span className="hidden text-[9px] font-black uppercase tracking-[0.3em] text-red-500 sm:block">
              PINTO ESPORT
            </span>
          </div>
        </section>

      </div>

      {/* =====================================================
          MARQUEE ANIMATION
      ===================================================== */}

      <style jsx global>{`
        @keyframes players-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .players-marquee {
          animation: players-marquee 45s linear infinite;
          will-change: transform;
        }

        .players-marquee:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .players-marquee {
            animation-duration: 32s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .players-marquee {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}

// =============================================================
// PLAYER CARD
// =============================================================

function PlayerPublicCard({
  player,
}: {
  player: PublicPlayer;
}) {
  const laneIcon = getLaneIcon(player.lane);

  return (
    <article
      className="group relative w-[360px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-[#090909] transition duration-500 hover:-translate-y-1 hover:border-red-500/50 hover:bg-[#0c0c0c] hover:shadow-[0_20px_80px_rgba(239,68,68,0.08)] md:w-[430px]"
    >
      {/* TOP RED LINE */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-red-500 transition duration-500 group-hover:h-[4px]" />

      {/* DECORATION */}
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-red-500/[0.04] blur-3xl transition duration-500 group-hover:bg-red-500/[0.08]" />

      {/* HEADER */}
      <div className="relative flex items-center justify-between px-6 pt-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            PINTO ESPORT
          </p>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700">
            Player Card
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          {player.gameLogo ? (
            <img
              src={player.gameLogo}
              alt=""
              className="h-4 w-4 object-contain"
            />
          ) : null}

          <span className="text-[9px] font-black uppercase tracking-wide text-gray-400">
            {player.gameName}
          </span>
        </div>
      </div>

      {/* PLAYER AREA */}
      <Link
        href={`/players/${player.playerId}`}
        className="relative block"
      >
        <div className="flex gap-5 px-6 py-7">
          {/* PHOTO */}
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            {player.avatar ? (
              <img
                src={player.avatar}
                alt={player.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-red-500/10 text-4xl font-black text-red-500">
                {player.name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
              Player
            </p>

            <h2 className="mt-1 truncate text-2xl font-black uppercase tracking-tight">
              {player.name}
            </h2>

            <p className="mt-1 truncate text-xs font-bold uppercase tracking-wide text-gray-500">
              {player.ign}
            </p>

            {/* LANE */}
            <div className="mt-5 flex items-center gap-2">
              {laneIcon ? (
                <img
                  src={laneIcon}
                  alt={formatLane(player.lane)}
                  className="h-7 w-7 object-contain"
                />
              ) : null}

              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-500">
                {formatLane(player.lane)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* SQUAD */}
      {player.squadName ? (
        <div className="px-6 pb-6">
          <Link
            href={
              player.squadSlug
                ? `/squads/${player.squadSlug}`
                : "#"
            }
            className="flex min-w-0 items-center gap-2 text-gray-500 transition hover:text-white"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
              {player.squadLogo ? (
                <img
                  src={player.squadLogo}
                  alt={player.squadName}
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="text-[10px] font-black text-red-500">
                  {player.squadName
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>

            <span className="truncate text-[10px] font-black uppercase tracking-wide">
              {player.squadName}
            </span>

            <span className="ml-auto text-sm text-gray-700 transition group-hover:text-red-500">
              →
            </span>
          </Link>
        </div>
      ) : (
        <div className="px-6 pb-6">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-700">
            Belum memiliki squad
          </p>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-3 border-t border-white/10">
        <PublicStat
          value={player.achievements}
          label="Achievements"
        />

        <PublicStat
          value={player.wins}
          label="Wins"
        />

        <PublicStat
          value={player.matches}
          label="Matches"
        />
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-700">
          View Profile
        </span>

        <Link
          href={`/players/${player.playerId}`}
          className="text-lg text-gray-700 transition duration-300 hover:translate-x-1 hover:text-red-500"
          aria-label={`View ${player.name} profile`}
        >
          →
        </Link>
      </div>
    </article>
  );
}

function PublicStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="border-r border-white/10 px-3 py-5 text-center last:border-r-0">

      <p className="text-2xl font-black">
        {value}
      </p>

      <p className="mt-1 text-[8px] font-black uppercase tracking-[0.15em] text-gray-600">
        {label}
      </p>

    </div>
  );
}