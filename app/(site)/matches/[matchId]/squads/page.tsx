import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
import { UpcomingCountdown } from "@/components/match/UpcomingCountdown";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { TeamSquad } from "@/components/team/TeamSquad";
import { Card } from "@/components/ui/card";
import { getMatchSummary, getPlayers, getTeam } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSportsEventJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

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

export async function generateMetadata({ params }: SquadsPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const match = await getMatchSummary(matchId);
  if (!match) {
    return buildPageMetadata({
      title: "Match Squads Not Found",
      description: "The requested match squads could not be found.",
      path: `/matches/${matchId}/squads`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${match.teamA.shortName} vs ${match.teamB.shortName} Squads & Playing XI`,
    description: `Confirmed Playing XI, captains, wicketkeepers, and full team squads for ${match.teamA.name} vs ${match.teamB.name} (${match.seriesName}).`,
    path: `/matches/${match.id}/squads`,
    keywords: [match.teamA.name, match.teamB.name, "playing xi", "squads"]
  });
}

export default async function SquadsPage({ params, searchParams }: SquadsPageProps): Promise<React.ReactElement> {
  const { matchId } = await params;
  const summary = await getMatchSummary(matchId);
  if (!summary) notFound();

  const query = (await searchParams) ?? {};
  const selectedTeamKey = query.team === "b" ? "b" : "a";
  const requestedView = query.view === "xi" ? "xi" : query.view === "squad" ? "squad" : null;

  const [teamA, teamB, players] = await Promise.all([
    getTeam(summary.teamA.id),
    getTeam(summary.teamB.id),
    summary.status === "upcoming" ? getPlayers() : Promise.resolve([])
  ]);
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
        <JsonLd
          data={[
            buildSportsEventJsonLd(summary, `/matches/${summary.id}/squads`),
            buildBreadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Matches", path: "/matches" },
              { name: `${summary.teamA.shortName} vs ${summary.teamB.shortName}`, path: `/matches/${summary.id}` },
              { name: "Squads", path: `/matches/${summary.id}/squads` }
            ])
          ]}
        />
        <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/squads`} status={summary.status} />
        <Card as="section" variant="strong" className="page-hero-card overflow-hidden p-0 text-slate-900">
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <p className="text-sm text-slate-600">
              {summary.seriesName}
              <span className="text-brand-700"> - {kickoffLabel}</span>
            </p>
            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center sm:gap-4">
              <div className="min-w-0">
                <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-sm font-extrabold text-brand-700 sm:h-12 sm:w-12">
                  {summary.teamA.shortName.slice(0, 3)}
                </span>
                <p className="mt-2 truncate text-base font-black tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                  {summary.teamA.name}
                </p>
              </div>
              <span className="text-sm font-extrabold uppercase text-slate-400 sm:text-lg">vs</span>
              <div className="min-w-0">
                <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-sm font-extrabold text-brand-700 sm:h-12 sm:w-12">
                  {summary.teamB.shortName.slice(0, 3)}
                </span>
                <p className="mt-2 truncate text-base font-black tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                  {summary.teamB.name}
                </p>
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
              className={`truncate rounded-full px-3 py-2 text-center text-xs font-bold transition sm:px-4 sm:text-base ${
                selectedTeamKey === "a"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {summary.teamA.name}
            </Link>
            <Link
              href={buildHref("b", selectedView)}
              className={`truncate rounded-full px-3 py-2 text-center text-xs font-bold transition sm:px-4 sm:text-base ${
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

          <div className="border-t border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="text-base font-bold text-slate-900 sm:text-xl">
              {selectedTeam.name} {selectedView === "xi" ? "Playing XI" : "Squad"}
            </h2>
            {shownMembers.length ? (
              <ul className="mt-4 divide-y divide-slate-200 sm:grid sm:grid-cols-2 sm:gap-3 sm:divide-y-0 lg:grid-cols-3">
                {shownMembers.map((member) => {
                  const player = playerById.get(member.playerId);
                  const details = [player?.battingStyle, player?.bowlingStyle].filter(Boolean).join(" | ") || member.role;
                  const initials = member.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("");

                  return (
                    <li key={member.playerId} className="min-w-0">
                      <Link
                        href={`/players/${member.playerId}`}
                        className="group flex min-w-0 items-center gap-3 py-2.5 transition sm:rounded-xl sm:border sm:border-slate-200 sm:bg-slate-50/70 sm:p-3 sm:hover:border-brand-300 sm:hover:bg-brand-50/40"
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-xs font-bold text-slate-700 sm:h-10 sm:w-10 sm:text-sm">
                          {initials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="truncate text-sm font-bold tracking-tight text-slate-900 group-hover:text-brand-700 sm:text-base">
                              {member.name}
                            </p>
                            {member.isCaptain ? (
                              <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-brand-700">
                                C
                              </span>
                            ) : null}
                            {member.isWicketKeeper ? (
                              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-indigo-800">
                                WK
                              </span>
                            ) : null}
                          </div>
                          <p className="truncate text-xs text-slate-600 sm:text-sm">{details}</p>
                        </div>
                      </Link>
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
        </Card>

        <AdSlot variant="leaderboard" label="Sponsored · Playing XI & Squads" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSportsEventJsonLd(summary, `/matches/${summary.id}/squads`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Matches", path: "/matches" },
            { name: `${summary.teamA.shortName} vs ${summary.teamB.shortName}`, path: `/matches/${summary.id}` },
            { name: "Squads", path: `/matches/${summary.id}/squads` }
          ])
        ]}
      />
      <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/squads`} status={summary.status} />
      <AdSlot variant="in-feed" label="Sponsored · Match Squads" />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="min-w-0 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xs font-black text-brand-700">
              {summary.teamA.shortName.slice(0, 3)}
            </span>
            <h2 className="truncate text-xl font-extrabold text-slate-900">{summary.teamA.name}</h2>
          </div>
          <TeamSquad members={teamA?.squad ?? []} />
        </section>
        <section className="min-w-0 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-800">
              {summary.teamB.shortName.slice(0, 3)}
            </span>
            <h2 className="truncate text-xl font-extrabold text-slate-900">{summary.teamB.name}</h2>
          </div>
          <TeamSquad members={teamB?.squad ?? []} />
        </section>
      </div>
      <AdSlot variant="leaderboard" label="Sponsored · Team Rosters" />
    </div>
  );
}

