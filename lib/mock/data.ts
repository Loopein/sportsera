import type { RankingEntry, SearchResult, StandingsSeason } from "@/types/api";
import type { MatchStats, MatchSummary, CommentaryItem, LiveMatch, Scorecard } from "@/types/match";
import type { NewsArticle } from "@/types/news";
import type { PlayerProfile } from "@/types/player";
import type { SeriesStanding, SeriesSummary } from "@/types/series";
import type { TournamentPlayerStat } from "@/types/stats";
import type { TeamProfile } from "@/types/team";

const now = new Date();

export const liveMatches: LiveMatch[] = [
  {
    id: "match-1001",
    slug: "asia-cup-final-ind-vs-aus",
    status: "live",
    format: "ODI",
    seriesName: "Asia Cup 2026",
    venue: "Sher-e-Bangla National Stadium, Dhaka",
    teamA: { id: "team-ind", name: "India", shortName: "IND", score: "221/4 (39.1)" },
    teamB: { id: "team-aus", name: "Australia", shortName: "AUS", score: "278/9 (50)" },
    summary: "India need 58 from 65 balls",
    lastUpdatedAt: new Date(now.getTime() - 20_000).toISOString()
  },
  {
    id: "match-1002",
    slug: "pl-super-over-eng-vs-sa",
    status: "innings_break",
    format: "T20",
    seriesName: "Premier League 2026",
    venue: "Lord's, London",
    teamA: { id: "team-eng", name: "England", shortName: "ENG", score: "176/7 (20)" },
    teamB: { id: "team-sa", name: "South Africa", shortName: "SA", score: "" },
    summary: "Innings break",
    lastUpdatedAt: new Date(now.getTime() - 45_000).toISOString()
  }
];

export const allMatchSummaries: MatchSummary[] = [
  {
    id: "match-1001",
    status: "live",
    format: "ODI",
    seriesName: "Asia Cup 2026",
    venue: "Sher-e-Bangla National Stadium, Dhaka",
    toss: "Australia won the toss and elected to bat",
    teamA: {
      id: "team-ind",
      name: "India",
      shortName: "IND",
      logo: "/images/teams/ind.png",
      score: "221/4"
    },
    teamB: {
      id: "team-aus",
      name: "Australia",
      shortName: "AUS",
      logo: "/images/teams/aus.png",
      score: "278/9"
    },
    currentRunRate: 5.65,
    requiredRunRate: 5.35,
    lastUpdatedAt: new Date(now.getTime() - 20_000).toISOString(),
    target: 279,
    overs: "39.1",
    currentBatters: [
      { name: "Virat Kohli", runs: 74, balls: 76 },
      { name: "KL Rahul", runs: 31, balls: 35 }
    ],
    currentBowlers: [{ name: "Pat Cummins", overs: "8.1", runs: 41, wickets: 1 }],
    recentOvers: ["0 1 1 4 2 1", "1 0 4 1 1 2", "2 1 0 1 1 0"]
  },
  {
    id: "match-1002",
    status: "innings_break",
    format: "T20",
    seriesName: "Premier League 2026",
    venue: "Lord's, London",
    toss: "England won the toss and batted",
    teamA: {
      id: "team-eng",
      name: "England",
      shortName: "ENG",
      logo: "/images/teams/eng.png",
      score: "176/7"
    },
    teamB: {
      id: "team-sa",
      name: "South Africa",
      shortName: "SA",
      logo: "/images/teams/sa.png"
    },
    currentRunRate: 8.8,
    lastUpdatedAt: new Date(now.getTime() - 45_000).toISOString(),
    overs: "20.0",
    resultText: "South Africa need 177 to win"
  },
  {
    id: "match-1003",
    status: "upcoming",
    format: "Test",
    seriesName: "Border-Gavaskar Trophy 2026",
    venue: "MCG, Melbourne",
    toss: "Toss starts at 09:00 local time",
    teamA: {
      id: "team-aus",
      name: "Australia",
      shortName: "AUS",
      logo: "/images/teams/aus.png"
    },
    teamB: {
      id: "team-ind",
      name: "India",
      shortName: "IND",
      logo: "/images/teams/ind.png"
    },
    playingXI: {
      teamA: [
        "player-warner",
        "player-khawaja",
        "player-labuschagne",
        "player-smith",
        "player-head",
        "player-green",
        "player-carey",
        "player-cummins",
        "player-starc",
        "player-hazlewood",
        "player-lyon"
      ],
      teamB: [
        "player-rohit",
        "player-yashasvi",
        "player-gill",
        "player-kohli",
        "player-shreyas",
        "player-rahul",
        "player-jadeja",
        "player-ashwin",
        "player-bumrah",
        "player-shami",
        "player-siraj"
      ]
    },
    startAt: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
    lastUpdatedAt: new Date(now.getTime() - 90_000).toISOString(),
    resultText: "Starts today"
  },
  {
    id: "match-1005",
    status: "upcoming",
    format: "T20",
    seriesName: "Champions Cup 2026",
    venue: "Karachi National Stadium, Karachi",
    toss: "Toss starts at 18:30 local time",
    teamA: {
      id: "team-eng",
      name: "England",
      shortName: "ENG",
      logo: "/images/teams/eng.png"
    },
    teamB: {
      id: "team-nz",
      name: "New Zealand",
      shortName: "NZ",
      logo: "/images/teams/nz.png"
    },
    startAt: new Date(now.getTime() + 36 * 60 * 60 * 1000).toISOString(),
    lastUpdatedAt: new Date(now.getTime() - 60_000).toISOString(),
    resultText: "Starts tomorrow"
  },
  {
    id: "match-1004",
    status: "completed",
    format: "ODI",
    seriesName: "Tri-Series 2026",
    venue: "Eden Park, Auckland",
    toss: "New Zealand won the toss and fielded",
    teamA: {
      id: "team-sl",
      name: "Sri Lanka",
      shortName: "SL",
      score: "249 all out",
      logo: "/images/teams/sl.png"
    },
    teamB: {
      id: "team-nz",
      name: "New Zealand",
      shortName: "NZ",
      score: "251/5",
      logo: "/images/teams/nz.png"
    },
    resultText: "New Zealand won by 5 wickets",
    lastUpdatedAt: new Date(now.getTime() - 3_600_000).toISOString()
  }
];

