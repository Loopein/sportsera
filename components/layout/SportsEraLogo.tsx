import { LoopeinLogo } from "@/components/shared/LoopeinBranding";
import { cn } from "@/lib/utils/text";

type SportsEraFaviconIconProps = {
  className?: string;
};

type SportsEraLogoProps = {
  theme?: "light" | "dark" | "auto";
  iconClassName?: string;
  className?: string;
  showPoweredBy?: boolean;
};

export function SportsEraFaviconIcon({ className }: SportsEraFaviconIconProps): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={64}
      height={64}
      aria-hidden="true"
      className={cn(className || "h-8 w-8 sm:h-11 sm:w-11", "shrink-0")}
    >
      <rect
        x={2}
        y={2}
        width={60}
        height={60}
        rx={15}
        strokeOpacity={0.35}
        strokeWidth={1.5}
        className="fill-[#0B1221] stroke-[#FF4D00]"
      />
      <g transform="translate(32,32) scale(0.255) translate(-120,-120)">
        <g transform="translate(120,120) skewX(-10) translate(-120,-120)">
          <path
            d="M 63 72 L 113 72 L 113 92 L 71 92 L 71 110 L 101 110 L 113 122 L 113 156 L 101 168 L 51 168 L 51 148 L 93 148 L 93 130 L 63 130 L 51 118 L 51 84 Z"
            className="fill-white"
          />
          <path
            d="M 127 72 L 189 72 L 189 92 L 147 92 L 147 148 L 189 148 L 189 168 L 127 168 Z"
            className="fill-white"
          />
          <polygon points="155,102 189,120 155,138" className="fill-[#FF4D00]" />
        </g>
      </g>
    </svg>
  );
}

export function SportsEraPlayIcon({ className }: SportsEraFaviconIconProps): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      aria-hidden="true"
      className={cn(className || "h-4 w-4", "shrink-0")}
    >
      <g transform="translate(12,12) skewX(-10) translate(-12,-12)">
        <polygon points="3.5,3 20.5,12 3.5,21" className="fill-[#FF4D00]" />
      </g>
    </svg>
  );
}

export function SportsEraLogo({
  theme = "auto",
  iconClassName,
  className,
  showPoweredBy = false
}: SportsEraLogoProps): React.ReactElement {
  const sportsTextColor =
    theme === "dark"
      ? "text-white"
      : theme === "light"
        ? "text-[#0B1221]"
        : "text-[var(--logo-sports-color)]";

  const wordmarkSizeClass = showPoweredBy
    ? "text-[1.45rem] sm:text-[2.05rem]"
    : "text-[1.2rem] sm:text-[1.7rem]";

  return (
    <span aria-hidden="true" className={cn("inline-flex shrink-0 items-center gap-2 sm:gap-2.5", className)}>
      <SportsEraFaviconIcon
        className={cn(showPoweredBy && "h-10 w-10 sm:h-12 sm:w-12", iconClassName)}
      />
      <span className="inline-flex flex-col leading-none">
        <span className="inline-flex items-baseline leading-none">
          <span
            className={cn(
              "font-black italic tracking-tight leading-none",
              wordmarkSizeClass,
              sportsTextColor
            )}
          >
            SPORTS
          </span>
          <span
            className={cn(
              "font-black italic tracking-tight leading-none text-[#FF4D00]",
              wordmarkSizeClass
            )}
          >
            ERA
          </span>
        </span>
        <span
          className={cn(
            "flex w-full items-center leading-none",
            showPoweredBy ? "mt-1 justify-between gap-3" : "mt-0.5 justify-end gap-1.5"
          )}
        >
          {showPoweredBy ? (
            <span className="inline-flex items-center gap-1.5 leading-none text-slate-600">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.05em] leading-none whitespace-nowrap sm:text-[11px]">
                Powered by
              </span>
              <LoopeinLogo height={13} />
            </span>
          ) : null}
          <span className="inline-flex shrink-0 items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D00]" />
            <span
              className={cn(
                "font-extrabold uppercase tracking-[0.18em] leading-none text-[#FF4D00]",
                showPoweredBy ? "text-[9.5px] sm:text-[10px]" : "text-[8.5px]"
              )}
            >
              LIVE
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}
