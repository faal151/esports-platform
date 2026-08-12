import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "../../lib/supabase/auth";
import LogoutButton from "../components/LogoutButton";

export default async function PlayerDashboardPage() {
  const { user, profile } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    profile?.full_name ||
    profile?.username ||
    user.email?.split("@")[0] ||
    "Player";

  const username = profile?.username
    ? `@${profile.username}`
    : "Player Account";

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[140px]" />

        <div className="absolute right-0 top-[35%] h-[400px] w-[400px] rounded-full bg-red-900/5 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:py-14">

        {/* Welcome */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-red-950/20 to-transparent" />

          <div className="relative p-7 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
              My Player Dashboard
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
              Welcome back,
              <br />
              <span className="text-red-500">
                {displayName}.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
              Kelola profil esports kamu, ikuti tournament,
              bergabung dengan squad, dan bangun perjalananmu
              bersama PINTO ESPORTS.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/tournaments"
                className="rounded-lg bg-red-600 px-6 py-3.5 text-xs font-black uppercase tracking-wide transition hover:bg-red-500"
              >
                Explore Tournaments
              </Link>

              <Link
                href="/squads"
                className="rounded-lg border border-white/10 bg-white/[0.02] px-6 py-3.5 text-xs font-black uppercase tracking-wide text-gray-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                Find A Squad
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStat
            value="0"
            label="Tournaments Joined"
          />

          <DashboardStat
            value="0"
            label="Tournament Wins"
          />

          <DashboardStat
            value="0"
            label="Matches Played"
          />

          <DashboardStat
            value="0"
            label="Achievements"
          />
        </section>

        {/* Main */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

          {/* Tournaments */}
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-7">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                  Compete
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase">
                  My Tournaments
                </h2>
              </div>

              <Link
                href="/tournaments"
                className="text-xs font-bold uppercase tracking-wide text-gray-500 transition hover:text-white"
              >
                View All →
              </Link>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                +
              </div>

              <h3 className="mt-4 font-black uppercase">
                No tournaments yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-gray-600">
                Kamu belum mengikuti tournament apa pun.
                Temukan tournament berikutnya dan mulai
                perjalanan kompetisimu.
              </p>

              <Link
                href="/tournaments"
                className="mt-5 inline-flex rounded-lg border border-red-500/30 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-red-500 transition hover:bg-red-500/10"
              >
                Browse Tournaments
              </Link>
            </div>
          </div>

          {/* Profile */}
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-7">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                Your Account
              </p>

              <h2 className="mt-2 text-2xl font-black uppercase">
                Player Profile
              </h2>
            </div>

            <div className="mt-6 flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-black text-red-500">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-black">
                  {displayName}
                </h3>

                <p className="mt-1 truncate text-xs text-gray-600">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-5">
              <ProfileRow
                label="Username"
                value={profile?.username || "-"}
              />

              <ProfileRow
                label="Role"
                value={profile?.role || "player"}
              />

              <ProfileRow
                label="Bio"
                value={profile?.bio || "No bio added yet."}
              />
            </div>

            <Link
              href="/player/profile"
              className="mt-6 flex w-full items-center justify-center rounded-lg border border-white/10 py-3 text-xs font-black uppercase tracking-wide text-gray-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Edit Profile
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10 pb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
            Get Started
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Quick Actions
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ActionCard
              title="Find Tournament"
              description="Temukan tournament yang sesuai dengan game dan skill kamu."
              href="/tournaments"
            />

            <ActionCard
              title="Join A Squad"
              description="Cari squad dan temukan player lain untuk bermain bersama."
              href="/squads"
            />

            <ActionCard
              title="Complete Profile"
              description="Lengkapi profil kamu agar lebih mudah ditemukan komunitas."
              href="/player/profile"
            />
          </div>
        </section>
      </div>
    </main>
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
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5 transition hover:border-white/15">
      <p className="text-3xl font-black">{value}</p>

      <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
        {label}
      </p>
    </div>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-300">
        {value}
      </p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/10 bg-[#0a0a0a] p-6 transition hover:-translate-y-0.5 hover:border-red-500/30 hover:bg-[#0d0d0d]"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-black uppercase">{title}</h3>

        <span className="text-lg text-gray-600 transition group-hover:text-red-500">
          →
        </span>
      </div>

      <p className="mt-3 text-xs leading-6 text-gray-600">
        {description}
      </p>
    </Link>
  );
}