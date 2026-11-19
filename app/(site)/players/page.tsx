import Link from "next/link";
import { getPlayers } from "@/lib/api/read";

export const revalidate = 60;

export default async function PlayersPage(): Promise<React.ReactElement> {
  const players = await getPlayers();

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Players</h1>
        <p className="mt-1 text-sm text-slate-600">Player profiles, career stats and recent form.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {players.map((player) => (
          <Link
            key={player.id}
            href={`/players/${player.id}`}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300"
          >
            <p className="text-lg font-semibold text-slate-900">{player.name}</p>
            <p className="text-sm text-slate-600">{player.role}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

