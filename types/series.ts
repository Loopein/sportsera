export type SeriesSummary = {
  id: string;
  name: string;
  season: string;
  format: string;
  startDate: string;
  endDate: string;
  status: "ongoing" | "upcoming" | "completed";
};

export type SeriesStanding = {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  netRunRate: number;
};
