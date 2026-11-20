"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils/text";

type ScoreDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type ParticleTone = "orange" | "mint" | "sky" | "slate";

type FallingDigit = {
  id: string;
  digit: ScoreDigit;
  left: string;
  sizeClass: string;
  duration: string;
  delay: string;
};

const FALLING_DIGITS: FallingDigit[] = [
  // Wave 1
  { id: "w1-01", digit: "0", left: "1%", sizeClass: "text-[11px] sm:text-xs", duration: "13.2s", delay: "-1.4s" },
  { id: "w1-03", digit: "4", left: "6%", sizeClass: "text-xs sm:text-sm", duration: "11.6s", delay: "-3.8s" },
  { id: "w1-05", digit: "1", left: "11%", sizeClass: "text-[11px] sm:text-xs", duration: "14.9s", delay: "-2.7s" },
  { id: "w1-07", digit: "9", left: "16%", sizeClass: "text-sm sm:text-base", duration: "10.6s", delay: "-5.1s" },
  { id: "w1-09", digit: "2", left: "21.5%", sizeClass: "text-[11px] sm:text-xs", duration: "13.9s", delay: "-6.6s" },
  { id: "w1-11", digit: "3", left: "27%", sizeClass: "text-xs sm:text-sm", duration: "13.1s", delay: "-9.7s" },
  { id: "w1-13", digit: "7", left: "32%", sizeClass: "text-[11px] sm:text-xs", duration: "12.7s", delay: "-7.4s" },
  { id: "w1-15", digit: "0", left: "37.5%", sizeClass: "text-xs sm:text-sm", duration: "17.4s", delay: "-14.1s" },
  { id: "w1-17", digit: "6", left: "43%", sizeClass: "text-sm sm:text-base", duration: "11.1s", delay: "-2.2s" },
  { id: "w1-19", digit: "1", left: "48.5%", sizeClass: "text-[11px] sm:text-xs", duration: "16.1s", delay: "-12.0s" },
  { id: "w1-21", digit: "8", left: "54%", sizeClass: "text-xs sm:text-sm", duration: "10.9s", delay: "-1.5s" },
  { id: "w1-23", digit: "2", left: "59.5%", sizeClass: "text-[11px] sm:text-xs", duration: "15.3s", delay: "-5.9s" },
  { id: "w1-25", digit: "5", left: "65%", sizeClass: "text-xs sm:text-sm", duration: "12.8s", delay: "-3.8s" },
  { id: "w1-27", digit: "3", left: "71%", sizeClass: "text-[11px] sm:text-xs", duration: "14.3s", delay: "-13.4s" },
  { id: "w1-29", digit: "9", left: "76.5%", sizeClass: "text-sm sm:text-base", duration: "10.3s", delay: "-6.9s" },
  { id: "w1-31", digit: "4", left: "82.5%", sizeClass: "text-xs sm:text-sm", duration: "11.8s", delay: "-10.0s" },
  { id: "w1-33", digit: "0", left: "88%", sizeClass: "text-[11px] sm:text-xs", duration: "16.3s", delay: "-12.7s" },
  { id: "w1-35", digit: "2", left: "94%", sizeClass: "text-xs sm:text-sm", duration: "15.6s", delay: "-9.1s" },

  // Wave 2
  { id: "w2-02", digit: "7", left: "4.5%", sizeClass: "text-[11px] sm:text-xs", duration: "12.3s", delay: "-4.6s" },
  { id: "w2-04", digit: "3", left: "10%", sizeClass: "text-[11px] sm:text-xs", duration: "17.1s", delay: "-6.8s" },
  { id: "w2-06", digit: "4", left: "15%", sizeClass: "text-xs sm:text-sm", duration: "11.4s", delay: "-10.2s" },
  { id: "w2-08", digit: "1", left: "20.5%", sizeClass: "text-[11px] sm:text-xs", duration: "14.6s", delay: "-2.1s" },
  { id: "w2-10", digit: "8", left: "25.5%", sizeClass: "text-sm sm:text-base", duration: "10.4s", delay: "-11.8s" },
  { id: "w2-12", digit: "0", left: "31%", sizeClass: "text-[11px] sm:text-xs", duration: "15.4s", delay: "-13.7s" },
  { id: "w2-14", digit: "2", left: "36.5%", sizeClass: "text-[11px] sm:text-xs", duration: "16.2s", delay: "-1.3s" },
  { id: "w2-16", digit: "4", left: "42%", sizeClass: "text-xs sm:text-sm", duration: "11.2s", delay: "-7.2s" },
  { id: "w2-18", digit: "5", left: "47.5%", sizeClass: "text-[11px] sm:text-xs", duration: "13.4s", delay: "-3.6s" },
  { id: "w2-20", digit: "3", left: "52.5%", sizeClass: "text-[11px] sm:text-xs", duration: "14.7s", delay: "-8.0s" },
  { id: "w2-22", digit: "9", left: "58%", sizeClass: "text-sm sm:text-base", duration: "10.1s", delay: "-10.6s" },
  { id: "w2-24", digit: "1", left: "64%", sizeClass: "text-[11px] sm:text-xs", duration: "17.3s", delay: "-12.2s" },
  { id: "w2-26", digit: "0", left: "69.5%", sizeClass: "text-xs sm:text-sm", duration: "14.0s", delay: "-9.0s" },
  { id: "w2-28", digit: "7", left: "75%", sizeClass: "text-xs sm:text-sm", duration: "11.7s", delay: "-13.1s" },
  { id: "w2-30", digit: "2", left: "81%", sizeClass: "text-[11px] sm:text-xs", duration: "16.1s", delay: "-3.2s" },
  { id: "w2-32", digit: "8", left: "86.5%", sizeClass: "text-sm sm:text-base", duration: "10.7s", delay: "-5.4s" },
  { id: "w2-34", digit: "5", left: "92.5%", sizeClass: "text-[11px] sm:text-xs", duration: "13.7s", delay: "-8.3s" },
  { id: "w2-36", digit: "3", left: "98.5%", sizeClass: "text-[11px] sm:text-xs", duration: "16.5s", delay: "-11.5s" }
];

