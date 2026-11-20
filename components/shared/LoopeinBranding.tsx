"use client";

import { useId } from "react";
import iconImg from "@/public/loopein/loopein-icon.png";
import "@/public/loopein/loopein.css";
import LoopeinLogo from "@/public/loopein";
import { cn } from "@/lib/utils/text";

export { LoopeinLogo };
export type { LoopeinLogoProps } from "@/public/loopein";

const iconSrc = typeof iconImg === "string" ? iconImg : iconImg.src;

export function LoopeinLoopIcon({ className }: { className?: string }): React.ReactElement {
  const rawId = useId();
  const maskId = `loopein-standalone-mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      viewBox="0 0 297 239"
      width={297}
      height={239}
      aria-hidden="true"
      className={cn("h-8 w-auto shrink-0 select-none", className)}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="297" height="239">
          <path
            d="M 131 115 C 112 96, 90 83, 68 83 C 34 83, 18 106, 18 132 C 18 158, 36 180, 68 180 C 94 180, 115 161, 143.5 132.5 C 172 104, 196 83, 226 83 C 258 83, 276 106, 276 132 C 276 158, 258 180, 226 180 C 204 180, 184 167, 164 147 L 145 166 L 145 240"
            fill="none"
            stroke="white"
            strokeWidth="41.5"
            strokeLinecap="butt"
            strokeLinejoin="round"
            className="loopein-loop-mask-path"
          />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <image href={iconSrc} x="0" y="0" width="297" height="239" />
      </g>
    </svg>
  );
}

type PoweredByLoopeinProps = {
  logoHeight?: number;
  className?: string;
};

export function PoweredByLoopein({
  logoHeight = 15,
  className
}: PoweredByLoopeinProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-600",
        className
      )}
    >
      <span className="uppercase tracking-[0.08em]">Powered by</span>
      <LoopeinLogo height={logoHeight} />
    </span>
  );
}
