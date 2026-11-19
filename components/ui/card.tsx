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
        interactive && "transition-shadow duration-300 hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}
