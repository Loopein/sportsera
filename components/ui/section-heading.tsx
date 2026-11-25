import type { ReactNode } from "react";
import { cn } from "@/lib/utils/text";

type SectionHeadingProps = {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function SectionHeading({
  title,
  icon,
  action,
  className,
  titleClassName
}: SectionHeadingProps): React.ReactElement {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2", className)}>
      <h2 className={cn("section-title inline-flex min-w-0 items-center gap-2.5", titleClassName)}>
        {icon ? (
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-sm sm:h-9 sm:w-9">
            {icon}
          </span>
        ) : null}
        <span className="truncate">{title}</span>
      </h2>
      {action}
    </div>
  );
}
