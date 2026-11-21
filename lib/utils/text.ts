import { clsx, type ClassValue } from "clsx";

export function cn(...values: ClassValue[]): string {
  return clsx(values);
}

export function trimText(value: string, max = 120): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
}

const TOURNAMENT_SHORT_NAMES: Array<[RegExp, string]> = [
  [/\benglish premier league\b/i, "EPL"],
  [/\bbangladesh premier league\b/i, "BPL"],
  [/\bindian premier league\b/i, "IPL"],
  [/\bpremier league t20\b/i, "PLT20"],
  [/\buefa champions league\b|\bchampions league\b/i, "UCL"],
  [/\beuropa league\b/i, "UEL"],
  [/\bworld test championship\b/i, "WTC"],
  [/\bworld cup qualifiers\b/i, "WCQ"],
  [/\bworld cup\b/i, "WC"],
  [/\bborder[- ]gavaskar\b/i, "BGT"],
  [/\basia cup\b/i, "ASIA"],
  [/\bbig bash\b/i, "BBL"],
  [/\bpakistan super league\b/i, "PSL"],
  [/\bcaribbean premier league\b/i, "CPL"],
  [/\bla liga\b/i, "LIGA"],
  [/\bserie a\b/i, "SERIE A"],
  [/\bbundesliga\b/i, "BULI"],
  [/\bligue 1\b/i, "L1"],
  [/\bmls\b/i, "MLS"],
  [/\bnba\b/i, "NBA"],
  [/\bwimbledon\b/i, "WIM"],
  [/\batp\b/i, "ATP"],
  [/\bwta\b/i, "WTA"],
  [/\bmlb\b/i, "MLB"],
  [/\bnhl\b/i, "NHL"],
  [/\brugby championship\b/i, "TRC"],
  [/\bsix nations\b/i, "6N"],
  [/\bformula 1\b|\bf1\b/i, "F1"],
  [/\bmotogp\b/i, "MGP"],
  [/\bvalorant champions tour\b|\bvct\b/i, "VCT"],
  [/\bufc\b/i, "UFC"],
  [/\bryder cup\b/i, "RYDER"],
  [/\bdiamond league\b/i, "WDL"]
];

export function formatTournamentShortName(seriesName?: string): string {
  const raw = (seriesName ?? "").trim();
  if (!raw) return "";

  for (const [pattern, shortCode] of TOURNAMENT_SHORT_NAMES) {
    if (pattern.test(raw)) return shortCode;
  }

  const primary = raw
    .split(/[·|–—]/)[0]
    .replace(/\b20\d{2}(?:[-–]\d{2,4})?\b/g, "")
    .trim();

  if (!primary) return raw.slice(0, 6).toUpperCase();

  const words = primary.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 6).toUpperCase();
  }

  const stopWords = new Set(["the", "of", "and", "in", "for", "at"]);
  const meaningful = words.filter((word) => !stopWords.has(word.toLowerCase()));
  const sourceWords = meaningful.length ? meaningful : words;

  if (sourceWords.length === 1) {
    return sourceWords[0].slice(0, 6).toUpperCase();
  }

  return sourceWords
    .map((word) => word[0])
    .join("")
    .slice(0, 5)
    .toUpperCase();
}
