import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayerTabs } from "@/app/(site)/players/[playerId]/PlayerTabs";
import { PlayerStats } from "@/components/player/PlayerStats";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { getPlayer } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildPersonJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type PlayerCareerProps = {
  params: Promise<{ playerId: string }>;
};

export async function generateMetadata({ params }: PlayerCareerProps): Promise<Metadata> {
  const { playerId } = await params;
  const player = await getPlayer(playerId);
  if (!player) {
    return buildPageMetadata({
      title: "Player Career Not Found",
      description: "The requested player career statistics could not be found.",
      path: `/players/${playerId}/career`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${player.name} Career Statistics & Records`,
    description: `Format-by-format career averages, matches, totals, and performance records for ${player.name}.`,
    path: `/players/${player.id}/career`,
    keywords: [player.name, "career stats", "records", player.role]
  });
}

export default async function PlayerCareerPage({ params }: PlayerCareerProps): Promise<React.ReactElement> {
  const { playerId } = await params;
  const player = await getPlayer(playerId);
  if (!player) notFound();

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildPersonJsonLd(player, `/players/${player.id}/career`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Players", path: "/players" },
            { name: player.name, path: `/players/${player.id}` },
            { name: "Career", path: `/players/${player.id}/career` }
          ])
        ]}
      />
      <PlayerTabs playerId={player.id} currentPath={`/players/${player.id}/career`} />
      <PlayerStats career={player.career} />
      <AdSlot variant="leaderboard" label="Sponsored · Career Records" />
    </div>
  );
}

