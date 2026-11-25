import Link from "next/link";

type PaginationProps = {
  page: number;
  hasNextPage: boolean;
  basePath: string;
};

export function Pagination({ page, hasNextPage, basePath }: PaginationProps): React.ReactElement {
  const prev = page > 1 ? `${basePath}?page=${page - 1}` : null;
  const next = hasNextPage ? `${basePath}?page=${page + 1}` : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-4">
      {prev ? (
        <Link href={prev} className="rounded border border-slate-300 px-3 py-2 text-sm">
          Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-slate-600">Page {page}</span>
      {next ? (
        <Link href={next} className="rounded border border-slate-300 px-3 py-2 text-sm">
          Next
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}