export const scorecards: Record<string, Scorecard> = {
  "match-1001": {
    matchId: "match-1001",
    innings: [
      {
        name: "Australia innings",
        total: "278/9 (50)",
        extras: "11 (b 1, lb 6, w 4)",
        fallOfWickets: ["48/1", "101/2", "179/5", "239/7"],
        batters: [
          {
            name: "David Warner",
            dismissal: "c Rahul b Bumrah",
            runs: 54,
            balls: 61,
            fours: 6,
            sixes: 1,
            strikeRate: 88.52
          },
          {
            name: "Steve Smith",
            dismissal: "b Kuldeep",
            runs: 73,
            balls: 82,
            fours: 5,
            sixes: 0,
            strikeRate: 89.02
          }
        ],
        bowlers: [
          {
            name: "Jasprit Bumrah",
            overs: "10",
            maidens: 1,
            runs: 44,
            wickets: 2,
            economy: 4.4
          },
          {
            name: "Kuldeep Yadav",
            overs: "10",
            maidens: 0,
            runs: 55,
            wickets: 3,
            economy: 5.5
          }
        ]
      },
      {
        name: "India innings",
        total: "221/4 (39.1)",
        extras: "7 (lb 2, w 5)",
        fallOfWickets: ["42/1", "130/2", "162/3", "190/4"],
        batters: [
          {
            name: "Rohit Sharma",
            dismissal: "c Maxwell b Starc",
            runs: 38,
            balls: 30,
            fours: 5,
            sixes: 1,
            strikeRate: 126.67
          },
          {
            name: "Virat Kohli",
            dismissal: "not out",
            runs: 74,
            balls: 76,
            fours: 7,
            sixes: 1,
            strikeRate: 97.37
          }
        ],
        bowlers: [
          {
            name: "Mitchell Starc",
            overs: "8",
            maidens: 0,
            runs: 49,
            wickets: 1,
            economy: 6.12
          },
          {
            name: "Pat Cummins",
            overs: "8.1",
            maidens: 0,
            runs: 41,
            wickets: 1,
            economy: 5.02
          }
        ]
      }
    ]
  },
  "match-1002": {
    matchId: "match-1002",
    innings: [
      {
        name: "England innings",
        total: "176/7 (20)",
        extras: "10 (w 8, lb 2)",
        fallOfWickets: ["34/1", "78/2", "121/4", "165/6"],
        batters: [
          {
            name: "Jos Buttler",
            dismissal: "c Klaasen b Jansen",
            runs: 41,
            balls: 28,
            fours: 5,
            sixes: 1,
            strikeRate: 146.42
          }
        ],
        bowlers: [
          {
            name: "Marco Jansen",
            overs: "4",
            maidens: 0,
            runs: 29,
            wickets: 2,
            economy: 7.25
          }
        ]
      }
    ]
  }
};

