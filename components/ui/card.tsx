import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/text";

type CardVariant = "default" | "strong";
type CardElement = "article" | "aside" | "div" | "header" | "main" | "nav" | "section" | "ul";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: CardElement;
  variant?: CardVariant;
  interactive?: boolean;
};

const variantClass: Record<CardVariant, string> = {
  default: "surface-card",
  strong: "surface-card-strong"
};

export function Card({
  as = "div",
  variant = "default",
  interactive = false,
  className,
  ...props
}: CardProps): React.ReactElement {
  const Component = as;

  return (
    <Component
      className={cn(
        variantClass[variant],
        interactive &&
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-brand-300/80 hover:shadow-xl active:translate-y-0 active:scale-[0.995]",
        className
      )}
      {...props}
    />
  );
}
