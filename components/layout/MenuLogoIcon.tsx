import { cn } from "@/lib/utils/text";

type MenuLogoIconProps = {
  className?: string;
};

export function MenuLogoIcon({ className }: MenuLogoIconProps): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" className={cn("menu-trigger-icon", className)} aria-hidden="true" fill="none">
      <rect x="4" y="5" width="13" height="2.2" rx="1.1" fill="currentColor" />
      <rect x="4" y="10.5" width="13" height="2.2" rx="1.1" fill="currentColor" />
      <rect x="4" y="16" width="3.4" height="2.2" rx="1.1" fill="#facc15" />
      <rect x="8.2" y="16" width="8.8" height="2.2" rx="1.1" fill="currentColor" />
    </svg>
  );
}
