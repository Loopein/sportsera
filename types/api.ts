export type ApiResponse<T> = {
  data: T;
  meta?: {
    cached?: boolean;
    generatedAt?: string;
    etag?: string;
  };
};

export type RankingEntry = {
  teamId: string;
  teamName: string;
  format: "test" | "odi" | "t20";
  rank: number;
  rating: number;
};

export type StandingsStageId = "group-stage" | "second-group-stage";

export type StandingsRow = {
  teamId: string;
  teamName: string;
  shortCode: string;
  played: number;
  won: number;
  lost: number;
  netRunRate: number;
  points: number;
  highlight?: boolean;
};

export type StandingsGroup = {
  id: string;
  label: string;
  rows: StandingsRow[];
};

export type StandingsStage = {
  id: StandingsStageId;
  label: string;
  groups: StandingsGroup[];
};

export type StandingsSeries = {
  id: string;
  label: string;
  stages: StandingsStage[];
};

export type StandingsSeason = {
  season: string;
  series: StandingsSeries[];
};

export type SearchResult =
  | { type: "match"; id: string; label: string; href: string; description?: string }
  | { type: "team"; id: string; label: string; href: string; description?: string }
  | { type: "player"; id: string; label: string; href: string; description?: string }
  | { type: "series"; id: string; label: string; href: string; description?: string };
