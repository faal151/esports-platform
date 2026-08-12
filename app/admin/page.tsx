import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/supabase/auth";

const pendingReviews = [
  {
    type: "Manager Application",
    title: "John Doe → STG Squad",
    detail: "Team Manager",
    status: "Pending",
  },
  {
    type: "Tournament",
    title: "PINTO Local Championship",
    detail: "Mobile Legends · 32 Teams",
    status: "Pending",
  },
  {
    type: "Squad",
    title: "New Squad Registration",
    detail: "Mobile Legends",
    status: "Pending",
  },
];

const quickStats = [
  { label: "Pending Reviews", value: "3" },
  { label: "Active Tournaments", value: "4" },
  { label: "Active Squads", value: "18" },
  { label: "Registered Players", value: "126" },
];

export default async function AdminPage() {
  const { user, profile } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
              PINTO ESPORT
            </p>

            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-5xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Review, validate, and manage esports activity on PINTO.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
              Access Level
            </p>

            <p className="mt-1 text-sm font-black uppercase text-red-500">
              Admin
            </p>
          </div>
        </header>

        {/* Quick Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-[#0b0b0b] p-5"
            >
              <p className="text-3xl font-black">
                {stat.value}
              </p>

              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Pending Reviews */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Requires Attention
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase">
                Pending Reviews
              </h2>
            </div>

            <span className="rounded-md bg-red-500/10 px-3 py-1 text-xs font-black text-red-500">
              {pendingReviews.length} Pending
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {pendingReviews.map((item) => (
              <div
                key={`${item.type}-${item.title}`}
                className="flex flex-col justify-between gap-5 rounded-xl border border-white/10 bg-[#0b0b0b] p-6 transition hover:border-red-500/30 md:flex-row md:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                    {item.type === "Manager Application"
                      ? "M"
                      : item.type === "Tournament"
                        ? "T"
                        : "S"}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                      {item.type}
                    </p>

                    <h3 className="mt-1 font-black uppercase">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-600">
                      {item.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-yellow-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-yellow-500">
                    {item.status}
                  </span>

                  <a
                    href={
                      item.type === "Manager Application"
                        ? "/admin/manager-applications"
                        : "#"
                    }
                    className="rounded-lg bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-wide transition hover:bg-red-500"
                  >
                    Review
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Management */}
        <section className="mt-12 pb-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Management
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Admin Tools
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-lg font-black uppercase">
                Tournaments
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Review and manage tournament submissions and publication.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-lg font-black uppercase">
                Manager Applications
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Review manager applications before granting squad access.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-lg font-black uppercase">
                Match Results
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Validate match results before they affect player statistics.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-lg font-black uppercase">
                Achievements
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Review achievement records generated from tournament data.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-lg font-black uppercase">
                Certificates
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Generate and manage player and team e-certificates.
              </p>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-lg font-black uppercase text-red-500">
                Super Admin
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Critical permissions and system-level controls are restricted
                to Super Admin.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}