function toneClass(tone: ParticleTone): string {
  switch (tone) {
    case "orange":
      return "particle-tone-orange";
    case "mint":
      return "particle-tone-mint";
    case "sky":
      return "particle-tone-sky";
    default:
      return "particle-tone-slate";
  }
}

function digitToneClass(digit: ScoreDigit): string {
  if (digit === "6" || digit === "9") return toneClass("orange");
  if (digit === "4" || digit === "7" || digit === "8") return toneClass("mint");
  if (digit === "1" || digit === "3" || digit === "5") return toneClass("sky");
  return toneClass("slate");
}

type SportIconNode = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  weight: number;
  iconIndex: number;
  cooldown: number;
  pop: number;
  flash: number;
  flashTone: ParticleTone;
};

type MovingIconNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  iconIndex: number;
  tone: ParticleTone;
  lastNodeIndex: number;
};

type CanvasPalette = {
  fixed: string;
  orange: string;
  mint: string;
  sky: string;
  slate: string;
};

const MOVING_TONES: readonly ParticleTone[] = ["orange", "mint", "sky"];
const CELL_STEP = 54;
const INTERACTION_RADIUS = 135;
const MAX_PUSH = 24;
const SPRING_STIFFNESS = 0.14;
const SPRING_DAMPING = 0.78;
const MOVING_ICON_COUNT = 48;
const ATTRACT_RADIUS = 26;
const ATTRACT_RADIUS_SQ = ATTRACT_RADIUS * ATTRACT_RADIUS;
const CONNECT_RADIUS = 12;
const CONNECT_RADIUS_SQ = CONNECT_RADIUS * CONNECT_RADIUS;

const LIGHT_DEFAULT_PALETTE: CanvasPalette = {
  fixed: "rgba(71, 85, 105, 0.22)",
  orange: "rgba(234, 88, 12, 0.46)",
  mint: "rgba(5, 150, 105, 0.44)",
  sky: "rgba(29, 112, 242, 0.44)",
  slate: "rgba(51, 65, 85, 0.22)"
};

const DARK_DEFAULT_PALETTE: CanvasPalette = {
  fixed: "rgba(148, 163, 184, 0.22)",
  orange: "rgba(255, 92, 26, 0.52)",
  mint: "rgba(78, 216, 160, 0.50)",
  sky: "rgba(56, 189, 248, 0.48)",
  slate: "rgba(203, 213, 225, 0.22)"
};

