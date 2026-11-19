import Link from "next/link";
import { getSeries } from "@/lib/api/read";

export const revalidate = 30;

export default async function SeriesPage(): Promise<React.ReactElement> {
  const series = await getSeries();

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Series</h1>
        <p className="mt-1 text-sm text-slate-600">Browse cricket tournaments and tours.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {series.map((item) => (
          <Link
            key={item.id}
            href={`/series/${item.id}`}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300"
          >
            <p className="text-lg font-semibold text-slate-900">
              {item.name} {item.season}
            </p>
            <p className="text-sm text-slate-600">
              {item.format} | {item.status}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