export const commentaryByMatchId: Record<string, CommentaryItem[]> = {
  "match-1001": [
    {
      id: "c1001",
      over: "39",
      ball: "39.1",
      text: "Length ball outside off, drilled through cover for two.",
      runs: 2,
      timestamp: new Date(now.getTime() - 15_000).toISOString()
    },
    {
      id: "c1002",
      over: "39",
      ball: "39.0",
      text: "Single to long-on, strike rotated.",
      runs: 1,
      timestamp: new Date(now.getTime() - 45_000).toISOString()
    },
    {
      id: "c1003",
      over: "38",
      ball: "38.6",
      text: "FOUR! Too full and clipped wide of midwicket.",
      runs: 4,
      timestamp: new Date(now.getTime() - 85_000).toISOString()
    }
  ],
  "match-1002": [
    {
      id: "c2001",
      over: "20",
      ball: "20.0",
      text: "End of innings: England finish at 176/7.",
      runs: 0,
      timestamp: new Date(now.getTime() - 65_000).toISOString()
    }
  ]
};

export const matchStatsById: Record<string, MatchStats> = {
  "match-1001": {
    matchId: "match-1001",
    runRate: 5.65,
    requiredRunRate: 5.35,
    partnerships: [
      { wickets: "2nd wicket", runs: 88, balls: 92 },
      { wickets: "4th wicket", runs: 42, balls: 39 }
    ],
    wagonWheel: [
      { zone: "Fine leg", runs: 24 },
      { zone: "Midwicket", runs: 43 },
      { zone: "Cover", runs: 37 },
      { zone: "Third man", runs: 11 }
    ],
    matchupNotes: [
      "Kohli has scored 36 runs off Cummins in ODIs at SR 96.",
      "India have won 7 of last 9 ODI chases over 275."
    ]
  },
  "match-1002": {
    matchId: "match-1002",
    runRate: 8.8,
    partnerships: [{ wickets: "3rd wicket", runs: 51, balls: 31 }],
    wagonWheel: [
      { zone: "Long-on", runs: 22 },
      { zone: "Cover", runs: 31 },
      { zone: "Square leg", runs: 28 }
    ],
    matchupNotes: ["Par score at Lord's this season in T20 is 164."]
  }
};

export const seriesSummaries: SeriesSummary[] = [
  {
    id: "series-asia-cup-2026",
    name: "Asia Cup",
    season: "2026",
    format: "ODI",
    startDate: "2026-02-20",
    endDate: "2026-03-08",
    status: "ongoing"
  },
  {
    id: "series-bgt-2026",
    name: "Border-Gavaskar Trophy",
    season: "2026",
    format: "Test",
    startDate: "2026-03-04",
    endDate: "2026-04-01",
    status: "upcoming"
  }
];

export const seriesStandings: Record<string, SeriesStanding[]> = {
  "series-asia-cup-2026": [
    {
      teamId: "team-ind",
      teamName: "India",
      played: 4,
      won: 3,
      lost: 1,
      points: 6,
      netRunRate: 1.32
    },
    {
      teamId: "team-aus",
      teamName: "Australia",
      played: 4,
      won: 3,
      lost: 1,
      points: 6,
      netRunRate: 0.94
    }
  ]
};

export const teamProfiles: TeamProfile[] = [
  {
    id: "team-ind",
    name: "India",
    shortName: "IND",
    logo: "/images/teams/ind.png",
    homeGround: "Wankhede Stadium",
    captain: "Rohit Sharma",
    coach: "Rahul Dravid",
    squad: [
      { playerId: "player-rohit", name: "Rohit Sharma", role: "Batter", isCaptain: true },
      { playerId: "player-yashasvi", name: "Yashasvi Jaiswal", role: "Batter" },
      { playerId: "player-gill", name: "Shubman Gill", role: "Batter" },
      { playerId: "player-kohli", name: "Virat Kohli", role: "Batter" },
      { playerId: "player-shreyas", name: "Shreyas Iyer", role: "Batter" },
      { playerId: "player-rahul", name: "KL Rahul", role: "Wicketkeeper Batter", isWicketKeeper: true },
      { playerId: "player-pant", name: "Rishabh Pant", role: "Wicketkeeper Batter", isWicketKeeper: true },
      { playerId: "player-jadeja", name: "Ravindra Jadeja", role: "All-rounder" },
      { playerId: "player-ashwin", name: "Ravichandran Ashwin", role: "Bowler" },
      { playerId: "player-kuldeep", name: "Kuldeep Yadav", role: "Bowler" },
      { playerId: "player-bumrah", name: "Jasprit Bumrah", role: "Bowler" },
      { playerId: "player-shami", name: "Mohammed Shami", role: "Bowler" },
      { playerId: "player-siraj", name: "Mohammed Siraj", role: "Bowler" },
      { playerId: "player-akashdeep", name: "Akash Deep", role: "Bowler" },
      { playerId: "player-mukesh", name: "Mukesh Kumar", role: "Bowler" }
    ]
  },
  {
    id: "team-aus",
    name: "Australia",
    shortName: "AUS",
    logo: "/images/teams/aus.png",
    homeGround: "MCG",
    captain: "Pat Cummins",
    coach: "Andrew McDonald",
    squad: [
      { playerId: "player-warner", name: "David Warner", role: "Batter" },
      { playerId: "player-khawaja", name: "Usman Khawaja", role: "Batter" },
      { playerId: "player-labuschagne", name: "Marnus Labuschagne", role: "Batter" },
      { playerId: "player-smith", name: "Steve Smith", role: "Batter" },
      { playerId: "player-head", name: "Travis Head", role: "Batter" },
      { playerId: "player-green", name: "Cameron Green", role: "All-rounder" },
      { playerId: "player-marsh", name: "Mitchell Marsh", role: "All-rounder" },
      { playerId: "player-carey", name: "Alex Carey", role: "Wicketkeeper Batter", isWicketKeeper: true },
      { playerId: "player-inglis", name: "Josh Inglis", role: "Wicketkeeper Batter", isWicketKeeper: true },
      { playerId: "player-starc", name: "Mitchell Starc", role: "Bowler" },
      { playerId: "player-hazlewood", name: "Josh Hazlewood", role: "Bowler" },
      { playerId: "player-cummins", name: "Pat Cummins", role: "Bowler", isCaptain: true },
      { playerId: "player-lyon", name: "Nathan Lyon", role: "Bowler" },
      { playerId: "player-boland", name: "Scott Boland", role: "Bowler" },
      { playerId: "player-zampa", name: "Adam Zampa", role: "Bowler" }
    ]
  }
];

