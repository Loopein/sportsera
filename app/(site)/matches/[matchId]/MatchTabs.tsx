import { Tabs } from "@/components/shared/Tabs";
import type { MatchStatus } from "@/types/match";

type MatchTabsProps = {
  matchId: string;
  currentPath: string;
  status?: MatchStatus;
};

export function MatchTabs({ matchId, currentPath, status }: MatchTabsProps): React.ReactElement {
  const base = `/matches/${matchId}`;
  const isUpcoming = status === "upcoming";
  const isLiveOrBreak = status === "live" || status === "innings_break";
  const activePath =
    isUpcoming && currentPath === base
      ? `${base}/stats`
      : isLiveOrBreak && currentPath === base
        ? `${base}/scorecard`
        : currentPath;
  const tabs = isUpcoming
    ? [
        { href: `${base}/squads`, label: "Squads", isActive: activePath === `${base}/squads` },
        { href: `${base}/commentary`, label: "Commentary", isActive: activePath === `${base}/commentary` },
        { href: `${base}/stats`, label: "Stats", isActive: activePath === `${base}/stats` }
      ]
    : isLiveOrBreak
      ? [
          { href: `${base}/scorecard`, label: "Scorecard", isActive: activePath === `${base}/scorecard` },
          { href: `${base}/commentary`, label: "Commentary", isActive: activePath === `${base}/commentary` },
          { href: `${base}/squads`, label: "Squads", isActive: activePath === `${base}/squads` },
          { href: `${base}/stats`, label: "Stats", isActive: activePath === `${base}/stats` }
        ]
      : [
        { href: base, label: "Summary", isActive: activePath === base },
        { href: `${base}/scorecard`, label: "Scorecard", isActive: activePath === `${base}/scorecard` },
        { href: `${base}/commentary`, label: "Commentary", isActive: activePath === `${base}/commentary` },
        { href: `${base}/squads`, label: "Squads", isActive: activePath === `${base}/squads` },
        { href: `${base}/stats`, label: "Stats", isActive: activePath === `${base}/stats` }
      ];

  return <Tabs tabs={tabs} align="center" />;
}

