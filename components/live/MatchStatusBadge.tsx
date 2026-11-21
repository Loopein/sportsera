import type { ReactNode } from "react";
import type { MatchStatus } from "@/types/match";
import type { IconType } from "react-icons";
import { BiBroadcast } from "react-icons/bi";
import { FiActivity, FiCheckCircle, FiClock, FiPauseCircle } from "react-icons/fi";
import { cn } from "@/lib/utils/text";
import { statusLabel } from "@/lib/utils/score";

const badgeColor: Record<MatchStatus, string> = {
  live: "bg-red-100 text-red-700 ring-1 ring-red-200",
  innings_break: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  upcoming: "bg-brand-100 text-brand-700 ring-1 ring-brand-200",
  completed: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
};

const badgeIcon: Record<MatchStatus, IconType> = {
  live: BiBroadcast,
  innings_break: FiPauseCircle,
  upcoming: FiClock,
  completed: FiCheckCircle
};

export function MatchStatusBadge({
  status,
  label,
  hideIcon = false,
  className
}: {
  status: MatchStatus;
  label?: ReactNode;
  hideIcon?: boolean;
  className?: string;
}): React.ReactElement {
  const Icon = badgeIcon[status];

  return (
    <span
      className={cn(
        "inline-flex min-w-0 shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        badgeColor[status],
        className
      )}
    >
      {!hideIcon ? (
        <Icon className={cn("h-3.5 w-3.5 shrink-0", status === "live" && "animate-pulse-soft")} aria-hidden="true" />
      ) : null}
      <span className="truncate">{label ?? statusLabel(status)}</span>
    </span>
  );
}

