"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
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
  in_game_name: string | null;
  game_uid: string | null;
  rank: string | null;
  status: string;
  profile_data: Record<string, unknown> | null;
};

type SquadGame = {
  id: string;
  squad_id: string;
  game_id: string;
  leader_id: string;
  status: string;
};

type Squad = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
};

type SquadMember = {
  id: string;
  squad_game_id: string;
  player_game_profile_id: string;
  role: string;
  status: string;
};

type PlayerCardData = {
  id: string;
  name: string;
  avatar: string | null;
  ign: string;
  game: string;
  gameSlug: string;
  gameLogo: string | null;
  role: string;
  rank: string;
  teamName: string | null;
  teamLogo: string | null;
  teamId: string | null;

  // Belum tersedia di database
  achievements: number;
  wins: number;
  matches: number;
};

export default function PlayersPage() {
  const supabase = createClient();

  const [players, setPlayers] =
    useState<PlayerCardData[]>([]);

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
        // 1. PROFILES
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
              role
            `
          )
          .eq("role", "player")
          .order("full_name", {
            ascending: true,
          });

        if (profileError) {
          console.error(
            "Players profile error:",
            profileError
          );

          setError(
            "Daftar player belum dapat dimuat."
          );

          return;
        }

        const profiles =
          (profileData ?? []) as Profile[];

        if (profiles.length === 0) {
          setPlayers([]);
          return;
        }

        const playerIds =
          profiles.map(
            (profile) => profile.id
          );

        // =====================================================
        // 2. GAME PROFILES
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
              profile_data
            `
          )
          .in(
            "player_id",
            playerIds
          )
          .eq(
            "status",
            "active"
          );

        if (gameProfileError) {
          console.error(
            "Player game profile error:",
            gameProfileError
          );

          setError(
            "Data game player belum dapat dimuat."
          );

          return;
        }

        const gameProfiles =
          (gameProfileData ??
            []) as PlayerGameProfile[];

        const gameIds = [
          ...new Set(
            gameProfiles.map(
              (profile) =>
                profile.game_id
            )
          ),
        ];

        // =====================================================
        // 3. GAMES
        // =====================================================

        let games: Game[] = [];

        if (gameIds.length > 0) {
          const {
            data: gameData,
            error: gameError,
          } = await supabase
            .from("games")
            .select(
              `
                id,
                name,
                slug,
                logo_url
              `
            )
            .in(
              "id",
              gameIds
            )
            .eq(
              "status",
              "active"
            );

          if (gameError) {
            console.error(
              "Games error:",
              gameError
            );
          }

          games =
            (gameData ??
              []) as Game[];
        }

        // =====================================================
        // 4. SQUAD MEMBERS
        // =====================================================

        const gameProfileIds =
          gameProfiles.map(
            (profile) =>
              profile.id
          );

        let memberships:
          SquadMember[] = [];

        if (
          gameProfileIds.length > 0
        ) {
          const {
            data: membershipData,
            error: membershipError,
          } = await supabase
            .from("squad_members")
            .select(
              `
                id,
                squad_game_id,
                player_game_profile_id,
                role,
                status
              `
            )
            .in(
              "player_game_profile_id",
              gameProfileIds
            )
            .eq(
              "status",
              "active"
            );

          if (membershipError) {
            console.error(
              "Squad membership error:",
              membershipError
            );
          }

          memberships =
            (membershipData ??
              []) as SquadMember[];
        }

        // =====================================================
        // 5. SQUAD GAMES
        // =====================================================

        const squadGameIds = [
          ...new Set(
            memberships.map(
              (membership) =>
                membership.squad_game_id
            )
          ),
        ];

        let squadGames:
          SquadGame[] = [];

        if (
          squadGameIds.length > 0
        ) {
          const {
            data: squadGameData,
            error: squadGameError,
          } = await supabase
            .from("squad_games")
            .select(
              `
                id,
                squad_id,
                game_id,
                leader_id,
                status
              `
            )
            .in(
              "id",
              squadGameIds
            )
            .eq(
              "status",
              "active"
            );

          if (squadGameError) {
            console.error(
              "Squad games error:",
              squadGameError
            );
          }

          squadGames =
            (squadGameData ??
              []) as SquadGame[];
        }

        // =====================================================
        // 6. SQUADS
        // =====================================================

        const squadIds = [
          ...new Set(
            squadGames.map(
              (item) =>
                item.squad_id
            )
          ),
        ];

        let squads: Squad[] = [];

        if (
          squadIds.length > 0
        ) {
          const {
            data: squadData,
            error: squadError,
          } = await supabase
            .from("squads")
            .select(
              `
                id,
                name,
                slug,
                description,
                status
              `
            )
            .in(
              "id",
              squadIds
            )
            .eq(
              "status",
              "active"
            );

          if (squadError) {
            console.error(
              "Squads error:",
              squadError
            );
          }

          squads =
            (squadData ??
              []) as Squad[];
        }

        // =====================================================
        // MAP DATA
        // =====================================================

        const gameMap =
          new Map(
            games.map(
              (game) => [
                game.id,
                game,
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

        const squadGameMap =
          new Map(
            squadGames.map(
              (squadGame) => [
                squadGame.id,
                squadGame,
              ]
            )
          );

        const membershipMap =
          new Map<
            string,
            SquadMember[]
          >();

        memberships.forEach(
          (membership) => {
            const current =
              membershipMap.get(
                membership.player_game_profile_id
              ) ?? [];

            current.push(
              membership
            );

            membershipMap.set(
              membership.player_game_profile_id,
              current
            );
          }
        );

        // =====================================================
        // CREATE PLAYER CARDS
        // =====================================================

        const cards: PlayerCardData[] =
          [];

        profiles.forEach(
          (profile) => {
            const profileGames =
              gameProfiles.filter(
                (gameProfile) =>
                  gameProfile.player_id ===
                  profile.id
              );

            // -------------------------------------------------
            // Player belum memiliki game profile
            // -------------------------------------------------

            if (
              profileGames.length ===
              0
            ) {
              cards.push({
                id: profile.id,
                name:
                  profile.full_name ||
                  profile.username ||
                  "Player",
                avatar:
                  profile.avatar_url,
                ign:
                  profile.username ||
                  "PLAYER",
                game:
                  "Belum terdaftar",
                gameSlug: "",
                gameLogo: null,
                role:
                  "PLAYER",
                rank:
                  "Belum ada data",
                teamName: null,
                teamLogo: null,
                teamId: null,

                achievements: 0,
                wins: 0,
                matches: 0,
              });

              return;
            }

            // -------------------------------------------------
            // Satu card per game profile
            // -------------------------------------------------

            profileGames.forEach(
              (gameProfile) => {
                const game =
                  gameMap.get(
                    gameProfile.game_id
                  );

                const playerMemberships =
                  membershipMap.get(
                    gameProfile.id
                  ) ?? [];

                // Cari squad untuk game ini
                let selectedSquad:
                  Squad | null = null;

                let selectedSquadGame:
                  SquadGame | null =
                  null;

                let selectedMembership:
                  SquadMember | null =
                  null;

                for (
                  const membership of playerMemberships
                ) {
                  const squadGame =
                    squadGameMap.get(
                      membership.squad_game_id
                    );

                  if (
                    !squadGame ||
                    squadGame.game_id !==
                      gameProfile.game_id
                  ) {
                    continue;
                  }

                  const squad =
                    squadMap.get(
                      squadGame.squad_id
                    );

                  if (!squad) {
                    continue;
                  }

                  selectedSquad =
                    squad;

                  selectedSquadGame =
                    squadGame;

                  selectedMembership =
                    membership;

                  break;
                }

                // ------------------------------------------------
                // Role
                // ------------------------------------------------

                let playerRole =
                  "PLAYER";

                // Coba dari profile_data
                if (
                  gameProfile.profile_data
                ) {
                  const data =
                    gameProfile.profile_data;

                  const possibleRole =
                    data.role ??
                    data.main_role ??
                    data.position;

                  if (
                    typeof possibleRole ===
                    "string" &&
                    possibleRole.trim()
                  ) {
                    playerRole =
                      possibleRole;
                  }
                }

                // Kalau leader squad,
                // gunakan LEADER
                if (
                  selectedSquadGame &&
                  selectedSquadGame.leader_id ===
                    profile.id
                ) {
                  playerRole =
                    "LEADER";
                }

                // Kalau ada membership role
                else if (
                  selectedMembership?.role
                ) {
                  playerRole =
                    selectedMembership.role;
                }

                cards.push({
                  id: profile.id,

                  name:
                    profile.full_name ||
                    profile.username ||
                    "Player",

                  avatar:
                    profile.avatar_url,

                  ign:
                    gameProfile.in_game_name ||
                    profile.username ||
                    "PLAYER",

                  game:
                    game?.name ||
                    "Game",

                  gameSlug:
                    game?.slug ||
                    "",

                  gameLogo:
                    game?.logo_url ||
                    null,

                  role:
                    playerRole,

                  rank:
                    gameProfile.rank ||
                    "Belum ada data",

                  teamName:
                    selectedSquad?.name ||
                    null,

                  teamLogo:
                    null,

                  teamId:
                    selectedSquad?.id ||
                    null,

                  // Belum ada sumber data
                  achievements: 0,
                  wins: 0,
                  matches: 0,
                });
              }
            );
          }
        );

        setPlayers(cards);
      } catch (err) {
        console.error(
          "Unexpected players error:",
          err
        );

        setError(
          "Terjadi kesalahan saat memuat daftar player."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlayers();
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">

      <div className="mx-auto max-w-7xl">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-12">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            PINTO ESPORT
          </p>

          <h1 className="mt-3 text-5xl font-black uppercase tracking-tight">
            Players
          </h1>

          <p className="mt-4 max-w-2xl text-gray-500">
            Player profiles, identities, and competitive records.
          </p>

        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
                />
              )
            )}

          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading &&
          error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">

              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-xl font-black text-red-400">
                  !
                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                    Players
                  </p>

                  <h2 className="mt-2 text-xl font-black">
                    Daftar player belum tersedia
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {error}
                  </p>

                </div>

              </div>

            </div>
          )}

        {/* ===================================================
            EMPTY
        =================================================== */}

        {!loading &&
          !error &&
          players.length ===
            0 && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] text-2xl text-gray-600">
                —
              </div>

              <h2 className="mt-5 text-xl font-black uppercase">
                Belum ada player
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Belum ada player yang terdaftar di sistem.
              </p>

            </div>
          )}

        {/* ===================================================
            PLAYERS
        =================================================== */}

        {!loading &&
          !error &&
          players.length >
            0 && (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {players.map(
                (player) => (
                  <PlayerCardWrapper
                    key={`${player.id}-${player.gameSlug}`}
                    player={player}
                  />
                )
              )}

            </section>
          )}

      </div>

    </main>
  );
}

