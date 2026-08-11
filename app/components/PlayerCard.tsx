type PlayerCardProps = {
  name: string;
  ign: string;
  game: string;
  gameSlug: "mobile-legends" | "pubg-mobile" | "valorant";
  role: string;
  teamName: string;
  teamLogo: string;
  achievements: number;
  wins: number;
  matches: number;
  playerId: string;
};

export default function PlayerCard({
  name,
  ign,
  game,
  gameSlug,
  role,
  teamName,
  teamLogo,
  achievements,
  wins,
  matches,
  playerId,
}: PlayerCardProps) {
  return (
    <article
      className={`group relative w-full max-w-md overflow-hidden rounded-2xl border bg-[#0b0b0b] shadow-[0_0_40px_rgba(255,30,30,0.12)] transition duration-300 hover:-translate-y-1 ${
        gameSlug === "mobile-legends"
          ? "border-red-500/40 hover:border-red-500/80"
          : gameSlug === "pubg-mobile"
            ? "border-yellow-500/40 hover:border-yellow-500/80"
            : "border-blue-500/40 hover:border-blue-500/80"
      }`}
    >
      {/* Game Accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          gameSlug === "mobile-legends"
            ? "bg-red-600"
            : gameSlug === "pubg-mobile"
              ? "bg-yellow-500"
              : "bg-blue-500"
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            PINTO ESPORT
          </p>

          <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
            Player Card
          </p>
        </div>

        <div className="rounded-md border border-white/10 px-3 py-1 text-xs font-bold uppercase text-gray-400">
          {game}
        </div>
      </div>

      {/* Player Identity */}
      <div className="px-6 pb-6 pt-8">
        <div className="flex items-center gap-5">
          {/* Player Photo */}
          {/* Player Photo */}
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-red-500/30 bg-[#151515]">
            <img
              src="/players/faal.png"
              alt="FAAL"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Player Information */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Player
            </p>

            <h2 className="mt-1 truncate text-3xl font-black uppercase tracking-tight text-white">
              {ign}
            </h2>

            <p className="mt-1 text-sm text-gray-500">{name}</p>

            {/* Role + Team */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
                {role}
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-700" />

              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white">
                  <img
                    src={teamLogo}
                    alt={`${teamName} logo`}
                    className="h-full w-full object-contain"
                  />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {teamName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-y border-white/10 bg-white/[0.02]">
        <div className="px-3 py-5 text-center">
          <p className="text-2xl font-black text-white">{achievements}</p>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Achievements
          </p>
        </div>

        <div className="border-x border-white/10 px-3 py-5 text-center">
          <p className="text-2xl font-black text-white">{wins}</p>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Wins
          </p>
        </div>

        <div className="px-3 py-5 text-center">
          <p className="text-2xl font-black text-white">{matches}</p>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Matches
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            PINTO ID
          </p>

          <p className="mt-1 font-mono text-xs font-bold text-gray-400">
            {playerId}
          </p>
        </div>

        <div className="text-sm font-black tracking-widest text-red-500">
          PINTO
        </div>
      </div>
    </article>
  );
}
