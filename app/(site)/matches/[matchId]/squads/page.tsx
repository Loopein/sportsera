import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
import { UpcomingCountdown } from "@/components/match/UpcomingCountdown";
import { TeamSquad } from "@/components/team/TeamSquad";
import { getMatchSummary, getPlayers, getTeam } from "@/lib/api/read";

type SquadsPageProps = {
  params: Promise<{ matchId: string }>;
  searchParams?: Promise<{ team?: string; view?: string }>;
};

function formatKickoffLabel(isoDate: string): string {
  const kickoff = new Date(isoDate);
  if (Number.isNaN(kickoff.getTime())) return "Schedule TBD";

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const timeLabel = kickoff.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  if (kickoff.toDateString() === now.toDateString()) return `Today, ${timeLabel}`;
  if (kickoff.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${timeLabel}`;

  const dateLabel = kickoff.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
  return `${dateLabel}, ${timeLabel}`;
}

export default async function SquadsPage({ params, searchParams }: SquadsPageProps): Promise<React.ReactElement> {
  const { matchId } = await params;
  const summary = await getMatchSummary(matchId);
  if (!summary) notFound();

  const query = (await searchParams) ?? {};
  const selectedTeamKey = query.team === "b" ? "b" : "a";
  const requestedView = query.view === "xi" ? "xi" : query.view === "squad" ? "squad" : null;

  const [teamA, teamB, players] = await Promise.all([getTeam(summary.teamA.id), getTeam(summary.teamB.id), getPlayers()]);
  const playerById = new Map(players.map((player) => [player.id, player]));

  const startIso = summary.startAt ?? summary.lastUpdatedAt ?? new Date().toISOString();
  const kickoffLabel = formatKickoffLabel(startIso);
  const shortMeta = `${summary.format} - Upcoming - ${summary.venue}`;
  const selectedTeam = selectedTeamKey === "a" ? summary.teamA : summary.teamB;
  const selectedProfile = selectedTeamKey === "a" ? teamA : teamB;
  const fullSquad = selectedProfile?.squad ?? [];
  const selectedPlayingXIIds = selectedTeamKey === "a" ? summary.playingXI?.teamA ?? [] : summary.playingXI?.teamB ?? [];
  const hasPlayingXI = selectedPlayingXIIds.length > 0;
  const selectedView = requestedView ? (requestedView === "xi" && hasPlayingXI ? "xi" : "squad") : hasPlayingXI ? "xi" : "squad";
  const squadMemberById = new Map(fullSquad.map((member) => [member.playerId, member]));
  const playingXI = selectedPlayingXIIds
    .map((playerId) => squadMemberById.get(playerId))
    .filter((member): member is (typeof fullSquad)[number] => Boolean(member));
  const shownMembers = selectedView === "xi" ? playingXI : fullSquad;

  if (summary.status === "upcoming") {
    const buildHref = (team: "a" | "b", view: "squad" | "xi"): string => `/matches/${summary.id}/squads?team=${team}&view=${view}`;

    return (
      <div className="space-y-4">
        <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/squads`} status={summary.status} />
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
          <div className="px-6 py-5">
            <p className="text-sm text-slate-600">
              {summary.seriesName}
              <span className="text-brand-700"> - {kickoffLabel}</span>
            </p>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div>
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-sm font-extrabold text-brand-700">
                  {summary.teamA.shortName.slice(0, 2)}
                </span>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{summary.teamA.name}</p>
              </div>
              <span className="text-xl font-semibold text-slate-500">vs</span>
              <div>
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-sm font-extrabold text-brand-700">
                  {summary.teamB.shortName.slice(0, 2)}
                </span>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{summary.teamB.name}</p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <UpcomingCountdown
                startAt={startIso}
                className="text-sm font-semibold text-slate-600"
                valueClassName="text-brand-700"
                fallbackValue="Upcoming"
              />
            </div>
            <p className="mt-3 text-center text-sm text-slate-600">{shortMeta}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-slate-200 px-4 py-2 sm:px-6">
            <Link
              href={buildHref("a", selectedView)}
              className={`rounded-full px-4 py-2 text-center text-base font-semibold transition sm:text-lg ${
                selectedTeamKey === "a"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {summary.teamA.name}
            </Link>
            <Link
              href={buildHref("b", selectedView)}
              className={`rounded-full px-4 py-2 text-center text-base font-semibold transition sm:text-lg ${
                selectedTeamKey === "b"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {summary.teamB.name}
            </Link>
          </div>

          <div className="flex gap-2 border-t border-slate-200 px-4 py-2 sm:px-6">
            {hasPlayingXI ? (
              <Link
                href={buildHref(selectedTeamKey, "xi")}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
                  selectedView === "xi" ? "bg-brand-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Playing XI
              </Link>
            ) : null}
            <Link
              href={buildHref(selectedTeamKey, "squad")}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
                selectedView === "squad" ? "bg-brand-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Full Squad
            </Link>
          </div>

          <div className="border-t border-slate-200 px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-slate-900">
              {selectedTeam.name} {selectedView === "xi" ? "Playing XI" : "Squad"}
            </h2>
            {shownMembers.length ? (
              <ul className="mt-4 divide-y divide-slate-200">
                {shownMembers.map((member) => {
                  const player = playerById.get(member.playerId);
                  const details = [player?.battingStyle, player?.bowlingStyle].filter(Boolean).join(" | ") || member.role;
                  const initials = member.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("");
                  const suffix = `${member.isWicketKeeper ? " (WK)" : ""}${member.isCaptain ? " (C)" : ""}`;

                  return (
                    <li key={member.playerId} className="flex items-start gap-3 py-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-sm font-bold text-slate-700">
                        {initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-2xl font-medium tracking-tight text-slate-900">
                          {member.name}
                          {suffix}
                        </p>
                        <p className="text-base text-slate-600">{details}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {selectedView === "xi" ? "Playing XI not declared yet. Once announced, selected 11 will appear here." : "Squad details will be published soon."}
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/squads`} status={summary.status} />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">{summary.teamA.name}</h2>
          <TeamSquad members={teamA?.squad ?? []} />
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">{summary.teamB.name}</h2>
          <TeamSquad members={teamB?.squad ?? []} />
        </section>
      </div>
    </div>
  );
}

