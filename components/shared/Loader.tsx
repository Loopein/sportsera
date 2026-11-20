import { LoopeinLogo, LoopeinLoopIcon } from "@/components/shared/LoopeinBranding";

export function Loader({ label = "Loading..." }: { label?: string }): React.ReactElement {
  return (
    <div
      role="status"
      aria-label={label}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <LoopeinLoopIcon className="h-9 w-auto" />
          <div className="space-y-1">
            <LoopeinLogo height={20} />
            <p className="text-xs font-semibold text-slate-500">{label}</p>
          </div>
        </div>
        <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200/80" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <span>Powered by</span>
        <LoopeinLogo height={14} />
      </div>
    </div>
  );
}
