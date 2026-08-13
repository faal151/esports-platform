"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Game = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
};

type GameProfile = {
  id: string;
  game_id: string;
  in_game_name: string;
  game_uid: string;
  rank: string | null;
  status: string;
};

export default function CreateSquadPage() {
  const router = useRouter();
  const supabase = createClient();

  const [games, setGames] = useState<Game[]>([]);
  const [gameProfiles, setGameProfiles] = useState<GameProfile[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gameId, setGameId] = useState("");

  const [inGameName, setInGameName] = useState("");
  const [gameUid, setGameUid] = useState("");
  const [rank, setRank] = useState("");

  const [loading, setLoading] = useState(true);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * Load games + existing game profiles
   */
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const [gamesResult, profilesResult] = await Promise.all([
        supabase
          .from("games")
          .select("id, name, slug, logo_url")
          .eq("status", "active")
          .order("name"),

        supabase
          .from("player_game_profiles")
          .select(
            "id, game_id, in_game_name, game_uid, rank, status"
          )
          .eq("player_id", user.id)
          .eq("status", "active"),
      ]);

      if (gamesResult.error) {
        console.error(gamesResult.error);
        setError("Gagal mengambil daftar game.");
        setLoading(false);
        return;
      }

      if (profilesResult.error) {
        console.error(profilesResult.error);
        setError("Gagal mengambil game profile.");
        setLoading(false);
        return;
      }

      setGames(gamesResult.data ?? []);
      setGameProfiles(profilesResult.data ?? []);

      setLoading(false);
    }

    loadData();
  }, [router]);

  /*
   * Existing profile for selected game
   */
  const selectedProfile = gameProfiles.find(
    (profile) =>
      profile.game_id === gameId &&
      profile.status === "active"
  );

  /*
   * When game changes:
   * - Existing profile → automatically fill fields
   * - No profile → show empty fields
   */
  useEffect(() => {
    if (!gameId) {
      setInGameName("");
      setGameUid("");
      setRank("");
      return;
    }

    const profile = gameProfiles.find(
      (item) =>
        item.game_id === gameId &&
        item.status === "active"
    );

    if (profile) {
      setInGameName(profile.in_game_name);
      setGameUid(profile.game_uid);
      setRank(profile.rank ?? "");
    } else {
      setInGameName("");
      setGameUid("");
      setRank("");
    }
  }, [gameId, gameProfiles]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Nama squad wajib diisi.");
      return;
    }

    if (!gameId) {
      setError("Silakan pilih game.");
      return;
    }

    if (selectedProfile) {
      /*
       * Profile sudah ada.
       * Tidak perlu membuat profile baru.
       */
      await createSquad();
      return;
    }

    /*
     * Belum punya profile.
     * Validasi data profile terlebih dahulu.
     */
    if (!inGameName.trim()) {
      setError("In-game name wajib diisi.");
      return;
    }

    if (!gameUid.trim()) {
      setError("Game UID wajib diisi.");
      return;
    }

    setCheckingProfile(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      /*
       * Buat Game Profile otomatis
       */
      const { data: newProfile, error: profileError } =
        await supabase
          .from("player_game_profiles")
          .insert({
            player_id: user.id,
            game_id: gameId,
            in_game_name: inGameName.trim(),
            game_uid: gameUid.trim(),
            rank: rank.trim() || null,
            status: "active",
          })
          .select(
            "id, game_id, in_game_name, game_uid, rank, status"
          )
          .single();

      if (profileError || !newProfile) {
        console.error(profileError);

        if (profileError?.code === "23505") {
          /*
           * Kemungkinan profile baru saja dibuat
           * atau sudah ada.
           */
          setError(
            "Game profile untuk game ini sudah ada. Silakan coba lagi."
          );
        } else {
          setError(
            profileError?.message ||
              "Gagal membuat game profile."
          );
        }

        return;
      }

      /*
       * Simpan profile ke state.
       */
      setGameProfiles((current) => [
        ...current,
        newProfile,
      ]);

      /*
       * Lanjut membuat squad.
       */
      await createSquad();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan."
      );
    } finally {
      setCheckingProfile(false);
    }
  }

  async function createSquad() {
    setSubmitting(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const { data: squadId, error: createError } =
        await supabase.rpc("create_squad_with_game", {
          p_name: name.trim(),
          p_description: description.trim() || null,
          p_game_id: gameId,
        });

      if (createError) {
        console.error(createError);

        throw new Error(
          createError.message ||
            "Gagal membuat squad."
        );
      }

      if (!squadId) {
        throw new Error(
          "Squad berhasil dibuat tetapi ID tidak ditemukan."
        );
      }

      /*
       * Redirect ke squad.
       * Halaman /squads/[id] kita buat berikutnya.
       */
      router.push(`/squads/${squadId}`);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal membuat squad."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const selectedGame = games.find(
    (game) => game.id === gameId
  );

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-red-500">
            Create Squad
          </p>

          <h1 className="text-4xl font-black uppercase">
            Create Your Squad
          </h1>

          <p className="mt-3 text-gray-500">
            Buat squad dan pilih game division yang akan
            kamu pimpin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8"
        >
          {/* Squad Name */}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Squad Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Contoh: STG Esports"
              disabled={submitting || checkingProfile}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-700 focus:border-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Ceritakan sedikit tentang squad kamu..."
              rows={5}
              disabled={submitting || checkingProfile}
              className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-700 focus:border-red-500"
            />
          </div>

          {/* Game */}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Game Division
            </label>

            {loading ? (
              <div className="rounded-xl border border-white/10 bg-black px-4 py-3 text-gray-500">
                Loading games...
              </div>
            ) : (
              <select
                value={gameId}
                onChange={(event) =>
                  setGameId(event.target.value)
                }
                disabled={
                  submitting || checkingProfile
                }
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-red-500"
              >
                <option value="">
                  Pilih game
                </option>

                {games.map((game) => (
                  <option
                    key={game.id}
                    value={game.id}
                  >
                    {game.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Game Profile */}
          {gameId && selectedGame && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
              {selectedProfile ? (
                <>
                  <div className="mb-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-green-500">
                      Game Profile Found
                    </p>

                    <h2 className="mt-2 text-xl font-black">
                      {selectedGame.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Profile kamu sudah terdaftar.
                      Data akan digunakan sebagai identitas
                      Leader squad.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">
                        In-Game Name
                      </p>

                      <p className="mt-1 font-bold">
                        {selectedProfile.in_game_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Game UID
                      </p>

                      <p className="mt-1 font-bold">
                        {selectedProfile.game_uid}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Rank
                      </p>

                      <p className="mt-1 font-bold">
                        {selectedProfile.rank ||
                          "Belum diisi"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
                      Game Profile Required
                    </p>

                    <h2 className="mt-2 text-xl font-black">
                      {selectedGame.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Kamu belum memiliki profile untuk game
                      ini. Lengkapi data berikut untuk menjadi
                      Leader.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-300">
                        In-Game Name
                      </label>

                      <input
                        type="text"
                        value={inGameName}
                        onChange={(event) =>
                          setInGameName(
                            event.target.value
                          )
                        }
                        placeholder="Contoh: Faal"
                        disabled={
                          submitting ||
                          checkingProfile
                        }
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-700 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-300">
                        Game UID
                      </label>

                      <input
                        type="text"
                        value={gameUid}
                        onChange={(event) =>
                          setGameUid(event.target.value)
                        }
                        placeholder="Contoh: 123456789"
                        disabled={
                          submitting ||
                          checkingProfile
                        }
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-700 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-300">
                        Rank
                      </label>

                      <input
                        type="text"
                        value={rank}
                        onChange={(event) =>
                          setRank(event.target.value)
                        }
                        placeholder="Contoh: Mythic"
                        disabled={
                          submitting ||
                          checkingProfile
                        }
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-700 focus:border-red-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              submitting ||
              checkingProfile ||
              !gameId
            }
            className="w-full rounded-xl bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkingProfile
              ? "Saving Game Profile..."
              : submitting
                ? "Creating Squad..."
                : "Create Squad"}
          </button>
        </form>
      </div>
    </main>
  );
}