"use client";

import React, { useEffect, useId, useRef } from "react";
import leftImg from "./loopein-left.png";
import iconImg from "./loopein-icon.png";
import rightImg from "./loopein-right.png";
import "./loopein.css";

type ImageImport = string | { src: string };

const resolveSrc = (img: ImageImport): string =>
  typeof img === "string" ? img : img.src;

export interface LoopeinLogoProps {
  className?: string;
  style?: React.CSSProperties;
  height?: number | string;
  href?: string;
  target?: string;
  rel?: string;
}

export default function LoopeinLogo({
  className = "",
  style,
  height,
  href,
  target,
  rel,
}: LoopeinLogoProps) {
  const rawId = useId();
  const maskId = `loopein-loop-mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const pathEl = el.querySelector(".loopein-loop-mask-path");
    const anims = [
      ...el.getAnimations(),
      ...(pathEl ? pathEl.getAnimations() : []),
    ];
    for (const anim of anims) {
      anim.currentTime = 0;
    }
  });

  const hasHeight =
    height !== undefined ||
    Boolean(style?.height) ||
    /(^|\s)h-/.test(className);

  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(height !== undefined
      ? { height: typeof height === "number" ? `${height}px` : height }
      : !hasHeight
      ? { height: "1.25rem" }
      : {}),
  };

  const content = (
    <svg
      viewBox="0 0 845 239"
      width={845}
      height={239}
      aria-hidden="true"
      className="loopein-svg"
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="297"
          height="239"
        >
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
      <image
        href={resolveSrc(leftImg)}
        x="0"
        y="0"
        width="209"
        height="239"
      />
      <g transform="translate(209, 0)" mask={`url(#${maskId})`}>
        <image
          href={resolveSrc(iconImg)}
          x="0"
          y="0"
          width="297"
          height="239"
        />
      </g>
      <image
        href={resolveSrc(rightImg)}
        x="506"
        y="0"
        width="339"
        height="239"
      />
    </svg>
  );

  const combinedClassName = `loopein-logo ${className}`.trim();

  if (href) {
    return (
      <a
        ref={(node) => {
          rootRef.current = node;
        }}
        href={href}
        target={target}
        rel={rel}
        style={combinedStyle}
        className={combinedClassName}
        aria-label="Loopein"
      >
        {content}
      </a>
    );
  }

  return (
    <span
      ref={(node) => {
        rootRef.current = node;
      }}
      style={combinedStyle}
      className={combinedClassName}
      aria-label="Loopein"
    >
      {content}
    </span>
  );
}
