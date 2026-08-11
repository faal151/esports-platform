export default function FaalProfilePage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <a
          href="/players"
          className="text-sm font-semibold text-gray-500 transition hover:text-red-500"
        >
          ← Back to Players
        </a>

        {/* Player Identity */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-red-500/30 bg-[#0b0b0b]">
          <div className="h-1 bg-red-600" />

          <div className="grid gap-8 p-8 md:grid-cols-[180px_1fr] md:p-10">

            {/* Photo */}
            <div className="h-44 w-44 overflow-hidden rounded-2xl border border-red-500/30 bg-[#151515]">
              <img
                src="/players/faal.png"
                alt="FAAL"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Identity */}
            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                PINTO ESPORT · PLAYER PROFILE
              </p>

              <h1 className="mt-3 text-5xl font-black uppercase tracking-tight">
                FAAL
              </h1>

              <p className="mt-2 text-lg text-gray-400">
                Faal
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-md bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-red-500">
                  Jungler
                </span>

                <span className="rounded-md border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Mobile Legends
                </span>

                <span className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <img
                    src="/teams/stg-squad.jpeg"
                    alt="STG Squad"
                    className="h-5 w-5 rounded object-contain"
                  />
                  STG Squad
                </span>
              </div>

              <p className="mt-5 font-mono text-xs text-gray-600">
                PINTO ID: PNT-00001
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Competitive Record
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Statistics
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-3xl font-black">42</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                Matches
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-3xl font-black">12</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                Wins
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-3xl font-black">8</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                Achievements
              </p>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="mt-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Recognition
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Badges
          </h2>

          <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-[#0b0b0b] p-8 text-center">
            <p className="text-sm text-gray-500">
              Badges akan diberikan otomatis berdasarkan pencapaian dan
              ketentuan PINTO ESPORT.
            </p>
          </div>
        </section>

        {/* Achievements */}
        <section className="mt-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Player Legacy
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Achievements
          </h2>

          <div className="mt-6 rounded-xl border border-white/10 bg-[#0b0b0b] p-8">
            <div className="border-b border-white/10 pb-6">
              <p className="text-lg font-bold">
                Tournament Achievement
              </p>

              <p className="mt-2 text-sm text-gray-500">
                E-Certificate dan pencapaian turnamen akan tersimpan di
                profile player.
              </p>
            </div>

            <p className="pt-6 text-sm text-gray-600">
              Belum ada achievement yang ditampilkan.
            </p>
          </div>
        </section>

        {/* Tournament History */}
        <section className="mt-12 pb-20">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Competitive History
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Tournament History
          </h2>

          <div className="mt-6 rounded-xl border border-white/10 bg-[#0b0b0b] p-8">
            <p className="text-sm text-gray-600">
              Tournament history akan muncul otomatis setelah player
              mengikuti turnamen PINTO ESPORT.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}