// ===========================================================
// PLAYER CARD WRAPPER
// ===========================================================

function PlayerCardWrapper({
  player,
}: {
  player: PlayerCardData;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#090909] transition duration-300 hover:-translate-y-1 hover:border-red-500/30">

      {/* GAME WATERMARK */}

      {player.gameLogo && (
        <img
          src={player.gameLogo}
          alt=""
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 object-contain opacity-[0.035] grayscale transition duration-500 group-hover:scale-110"
        />
      )}

      {/* TOP */}

      <div className="relative p-5">

        <div className="flex items-start gap-4">

          {/* PLAYER PHOTO */}

          <Link
            href={`/players/${player.id}`}
            className="group/photo shrink-0"
          >
            <div className="h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">

              {player.avatar ? (
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="h-full w-full object-cover transition duration-300 group-hover/photo:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-black text-red-500">
                  {player.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

            </div>
          </Link>

          {/* PLAYER INFO */}

          <div className="min-w-0 flex-1">

            <Link
              href={`/players/${player.id}`}
              className="block"
            >
              <h2 className="truncate text-2xl font-black uppercase transition group-hover:text-red-500">
                {player.name}
              </h2>
            </Link>

            <p className="mt-1 truncate text-xs font-bold uppercase tracking-wide text-gray-500">
              {player.ign}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <span className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase text-red-400">
                {player.role}
              </span>

              {player.game && (
                <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[9px] font-black uppercase text-gray-500">

                  {player.gameLogo && (
                    <img
                      src={
                        player.gameLogo
                      }
                      alt=""
                      className="h-3.5 w-3.5 object-contain"
                    />
                  )}

                  {player.game}

                </span>
              )}

            </div>

          </div>

        </div>

        {/* =================================================
            SQUAD
        ================================================= */}

        {player.teamId &&
          player.teamName ? (
          <Link
            href={`/squads/${player.teamId}`}
            className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 transition hover:border-red-500/30 hover:bg-red-500/[0.04]"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-sm font-black text-red-500">
              {player.teamName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
                Squad
              </p>

              <p className="truncate text-sm font-black uppercase">
                {player.teamName}
              </p>

            </div>

            <span className="text-gray-600 transition group-hover:text-red-500">
              →
            </span>

          </Link>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-3">

            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-700">
              Squad
            </p>

            <p className="mt-1 text-xs font-bold text-gray-600">
              Belum memiliki squad
            </p>

          </div>
        )}

      </div>

      {/* ===================================================
          STATS
      =================================================== */}

      <div className="grid grid-cols-3 border-t border-white/10">

        <PlayerMiniStat
          value={player.matches}
          label="Matches"
        />

        <PlayerMiniStat
          value={player.wins}
          label="Wins"
        />

        <PlayerMiniStat
          value={player.achievements}
          label="Awards"
        />

      </div>

    </article>
  );
}

// ===========================================================
// MINI STAT
// ===========================================================

function PlayerMiniStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="border-r border-white/10 px-3 py-4 text-center last:border-r-0">

      <p className="text-xl font-black">
        {value}
      </p>

      <p className="mt-1 text-[8px] font-black uppercase tracking-[0.15em] text-gray-600">
        {label}
      </p>

    </div>
  );
}