// Normalized 24x24 vector SVG paths covering every sport, compiled lazily via Path2D in useEffect
const SPORT_ICON_PATHS: readonly string[] = [
  // Soccer / football
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 3.3 1.35-.95a8 8 0 0 1 4.38 3.34l-.39 1.34-1.35.46L13 6.7zm-3.35-.95L11 5.3v1.4L7.01 9.49l-1.35-.46-.39-1.34a8.1 8.1 0 0 1 4.38-3.34M7.08 17.11l-1.14.1A7.94 7.94 0 0 1 4 12c0-.12.01-.23.02-.35l1-.73 1.38.48 1.46 4.34zm7.42 2.48c-.79.26-1.63.41-2.5.41s-1.71-.15-2.5-.41l-.69-1.49.64-1.1h5.11l.64 1.11zM14.27 15H9.73l-1.35-4.02L12 8.44l3.63 2.54zm3.79 2.21-1.14-.1-.79-1.37 1.46-4.34 1.39-.47 1 .73c.01.11.02.22.02.34 0 1.99-.73 3.81-1.94 5.21",
  // Basketball
  "M17.09 11h4.86a9.95 9.95 0 0 0-1.54-4.4 5.99 5.99 0 0 0-3.32 4.4M6.91 11a5.99 5.99 0 0 0-3.32-4.4A9.95 9.95 0 0 0 2.05 11zM15.07 11a8 8 0 0 1 4.06-6A9.97 9.97 0 0 0 13 2.05V11zM8.93 11H11V2.05A9.94 9.94 0 0 0 4.87 5a8 8 0 0 1 4.06 6M15.07 13H13v8.95A9.94 9.94 0 0 0 19.13 19a8 8 0 0 1-4.06-6M3.59 17.4A6.03 6.03 0 0 0 6.91 13H2.05c.16 1.61.71 3.11 1.54 4.4M17.09 13a5.99 5.99 0 0 0 3.32 4.4 9.95 9.95 0 0 0 1.54-4.4zM8.93 13a8 8 0 0 1-4.06 6A9.97 9.97 0 0 0 11 21.95V13z",
  // Tennis racket & ball
  "M19.52 2.49C17.18.15 12.9.62 9.97 3.55c-1.6 1.6-2.52 3.87-2.54 5.46-.02 1.58.26 3.89-1.35 5.5l-4.24 4.24 1.42 1.42 4.24-4.24c1.61-1.61 3.92-1.33 5.5-1.35s3.86-.94 5.46-2.54c2.92-2.93 3.4-7.21 1.06-9.55m-9.2 9.19c-1.53-1.53-1.05-4.61 1.06-6.72s5.18-2.59 6.72-1.06c1.53 1.53 1.05 4.61-1.06 6.72s-5.18 2.59-6.72 1.06M18 17c.53 0 1.04.21 1.41.59.78.78.78 2.05 0 2.83-.37.37-.88.58-1.41.58s-1.04-.21-1.41-.59c-.78-.78-.78-2.05 0-2.83.37-.37.88-.58 1.41-.58m0-2a3.998 3.998 0 0 0-2.83 6.83c.78.78 1.81 1.17 2.83 1.17a3.998 3.998 0 0 0 2.83-6.83A4 4 0 0 0 18 15",
  // Cricket bat & ball
  "M15.05 12.81 6.56 4.32a.996.996 0 0 0-1.41 0L2.32 7.15a.996.996 0 0 0 0 1.41l8.49 8.49c.39.39 1.02.39 1.41 0l2.83-2.83a.996.996 0 0 0 0-1.41M14.341 17.756l1.414-1.414 4.243 4.243-1.414 1.414zM18.5 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7",
  // Baseball
  "M3.81 6.28C2.67 7.9 2 9.87 2 12s.67 4.1 1.81 5.72C6.23 16.95 8 14.68 8 12S6.23 7.05 3.81 6.28M20.19 6.28C17.77 7.05 16 9.32 16 12s1.77 4.95 4.19 5.72C21.33 16.1 22 14.13 22 12s-.67-4.1-1.81-5.72M14 12c0-3.28 1.97-6.09 4.79-7.33C17.01 3.02 14.63 2 12 2S6.99 3.02 5.21 4.67C8.03 5.91 10 8.72 10 12s-1.97 6.09-4.79 7.33C6.99 20.98 9.37 22 12 22s5.01-1.02 6.79-2.67A8 8 0 0 1 14 12",
  // Volleyball
  "M6 4.01C3.58 5.84 2 8.73 2 12c0 1.46.32 2.85.89 4.11L6 14.31zM11 11.42V2.05c-1.06.11-2.07.38-3 .79v10.32zM12 13.15l-8.11 4.68c.61.84 1.34 1.59 2.18 2.2L15 14.89zM13 7.96v3.46l8.11 4.68c.42-.93.7-1.93.82-2.98zM8.07 21.2c1.21.51 2.53.8 3.93.8 3.34 0 6.29-1.65 8.11-4.16L17 16.04zM21.92 10.81c-.55-4.63-4.26-8.3-8.92-8.76v3.6z",
  // Rugby
  "M20.49 3.51c-.56-.56-2.15-.97-4.16-.97-3.08 0-7.15.96-9.98 3.79-4.69 4.7-4.25 12.74-2.84 14.16.56.56 2.15.97 4.16.97 3.08 0 7.15-.96 9.98-3.79 4.69-4.7 4.25-12.74 2.84-14.16M7.76 7.76c2.64-2.64 6.35-3.12 8.03-3.19-2.05.94-4.46 2.45-6.61 4.61a23.5 23.5 0 0 0-4.62 6.63c.1-2.48.88-5.74 3.2-8.05m8.48 8.48c-2.64 2.64-6.35 3.12-8.03 3.19 2.05-.94 4.46-2.45 6.61-4.61 2.16-2.16 3.67-4.58 4.62-6.63-.1 2.48-.88 5.74-3.2 8.05",
  // American football
  "M3.02 15.62c-.08 2.42.32 4.34.67 4.69s2.28.76 4.69.67zM13.08 3.28c-2.33.42-4.79 1.34-6.62 3.18s-2.76 4.29-3.18 6.62l7.63 7.63c2.34-.41 4.79-1.34 6.62-3.18s2.76-4.29 3.18-6.62zM9.9 15.5l-1.4-1.4 5.6-5.6 1.4 1.4zM20.98 8.38c.08-2.42-.32-4.34-.67-4.69s-2.28-.76-4.69-.67z",
  // Hockey sticks & puck
  "M2 17v3h2v-4H3c-.55 0-1 .45-1 1M9 16H5v4l4.69-.01c.38 0 .72-.21.89-.55l.87-1.9-1.59-3.48zM21.71 16.29A1 1 0 0 0 21 16h-1v4h2v-3c0-.28-.11-.53-.29-.71M13.6 12.84 17.65 4H14.3l-1.76 3.97-.49 1.1-.05.14L9.7 4H6.35l4.05 8.84 1.52 3.32.08.18 1.42 3.1c.17.34.51.55.89.55L19 20v-4h-4z",
  // Golf ball & tee
  "M12 16c3.87 0 7-3.13 7-7s-3.13-7-7-7-7 3.13-7 7 3.13 7 7 7m0-12c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5M10 7a1 1 0 1 0 0 2 1 1 0 1 0 0-2M14 7a1 1 0 1 0 0 2 1 1 0 1 0 0-2M12 5a1 1 0 1 0 0 2 1 1 0 1 0 0-2M7 19h2c1.1 0 2 .9 2 2v1h2v-1c0-1.1.9-2 2-2h2v-2H7z",
  // Golf flag & cup
  "M10.2 3H12v15h-1.8zM12 3.4l8.5 3.6-8.5 3.6V3.4zM12 18.3a5.5 1.5 0 1 0 0 3 5.5 1.5 0 1 0 0-3",
  // Badminton shuttlecock
  "M8.6 14.3 4.2 5.2a1.3 1.3 0 0 1 2.2-1.2l3.8 9.6-1.6.7zM11 14V3.5a1 1 0 0 1 2 0V14h-2zM15.4 14.3l4.4-9.1a1.3 1.3 0 0 0-2.2-1.2l-3.8 9.6 1.6.7zM9 15h6v1.2H9zM9.5 17.2h5v.8a2.5 2.5 0 0 1-5 0z",
  // Motorsports helmet
  "M12 11.39c0-.65-.39-1.23-.98-1.48L5.44 7.55c-1.48 1.68-2.32 3.7-2.8 5.45h7.75c.89 0 1.61-.72 1.61-1.61M21.96 11.22c-.41-4.41-4.56-7.49-8.98-7.2-2.51.16-4.44.94-5.93 2.04l4.74 2.01c1.33.57 2.2 1.87 2.2 3.32 0 1.99-1.62 3.61-3.61 3.61H2.21C2 16.31 2 17.2 2 17.2v.8c0 1.1.9 2 2 2h10c4.67 0 8.41-4.01 7.96-8.78",
  // Esports controller
  "m21.58 16.09-1.09-7.66A3.996 3.996 0 0 0 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91M11 11H9v2H8v-2H6v-1h2V8h1v2h2zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1",
  // Handball
  "M14.27 6c-.55.95-.22 2.18.73 2.73s2.18.22 2.73-.73.22-2.18-.73-2.73-2.18-.22-2.73.73m1.57 4.41-2.6-1.5c-2.38-1.38-3.2-4.44-1.82-6.82l-1.73-1C8.1 3.83 8.6 7.21 10.66 9.4l-5.15 8.92 1.73 1 1.5-2.6 1.73 1-3 5.2 1.73 1 6.29-10.89a5 5 0 0 1 .31 5.46l1.73 1c1.6-2.75 1.28-6.58-1.69-9.08M12.75 3.8c.72.41 1.63.17 2.05-.55.41-.72.17-1.63-.55-2.05a1.501 1.501 0 0 0-1.5 2.6",
  // Martial arts
  "m19.8 2-8.2 6.7-1.21-1.04 3.6-2.08L9.41 1 8 2.41l2.74 2.74L5 8.46l-1.19 4.29L6.27 17 8 16l-2.03-3.52.35-1.3L9.5 13l.5 9h2l.5-10L21 3.4zM5 3a2 2 0 1 0 0 4 2 2 0 1 0 0-4",
  // MMA glove
  "M7 20c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-3H7zM18 7c-.55 0-1 .45-1 1V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v5.8c0 .13.01.26.04.39l.8 4c.09.47.5.8.98.8h10.36c.45 0 .89-.36.98-.8l.8-4c.03-.13.04-.26.04-.39V8c0-.55-.45-1-1-1m-3 3H7V7h8z",
  // Kabaddi
  "M16.5.38a2 2 0 1 0 0 4 2 2 0 1 0 0-4M24 11.88v-4.7l-5.05-2.14c-.97-.41-2.09-.06-2.65.84l-1 1.6c-.67 1.18-1.91 2.06-3.41 2.32l.06.06c.69.69 1.52 1.07 2.46 1.17.8-.42 1.52-.98 2.09-1.64l.6 3-1.16 1.1-.94.89v7.5h2v-6l2.1-2 1.8 8H23l-2.18-11-.62-3.1 1.8.7v3.4zM10.29 8.09c.22.15.47.24.72.29.13.02.25.04.38.04s.26-.01.38-.04c.13-.02.25-.06.37-.11.24-.1.47-.24.66-.44.49-.49.67-1.17.55-1.8-.07-.37-.25-.74-.55-1.03-.19-.19-.42-.34-.66-.44-.12-.05-.24-.09-.37-.11s-.25-.04-.38-.04c-.12 0-.23.01-.35.03-.14.02-.28.06-.41.11-.23.11-.46.26-.65.45-.3.29-.48.66-.55 1.03-.12.63.06 1.31.55 1.8.09.1.2.18.31.26m.95 2.47-2-2c-.1-.1-.2-.18-.31-.26a1.9 1.9 0 0 0-.72-.28c-.13-.03-.25-.04-.38-.04-.51 0-1.02.2-1.41.59l-3.34 3.34c-.41.41-.62.98-.58 1.54 0 .18.04.37.11.55l1.07 2.95-3.63 3.63L1.46 22l4.24-4.24v-2.22L7 16.75v5.13h2v-6l-2.12-2.12 2.36-2.36.71.71c1.29 1.26 2.97 2.04 5.03 2.04l-.14-2.07c-1.5-.02-2.7-.62-3.6-1.52",
  // Running / athletics
  "M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m-3.6 13.9 1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2z",
  // Gymnastics
  "M4 6c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2M1 9h6l7-5 1.31 1.52-4.17 2.98H14L21.8 4 23 5.4 14.5 12 14 22h-2l-.5-10L8 11H1z",
  // Cycling
  "M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2M5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5m0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5m5.8-10 2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5m0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5",
  // Swimming / pool
  "M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.08.64-2.19.64s-1.73-.37-2.18-.64c-.37-.23-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.08.64-2.19.64v-2c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36s.78-.13 1.15-.36c.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36zm0-4.5c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.45.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.45.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36s-.78.13-1.15.36c-.47.27-1.09.64-2.2.64v-2c.56 0 .78-.13 1.15-.36.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.56 0 .78-.13 1.15-.36.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36v2zM8.67 12c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.12-.07.26-.15.41-.23L10.48 5C8.93 3.45 7.5 2.99 5 3v2.5c1.82-.01 2.89.39 4 1.5l1 1-3.25 3.25c.31.12.56.27.77.39.37.23.59.36 1.15.36M16.5 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5",
  // Weightlifting / fitness
  "M20.57 14.86 22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z",
  // Trophy cup
  "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2M5 8V7h2v3.82C5.84 10.4 5 9.3 5 8m14 0c0 1.3-.84 2.4-2 2.82V7h2z",
  // Championship medal / star
  "M17 10.43V2H7v8.43c0 .35.18.68.49.86l4.18 2.51-.99 2.34-3.41.29 2.59 2.24L9.07 22 12 20.23 14.93 22l-.78-3.33 2.59-2.24-3.41-.29-.99-2.34 4.18-2.51c.3-.18.48-.5.48-.86m-4 1.8-1 .6-1-.6V3h2z"
];

