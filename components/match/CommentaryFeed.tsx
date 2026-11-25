import { memo } from "react";
import type { CommentaryItem } from "@/types/match";
import { Card } from "@/components/ui/card";
import { formatTime } from "@/lib/utils/date";

function detectCommentaryTag(text: string): { label: string; className: string } | null {
  if (/\bsix\b|max(imum)?|\b6 runs?\b/i.test(text)) {
    return { label: "6", className: "border-indigo-200 bg-indigo-50 text-indigo-800" };
  }
  if (/\bfour\b|\b4 runs?\b|boundary/i.test(text)) {
    return { label: "4", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
  }
  if (/\bwicket\b|\bout\b|\bbowled\b|\bcaught\b|\blbw\b/i.test(text)) {
    return { label: "W", className: "border-red-200 bg-red-50/90 text-red-700" };
  }
  if (/\bgoal\b|\bscored!\b/i.test(text)) {
    return { label: "GOAL", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
  }
  return null;
}

function CommentaryFeedItem({
  item
}: {
  item: CommentaryItem;
}): React.ReactElement {
  const eventTag = detectCommentaryTag(item.text);

  return (
    <li className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-3.5 transition hover:border-brand-200">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-extrabold text-brand-800">
            Over {item.over} · Ball {item.ball}
          </span>
          {eventTag ? (
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-black uppercase tracking-wider ${eventTag.className}`}
            >
              {eventTag.label}
            </span>
          ) : null}
        </div>
        <span>{formatTime(item.timestamp)}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-800">{item.text}</p>
    </li>
  );
}

const MemoCommentaryFeedItem = memo(
  CommentaryFeedItem,
  (previous, next) => previous.item === next.item
);

MemoCommentaryFeedItem.displayName = "CommentaryFeedItem";

function CommentaryFeedComponent({ items }: { items: CommentaryItem[] }): React.ReactElement {
  return (
    <Card as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold text-slate-900">Live Play-by-Play Commentary</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
          {items.length} updates
        </span>
      </div>
      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <MemoCommentaryFeedItem key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Live play-by-play commentary will appear here once the match gets underway.
        </p>
      )}
    </Card>
  );
}

export const CommentaryFeed = memo(
  CommentaryFeedComponent,
  (previous, next) => previous.items === next.items
);

CommentaryFeed.displayName = "CommentaryFeed";