export const playerProfiles: PlayerProfile[] = [
  {
    id: "player-kohli",
    name: "Virat Kohli",
    teamId: "team-ind",
    role: "Batter",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm medium",
    career: [
      { format: "ODI", matches: 297, runs: 14021, average: 58.67, strikeRate: 93.42 },
      { format: "T20I", matches: 125, runs: 4188, average: 48.12, strikeRate: 137.04 }
    ],
    recentForm: ["74", "46", "102*", "18", "67"]
  },
  {
    id: "player-cummins",
    name: "Pat Cummins",
    teamId: "team-aus",
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast",
    career: [
      { format: "Test", matches: 67, wickets: 289, average: 22.39 },
      { format: "ODI", matches: 88, wickets: 145, average: 28.12 }
    ],
    recentForm: ["2/44", "1/53", "3/26", "0/40", "2/35"]
  }
];

export const tournamentPlayerStats: TournamentPlayerStat[] = [
  {
    playerId: "player-kohli",
    playerName: "Virat Kohli",
    teamId: "team-ind",
    teamName: "India",
    matches: 8,
    innings: 8,
    runs: 328,
    highestScore: 92,
    battingAverage: 54.67,
    strikeRate: 139.57,
    fours: 29,
    sixes: 11,
    wickets: 0,
    bowlingAverage: 0,
    economy: 0,
    overs: 0,
    bestBowling: "-"
  },
  {
    playerId: "player-rohit",
    playerName: "Rohit Sharma",
    teamId: "team-ind",
    teamName: "India",
    matches: 8,
    innings: 8,
    runs: 301,
    highestScore: 87,
    battingAverage: 43,
    strikeRate: 152.79,
    fours: 31,
    sixes: 15,
    wickets: 0,
    bowlingAverage: 0,
    economy: 0,
    overs: 0,
    bestBowling: "-"
  },
  {
    playerId: "player-rizwan",
    playerName: "Mohammad Rizwan",
    teamId: "team-pak",
    teamName: "Pakistan",
    matches: 7,
    innings: 7,
    runs: 287,
    highestScore: 79,
    battingAverage: 47.83,
    strikeRate: 131.35,
    fours: 24,
    sixes: 8,
    wickets: 0,
    bowlingAverage: 0,
    economy: 0,
    overs: 0,
    bestBowling: "-"
  },
  {
    playerId: "player-brook",
    playerName: "Harry Brook",
    teamId: "team-eng",
    teamName: "England",
    matches: 7,
    innings: 7,
    runs: 264,
    highestScore: 88,
    battingAverage: 44,
    strikeRate: 148.31,
    fours: 22,
    sixes: 12,
    wickets: 0,
    bowlingAverage: 0,
    economy: 0,
    overs: 0,
    bestBowling: "-"
  },
  {
    playerId: "player-head",
    playerName: "Travis Head",
    teamId: "team-aus",
    teamName: "Australia",
    matches: 7,
    innings: 7,
    runs: 251,
    highestScore: 91,
    battingAverage: 41.83,
    strikeRate: 155.9,
    fours: 20,
    sixes: 14,
    wickets: 0,
    bowlingAverage: 0,
    economy: 0,
    overs: 0,
    bestBowling: "-"
  },
  {
    playerId: "player-shamsi",
    playerName: "Tabraiz Shamsi",
    teamId: "team-sa",
    teamName: "South Africa",
    matches: 8,
    innings: 8,
    runs: 12,
    highestScore: 8,
    battingAverage: 6,
    strikeRate: 80,
    fours: 1,
    sixes: 0,
    wickets: 16,
    bowlingAverage: 13.68,
    economy: 6.31,
    overs: 30.2,
    bestBowling: "4/19"
  },
  {
    playerId: "player-rashid",
    playerName: "Rashid Khan",
    teamId: "team-afg",
    teamName: "Afghanistan",
    matches: 8,
    innings: 8,
    runs: 52,
    highestScore: 19,
    battingAverage: 10.4,
    strikeRate: 129.33,
    fours: 4,
    sixes: 3,
    wickets: 15,
    bowlingAverage: 14.53,
    economy: 6.02,
    overs: 36,
    bestBowling: "4/17"
  },
  {
    playerId: "player-haris",
    playerName: "Haris Rauf",
    teamId: "team-pak",
    teamName: "Pakistan",
    matches: 7,
    innings: 7,
    runs: 9,
    highestScore: 7,
    battingAverage: 4.5,
    strikeRate: 69.23,
    fours: 1,
    sixes: 0,
    wickets: 14,
    bowlingAverage: 15.71,
    economy: 7.08,
    overs: 31,
    bestBowling: "3/21"
  },
  {
    playerId: "player-cummins",
    playerName: "Pat Cummins",
    teamId: "team-aus",
    teamName: "Australia",
    matches: 7,
    innings: 7,
    runs: 24,
    highestScore: 13,
    battingAverage: 8,
    strikeRate: 114.28,
    fours: 2,
    sixes: 1,
    wickets: 13,
    bowlingAverage: 17.3,
    economy: 6.88,
    overs: 32.4,
    bestBowling: "3/24"
  },
  {
    playerId: "player-bumrah",
    playerName: "Jasprit Bumrah",
    teamId: "team-ind",
    teamName: "India",
    matches: 8,
    innings: 8,
    runs: 7,
    highestScore: 4,
    battingAverage: 3.5,
    strikeRate: 70,
    fours: 0,
    sixes: 0,
    wickets: 12,
    bowlingAverage: 16.41,
    economy: 5.89,
    overs: 31.1,
    bestBowling: "3/14"
  }
];

