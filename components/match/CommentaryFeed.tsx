import { memo } from "react";
import type { CommentaryItem } from "@/types/match";
import { formatTime } from "@/lib/utils/date";

function CommentaryFeedItem({
  item
}: {
  item: CommentaryItem;
}): React.ReactElement {
  return (
    <li className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
        <span>
          Over {item.over} | Ball {item.ball}
        </span>
        <span>{formatTime(item.timestamp)}</span>
      </div>
      <p className="mt-2 text-sm text-slate-800">{item.text}</p>
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
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Commentary</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <MemoCommentaryFeedItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

export const CommentaryFeed = memo(
  CommentaryFeedComponent,
  (previous, next) => previous.items === next.items
);

CommentaryFeed.displayName = "CommentaryFeed";

