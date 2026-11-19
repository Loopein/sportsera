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
      <h2 className={cn("section-title inline-flex items-center gap-2", titleClassName)}>
        {icon}
        {title}
      </h2>
      {action}
    </div>
  );
}
