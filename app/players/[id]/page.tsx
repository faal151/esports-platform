"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  main_lane: string | null;
  status: string;
};

type SquadMember = {
  id: string;
  squad_game_id: string;
  player_game_profile_id: string;
  role: string;
  status: string;
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
  logo_url: string | null;
  status: string;
};

export default function PlayerDetailPage() {
  const params = useParams();
  const supabase = createClient();

  const playerId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [gameProfiles, setGameProfiles] =
    useState<PlayerGameProfile[]>([]);

  const [games, setGames] =
    useState<Game[]>([]);

  const [squadData, setSquadData] =
    useState<
      {
        gameProfileId: string;
        squad: Squad;
        role: string;
        isLeader: boolean;
      }[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!playerId) return;

    async function loadPlayer() {
      setLoading(true);
      setError("");

      try {
        // =====================================================
        // 1. PROFILE BERDASARKAN URL ID
        // =====================================================

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(`
            id,
            username,
            full_name,
            avatar_url,
            role
          `)
          .eq("id", playerId)
          .single();

        if (profileError) {
          console.error(
            "Player profile error:",
            profileError
          );

          setError(
            "Player tidak ditemukan."
          );

          return;
        }

        setProfile(
          profileData as Profile
        );

        // =====================================================
        // 2. GAME PROFILE PLAYER INI SAJA
        // =====================================================

        const {
          data: gameProfileData,
          error: gameProfileError,
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
            status
          `)
          .eq("player_id", playerId)
          .eq("status", "active")
          .order("created_at", {
            ascending: true,
          });

        if (gameProfileError) {
          console.error(
            "Player game profile error:",
            gameProfileError
          );

          setError(
            "Data game player tidak dapat dimuat."
          );

          return;
        }

        const playerGameProfiles =
          (gameProfileData ??
            []) as PlayerGameProfile[];

        setGameProfiles(
          playerGameProfiles
        );

        // =====================================================
        // 3. GAMES
        // =====================================================

        const gameIds = [
          ...new Set(
            playerGameProfiles.map(
              (item) => item.game_id
            )
          ),
        ];

        let playerGames: Game[] = [];

        if (gameIds.length > 0) {
          const {
            data: gameData,
            error: gameError,
          } = await supabase
            .from("games")
            .select(`
              id,
              name,
              slug,
              logo_url
            `)
            .in("id", gameIds);

          if (gameError) {
            console.error(
              "Games error:",
              gameError
            );
          }

          playerGames =
            (gameData ??
              []) as Game[];
        }

        setGames(playerGames);

        // =====================================================
        // 4. SQUAD MEMBERS PLAYER INI
        // =====================================================

        const gameProfileIds =
          playerGameProfiles.map(
            (item) => item.id
          );

        let memberships:
          SquadMember[] = [];

        if (gameProfileIds.length > 0) {
          const {
            data: membershipData,
            error: membershipError,
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
              gameProfileIds
            )
            .eq("status", "active");

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
              (item) =>
                item.squad_game_id
            )
          ),
        ];

        let squadGames:
          SquadGame[] = [];

        if (squadGameIds.length > 0) {
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
            .in(
              "id",
              squadGameIds
            )
            .eq("status", "active");

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
              (item) => item.squad_id
            )
          ),
        ];

        let squads: Squad[] = [];

        if (squadIds.length > 0) {
          const {
            data: squadDataResult,
            error: squadError,
          } = await supabase
            .from("squads")
            .select(`
              id,
              name,
              slug,
              description,
              logo_url,
              status
            `)
            .in(
              "id",
              squadIds
            );

          if (squadError) {
            console.error(
              "Squads error:",
              squadError
            );
          }

          squads =
            (squadDataResult ??
              []) as Squad[];
        }

        // =====================================================
        // 7. MAP
        // =====================================================

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
              (item) => [
                item.id,
                item,
              ]
            )
          );

        const result:
          {
            gameProfileId: string;
            squad: Squad;
            role: string;
            isLeader: boolean;
          }[] = [];

        memberships.forEach(
          (membership) => {
            const squadGame =
              squadGameMap.get(
                membership.squad_game_id
              );

            if (!squadGame) return;

            const squad =
              squadMap.get(
                squadGame.squad_id
              );

            if (!squad) return;

            result.push({
              gameProfileId:
                membership.player_game_profile_id,

              squad,

              role:
                membership.role ||
                "MEMBER",

              isLeader:
                squadGame.leader_id ===
                playerId,
            });
          }
        );

        setSquadData(result);
      } catch (err) {
        console.error(
          "Unexpected player detail error:",
          err
        );

        setError(
          "Terjadi kesalahan saat memuat profile player."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlayer();
  }, [playerId]);

  // ===========================================================
  // LOADING
  // ===========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-white/10" />
            <div className="mt-5 h-12 w-72 rounded bg-white/10" />
            <div className="mt-8 h-[350px] rounded-3xl bg-white/[0.03]" />
          </div>
        </div>
      </main>
    );
  }

  // ===========================================================
  // ERROR / NOT FOUND
  // ===========================================================

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/players"
            className="text-xs font-black uppercase tracking-[0.2em] text-gray-600 transition hover:text-red-500"
          >
            ← Back to Players
          </Link>

          <div className="mt-12 rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
              PINTO ESPORT
            </p>

            <h1 className="mt-3 text-4xl font-black uppercase">
              Player Not Found
            </h1>

            <p className="mt-4 text-sm text-gray-500">
              {error ||
                "Profile player tidak ditemukan."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const displayName =
    profile.full_name ||
    profile.username ||
    "PLAYER";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[150px]" />

        <div className="absolute right-0 top-[35%] h-[500px] w-[500px] rounded-full bg-red-900/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">

        {/* BACK */}

        <Link
          href="/players"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-600 transition hover:text-red-500"
        >
          ← Players
        </Link>

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#090909]">

          <div className="h-1 bg-red-500" />

          <div className="relative p-7 md:p-10">

            <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-red-500/[0.04] blur-[100px]" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-center">

              {/* AVATAR */}

              <div className="h-36 w-36 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:h-44 md:w-44">

                {profile.avatar_url ? (
                  <img
                    src={
                      profile.avatar_url
                    }
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-red-500/10 text-6xl font-black text-red-500">
                    {displayName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

              </div>

              {/* INFO */}

              <div className="min-w-0">

                <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
                  Player Profile
                </p>

                <h1 className="mt-3 break-words text-4xl font-black uppercase tracking-tight md:text-6xl">
                  {displayName}
                </h1>

                {profile.username && (
                  <p className="mt-2 text-sm font-bold text-gray-500">
                    @{profile.username}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">

                  <span className="rounded-xl bg-red-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-red-400">
                    PLAYER
                  </span>

                  <span className="rounded-xl border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-gray-500">
                    {gameProfiles.length} GAME
                    {gameProfiles.length !==
                    1
                      ? "S"
                      : ""}
                  </span>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ===================================================
            GAME PROFILES
        =================================================== */}

        <section className="mt-12">

          <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
            Competitive Identity
          </p>

          <h2 className="mt-3 text-4xl font-black uppercase">
            Game Profiles
          </h2>

          {gameProfiles.length ===
          0 ? (
            <div className="mt-7 rounded-3xl border border-dashed border-white/10 p-8">
              <p className="text-sm text-gray-600">
                Player belum memiliki game profile aktif.
              </p>
            </div>
          ) : (
            <div className="mt-7 grid gap-5 md:grid-cols-2">

              {gameProfiles.map(
                (gameProfile) => {
                  const game =
                    games.find(
                      (item) =>
                        item.id ===
                        gameProfile.game_id
                    );

                  const squad =
                    squadData.find(
                      (item) =>
                        item.gameProfileId ===
                        gameProfile.id
                    );

                  return (
                    <article
                      key={
                        gameProfile.id
                      }
                      className="overflow-hidden rounded-3xl border border-white/10 bg-[#090909]"
                    >

                      {/* GAME HEADER */}

                      <div className="flex items-center justify-between border-b border-white/10 p-6">

                        <div className="flex items-center gap-3">

                          {game?.logo_url ? (
                            <img
                              src={
                                game.logo_url
                              }
                              alt=""
                              className="h-10 w-10 object-contain"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-sm font-black text-red-500">
                              G
                            </div>
                          )}

                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                              Game
                            </p>

                            <p className="mt-1 text-sm font-black uppercase">
                              {game?.name ||
                                "Game"}
                            </p>
                          </div>

                        </div>

                        <span className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase text-red-400">
                          ACTIVE
                        </span>

                      </div>

                      {/* GAME INFO */}

                      <div className="p-6">

                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                          In Game Name
                        </p>

                        <h3 className="mt-2 text-3xl font-black uppercase">
                          {gameProfile.in_game_name ||
                            "PLAYER"}
                        </h3>

                        <div className="mt-6 grid grid-cols-2 gap-4">

                          <DetailItem
                            label="Rank"
                            value={
                              gameProfile.rank ||
                              "Belum ada"
                            }
                          />

                          <DetailItem
                            label="Game UID"
                            value={
                              gameProfile.game_uid ||
                              "Belum ada"
                            }
                          />

                          <DetailItem
                            label="Lane"
                            value={
                              gameProfile.main_lane ||
                              "Belum ditentukan"
                            }
                          />

                          <DetailItem
                            label="Status"
                            value="Active"
                          />

                        </div>

                        {/* SQUAD */}

                        {squad && (
                          <Link
                            href={`/squads/${squad.squad.id}`}
                            className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-red-500/30 hover:bg-red-500/[0.03]"
                          >

                            {squad.squad.logo_url ? (
                              <img
                                src={
                                  squad.squad.logo_url
                                }
                                alt={
                                  squad.squad.name
                                }
                                className="h-12 w-12 rounded-xl object-contain"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-lg font-black text-red-500">
                                {squad.squad.name
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0 flex-1">

                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                                Squad
                              </p>

                              <p className="mt-1 truncate text-sm font-black uppercase">
                                {squad.squad.name}
                              </p>

                              <p className="mt-1 text-[9px] font-bold uppercase text-red-500">
                                {squad.isLeader
                                  ? "Leader"
                                  : squad.role}
                              </p>

                            </div>

                            <span className="text-gray-600">
                              →
                            </span>

                          </Link>
                        )}

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* ===================================================
            STATS PLACEHOLDER
        =================================================== */}

        <section className="mt-12">

          <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
            Competitive Record
          </p>

          <h2 className="mt-3 text-4xl font-black uppercase">
            Statistics
          </h2>

          <div className="mt-7 grid grid-cols-3 overflow-hidden rounded-3xl border border-white/10 bg-[#090909]">

            <Stat
              value={0}
              label="Matches"
            />

            <Stat
              value={0}
              label="Wins"
            />

            <Stat
              value={0}
              label="Awards"
            />

          </div>

          <p className="mt-4 text-xs text-gray-700">
            Statistik kompetitif akan tersedia setelah modul pertandingan diaktifkan.
          </p>

        </section>

      </div>
    </main>
  );
}

// =============================================================
// DETAIL ITEM
// =============================================================

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">

      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-700">
        {label}
      </p>

      <p className="mt-2 truncate text-xs font-black uppercase text-gray-400">
        {value}
      </p>

    </div>
  );
}

// =============================================================
// STAT
// =============================================================

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="border-r border-white/10 px-4 py-7 text-center last:border-r-0">

      <p className="text-3xl font-black">
        {value}
      </p>

      <p className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

    </div>
  );
}