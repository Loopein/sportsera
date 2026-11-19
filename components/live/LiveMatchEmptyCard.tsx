import { FiActivity } from "react-icons/fi";
import { Card } from "@/components/ui/card";

export function LiveMatchEmptyCard({ label = "No data found" }: { label?: string }): React.ReactElement {
  return (
    <Card as="article" variant="strong" className="h-full w-full min-w-0 overflow-hidden p-4 sm:p-5">
      <div className="flex h-full min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/80 px-4 py-6 text-center">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <FiActivity className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-bold text-slate-800">{label}</p>
        <p className="mt-1 text-xs text-slate-500">Match updates will appear here when scheduled or completed.</p>
      </div>
    </Card>
  );
}
