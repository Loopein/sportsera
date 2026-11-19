import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function VideosPage(): React.ReactElement {
  return (
    <div className="space-y-5">
      <Card as="section" variant="strong" className="p-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Videos</h1>
        <p className="mt-2 text-sm text-slate-600">
          Highlights, post-match analysis, and short clips will appear here.
        </p>
      </Card>

      <Card as="section" className="p-5">
        <h2 className="text-base font-semibold text-slate-900">Coming Soon</h2>
        <p className="mt-2 text-sm text-slate-600">
          While video publishing is being finalized, you can follow live updates and full scorecards.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/live" className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white">
            Go to Live
          </Link>
          <Link href="/matches" className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
            Browse Matches
          </Link>
        </div>
      </Card>
    </div>
  );
}

