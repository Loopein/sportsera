import { Card } from "@/components/ui/card";

export function LiveMatchEmptyCard({ label = "No data found" }: { label?: string }): React.ReactElement {
  return (
    <Card as="article" variant="strong" className="h-full w-full min-w-0 overflow-hidden p-5 md:p-4">
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="mt-1 text-xs text-slate-500">Data will appear here when available.</p>
      </div>
    </Card>
  );
}
