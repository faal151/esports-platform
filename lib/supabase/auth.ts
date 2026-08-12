import { createClient } from "./server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      profile: null,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, role, bio, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to load profile:", profileError);
  }

  return {
    user,
    profile: profile ?? null,
  };
}
export async function requireUser() {
  const { user, profile } = await getCurrentUser();

  if (!user) {
    return null;
  }

  return {
    user,
    profile,
  };
}

export async function requireAdmin() {
  const { user, profile } = await getCurrentUser();

  if (!user || profile?.role !== "admin") {
    return null;
  }

  return {
    user,
    profile,
  };
}