export const rankings: RankingEntry[] = [
  { teamId: "team-ind", teamName: "India", format: "odi", rank: 1, rating: 122 },
  { teamId: "team-aus", teamName: "Australia", format: "odi", rank: 2, rating: 117 },
  { teamId: "team-eng", teamName: "England", format: "odi", rank: 3, rating: 111 },
  { teamId: "team-ind", teamName: "India", format: "t20", rank: 1, rating: 268 },
  { teamId: "team-eng", teamName: "England", format: "t20", rank: 2, rating: 260 }
];

export const standingsSeasons: StandingsSeason[] = [
  {
    season: "2026",
    series: [
      {
        id: "t20-world-cup",
        label: "ICC Men's T20 World Cup",
        stages: [
          {
            id: "second-group-stage",
            label: "Second group stage",
            groups: [
              {
                id: "A",
                label: "A",
                rows: [
                  {
                    teamId: "team-ind",
                    teamName: "India",
                    shortCode: "IND",
                    played: 3,
                    won: 2,
                    lost: 0,
                    netRunRate: 1.42,
                    points: 5
                  },
                  {
                    teamId: "team-sl",
                    teamName: "Sri Lanka",
                    shortCode: "SL",
                    played: 3,
                    won: 2,
                    lost: 1,
                    netRunRate: 0.666,
                    points: 4
                  },
                  {
                    teamId: "team-eng",
                    teamName: "England",
                    shortCode: "ENG",
                    played: 3,
                    won: 1,
                    lost: 1,
                    netRunRate: 0.11,
                    points: 3,
                    highlight: true
                  },
                  {
                    teamId: "team-usa",
                    teamName: "United States",
                    shortCode: "USA",
                    played: 3,
                    won: 0,
                    lost: 3,
                    netRunRate: -2.011,
                    points: 0
                  }
                ]
              },
              {
                id: "B",
                label: "B",
                rows: [
                  {
                    teamId: "team-wi",
                    teamName: "West Indies",
                    shortCode: "WI",
                    played: 3,
                    won: 2,
                    lost: 1,
                    netRunRate: 1.035,
                    points: 4
                  },
                  {
                    teamId: "team-pak",
                    teamName: "Pakistan",
                    shortCode: "PAK",
                    played: 3,
                    won: 2,
                    lost: 1,
                    netRunRate: 0.901,
                    points: 4
                  },
                  {
                    teamId: "team-aus",
                    teamName: "Australia",
                    shortCode: "AUS",
                    played: 3,
                    won: 1,
                    lost: 2,
                    netRunRate: -0.245,
                    points: 2
                  },
                  {
                    teamId: "team-zim",
                    teamName: "Zimbabwe",
                    shortCode: "ZIM",
                    played: 3,
                    won: 0,
                    lost: 2,
                    netRunRate: -1.322,
                    points: 1
                  }
                ]
              }
            ]
          },
          {
            id: "group-stage",
            label: "Group stage",
            groups: [
              {
                id: "A",
                label: "A",
                rows: [
                  {
                    teamId: "team-ind",
                    teamName: "India",
                    shortCode: "IND",
                    played: 4,
                    won: 4,
                    lost: 0,
                    netRunRate: 2.5,
                    points: 8
                  },
                  {
                    teamId: "team-pak",
                    teamName: "Pakistan",
                    shortCode: "PAK",
                    played: 4,
                    won: 3,
                    lost: 1,
                    netRunRate: 0.976,
                    points: 6
                  },
                  {
                    teamId: "team-usa",
                    teamName: "United States",
                    shortCode: "USA",
                    played: 4,
                    won: 2,
                    lost: 2,
                    netRunRate: 0.788,
                    points: 4,
                    highlight: true
                  },
                  {
                    teamId: "team-ned",
                    teamName: "Netherlands",
                    shortCode: "NED",
                    played: 4,
                    won: 1,
                    lost: 3,
                    netRunRate: -1.217,
                    points: 2
                  },
                  {
                    teamId: "team-nam",
                    teamName: "Namibia",
                    shortCode: "NAM",
                    played: 4,
                    won: 0,
                    lost: 4,
                    netRunRate: -3.108,
                    points: 0
                  }
                ]
              },
              {
                id: "B",
                label: "B",
                rows: [
                  {
                    teamId: "team-zim",
                    teamName: "Zimbabwe",
                    shortCode: "ZIM",
                    played: 4,
                    won: 3,
                    lost: 0,
                    netRunRate: 1.506,
                    points: 7
                  },
                  {
                    teamId: "team-sl",
                    teamName: "Sri Lanka",
                    shortCode: "SL",
                    played: 4,
                    won: 3,
                    lost: 1,
                    netRunRate: 1.741,
                    points: 6
                  },
                  {
                    teamId: "team-aus",
                    teamName: "Australia",
                    shortCode: "AUS",
                    played: 4,
                    won: 2,
                    lost: 2,
                    netRunRate: 1.523,
                    points: 4
                  },
                  {
                    teamId: "team-ire",
                    teamName: "Ireland",
                    shortCode: "IRE",
                    played: 4,
                    won: 1,
                    lost: 2,
                    netRunRate: 0.15,
                    points: 3
                  },
                  {
                    teamId: "team-oma",
                    teamName: "Oman",
                    shortCode: "OMA",
                    played: 4,
                    won: 0,
                    lost: 4,
                    netRunRate: -4.845,
                    points: 0
                  }
                ]
              },
              {
                id: "C",
                label: "C",
                rows: [
                  {
                    teamId: "team-wi",
                    teamName: "West Indies",
                    shortCode: "WI",
                    played: 4,
                    won: 4,
                    lost: 0,
                    netRunRate: 1.874,
                    points: 8
                  },
                  {
                    teamId: "team-eng",
                    teamName: "England",
                    shortCode: "ENG",
                    played: 4,
                    won: 3,
                    lost: 1,
                    netRunRate: 0.201,
                    points: 6
                  },
                  {
                    teamId: "team-sco",
                    teamName: "Scotland",
                    shortCode: "SCO",
                    played: 4,
                    won: 1,
                    lost: 3,
                    netRunRate: 0.184,
                    points: 2
                  },
                  {
                    teamId: "team-ita",
                    teamName: "Italy",
                    shortCode: "ITA",
                    played: 4,
                    won: 1,
                    lost: 3,
                    netRunRate: -1.02,
                    points: 2
                  },
                  {
                    teamId: "team-nep",
                    teamName: "Nepal",
                    shortCode: "NEP",
                    played: 4,
                    won: 1,
                    lost: 3,
                    netRunRate: -1.349,
                    points: 2
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "asia-cup",
        label: "Asia Cup",
        stages: [
          {
            id: "group-stage",
            label: "Group stage",
            groups: [
              {
                id: "A",
                label: "A",
                rows: [
                  {
                    teamId: "team-ind",
                    teamName: "India",
                    shortCode: "IND",
                    played: 3,
                    won: 3,
                    lost: 0,
                    netRunRate: 1.982,
                    points: 6
                  },
                  {
                    teamId: "team-pak",
                    teamName: "Pakistan",
                    shortCode: "PAK",
                    played: 3,
                    won: 2,
                    lost: 1,
                    netRunRate: 0.674,
                    points: 4
                  },
                  {
                    teamId: "team-sl",
                    teamName: "Sri Lanka",
                    shortCode: "SL",
                    played: 3,
                    won: 1,
                    lost: 2,
                    netRunRate: -0.301,
                    points: 2
                  },
                  {
                    teamId: "team-afg",
                    teamName: "Afghanistan",
                    shortCode: "AFG",
                    played: 3,
                    won: 0,
                    lost: 3,
                    netRunRate: -1.984,
                    points: 0
                  }
                ]
              },
              {
                id: "B",
                label: "B",
                rows: [
                  {
                    teamId: "team-aus",
                    teamName: "Australia",
                    shortCode: "AUS",
                    played: 3,
                    won: 2,
                    lost: 1,
                    netRunRate: 1.203,
                    points: 4
                  },
                  {
                    teamId: "team-eng",
                    teamName: "England",
                    shortCode: "ENG",
                    played: 3,
                    won: 2,
                    lost: 1,
                    netRunRate: 0.816,
                    points: 4
                  },
                  {
                    teamId: "team-bd",
                    teamName: "Bangladesh",
                    shortCode: "BAN",
                    played: 3,
                    won: 1,
                    lost: 2,
                    netRunRate: -0.104,
                    points: 2
                  },
                  {
                    teamId: "team-nz",
                    teamName: "New Zealand",
                    shortCode: "NZ",
                    played: 3,
                    won: 1,
                    lost: 2,
                    netRunRate: -0.611,
                    points: 2
                  }
                ]
              }
            ]
          },
          {
            id: "second-group-stage",
            label: "Second group stage",
            groups: [
              {
                id: "Super Four",
                label: "Super Four",
                rows: [
                  {
                    teamId: "team-ind",
                    teamName: "India",
                    shortCode: "IND",
                    played: 3,
                    won: 2,
                    lost: 1,
                    netRunRate: 0.888,
                    points: 4
                  },
                  {
                    teamId: "team-aus",
                    teamName: "Australia",
                    shortCode: "AUS",
                    played: 3,
                    won: 2,
                    lost: 1,
                    netRunRate: 0.472,
                    points: 4
                  },
                  {
                    teamId: "team-pak",
                    teamName: "Pakistan",
                    shortCode: "PAK",
                    played: 3,
                    won: 1,
                    lost: 2,
                    netRunRate: -0.102,
                    points: 2
                  },
                  {
                    teamId: "team-eng",
                    teamName: "England",
                    shortCode: "ENG",
                    played: 3,
                    won: 1,
                    lost: 2,
                    netRunRate: -1.258,
                    points: 2
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    season: "2025",
    series: [
      {
        id: "champions-trophy",
        label: "Champions Trophy",
        stages: [
          {
            id: "second-group-stage",
            label: "Second group stage",
            groups: [
              {
                id: "A",
                label: "A",
                rows: [
                  {
                    teamId: "team-ind",
                    teamName: "India",
                    shortCode: "IND",
                    played: 3,
                    won: 2,
                    lost: 1,
                    netRunRate: 0.852,
                    points: 4
                  },
                  {
                    teamId: "team-aus",
                    teamName: "Australia",
                    shortCode: "AUS",
                    played: 3,
                    won: 2,
                    lost: 1,
                    netRunRate: 0.442,
                    points: 4
                  },
                  {
                    teamId: "team-eng",
                    teamName: "England",
                    shortCode: "ENG",
                    played: 3,
                    won: 1,
                    lost: 2,
                    netRunRate: -0.311,
                    points: 2
                  },
                  {
                    teamId: "team-sa",
                    teamName: "South Africa",
                    shortCode: "SA",
                    played: 3,
                    won: 1,
                    lost: 2,
                    netRunRate: -0.982,
                    points: 2
                  }
                ]
              }
            ]
          },
          {
            id: "group-stage",
            label: "Group stage",
            groups: [
              {
                id: "A",
                label: "A",
                rows: [
                  {
                    teamId: "team-ind",
                    teamName: "India",
                    shortCode: "IND",
                    played: 4,
                    won: 3,
                    lost: 1,
                    netRunRate: 1.112,
                    points: 6
                  },
                  {
                    teamId: "team-sa",
                    teamName: "South Africa",
                    shortCode: "SA",
                    played: 4,
                    won: 3,
                    lost: 1,
                    netRunRate: 0.544,
                    points: 6
                  },
                  {
                    teamId: "team-nz",
                    teamName: "New Zealand",
                    shortCode: "NZ",
                    played: 4,
                    won: 2,
                    lost: 2,
                    netRunRate: -0.064,
                    points: 4
                  },
                  {
                    teamId: "team-afg",
                    teamName: "Afghanistan",
                    shortCode: "AFG",
                    played: 4,
                    won: 0,
                    lost: 4,
                    netRunRate: -1.72,
                    points: 0
                  }
                ]
              },
              {
                id: "B",
                label: "B",
                rows: [
                  {
                    teamId: "team-aus",
                    teamName: "Australia",
                    shortCode: "AUS",
                    played: 4,
                    won: 4,
                    lost: 0,
                    netRunRate: 1.942,
                    points: 8
                  },
                  {
                    teamId: "team-eng",
                    teamName: "England",
                    shortCode: "ENG",
                    played: 4,
                    won: 2,
                    lost: 2,
                    netRunRate: 0.235,
                    points: 4
                  },
                  {
                    teamId: "team-pak",
                    teamName: "Pakistan",
                    shortCode: "PAK",
                    played: 4,
                    won: 2,
                    lost: 2,
                    netRunRate: -0.101,
                    points: 4
                  },
                  {
                    teamId: "team-sl",
                    teamName: "Sri Lanka",
                    shortCode: "SL",
                    played: 4,
                    won: 0,
                    lost: 4,
                    netRunRate: -2.204,
                    points: 0
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "world-cup-qualifier",
        label: "World Cup Qualifier",
        stages: [
          {
            id: "group-stage",
            label: "Group stage",
            groups: [
              {
                id: "A",
                label: "A",
                rows: [
                  {
                    teamId: "team-zim",
                    teamName: "Zimbabwe",
                    shortCode: "ZIM",
                    played: 5,
                    won: 4,
                    lost: 1,
                    netRunRate: 1.304,
                    points: 8
                  },
                  {
                    teamId: "team-ned",
                    teamName: "Netherlands",
                    shortCode: "NED",
                    played: 5,
                    won: 3,
                    lost: 2,
                    netRunRate: 0.266,
                    points: 6
                  },
                  {
                    teamId: "team-ire",
                    teamName: "Ireland",
                    shortCode: "IRE",
                    played: 5,
                    won: 2,
                    lost: 3,
                    netRunRate: -0.112,
                    points: 4
                  },
                  {
                    teamId: "team-nep",
                    teamName: "Nepal",
                    shortCode: "NEP",
                    played: 5,
                    won: 1,
                    lost: 4,
                    netRunRate: -1.455,
                    points: 2
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export const newsArticles: NewsArticle[] = [
  {
    slug: "kohli-guides-india-steady-chase",
    title: "Kohli guides India in steady chase",
    summary: "India stay on course in the Asia Cup final as Kohli anchors the innings.",
    content:
      "Virat Kohli held the chase together with a composed half-century while India kept the required rate in check through the middle overs.",
    publishedAt: new Date(now.getTime() - 90 * 60_000).toISOString()
  },
  {
    slug: "england-post-176-at-lords",
    title: "England post 176 at Lord's",
    summary: "Late acceleration pushes England to a strong total in T20 action.",
    content:
      "After a mixed powerplay, England rebuilt through the middle overs and finished strongly with 52 runs in the final five.",
    publishedAt: new Date(now.getTime() - 3 * 60 * 60_000).toISOString()
  }
];

export function buildSearchResults(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const matchResults: SearchResult[] = allMatchSummaries
    .filter((m) => m.seriesName.toLowerCase().includes(q) || m.teamA.name.toLowerCase().includes(q) || m.teamB.name.toLowerCase().includes(q))
    .map((m) => ({
      type: "match" as const,
      id: m.id,
      label: `${m.teamA.shortName} vs ${m.teamB.shortName}`,
      href: `/matches/${m.id}`,
      description: `${m.seriesName} - ${m.venue}`
    }));

  const teamResults: SearchResult[] = teamProfiles
    .filter((team) => team.name.toLowerCase().includes(q))
    .map((team) => ({
      type: "team" as const,
      id: team.id,
      label: team.name,
      href: `/teams/${team.id}`,
      description: team.homeGround
    }));

  const playerResults: SearchResult[] = playerProfiles
    .filter((player) => player.name.toLowerCase().includes(q))
    .map((player) => ({
      type: "player" as const,
      id: player.id,
      label: player.name,
      href: `/players/${player.id}`,
      description: player.role
    }));

  const seriesResults: SearchResult[] = seriesSummaries
    .filter((series) => series.name.toLowerCase().includes(q))
    .map((series) => ({
      type: "series" as const,
      id: series.id,
      label: `${series.name} ${series.season}`,
      href: `/series/${series.id}`,
      description: `${series.format} - ${series.status}`
    }));

  return [...matchResults, ...teamResults, ...playerResults, ...seriesResults].slice(0, 25);
}
