type ManagerApplication = {
  applicant: string;
  applicantId: string;
  squad: string;
  game: string;
  experience: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

const applications: ManagerApplication[] = [
  {
    applicant: "John Doe",
    applicantId: "PNT-M-0001",
    squad: "STG Squad",
    game: "Mobile Legends",
    experience: "2 Years Team Management",
    reason:
      "Saya ingin membantu STG Squad membangun roster yang lebih kompetitif dan mengikuti lebih banyak turnamen lokal.",
    status: "Pending",
  },
];

export default function ManagerApplicationsPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="border-b border-white/10 pb-8">
          <a
            href="/admin"
            className="text-sm font-semibold text-gray-500 transition hover:text-red-500"
          >
            ← Back to Admin Dashboard
          </a>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-red-500">
            PINTO ESPORT · ADMIN
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
                Manager Applications
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Review calon manager sebelum mereka mendapatkan akses untuk
                mengelola squad.
              </p>
            </div>

            <span className="w-fit rounded-md bg-yellow-500/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-yellow-500">
              {applications.length} Pending
            </span>
          </div>
        </header>

        {/* Applications */}
        <section className="mt-10 space-y-6">
          {applications.map((application) => (
            <article
              key={application.applicantId}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]"
            >
              {/* Application Header */}
              <div className="flex flex-col justify-between gap-5 border-b border-white/10 p-6 md:flex-row md:items-center">
                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-red-500/10 text-xl font-black text-red-500">
                    JD
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                      Manager Applicant
                    </p>

                    <h2 className="mt-1 text-2xl font-black uppercase">
                      {application.applicant}
                    </h2>

                    <p className="mt-1 font-mono text-[10px] text-gray-600">
                      {application.applicantId}
                    </p>
                  </div>

                </div>

                <span className="w-fit rounded-md bg-yellow-500/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-yellow-500">
                  {application.status}
                </span>
              </div>

              {/* Application Details */}
              <div className="grid gap-8 p-6 md:grid-cols-2">

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                    Squad
                  </p>

                  <p className="mt-2 text-xl font-black uppercase">
                    {application.squad}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {application.game}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                    Experience
                  </p>

                  <p className="mt-2 font-bold text-gray-300">
                    {application.experience}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                    Applicant Statement
                  </p>

                  <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-sm leading-7 text-gray-400">
                      "{application.reason}"
                    </p>
                  </div>
                </div>

              </div>

              {/* Review Actions */}
              <div className="flex flex-col gap-4 border-t border-white/10 bg-white/[0.02] p-6 md:flex-row md:items-center md:justify-between">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    Admin Decision
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Approval akan memberikan status Verified Manager.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="rounded-lg border border-red-500/30 px-6 py-3 text-xs font-black uppercase tracking-wide text-red-400 transition hover:bg-red-500/10">
                    Reject
                  </button>

                  <button className="rounded-lg bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-wide transition hover:bg-red-500">
                    Approve Manager
                  </button>
                </div>

              </div>
            </article>
          ))}
        </section>

        {/* Permission Notice */}
        <section className="mt-10 pb-20">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
              PINTO Permission Policy
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Squad Leader atau player tidak dapat menyetujui Manager.
              Persetujuan Manager dilakukan oleh Admin PINTO. Akses
              administratif yang bersifat kritis tetap berada di bawah
              Super Admin.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}