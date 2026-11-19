import type { Metadata } from "next";
import { LivePageClient } from "@/app/(site)/live/LivePageClient";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { getLiveMatches } from "@/lib/api/read";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Live Matches",
  description: "All currently live cricket matches with fast score refresh."
};

export default async function LivePage(): Promise<React.ReactElement> {
  const matches = await getLiveMatches();

  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="p-5 md:p-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Live Matches</h1>
        <p className="mt-2 text-sm text-slate-600">
          Compact match cards with controlled refresh so users can scan quickly without jitter.
        </p>
      </Card>
      <AdSlot variant="in-feed" label="Sponsored · Live Feed" />
      <LivePageClient initialMatches={matches} />
      <AdSlot variant="leaderboard" label="Sponsored · Live Center Banner" />
    </div>
  );
}

