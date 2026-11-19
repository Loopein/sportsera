import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SITE_NAME, SITE_POWERED_BY } from "@/lib/constants/site";

const moreLinks = [
  { href: "/live", label: "Live Center" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/results", label: "Results" },
  { href: "/series", label: "Series" },
  { href: "/teams", label: "Teams" },
  { href: "/players", label: "Players" },
  { href: "/search", label: "Search" }
];

export default function MorePage(): React.ReactElement {
  return (
    <div className="space-y-5">
      <Card as="section" variant="strong" className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">More</h1>
          <span className="inline-flex items-center rounded-full border border-[#cfd7ef] bg-[#edf2ff] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[rgb(6,12,58)]">
            {SITE_NAME} · Powered by {SITE_POWERED_BY}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600">Explore additional cricket sections and tools.</p>
      </Card>

      <Card as="section" className="p-5">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {moreLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
