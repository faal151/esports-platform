type Tournament = {
  title: string;
  game: string;
  status: string;
  date: string;
  location: string;
  slots: string;
  format: string;
  organizer: string;
  reward: string;
};

const tournaments: Tournament[] = [
  {
    title: "PINTO Local Championship",
    game: "Mobile Legends",
    status: "Registration Open",
    date: "20 AUG 2026",
    location: "Kabupaten Lokal",
    slots: "32 Teams",
    format: "BO3 • Elimination",
    organizer: "PINTO ESPORT",
    reward: "Tournament Achievement",
  },
];

export default function TournamentsPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            PINTO ESPORT
          </p>

          <h1 className="mt-3 text-5xl font-black uppercase tracking-tight">
            Tournaments
          </h1>

          <p className="mt-4 max-w-2xl text-gray-500">
            Temukan turnamen esports lokal, lihat detail kompetisi,
            dan bangun competitive record kamu.
          </p>
        </div>

        {/* Tournament List */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <article
              key={tournament.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] transition duration-300 hover:-translate-y-1 hover:border-red-500/60"
            >
              {/* Accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-red-600" />

              {/* Banner Placeholder */}
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-red-600/20 via-[#111111] to-[#050505]">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
                    {tournament.game}
                  </p>

                  <p className="mt-2 text-3xl font-black uppercase">
                    PINTO
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">

                {/* Status */}
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-500">
                    {tournament.status}
                  </span>

                  <span className="text-xs font-bold text-gray-600">
                    {tournament.date}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mt-5 text-2xl font-black uppercase leading-tight">
                  {tournament.title}
                </h2>

                {/* Info */}
                <div className="mt-6 space-y-3 border-t border-white/10 pt-5">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Location
                    </span>

                    <span className="font-semibold text-gray-300">
                      {tournament.location}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Slots
                    </span>

                    <span className="font-semibold text-gray-300">
                      {tournament.slots}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Format
                    </span>

                    <span className="font-semibold text-gray-300">
                      {tournament.format}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Organizer
                    </span>

                    <span className="font-semibold text-gray-300">
                      {tournament.organizer}
                    </span>
                  </div>

                </div>

                {/* Reward */}
                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    Player Reward
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    🏆 {tournament.reward}
                  </p>
                </div>

                {/* Button */}
                <a
  href="/tournaments/pinto-local-championship"
  className="mt-6 block w-full rounded-lg bg-red-600 px-5 py-3 text-center text-sm font-black uppercase tracking-wide transition hover:bg-red-500 hover:shadow-[0_0_25px_rgba(255,30,30,0.25)]"
>
  View Tournament
</a>

              </div>
            </article>
          ))}
        </section>

      </div>
    </main>
  );
}