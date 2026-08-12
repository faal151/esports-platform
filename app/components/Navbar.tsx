"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UserProfile = {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
};

const publicNavItems = [
  {
    label: "Tournaments",
    href: "/tournaments",
  },
  {
    label: "Players",
    href: "/players",
  },
  {
    label: "Teams",
    href: "/teams",
  },
  {
    label: "Sponsors",
    href: "/sponsors",
  },
];

const playerNavItems = [
  {
    label: "Tournaments",
    href: "/tournaments",
  },
  {
    label: "Dashboard",
    href: "/player",
  },
  {
    label: "Squads",
    href: "/squads",
  },
  {
    label: "Players",
    href: "/players",
  },
];

const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Tournaments",
    href: "/tournaments",
  },
  {
    label: "Players",
    href: "/players",
  },
  {
    label: "Squads",
    href: "/squads",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    let mounted = true;

    async function loadAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username, full_name, avatar_url, role")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;

        setProfile(profileData);
      } else {
        setProfile(null);
      }

      setCheckingAuth(false);
    }

    loadAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setCheckingAuth(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, role")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!mounted) return;

      setProfile(profileData);
      setCheckingAuth(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    setUser(null);
    setProfile(null);

    router.push("/");
    router.refresh();
  }

  /*
   * Saat auth masih diperiksa, kita tetap tampilkan
   * navbar publik agar navbar tidak menghilang.
   */
  const isAuthenticated = !checkingAuth && !!user;
  const isAdmin = isAuthenticated && profile?.role === "admin";

  const navItems = isAdmin
    ? adminNavItems
    : isAuthenticated
      ? playerNavItems
      : publicNavItems;

  const displayName =
    profile?.full_name ||
    profile?.username ||
    user?.email?.split("@")[0] ||
    "Player";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* LOGO */}
        <Link
          href="/"
          className="group shrink-0 text-xl font-black tracking-wider"
        >
          PINTO{" "}
          <span className="text-red-500 transition group-hover:text-red-400">
            ESPORTS.
          </span>
        </Link>

        {/* NAVIGATION */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative py-7 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "text-white"
                    : "text-gray-500 hover:text-white hover:text-red-400 hover:[text-shadow:0_0_12px_rgba(239,68,68,0.7)]"
                }`}
              >
                {item.label}

                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 bg-red-500 transition-all duration-300 ${
                    active
                      ? "w-full shadow-[0_0_12px_rgba(239,68,68,0.9)]"
                      : "w-0 group-hover:w-full group-hover:shadow-[0_0_12px_rgba(239,68,68,0.9)]"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* PUBLIC */}
          {!isAuthenticated && (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-bold text-gray-300 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register/player"
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* AUTHENTICATED */}
          {isAuthenticated && (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-black text-white">
                  {displayName}
                </p>

                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  {isAdmin ? "Admin" : "Player"}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-black text-red-500">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-bold text-gray-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
              >
                LOGOUT
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}