import { memo } from "react";
import { LiveMatchCard } from "@/components/live/LiveMatchCard";
import { LiveMatchEmptyCard } from "@/components/live/LiveMatchEmptyCard";
import type { LiveMatch } from "@/types/match";
import { cn } from "@/lib/utils/text";

type LiveMatchListProps = {
  matches: LiveMatch[];
  mobileLimit?: number;
  desktopColumns?: 3 | 4;
  emptyCount?: number;
  emptyLabel?: string;
};

function LiveMatchListComponent({
  matches,
  mobileLimit,
  desktopColumns = 3,
  emptyCount,
  emptyLabel
}: LiveMatchListProps): React.ReactElement {
  const desktopGridClass = desktopColumns === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-3";
  const shouldShowEmpty = matches.length === 0 && Boolean(emptyCount && emptyCount > 0);

  return (
    <div className={cn("grid gap-3.5 sm:grid-cols-2 sm:gap-4", desktopGridClass)}>
      {shouldShowEmpty
        ? Array.from({ length: emptyCount ?? 0 }).map((_, index) => (
            <div key={`empty-${index}`} className="min-w-0 animate-reveal-up" style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}>
              <LiveMatchEmptyCard label={emptyLabel} />
            </div>
          ))
        : matches.map((match, index) => (
            <div
              key={match.id}
              className={cn(
                "min-w-0 animate-reveal-up",
                mobileLimit !== undefined && index >= mobileLimit && "hidden sm:block"
              )}
              style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
            >
              <LiveMatchCard match={match} />
            </div>
          ))}
    </div>
  );
}

export const LiveMatchList = memo(
  LiveMatchListComponent,
  (previous, next) =>
    previous.matches === next.matches &&
    previous.mobileLimit === next.mobileLimit &&
    previous.desktopColumns === next.desktopColumns &&
    previous.emptyCount === next.emptyCount &&
    previous.emptyLabel === next.emptyLabel
);

LiveMatchList.displayName = "LiveMatchList";

