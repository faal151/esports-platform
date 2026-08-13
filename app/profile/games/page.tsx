"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Game = {
  id: string;
  name: string;
  slug: string;
};

export default function GameProfilesPage() {
  const supabase = createClient();

  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState("");
  const [inGameName, setInGameName] = useState("");
  const [gameUid, setGameUid] = useState("");
  const [rank, setRank] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadGames() {
      const { data, error } = await supabase
        .from("games")
        .select("id, name, slug")
        .eq("status", "active")
        .order("name");

      if (error) {
        console.error(error);
        setError("Gagal mengambil daftar game.");
        setLoading(false);
        return;
      }

      setGames(data ?? []);
      setLoading(false);
    }

    loadGames();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!gameId) {
      setError("Pilih game terlebih dahulu.");
      return;
    }

    if (!inGameName.trim()) {
      setError("In-game name wajib diisi.");
      return;
    }

    if (!gameUid.trim()) {
      setError("Game UID wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Silakan login terlebih dahulu.");
        return;
      }

      const { error: insertError } = await supabase
        .from("player_game_profiles")
        .insert({
          player_id: user.id,
          game_id: gameId,
          in_game_name: inGameName.trim(),
          game_uid: gameUid.trim(),
          rank: rank.trim() || null,
          status: "active",
        });

      if (insertError) {
        console.error(insertError);

        if (insertError.code === "23505") {
          throw new Error(
            "Kamu sudah memiliki game profile untuk game ini."
          );
        }

        throw new Error(
          insertError.message || "Gagal menyimpan game profile."
        );
      }

      setSuccess("Game profile berhasil ditambahkan.");

      setGameId("");
      setInGameName("");
      setGameUid("");
      setRank("");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-red-500">
            Game Profile
          </p>

          <h1 className="text-4xl font-black uppercase">
            Add Game Profile
          </h1>

          <p className="mt-3 text-gray-500">
            Tambahkan identitas player kamu pada game yang kamu mainkan.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Game
            </label>

            {loading ? (
              <div className="rounded-xl border border-white/10 bg-black px-4 py-3 text-gray-500">
                Loading games...
              </div>
            ) : (
              <select
                value={gameId}
                onChange={(event) => setGameId(event.target.value)}
                disabled={saving}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-red-500"
              >
                <option value="">Pilih game</option>

                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              In-Game Name
            </label>

            <input
              value={inGameName}
              onChange={(event) => setInGameName(event.target.value)}
              placeholder="Contoh: Faal"
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-700 focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Game UID
            </label>

            <input
              value={gameUid}
              onChange={(event) => setGameUid(event.target.value)}
              placeholder="Contoh: 123456789"
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-700 focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Rank
            </label>

            <input
              value={rank}
              onChange={(event) => setRank(event.target.value)}
              placeholder="Contoh: Mythic"
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-700 focus:border-red-500"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || loading}
            className="w-full rounded-xl bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Game Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}