function hash2D(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function pickIconScale(seedVal: number): { scale: number; weight: number } {
  const scale =
    seedVal < 0.34
      ? 0.45
      : seedVal < 0.64
        ? 0.58
        : seedVal < 0.84
          ? 0.72
          : seedVal < 0.94
            ? 0.84
            : 0.95;
  const weight = 0.75 + ((scale - 0.45) / 0.5) * 0.6;
  return { scale, weight };
}

function readCanvasPalette(): CanvasPalette {
  const root = document.documentElement;
  const tokens = window.getComputedStyle(root);
  const defaults = root.dataset.theme === "light" ? LIGHT_DEFAULT_PALETTE : DARK_DEFAULT_PALETTE;
  return {
    fixed: tokens.getPropertyValue("--dot-canvas").trim() || defaults.fixed,
    orange: tokens.getPropertyValue("--particle-orange").trim() || defaults.orange,
    mint: tokens.getPropertyValue("--particle-mint").trim() || defaults.mint,
    sky: tokens.getPropertyValue("--particle-sky").trim() || defaults.sky,
    slate: tokens.getPropertyValue("--particle-slate").trim() || defaults.slate
  };
}

export function AnimatedScoreBackground(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || typeof Path2D === "undefined") return;

    const iconPaths = SPORT_ICON_PATHS.map((d) => new Path2D(d));
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;
    let nodes: SportIconNode[] = [];
    let movers: MovingIconNode[] = [];
    let palette = readCanvasPalette();
    let rafId = 0;

    const mouse = { x: -9999, y: -9999 };
    const radiusSq = INTERACTION_RADIUS * INTERACTION_RADIUS;

    const rebuildGrid = (): void => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

      const nextNodes: SportIconNode[] = [];
      const cols = Math.ceil(width / CELL_STEP) + 2;
      const rows = Math.ceil(height / CELL_STEP) + 2;

      for (let row = -1; row < rows; row += 1) {
        const staggerX = (row & 1) * 14;
        for (let col = -1; col < cols; col += 1) {
          if (hash2D(col, row, 3) < 0.14) continue;

          const jitterX = (hash2D(col, row, 1) - 0.5) * 40;
          const jitterY = (hash2D(col, row, 2) - 0.5) * 40;
          const ox = col * CELL_STEP + staggerX + jitterX;
          const oy = row * CELL_STEP + jitterY;
          const { scale, weight } = pickIconScale(hash2D(col, row, 5));
          const iconIndex = Math.floor(hash2D(col, row, 9) * iconPaths.length) % iconPaths.length;

          nextNodes.push({
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
            scale,
            weight,
            iconIndex,
            cooldown: 0,
            pop: 0,
            flash: 0,
            flashTone: "orange"
          });

          if (hash2D(col, row, 4) > 0.82) {
            const angle = hash2D(col, row, 6) * Math.PI * 2;
            const dist = 18 + hash2D(col, row, 7) * 10;
            const satX = ox + Math.cos(angle) * dist;
            const satY = oy + Math.sin(angle) * dist;
            const sat = pickIconScale(hash2D(col, row, 8));
            const satIconIndex = Math.floor(hash2D(col, row, 10) * iconPaths.length) % iconPaths.length;
            nextNodes.push({
              ox: satX,
              oy: satY,
              x: satX,
              y: satY,
              vx: 0,
              vy: 0,
              scale: sat.scale,
              weight: sat.weight,
              iconIndex: satIconIndex,
              cooldown: 0,
              pop: 0,
              flash: 0,
              flashTone: "orange"
            });
          }
        }
      }
      nodes = nextNodes;
    };

    const rebuildMovingIcons = (): void => {
      if (!movers.length) {
        const nextMovers: MovingIconNode[] = [];
        const usableWidth = Math.max(1, width - 32);
        const slotWidth = usableWidth / MOVING_ICON_COUNT;
        for (let i = 0; i < MOVING_ICON_COUNT; i += 1) {
          const h1 = hash2D(i, 11, 1);
          const h2 = hash2D(i, 17, 2);
          const h3 = hash2D(i, 23, 3);
          const h4 = hash2D(i, 31, 4);
          const h5 = hash2D(i, 41, 5);
          const rawX = 16 + i * slotWidth + (h1 - 0.5) * Math.min(28, slotWidth * 0.85);
          nextMovers.push({
            x: Math.min(Math.max(16, rawX), Math.max(16, width - 16)),
            y: -40 + h2 * (height + 40),
            vx: (h3 - 0.5) * 0.28,
            vy: 0.9 + h4 * 0.75,
            scale: 0.58 + h5 * 0.28,
            iconIndex: Math.floor(hash2D(i, 53, 6) * iconPaths.length) % iconPaths.length,
            tone: MOVING_TONES[i % MOVING_TONES.length],
            lastNodeIndex: -1
          });
        }
        movers = nextMovers;
        return;
      }

      const span = Math.max(32, width - 32);
      for (let i = 0; i < movers.length; i += 1) {
        movers[i].lastNodeIndex = -1;
        if (movers[i].x > width - 16) {
          movers[i].x = Math.max(16, (movers[i].x % span) + 16);
        }
      }
    };

    const tick = (): void => {
      rafId = 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const pointerActive = mouse.x > -5000 && mouse.y > -5000;

      // 1. Update top-to-bottom moving sports icons, steer toward approaching fixed icons, and replace on contact
      for (let m = 0; m < movers.length; m += 1) {
        const mover = movers[m];
        mover.x += mover.vx;
        mover.y += mover.vy;

        if (mover.x < -24) {
          mover.x = width + 20;
        } else if (mover.x > width + 24) {
          mover.x = -20;
        }

        if (mover.y > height + 28) {
          mover.y = -24 - Math.random() * 36;
          mover.x = 16 + Math.random() * Math.max(1, width - 32);
          mover.vx = (Math.random() - 0.5) * 0.28;
          mover.iconIndex = (mover.iconIndex + 7) % iconPaths.length;
          mover.tone = MOVING_TONES[(MOVING_TONES.indexOf(mover.tone) + 1) % MOVING_TONES.length];
          mover.lastNodeIndex = -1;
          continue;
        }

        let closestIndex = -1;
        let closestDistSq = ATTRACT_RADIUS_SQ;

        for (let n = 0; n < nodes.length; n += 1) {
          if (n === mover.lastNodeIndex) continue;
          const candidate = nodes[n];
          if (candidate.cooldown > 0) continue;

          const dx = candidate.x - mover.x;
          if (dx > ATTRACT_RADIUS || dx < -ATTRACT_RADIUS) continue;
          const dy = candidate.y - mover.y;
          if (dy > ATTRACT_RADIUS || dy < -ATTRACT_RADIUS) continue;

          const distSq = dx * dx + dy * dy;
          if (distSq < closestDistSq) {
            closestDistSq = distSq;
            closestIndex = n;
          }
        }

        if (closestIndex !== -1) {
          const node = nodes[closestIndex];
          if (closestDistSq <= CONNECT_RADIUS_SQ) {
            const incomingIcon =
              mover.iconIndex === node.iconIndex
                ? (mover.iconIndex + 1) % iconPaths.length
                : mover.iconIndex;
            const displacedIcon = node.iconIndex;
            const displacedScale = node.scale;

            // Replace the fixed icon with the moving icon
            node.iconIndex = incomingIcon;
            node.scale = Math.max(0.68, mover.scale);
            node.weight = 0.75 + (Math.min(Math.max(node.scale - 0.45, 0), 0.5) / 0.5) * 0.6;
            node.vx += mover.vx * 1.4;
            node.vy += mover.vy * 2.4;
            node.pop = 1;
            node.flash = 1;
            node.flashTone = mover.tone;
            node.cooldown = 28;

            // Displaced fixed icon continues falling from the contact point with a different tone
            mover.iconIndex =
              displacedIcon === incomingIcon
                ? (incomingIcon + 3) % iconPaths.length
                : displacedIcon;
            mover.scale = Math.max(0.6, displacedScale);
            mover.tone = MOVING_TONES[(MOVING_TONES.indexOf(mover.tone) + 1) % MOVING_TONES.length];
            mover.vx = mover.x >= node.x ? 0.35 : -0.35;
            mover.lastNodeIndex = closestIndex;
          } else if (node.y >= mover.y - 4) {
            mover.x += (node.x - mover.x) * 0.14;
          }
        }
      }

      // 2. Step fixed-node cursor repulsion, spring return, pop & accent flash, and render
      let lastFill = "";
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.cooldown > 0) {
          node.cooldown -= 1;
        }
        if (node.pop > 0.01) {
          node.pop *= 0.88;
        } else {
          node.pop = 0;
        }
        if (node.flash > 0.02) {
          node.flash *= 0.965;
        } else {
          node.flash = 0;
        }

        let targetX = node.ox;
        let targetY = node.oy;

        if (pointerActive) {
          const dx = node.ox - mouse.x;
          const dy = node.oy - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0 && distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / INTERACTION_RADIUS) ** 2;
            const push = force * MAX_PUSH * node.weight;
            targetX += (dx / dist) * push;
            targetY += (dy / dist) * push;
          }
        }

        node.vx = (node.vx + (targetX - node.x) * SPRING_STIFFNESS) * SPRING_DAMPING;
        node.vy = (node.vy + (targetY - node.y) * SPRING_STIFFNESS) * SPRING_DAMPING;
        node.x += node.vx;
        node.y += node.vy;

        const nextFill = node.flash > 0.18 ? palette[node.flashTone] : palette.fixed;
        if (nextFill !== lastFill) {
          ctx.fillStyle = nextFill;
          lastFill = nextFill;
        }

        const renderScale = node.scale * (1 + node.pop * 0.45);
        const s = dpr * renderScale;
        ctx.setTransform(
          s,
          0,
          0,
          s,
          (node.x - 12 * renderScale) * dpr,
          (node.y - 12 * renderScale) * dpr
        );
        ctx.fill(iconPaths[node.iconIndex]);
      }

      // 3. Render active top-to-bottom falling moving icons
      for (let m = 0; m < movers.length; m += 1) {
        const mover = movers[m];
        const nextFill = palette[mover.tone];
        if (nextFill !== lastFill) {
          ctx.fillStyle = nextFill;
          lastFill = nextFill;
        }

        const s = dpr * mover.scale;
        ctx.setTransform(s, 0, 0, s, (mover.x - 12 * mover.scale) * dpr, (mover.y - 12 * mover.scale) * dpr);
        ctx.fill(iconPaths[mover.iconIndex]);
      }

      if (!document.hidden) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const wakeLoop = (): void => {
      if (!rafId && !document.hidden) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (event: PointerEvent): void => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const resetPointer = (): void => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleResize = (): void => {
      rebuildGrid();
      rebuildMovingIcons();
      wakeLoop();
    };

    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
        return;
      }
      wakeLoop();
    };

    const themeObserver = new MutationObserver(() => {
      palette = readCanvasPalette();
      wakeLoop();
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    rebuildGrid();
    rebuildMovingIcons();
    wakeLoop();

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("mouseleave", resetPointer);

    return () => {
      themeObserver.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {FALLING_DIGITS.map((item) => {
        const style: CSSProperties = {
          left: item.left,
          animationDuration: item.duration,
          animationDelay: item.delay
        };

        return (
          <span
            key={item.id}
            style={style}
            className={cn(
              "bg-score-number font-black italic tracking-tight tabular-nums",
              item.sizeClass,
              digitToneClass(item.digit)
            )}
          >
            {item.digit}
          </span>
        );
      })}
      <div className="bg-foreground-blur pointer-events-none absolute inset-0" />
    </div>
  );
}
