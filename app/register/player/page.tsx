"use client";

import { useEffect, useMemo, useState } from "react";
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
  in_game_name: string | null;
  game_uid: string | null;
  rank: string | null;
  main_lane: string | null;
  status: string;
  profile_data: Record<string, unknown> | null;
};

type ProfileField = {
  id: string;
  game_id: string;
  field_key: string;
  field_label: string;
  field_type:
    | "text"
    | "number"
    | "select"
    | "textarea"
    | "date";
  required: boolean;
  placeholder: string | null;
  description: string | null;
  sort_order: number;
  status: string;
};

type ProfileOption = {
  id: string;
  field_id: string;
  option_value: string;
  option_label: string;
  sort_order: number;
  status: string;
};

type SquadInfo = {
  squadId: string;
  squadName: string;
  squadSlug: string;
  role: "leader" | "member";
};

type SquadListItem = {
  squadGameId: string;
  squadId: string;
  gameId: string;
  name: string;
  slug: string;
  description: string | null;
  leaderId: string;
  leaderName: string;
};

type Filter = "all" | "registered" | "unregistered";

type AlertType = "error" | "warning" | "success" | "info";

type AlertState = {
  type: AlertType;
  title: string;
  message: string;
} | null;

export default function PlayerRegistrationPage() {
  const router = useRouter();
  const supabase = createClient();

  const [games, setGames] = useState<Game[]>([]);
  const [profiles, setProfiles] = useState<GameProfile[]>([]);
  const [fields, setFields] = useState<ProfileField[]>([]);
  const [options, setOptions] = useState<ProfileOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkingSquad, setCheckingSquad] = useState(false);
  const [loadingSquads, setLoadingSquads] = useState(false);
  const [joiningSquadId, setJoiningSquadId] = useState<string | null>(null);

  const [selectedGameId, setSelectedGameId] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [squadSearch, setSquadSearch] = useState("");

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [squadInfo, setSquadInfo] = useState<SquadInfo | null>(null);
  const [availableSquads, setAvailableSquads] = useState<SquadListItem[]>([]);
  const [alert, setAlert] = useState<AlertState>(null);

  function showAlert(type: AlertType, title: string, message: string) {
    setAlert({ type, title, message });
  }

  function closeAlert() {
    setAlert(null);
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        showAlert(
          "warning",
          "Sesi tidak ditemukan",
          "Silakan login terlebih dahulu untuk mendaftarkan game profile."
        );
        setLoading(false);
        setTimeout(() => router.push("/login"), 1000);
        return;
      }

      const [
        gamesResult,
        profilesResult,
        fieldsResult,
        optionsResult,
      ] = await Promise.all([
        supabase
          .from("games")
          .select("id, name, slug, logo_url")
          .eq("status", "active")
          .order("name"),
        supabase
          .from("player_game_profiles")
          .select(
            "id, game_id, in_game_name, game_uid, rank, main_lane, status, profile_data"
          )
          .eq("player_id", user.id)
          .eq("status", "active"),
        supabase
          .from("game_profile_fields")
          .select(
            "id, game_id, field_key, field_label, field_type, required, placeholder, description, sort_order, status"
          )
          .eq("status", "active")
          .order("sort_order"),
        supabase
          .from("game_profile_field_options")
          .select(
            "id, field_id, option_value, option_label, sort_order, status"
          )
          .eq("status", "active")
          .order("sort_order"),
      ]);

      if (gamesResult.error) {
        console.error("Games error:", gamesResult.error);
        showAlert(
          "error",
          "Game tidak dapat dimuat",
          "Daftar game gagal dimuat. Silakan refresh halaman dan coba lagi."
        );
        setLoading(false);
        return;
      }

      if (profilesResult.error) {
        console.error("Profiles error:", profilesResult.error);
        showAlert(
          "error",
          "Profile tidak dapat dimuat",
          "Game profile kamu gagal dimuat. Silakan refresh halaman dan coba lagi."
        );
        setLoading(false);
        return;
      }

      if (fieldsResult.error) {
        console.error("Fields error:", fieldsResult.error);
        showAlert(
          "error",
          "Konfigurasi profile tidak dapat dimuat",
          "Form profile game gagal dimuat. Silakan coba lagi atau hubungi admin."
        );
        setLoading(false);
        return;
      }

      if (optionsResult.error) {
        console.error("Options error:", optionsResult.error);
        showAlert(
          "error",
          "Pilihan profile tidak dapat dimuat",
          "Pilihan pada form game gagal dimuat. Silakan coba lagi."
        );
        setLoading(false);
        return;
      }

      const nextGames = gamesResult.data ?? [];
      setGames(nextGames);
      setProfiles(profilesResult.data ?? []);
      setFields(fieldsResult.data ?? []);
      setOptions(optionsResult.data ?? []);

      setLoading(false);
    }

    loadData();
  }, [router]);

  function getProfileForGame(gameId: string) {
    return profiles.find(
      (profile) => profile.game_id === gameId && profile.status === "active"
    );
  }

  function getFieldsForGame(gameId: string) {
    return fields
      .filter(
        (field) => field.game_id === gameId && field.status === "active"
      )
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  function getOptionsForField(fieldId: string) {
    return options
      .filter(
        (option) => option.field_id === fieldId && option.status === "active"
      )
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  const filteredGames = useMemo(() => {
    const query = search.trim().toLowerCase();

    return games.filter((game) => {
      const registered = Boolean(getProfileForGame(game.id));

      const matchesSearch =
        !query ||
        game.name.toLowerCase().includes(query) ||
        game.slug.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "registered" && registered) ||
        (filter === "unregistered" && !registered);

      return matchesSearch && matchesFilter;
    });
  }, [games, profiles, search, filter]);

  const filteredSquads = useMemo(() => {
    const query = squadSearch.trim().toLowerCase();

    if (!query) return availableSquads;

    return availableSquads.filter(
      (squad) =>
        squad.name.toLowerCase().includes(query) ||
        squad.slug.toLowerCase().includes(query) ||
        squad.leaderName.toLowerCase().includes(query)
    );
  }, [availableSquads, squadSearch]);

  async function loadAvailableSquads(gameId: string) {
    setLoadingSquads(true);

    try {
      const { data: squadGames, error: squadGamesError } = await supabase
        .from("squad_games")
        .select("id, squad_id, game_id, leader_id, status")
        .eq("game_id", gameId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (squadGamesError) {
        console.error("Available squad games error:", squadGamesError);
        setAvailableSquads([]);
        showAlert(
          "error",
          "Daftar squad tidak dapat dimuat",
          "Kami gagal mengambil daftar squad untuk game ini. Silakan coba lagi."
        );
        return;
      }

      if (!squadGames || squadGames.length === 0) {
        setAvailableSquads([]);
        return;
      }

      const squadIds = [...new Set(squadGames.map((item) => item.squad_id))];
      const leaderIds = [...new Set(squadGames.map((item) => item.leader_id))];

      const [{ data: squads, error: squadsError }, { data: leaderProfiles, error: leaderProfilesError }] =
        await Promise.all([
          supabase
            .from("squads")
            .select("id, name, slug, description, status")
            .in("id", squadIds)
            .eq("status", "active"),
          supabase
            .from("player_game_profiles")
            .select("player_id, in_game_name, profile_data, game_id, status")
            .in("player_id", leaderIds)
            .eq("game_id", gameId)
            .eq("status", "active"),
        ]);

      if (squadsError) {
        console.error("Available squads error:", squadsError);
        setAvailableSquads([]);
        showAlert(
          "error",
          "Data squad tidak dapat dimuat",
          "Informasi squad aktif tidak dapat dimuat."
        );
        return;
      }

      if (leaderProfilesError) {
        console.error("Leader profiles error:", leaderProfilesError);
      }

      const squadMap = new Map((squads ?? []).map((squad) => [squad.id, squad]));
      const leaderMap = new Map(
        (leaderProfiles ?? []).map((profile) => [
          profile.player_id,
          profile,
        ])
      );

      const result: SquadListItem[] = squadGames
        .map((squadGame) => {
          const squad = squadMap.get(squadGame.squad_id);
          if (!squad) return null;

          const leaderProfile = leaderMap.get(squadGame.leader_id);
          const profileData = leaderProfile?.profile_data;
          const dynamicIgn =
            profileData &&
            typeof profileData === "object" &&
            "ign" in profileData
              ? String(profileData.ign ?? "")
              : "";

          return {
            squadGameId: squadGame.id,
            squadId: squad.id,
            gameId: squadGame.game_id,
            name: squad.name,
            slug: squad.slug,
            description: squad.description,
            leaderId: squadGame.leader_id,
            leaderName:
              dynamicIgn ||
              leaderProfile?.in_game_name ||
              "Leader",
          };
        })
        .filter((item): item is SquadListItem => Boolean(item));

      setAvailableSquads(result);
    } catch (error) {
      console.error("Unexpected available squad error:", error);
      setAvailableSquads([]);
      showAlert(
        "error",
        "Terjadi kesalahan",
        "Daftar squad tidak dapat dimuat. Silakan coba lagi."
      );
    } finally {
      setLoadingSquads(false);
    }
  }

  async function handleSelectGame(gameId: string) {
    setSelectedGameId(gameId);
    setSquadInfo(null);
    setAvailableSquads([]);
    setSquadSearch("");
    setFormValues({});
    setAlert(null);

    const profile = getProfileForGame(gameId);

    if (!profile) {
      return;
    }

    const values: Record<string, string> = {};

    if (profile.profile_data) {
      Object.entries(profile.profile_data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          values[key] = String(value);
        }
      });
    }

    if (!values.ign && profile.in_game_name) {
      values.ign = profile.in_game_name;
    }

    if (!values.game_uid && profile.game_uid) {
      values.game_uid = profile.game_uid;
    }

    if (!values.rank && profile.rank) {
  values.rank = profile.rank;
}

if (!values.main_lane && profile.main_lane) {
  values.main_lane = profile.main_lane;
}

setFormValues(values);

    await checkSquadStatus(gameId, profile.id);
    await loadAvailableSquads(gameId);
  }

  function updateFieldValue(fieldKey: string, value: string) {
    setFormValues((current) => ({
      ...current,
      [fieldKey]: value,
    }));
    setAlert(null);
  }

  async function checkSquadStatus(gameId: string, profileId: string) {
    setCheckingSquad(true);
    setSquadInfo(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        showAlert(
          "warning",
          "Sesi telah berakhir",
          "Silakan login kembali untuk melanjutkan."
        );
        setTimeout(() => router.push("/login"), 1000);
        return;
      }

      const { data: leaderGame, error: leaderError } = await supabase
        .from("squad_games")
        .select("id, squad_id, game_id, leader_id, status")
        .eq("game_id", gameId)
        .eq("leader_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (leaderError) {
        console.error("Leader check error:", leaderError);
        showAlert(
          "error",
          "Gagal memeriksa squad",
          "Status squad kamu tidak dapat diperiksa. Silakan coba lagi."
        );
        return;
      }

      if (leaderGame) {
        const { data: squad, error: squadError } = await supabase
          .from("squads")
          .select("id, name, slug, status")
          .eq("id", leaderGame.squad_id)
          .eq("status", "active")
          .maybeSingle();

        if (squadError) {
          console.error("Squad leader error:", squadError);
          showAlert(
            "error",
            "Data squad tidak dapat dimuat",
            "Squad kamu ditemukan, tetapi informasinya tidak dapat dimuat."
          );
          return;
        }

        if (squad) {
          setSquadInfo({
            squadId: squad.id,
            squadName: squad.name,
            squadSlug: squad.slug,
            role: "leader",
          });
          return;
        }
      }

      const { data: member, error: memberError } = await supabase
        .from("squad_members")
        .select(
          "id, squad_game_id, player_game_profile_id, role, status"
        )
        .eq("player_game_profile_id", profileId)
        .eq("status", "active")
        .maybeSingle();

      if (memberError) {
        console.error("Member check error:", memberError);
        showAlert(
          "error",
          "Gagal memeriksa squad",
          "Status keanggotaan squad kamu tidak dapat diperiksa."
        );
        return;
      }

      if (!member) {
        setSquadInfo(null);
        return;
      }

      const { data: squadGame, error: squadGameError } = await supabase
        .from("squad_games")
        .select("id, squad_id, game_id, leader_id, status")
        .eq("id", member.squad_game_id)
        .eq("game_id", gameId)
        .eq("status", "active")
        .maybeSingle();

      if (squadGameError) {
        console.error("Squad game error:", squadGameError);
        showAlert(
          "error",
          "Data squad tidak dapat dimuat",
          "Informasi game squad kamu tidak dapat ditemukan."
        );
        return;
      }

      if (!squadGame) {
        setSquadInfo(null);
        return;
      }

      const { data: squad, error: squadError } = await supabase
        .from("squads")
        .select("id, name, slug, status")
        .eq("id", squadGame.squad_id)
        .eq("status", "active")
        .maybeSingle();

      if (squadError) {
        console.error("Squad member error:", squadError);
        showAlert(
          "error",
          "Data squad tidak dapat dimuat",
          "Informasi squad kamu tidak dapat dimuat. Silakan coba lagi."
        );
        return;
      }

      if (!squad) {
        setSquadInfo(null);
        return;
      }

      setSquadInfo({
        squadId: squad.id,
        squadName: squad.name,
        squadSlug: squad.slug,
        role: member.role === "leader" ? "leader" : "member",
      });
    } catch (error) {
      console.error("Unexpected squad error:", error);
      showAlert(
        "error",
        "Terjadi kesalahan",
        "Status squad tidak dapat diperiksa. Silakan coba lagi."
      );
    } finally {
      setCheckingSquad(false);
    }
  }

  async function handleJoinSquad(squadGameId: string, squadName: string) {
    if (!selectedGameId) return;

    const profile = getProfileForGame(selectedGameId);

    if (!profile) {
      showAlert(
        "warning",
        "Profile belum tersedia",
        "Daftarkan profile game terlebih dahulu sebelum bergabung ke squad."
      );
      return;
    }

    setJoiningSquadId(squadGameId);

    try {
      const { data, error } = await supabase.rpc("join_squad", {
        p_squad_game_id: squadGameId,
      });

      if (error) {
  console.error("Join squad error:", error);

  if (error.code === "23514") {
    showAlert(
      "error",
      "Belum bisa bergabung",
      "Squad belum dapat menerima anggota baru. Silakan coba lagi beberapa saat lagi."
    );

    return;
  }

  if (error.code === "42501") {
    showAlert(
      "error",
      "Tidak dapat bergabung",
      "Kamu tidak memiliki izin untuk bergabung ke squad ini."
    );

    return;
  }

  if (error.code === "23505") {
    showAlert(
      "info",
      "Sudah tergabung",
      "Kamu sudah menjadi anggota squad ini."
    );

    return;
  }

  showAlert(
    "error",
    "Gagal bergabung",
    "Kami belum dapat menambahkan kamu ke squad ini. Silakan coba lagi."
  );

  return;
}

      if (!data) {
        showAlert(
          "error",
          "Join squad gagal",
          "Server tidak mengembalikan ID member. Silakan coba lagi."
        );
        return;
      }

      showAlert(
  "success",
  "Berhasil bergabung!",
  `Kamu sekarang menjadi member ${squadName}.`
);

      await checkSquadStatus(selectedGameId, profile.id);

      setAvailableSquads((current) =>
        current.filter(
          (squad) => squad.squadGameId !== squadGameId
        )
      );
    } catch (error) {
      console.error("Unexpected join squad error:", error);
      showAlert(
        "error",
        "Terjadi kesalahan",
        "Kami tidak dapat menyelesaikan proses join squad. Silakan coba lagi."
      );
    } finally {
      setJoiningSquadId(null);
    }
  }

  async function handleSaveProfile() {
    if (!selectedGameId) {
      showAlert(
        "warning",
        "Pilih game terlebih dahulu",
        "Silakan pilih game yang ingin kamu daftarkan."
      );
      return;
    }

    const gameFields = getFieldsForGame(selectedGameId);

    if (gameFields.length === 0) {
      showAlert(
        "error",
        "Form belum tersedia",
        "Field profile untuk game ini belum dikonfigurasi oleh admin."
      );
      return;
    }

    for (const field of gameFields) {
      if (!field.required) continue;

      const value = formValues[field.field_key];

      if (value === undefined || value.trim() === "") {
        showAlert(
          "warning",
          "Data belum lengkap",
          `${field.field_label} wajib diisi sebelum profile dapat disimpan.`
        );
        return;
      }
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        showAlert(
          "warning",
          "Sesi telah berakhir",
          "Silakan login kembali untuk menyimpan profile."
        );
        setTimeout(() => router.push("/login"), 1000);
        return;
      }

      const profileData: Record<string, string> = {};

      for (const field of gameFields) {
        const value = formValues[field.field_key];

        if (value !== undefined && value.trim() !== "") {
          profileData[field.field_key] = value.trim();
        }
      }

      const legacyInGameName =
        profileData.ign ?? profileData.in_game_name ?? null;
      const legacyGameUid = profileData.game_uid ?? null;
      const legacyRank = profileData.rank ?? null;
      const mainLane = formValues.main_lane?.trim() || null;

      const {
        data: existingProfile,
        error: existingError,
      } = await supabase
        .from("player_game_profiles")
        .select(
          "id, game_id, in_game_name, game_uid, rank, status, profile_data"
        )
        .eq("player_id", user.id)
        .eq("game_id", selectedGameId)
        .maybeSingle();

      if (existingError) {
        console.error(existingError);
        showAlert(
          "error",
          "Profile tidak dapat diperiksa",
          "Kami gagal memeriksa profile yang sudah ada. Silakan coba lagi."
        );
        return;
      }

      if (existingProfile) {
        const oldData = existingProfile.profile_data ?? {};
        const mergedProfileData = {
          ...oldData,
          ...profileData,
        };

        const updateData: Record<string, unknown> = {
          profile_data: mergedProfileData,
          main_lane: mainLane,
        };

        if (legacyInGameName !== null) {
          updateData.in_game_name = legacyInGameName;
        }

        if (legacyGameUid !== null) {
          updateData.game_uid = legacyGameUid;
        }

        if (legacyRank !== null) {
          updateData.rank = legacyRank;
        }

        const {
          data: updatedProfile,
          error: updateError,
        } = await supabase
          .from("player_game_profiles")
          .update(updateData)
          .eq("id", existingProfile.id)
          .select(
            "id, game_id, in_game_name, game_uid, rank, main_lane, status, profile_data"
          )
          .single();

        if (updateError || !updatedProfile) {
          console.error("Update profile error:", updateError);

          if (updateError?.code === "42501") {
            showAlert(
              "error",
              "Akses ditolak",
              "Kamu tidak memiliki izin untuk memperbarui profile ini."
            );
            return;
          }

          showAlert(
            "error",
            "Profile gagal diperbarui",
            "Data profile tidak dapat diperbarui. Silakan coba lagi."
          );
          return;
        }

        setProfiles((current) =>
          current.map((profile) =>
            profile.id === updatedProfile.id ? updatedProfile : profile
          )
        );

        showAlert(
          "success",
          "Profile berhasil diperbarui",
          `Profile ${selectedGameName()} berhasil diperbarui.`
        );

        await checkSquadStatus(selectedGameId, updatedProfile.id);
        await loadAvailableSquads(selectedGameId);
        return;
      }

      const {
        data: newProfile,
        error: insertError,
      } = await supabase
        .from("player_game_profiles")
        .insert({
          player_id: user.id,
          game_id: selectedGameId,
          in_game_name: legacyInGameName || "Player",
          game_uid: legacyGameUid,
          rank: legacyRank,
          main_lane: mainLane,
          profile_data: profileData,
          status: "active",
        })
        .select(
          "id, game_id, in_game_name, game_uid, rank, main_lane, status, profile_data"
        )
        .single();

      if (insertError || !newProfile) {
        console.error("Insert profile error:", insertError);

        if (insertError?.code === "42501") {
          showAlert(
            "error",
            "Akses ditolak",
            "Kamu tidak memiliki izin untuk mendaftarkan profile ini."
          );
          return;
        }

        if (insertError?.code === "23505") {
          showAlert(
            "warning",
            "Profile sudah terdaftar",
            `Profile ${selectedGameName()} sudah terdaftar untuk akun kamu.`
          );
          return;
        }

        showAlert(
          "error",
          "Profile gagal disimpan",
          "Profile tidak dapat disimpan. Silakan coba lagi."
        );
        return;
      }

      setProfiles((current) => [...current, newProfile]);

      showAlert(
        "success",
        "Profile berhasil didaftarkan",
        `Profile ${selectedGameName()} berhasil didaftarkan.`
      );

      await checkSquadStatus(selectedGameId, newProfile.id);
      await loadAvailableSquads(selectedGameId);
    } catch (error) {
      console.error("Unexpected save error:", error);
      showAlert(
        "error",
        "Terjadi kesalahan",
        "Terjadi kesalahan yang tidak terduga. Silakan coba lagi."
      );
    } finally {
      setSaving(false);
    }
  }

  function selectedGameName() {
    return games.find((game) => game.id === selectedGameId)?.name ?? "game";
  }

  function handleCreateSquad() {
    if (!selectedGameId) {
      showAlert(
        "warning",
        "Game belum dipilih",
        "Silakan pilih game terlebih dahulu."
      );
      return;
    }

    router.push(
      `/squads/create?game=${encodeURIComponent(selectedGameId)}`
    );
  }

  function renderField(field: ProfileField) {
    const value = formValues[field.field_key] ?? "";
    const fieldOptions = getOptionsForField(field.id);

    const commonClass =
      "w-full rounded-2xl border border-white/10 bg-black px-4 py-3.5 text-white outline-none transition placeholder:text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 disabled:opacity-50";

    return (
      <div key={field.id}>
        <label className="mb-2 block text-sm font-bold text-gray-300">
          {field.field_label}
          {field.required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>

        {field.description && (
          <p className="mb-2 text-xs leading-5 text-gray-600">
            {field.description}
          </p>
        )}

        {field.field_type === "textarea" && (
          <textarea
            value={value}
            onChange={(event) =>
              updateFieldValue(field.field_key, event.target.value)
            }
            placeholder={field.placeholder ?? ""}
            disabled={saving}
            rows={4}
            className={commonClass}
          />
        )}

        {field.field_type === "select" && (
          <select
            value={value}
            onChange={(event) =>
              updateFieldValue(field.field_key, event.target.value)
            }
            disabled={saving}
            className={commonClass}
          >
            <option value="">
              {field.placeholder || `Pilih ${field.field_label}`}
            </option>
            {fieldOptions.map((option) => (
              <option key={option.id} value={option.option_value}>
                {option.option_label}
              </option>
            ))}
          </select>
        )}

        {field.field_type !== "textarea" &&
          field.field_type !== "select" && (
            <input
              type={
                field.field_type === "number"
                  ? "number"
                  : field.field_type === "date"
                  ? "date"
                  : "text"
              }
              value={value}
              onChange={(event) =>
                updateFieldValue(field.field_key, event.target.value)
              }
              placeholder={field.placeholder ?? ""}
              disabled={saving}
              className={commonClass}
            />
          )}
      </div>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.02] p-8">
            <div className="h-3 w-32 rounded bg-white/10" />
            <div className="mt-4 h-10 w-80 rounded bg-white/10" />
            <div className="mt-3 h-4 w-96 max-w-full rounded bg-white/5" />
            <div className="mt-10 h-16 rounded-2xl bg-white/5" />
            <div className="mt-3 h-16 rounded-2xl bg-white/5" />
            <div className="mt-3 h-16 rounded-2xl bg-white/5" />
          </div>
        </div>
      </main>
    );
  }

  const selectedGame = games.find(
    (game) => game.id === selectedGameId
  );
  const selectedProfile = selectedGameId
    ? getProfileForGame(selectedGameId)
    : undefined;
  const selectedFields = selectedGameId
    ? getFieldsForGame(selectedGameId)
    : [];

  return (
    <>
      {alert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="alert-title"
        >
          <div
            className={`w-full max-w-md overflow-hidden rounded-3xl border bg-[#0b0b0b] shadow-2xl ${
              alert.type === "error"
                ? "border-red-500/30"
                : alert.type === "warning"
                ? "border-yellow-500/30"
                : alert.type === "success"
                ? "border-green-500/30"
                : "border-blue-500/30"
            }`}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${
                    alert.type === "error"
                      ? "bg-red-500/10 text-red-400"
                      : alert.type === "warning"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : alert.type === "success"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  {alert.type === "success"
                    ? "✓"
                    : alert.type === "info"
                    ? "i"
                    : "!"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 id="alert-title" className="text-lg font-black text-white">
                    {alert.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {alert.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeAlert}
                  className="text-2xl leading-none text-gray-600 transition hover:text-white"
                  aria-label="Tutup"
                >
                  ×
                </button>
              </div>

              <button
                type="button"
                onClick={closeAlert}
                className={`mt-6 w-full rounded-xl px-5 py-3 text-sm font-black uppercase transition ${
                  alert.type === "error"
                    ? "bg-red-600 hover:bg-red-500"
                    : alert.type === "warning"
                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                    : alert.type === "success"
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#050505] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-red-500">
              Player Registration
            </p>
            <h1 className="text-3xl font-black uppercase sm:text-4xl">
              Register Your Game Profile
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Pilih game untuk mendaftarkan profile, memperbarui data, atau
              bergabung dengan squad.
            </p>
          </div>

          <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                ⌕
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari game..."
                className="w-full rounded-2xl border border-white/10 bg-black py-3.5 pl-11 pr-4 text-white outline-none placeholder:text-gray-700 focus:border-red-500"
              />
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {[
                ["all", "Semua"],
                ["registered", "Terdaftar"],
                ["unregistered", "Belum Terdaftar"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value as Filter)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black uppercase transition ${
                    filter === value
                      ? "bg-red-600 text-white"
                      : "border border-white/10 bg-white/[0.02] text-gray-500 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-600">
                  Game
                </p>
                <p className="mt-1 text-sm font-bold text-gray-400">
                  {filteredGames.length} game tersedia
                </p>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-gray-500">
                {games.length}
              </span>
            </div>

            {filteredGames.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-bold text-gray-400">Tidak ada game ditemukan.</p>
                <p className="mt-2 text-sm text-gray-600">
                  Coba ubah pencarian atau filter.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 p-3 sm:grid-cols-2">
                {filteredGames.map((game) => {
                  const profile = getProfileForGame(game.id);
                  const registered = Boolean(profile);
                  const selected = selectedGameId === game.id;

                  return (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => handleSelectGame(game.id)}
                      className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-red-500/50 bg-red-500/[0.08] shadow-[0_0_0_1px_rgba(239,68,68,0.12)]"
                          : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/5 font-black text-lg">
                        {game.logo_url ? (
                          <img
                            src={game.logo_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          game.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-black">{game.name}</h3>
                        {registered && profile ? (
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {profile.profile_data?.ign
                              ? String(profile.profile_data.ign)
                              : profile.in_game_name || "Profile terdaftar"}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-gray-600">
                            Belum memiliki profile
                          </p>
                        )}
                      </div>

                      <div className="shrink-0">
                        {registered ? (
                          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1.5 text-[9px] font-black uppercase text-green-400">
                            ✓ Terdaftar
                          </span>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[9px] font-black uppercase text-gray-500">
                            + Daftar
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {selectedGame && (
            <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="border-b border-white/10 p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/5 font-black">
                    {selectedGame.logo_url ? (
                      <img
                        src={selectedGame.logo_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      selectedGame.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                      Selected Game
                    </p>
                    <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                      {selectedGame.name}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {selectedFields.length === 0 ? (
                  <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
                    <p className="font-bold text-yellow-400">
                      Form profile belum tersedia
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Admin belum mengatur field profile untuk game ini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">

  {/* MOBILE LEGENDS MAIN LANE */}
  {selectedGame.slug === "mobile-legends" && (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-300">
        Main Lane
        <span className="ml-1 text-red-500">*</span>
      </label>

      <p className="mb-2 text-xs leading-5 text-gray-600">
        Pilih lane utama yang kamu gunakan dalam Mobile Legends.
      </p>

      <select
        value={formValues.main_lane ?? ""}
        onChange={(event) =>
          updateFieldValue(
            "main_lane",
            event.target.value
          )
        }
        disabled={saving}
        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3.5 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
      >
        <option value="">
          Pilih Main Lane
        </option>

        <option value="exp lane">
          EXP Lane
        </option>

        <option value="mid lane">
          Mid Lane
        </option>

        <option value="gold lane">
          Gold Lane
        </option>

        <option value="jungler">
          Jungler
        </option>

        <option value="roamer">
          Roamer
        </option>
      </select>
    </div>
  )}

  {selectedFields.map(renderField)}

  <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full rounded-2xl bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-wide transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving
                        ? "Menyimpan..."
                        : selectedProfile
                        ? "Simpan Perubahan"
                        : "Daftarkan Profile"}
                    </button>
                  </div>
                )}

                {selectedProfile && (
                  <div className="mt-10 border-t border-white/10 pt-8">
                    <div className="mb-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                        Squad
                      </p>
                      <h2 className="mt-2 text-xl font-black">
                        Status Squad
                      </h2>
                    </div>

                    {checkingSquad ? (
                      <div className="animate-pulse rounded-2xl border border-white/10 bg-black/30 p-6">
                        <div className="h-4 w-32 rounded bg-white/10" />
                        <div className="mt-3 h-7 w-56 rounded bg-white/10" />
                        <div className="mt-5 h-10 w-32 rounded-xl bg-white/5" />
                      </div>
                    ) : squadInfo ? (
                      <div className="rounded-2xl border border-green-500/25 bg-green-500/[0.06] p-5 sm:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-xl font-black text-green-400">
                            ✓
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">
                              Kamu sudah tergabung
                            </p>
                            <h3 className="mt-1 truncate text-xl font-black">
                              {squadInfo.squadName}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Role kamu{" "}
                              <span className="font-black uppercase text-white">
                                {squadInfo.role}
                              </span>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/squads/${squadInfo.squadId}`)
                            }
                            className="rounded-xl border border-white/10 px-5 py-3 text-xs font-black uppercase transition hover:border-white/30 hover:bg-white/5"
                          >
                            Buka Squad
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-gray-400">
                              +
                            </div>
                            <div className="flex-1">
                              <p className="font-black">Belum memiliki squad</p>
                              <p className="mt-1 text-sm leading-6 text-gray-500">
                                Kamu bisa membuat squad sendiri atau bergabung
                                dengan squad yang sudah tersedia.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleCreateSquad}
                              className="rounded-xl bg-red-600 px-5 py-3 text-xs font-black uppercase transition hover:bg-red-500"
                            >
                              Buat Squad
                            </button>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                Squad tersedia
                              </p>
                              <h3 className="mt-2 text-xl font-black">
                                Bergabung ke Squad
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Pilih squad yang sesuai. Role kamu otomatis
                                menjadi member.
                              </p>
                            </div>

                            {availableSquads.length > 0 && (
                              <div className="w-full sm:w-64">
                                <input
                                  type="search"
                                  value={squadSearch}
                                  onChange={(event) =>
                                    setSquadSearch(event.target.value)
                                  }
                                  placeholder="Cari squad atau leader..."
                                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-red-500"
                                />
                              </div>
                            )}
                          </div>

                          {loadingSquads ? (
                            <div className="mt-5 space-y-3">
                              {[1, 2].map((item) => (
                                <div
                                  key={item}
                                  className="animate-pulse rounded-2xl border border-white/10 bg-black/30 p-5"
                                >
                                  <div className="h-4 w-40 rounded bg-white/10" />
                                  <div className="mt-3 h-3 w-56 rounded bg-white/5" />
                                  <div className="mt-5 h-10 w-28 rounded-xl bg-white/5" />
                                </div>
                              ))}
                            </div>
                          ) : availableSquads.length === 0 ? (
                            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
                              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-xl text-gray-500">
                                +
                              </div>
                              <p className="mt-4 font-bold text-gray-400">
                                Belum ada squad lain
                              </p>
                              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                                Belum ada squad aktif yang bisa kamu ikuti untuk
                                game ini. Kamu bisa menjadi leader dengan membuat
                                squad sendiri.
                              </p>
                            </div>
                          ) : filteredSquads.length === 0 ? (
                            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-8 text-center">
                              <p className="font-bold text-gray-400">
                                Squad tidak ditemukan
                              </p>
                              <p className="mt-2 text-sm text-gray-600">
                                Coba gunakan kata pencarian lain.
                              </p>
                            </div>
                          ) : (
                            <div className="mt-5 grid gap-3 lg:grid-cols-2">
                              {filteredSquads.map((squad) => {
                                const joining =
                                  joiningSquadId === squad.squadGameId;

                                return (
                                  <div
                                    key={squad.squadGameId}
                                    className="group rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-white/20 hover:bg-white/[0.03]"
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 font-black text-red-400">
                                        {squad.name.charAt(0).toUpperCase()}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <h4 className="truncate font-black">
                                          {squad.name}
                                        </h4>
                                        <p className="mt-1 text-xs text-gray-600">
                                          Leader:{" "}
                                          <span className="text-gray-400">
                                            {squad.leaderName}
                                          </span>
                                        </p>
                                      </div>

                                      <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-black uppercase text-gray-600">
                                        Active
                                      </span>
                                    </div>

                                    {squad.description && (
                                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                                        {squad.description}
                                      </p>
                                    )}

                                    <div className="mt-5 flex items-center justify-between gap-3">
                                      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
                                        Role otomatis: Member
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleJoinSquad(
                                            squad.squadGameId,
                                            squad.name
                                          )
                                        }
                                        disabled={joiningSquadId !== null}
                                        className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black uppercase transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        {joining
                                          ? "Bergabung..."
                                          : "Join Squad"}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}