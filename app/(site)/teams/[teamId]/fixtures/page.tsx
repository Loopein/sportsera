import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamTabs } from "@/app/(site)/teams/[teamId]/TeamTabs";
import { getMatches, getTeam } from "@/lib/api/read";

type TeamFixturesProps = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamFixturesPage({ params }: TeamFixturesProps): Promise<React.ReactElement> {
  const { teamId } = await params;
  const [team, matches] = await Promise.all([getTeam(teamId), getMatches()]);
  if (!team) notFound();

  const teamMatches = matches.filter((match) => match.teamA.id === team.id || match.teamB.id === team.id);

  return (
    <div className="space-y-4">
      <TeamTabs teamId={team.id} currentPath={`/teams/${team.id}/fixtures`} />
      <div className="space-y-3">
        {teamMatches.map((match) => (
          <Link
            key={match.id}
            href={`/matches/${match.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300"
          >
            <p className="font-semibold text-slate-900">
              {match.teamA.shortName} vs {match.teamB.shortName}
            </p>
            <p className="text-sm text-slate-600">{match.seriesName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

