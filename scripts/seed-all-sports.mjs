import { readFileSync } from "node:fs";
import pg from "pg";

const { Pool } = pg;

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  for (const file of [".env.local", ".env"]) {
    try {
      const content = readFileSync(file, "utf8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        if (trimmed.startsWith("DATABASE_URL=")) {
          return trimmed.slice("DATABASE_URL=".length).trim().replace(/^['"]|['"]$/g, "");
        }
      }
    } catch {
      // Ignore missing env file and try next candidate
    }
  }
  throw new Error("DATABASE_URL is not set in environment or .env.local");
}

const connectionString = loadDatabaseUrl();
const shouldUseSsl = connectionString.includes("neon.tech") || connectionString.includes("sslmode=");
const pool = new Pool({
  connectionString,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined
});

const TEAMS = [
  // Cricket
  { id: "team-ind", name: "India", shortName: "IND", country: "India", homeGround: "Wankhede Stadium" },
  { id: "team-aus", name: "Australia", shortName: "AUS", country: "Australia", homeGround: "MCG" },
  { id: "team-eng", name: "England", shortName: "ENG", country: "England", homeGround: "Lord's" },
  { id: "team-pak", name: "Pakistan", shortName: "PAK", country: "Pakistan", homeGround: "Gaddafi Stadium" },
  { id: "team-sa", name: "South Africa", shortName: "SA", country: "South Africa", homeGround: "Wanderers Stadium" },
  { id: "team-nz", name: "New Zealand", shortName: "NZ", country: "New Zealand", homeGround: "Eden Park" },
  { id: "team-ban", name: "Bangladesh", shortName: "BAN", country: "Bangladesh", homeGround: "Sher-e-Bangla Stadium" },
  { id: "team-sl", name: "Sri Lanka", shortName: "SL", country: "Sri Lanka", homeGround: "R. Premadasa Stadium" },
  // Football
  { id: "team-rma", name: "Real Madrid", shortName: "RMA", country: "Spain", homeGround: "Santiago Bernabeu" },
  { id: "team-bar", name: "FC Barcelona", shortName: "BAR", country: "Spain", homeGround: "Camp Nou" },
  { id: "team-ars", name: "Arsenal FC", shortName: "ARS", country: "England", homeGround: "Emirates Stadium" },
  { id: "team-mci", name: "Manchester City", shortName: "MCI", country: "England", homeGround: "Etihad Stadium" },
  { id: "team-liv", name: "Liverpool FC", shortName: "LIV", country: "England", homeGround: "Anfield" },
  { id: "team-bay", name: "Bayern Munich", shortName: "BAY", country: "Germany", homeGround: "Allianz Arena" },
  { id: "team-psg", name: "Paris Saint-Germain", shortName: "PSG", country: "France", homeGround: "Parc des Princes" },
  { id: "team-int", name: "Inter Milan", shortName: "INT", country: "Italy", homeGround: "San Siro" },
  { id: "team-arg", name: "Argentina", shortName: "ARG", country: "Argentina", homeGround: "Estadio Monumental" },
  { id: "team-bra", name: "Brazil", shortName: "BRA", country: "Brazil", homeGround: "Maracana" },
  { id: "team-juv", name: "Juventus", shortName: "JUV", country: "Italy", homeGround: "Allianz Stadium" },
  { id: "team-acm", name: "AC Milan", shortName: "ACM", country: "Italy", homeGround: "San Siro" },
  { id: "team-bvb", name: "Borussia Dortmund", shortName: "BVB", country: "Germany", homeGround: "Signal Iduna Park" },
  { id: "team-rbl", name: "RB Leipzig", shortName: "RBL", country: "Germany", homeGround: "Red Bull Arena" },
  { id: "team-mia", name: "Inter Miami", shortName: "MIA", country: "USA", homeGround: "Chase Stadium" },
  { id: "team-lag", name: "LA Galaxy", shortName: "LAG", country: "USA", homeGround: "Dignity Health Sports Park" },
  // Basketball
  { id: "team-lal", name: "LA Lakers", shortName: "LAL", country: "USA", homeGround: "Crypto.com Arena" },
  { id: "team-bos", name: "Boston Celtics", shortName: "BOS", country: "USA", homeGround: "TD Garden" },
  // Tennis
  { id: "team-alc", name: "Carlos Alcaraz", shortName: "ALC", country: "Spain", homeGround: "Centre Court" },
  { id: "team-djo", name: "Novak Djokovic", shortName: "DJO", country: "Serbia", homeGround: "Belgrade Arena" },
  { id: "team-sin", name: "Jannik Sinner", shortName: "SIN", country: "Italy", homeGround: "Pala Alpitour" },
  { id: "team-zve", name: "Alexander Zverev", shortName: "ZVE", country: "Germany", homeGround: "Rothenbaum" },
  // Baseball
  { id: "team-nyy", name: "NY Yankees", shortName: "NYY", country: "USA", homeGround: "Yankee Stadium" },
  { id: "team-lad", name: "LA Dodgers", shortName: "LAD", country: "USA", homeGround: "Dodger Stadium" },
  // Hockey
  { id: "team-tor", name: "Toronto Maple Leafs", shortName: "TOR", country: "Canada", homeGround: "Scotiabank Arena" },
  { id: "team-mtl", name: "Montreal Canadiens", shortName: "MTL", country: "Canada", homeGround: "Bell Centre" },
  // Rugby
  { id: "team-nzl-rugby", name: "All Blacks", shortName: "ABK", country: "New Zealand", homeGround: "Eden Park" },
  { id: "team-rsa-rugby", name: "Springboks", shortName: "SPR", country: "South Africa", homeGround: "Ellis Park" },
  // Motorsports
  { id: "team-rbr", name: "Red Bull Racing", shortName: "RBR", country: "Austria", homeGround: "Red Bull Ring" },
  { id: "team-fer", name: "Scuderia Ferrari", shortName: "FER", country: "Italy", homeGround: "Monza Circuit" },
  // Esports
  { id: "team-fnc", name: "Fnatic", shortName: "FNC", country: "United Kingdom", homeGround: "Berlin Riot Arena" },
  { id: "team-sen", name: "Sentinels", shortName: "SEN", country: "USA", homeGround: "Los Angeles Shrine" },
  // MMA
  { id: "team-mak", name: "Islam Makhachev", shortName: "MAK", country: "Neutral", homeGround: "T-Mobile Arena" },
  { id: "team-tsa", name: "Arman Tsarukyan", shortName: "TSA", country: "Armenia", homeGround: "Apex Las Vegas" },
  // Golf
  { id: "team-eur", name: "Team Europe", shortName: "EUR", country: "Europe", homeGround: "Marco Simone" },
  { id: "team-usa", name: "Team USA", shortName: "USA", country: "USA", homeGround: "Bethpage Black" },
  // Athletics
  { id: "team-ust", name: "USA Track", shortName: "UST", country: "USA", homeGround: "Hayward Field" },
  { id: "team-jam", name: "Jamaica Track", shortName: "JAM", country: "Jamaica", homeGround: "National Stadium Kingston" }
];

const TOURNAMENTS = [
  { id: "t-asia-cup-2026", name: "Asia Cup", season: "2026", format: "ODI" },
  { id: "t-premier-league-2026", name: "Premier League T20", season: "2026", format: "T20" },
  { id: "t-test-championship-2026", name: "World Test Championship", season: "2026", format: "Test" },
  { id: "t-ucl-2026", name: "UEFA Champions League", season: "2025-26", format: "Football" },
  { id: "t-epl-2026", name: "English Premier League", season: "2025-26", format: "Football" },
  { id: "t-wcq-2026", name: "FIFA World Cup Qualifiers", season: "2026", format: "Football" },
  { id: "t-serie-a-2026", name: "Serie A", season: "2025-26", format: "Football" },
  { id: "t-bundesliga-2026", name: "Bundesliga", season: "2025-26", format: "Football" },
  { id: "t-mls-2026", name: "MLS Cup", season: "2026", format: "Football" },
  { id: "t-nba-2026", name: "NBA Finals", season: "2026", format: "Basketball" },
  { id: "t-wimbledon-2026", name: "Wimbledon Championships", season: "2026", format: "Tennis" },
  { id: "t-atp-2026", name: "ATP Tour Finals", season: "2026", format: "Tennis" },
  { id: "t-mlb-2026", name: "MLB World Series", season: "2026", format: "Baseball" },
  { id: "t-nhl-2026", name: "NHL Stanley Cup Playoffs", season: "2026", format: "Hockey" },
  { id: "t-rugby-2026", name: "Rugby Championship", season: "2026", format: "Rugby" },
  { id: "t-f1-2026", name: "Formula 1 World Championship", season: "2026", format: "Motorsports" },
  { id: "t-vct-2026", name: "Valorant Champions Tour", season: "2026", format: "Esports" },
  { id: "t-ufc-2026", name: "UFC 315 Main Card", season: "2026", format: "MMA" },
  { id: "t-ryder-2026", name: "Ryder Cup", season: "2026", format: "Golf" },
  { id: "t-diamond-2026", name: "Wanda Diamond League", season: "2026", format: "Athletics" }
];

const SERIES = [
  { id: "series-asia-cup-2026", name: "Asia Cup", season: "2026", format: "ODI", status: "ongoing" },
  { id: "series-bgt-2026", name: "Border-Gavaskar Trophy", season: "2026", format: "Test", status: "ongoing" },
  { id: "series-plt20-2026", name: "Premier League T20", season: "2026", format: "T20", status: "ongoing" },
  { id: "series-ucl-2026", name: "UEFA Champions League", season: "2025-26", format: "Football", status: "ongoing" },
  { id: "series-epl-2026", name: "English Premier League", season: "2025-26", format: "Football", status: "ongoing" },
  { id: "series-serie-a-2026", name: "Serie A", season: "2025-26", format: "Football", status: "ongoing" },
  { id: "series-bundesliga-2026", name: "Bundesliga", season: "2025-26", format: "Football", status: "ongoing" },
  { id: "series-mls-2026", name: "MLS Cup", season: "2026", format: "Football", status: "ongoing" },
  { id: "series-nba-2026", name: "NBA Finals", season: "2026", format: "Basketball", status: "ongoing" },
  { id: "series-wimbledon-2026", name: "Wimbledon", season: "2026", format: "Tennis", status: "ongoing" },
  { id: "series-mlb-2026", name: "MLB World Series", season: "2026", format: "Baseball", status: "ongoing" },
  { id: "series-nhl-2026", name: "NHL Stanley Cup", season: "2026", format: "Hockey", status: "ongoing" },
  { id: "series-rugby-2026", name: "Rugby Championship", season: "2026", format: "Rugby", status: "ongoing" },
  { id: "series-f1-2026", name: "Formula 1 Grand Prix", season: "2026", format: "Motorsports", status: "ongoing" },
  { id: "series-vct-2026", name: "Valorant Champions Tour", season: "2026", format: "Esports", status: "upcoming" },
  { id: "series-ufc-2026", name: "UFC 315", season: "2026", format: "MMA", status: "upcoming" },
  { id: "series-ryder-2026", name: "Ryder Cup", season: "2026", format: "Golf", status: "upcoming" },
  { id: "series-diamond-2026", name: "Diamond League", season: "2026", format: "Athletics", status: "upcoming" }
];

function buildMatches(nowMs) {
  const rel = (minutes) => new Date(nowMs + minutes * 60_000).toISOString();

  return [
    // Cricket: live + upcoming + completed (including existing match-1001..1010 cleanup)
    {
      id: "match-1001",
      slug: "match-1001",
      tournamentId: "t-asia-cup-2026",
      seriesId: "series-asia-cup-2026",
      seriesName: "Asia Cup 2026",
      format: "ODI",
      status: "LIVE",
      venue: "Sher-e-Bangla National Stadium, Dhaka",
      teamAId: "team-ind",
      teamBId: "team-aus",
      teamAScore: "221/4 (39.1)",
      teamBScore: "278 (50.0)",
      summary: "India need 58 runs in 65 balls",
      resultText: null,
      offsetMinutes: -45,
      updatedOffsetMinutes: -1
    },
    {
      id: "match-1003",
      slug: "match-1003",
      tournamentId: "t-asia-cup-2026",
      seriesId: "series-asia-cup-2026",
      seriesName: "Asia Cup 2026",
      format: "ODI",
      status: "LIVE",
      venue: "MCG, Melbourne",
      teamAId: "team-eng",
      teamBId: "team-ind",
      teamAScore: "248/6 (42.3)",
      teamBScore: "Yet to bat",
      summary: "England steady after Root & Brook partnership",
      resultText: null,
      offsetMinutes: -80,
      updatedOffsetMinutes: -2
    },
    {
      id: "match-1004",
      slug: "match-1004",
      tournamentId: "t-premier-league-2026",
      seriesId: "series-plt20-2026",
      seriesName: "Premier League T20 2026",
      format: "T20",
      status: "LIVE",
      venue: "Eden Gardens, Kolkata",
      teamAId: "team-aus",
      teamBId: "team-eng",
      teamAScore: "164/4 (17.2)",
      teamBScore: "178/7 (20.0)",
      summary: "Australia need 15 runs in 16 balls",
      resultText: null,
      offsetMinutes: -95,
      updatedOffsetMinutes: -3
    },
    {
      id: "match-1005",
      slug: "match-1005",
      tournamentId: "t-asia-cup-2026",
      seriesId: "series-asia-cup-2026",
      seriesName: "Asia Cup 2026",
      format: "ODI",
      status: "LIVE",
      venue: "Gaddafi Stadium, Lahore",
      teamAId: "team-pak",
      teamBId: "team-eng",
      teamAScore: "198/3 (34.4)",
      teamBScore: "Yet to bat",
      summary: "Pakistan accelerate past 5.7 RPO in middle overs",
      resultText: null,
      offsetMinutes: -65,
      updatedOffsetMinutes: -4
    },
    {
      id: "match-1006",
      slug: "match-1006",
      tournamentId: "t-premier-league-2026",
      seriesId: "series-plt20-2026",
      seriesName: "Premier League T20 2026",
      format: "T20",
      status: "LIVE",
      venue: "National Stadium, Karachi",
      teamAId: "team-nz",
      teamBId: "team-sa",
      teamAScore: "189/5 (20.0)",
      teamBScore: "92/2 (9.4)",
      summary: "South Africa chase 190 • need 98 in 62 balls",
      resultText: null,
      offsetMinutes: -70,
      updatedOffsetMinutes: -5
    },
    {
      id: "match-cric-1011",
      slug: "match-cric-1011",
      tournamentId: "t-test-championship-2026",
      seriesId: "series-bgt-2026",
      seriesName: "World Test Championship 2026",
      format: "Test",
      status: "LIVE",
      venue: "Wanderers Stadium, Johannesburg",
      teamAId: "team-sa",
      teamBId: "team-aus",
      teamAScore: "342/6 (94.0)",
      teamBScore: "Day 2",
      summary: "Day 2 Session 2 • South Africa build first-innings lead",
      resultText: null,
      offsetMinutes: -120,
      updatedOffsetMinutes: -6
    },
    {
      id: "match-1002",
      slug: "match-1002",
      tournamentId: "t-premier-league-2026",
      seriesId: "series-plt20-2026",
      seriesName: "Premier League T20 2026",
      format: "T20",
      status: "UPCOMING",
      venue: "Lord's, London",
      teamAId: "team-eng",
      teamBId: "team-aus",
      teamAScore: null,
      teamBScore: null,
      summary: "Toss in 3 hours",
      resultText: "Starts soon at Lord's",
      offsetMinutes: 210,
      updatedOffsetMinutes: -10
    },
    {
      id: "match-1007",
      slug: "match-1007",
      tournamentId: "t-asia-cup-2026",
      seriesId: "series-asia-cup-2026",
      seriesName: "Asia Cup 2026",
      format: "ODI",
      status: "UPCOMING",
      venue: "R. Premadasa Stadium, Colombo",
      teamAId: "team-sl",
      teamBId: "team-ban",
      teamAScore: null,
      teamBScore: null,
      summary: "Group B Key ODI Fixture",
      resultText: "Floodlit clash in Colombo",
      offsetMinutes: 460,
      updatedOffsetMinutes: -12
    },
    {
      id: "match-1008",
      slug: "match-1008",
      tournamentId: "t-premier-league-2026",
      seriesId: "series-plt20-2026",
      seriesName: "Premier League T20 2026",
      format: "T20",
      status: "UPCOMING",
      venue: "Wankhede Stadium, Mumbai",
      teamAId: "team-ind",
      teamBId: "team-pak",
      teamAScore: null,
      teamBScore: null,
      summary: "High-voltage evening T20 clash",
      resultText: "Wankhede T20 Showdown",
      offsetMinutes: 840,
      updatedOffsetMinutes: -15
    },
    {
      id: "match-1009",
      slug: "match-1009",
      tournamentId: "t-asia-cup-2026",
      seriesId: "series-asia-cup-2026",
      seriesName: "Asia Cup 2026",
      format: "ODI",
      status: "UPCOMING",
      venue: "Lord's, London",
      teamAId: "team-eng",
      teamBId: "team-nz",
      teamAScore: null,
      teamBScore: null,
      summary: "50-over Tri-Series opener",
      resultText: "Scheduled ODI fixture",
      offsetMinutes: 1440,
      updatedOffsetMinutes: -20
    },
    {
      id: "match-1010",
      slug: "match-1010",
      tournamentId: "t-premier-league-2026",
      seriesId: "series-plt20-2026",
      seriesName: "Premier League T20 2026",
      format: "T20",
      status: "UPCOMING",
      venue: "MCG, Melbourne",
      teamAId: "team-aus",
      teamBId: "team-ban",
      teamAScore: null,
      teamBScore: null,
      summary: "Under-lights T20I doubleheader",
      resultText: "MCG T20 Fixture",
      offsetMinutes: 2100,
      updatedOffsetMinutes: -25
    },
    {
      id: "match-cric-1012",
      slug: "match-cric-1012",
      tournamentId: "t-premier-league-2026",
      seriesId: "series-plt20-2026",
      seriesName: "Premier League T20 2026",
      format: "T20",
      status: "UPCOMING",
      venue: "Newlands, Cape Town",
      teamAId: "team-sa",
      teamBId: "team-pak",
      teamAScore: null,
      teamBScore: null,
      summary: "Proteas host Pakistan in T20I Decider",
      resultText: "Cape Town T20I Showdown",
      offsetMinutes: 2520,
      updatedOffsetMinutes: -30
    },
    {
      id: "match-cric-comp-1",
      slug: "match-cric-comp-1",
      tournamentId: "t-asia-cup-2026",
      seriesId: "series-asia-cup-2026",
      seriesName: "Asia Cup 2026",
      format: "ODI",
      status: "COMPLETED",
      venue: "Wankhede Stadium, Mumbai",
      teamAId: "team-ind",
      teamBId: "team-sl",
      teamAScore: "312/5 (50.0)",
      teamBScore: "256/9 (50.0)",
      summary: "India won by 56 runs",
      resultText: "India won by 56 runs",
      offsetMinutes: -600,
      updatedOffsetMinutes: -180
    },

    // Football: live + upcoming + completed
    {
      id: "match-fb-2001",
      slug: "match-fb-2001",
      tournamentId: "t-ucl-2026",
      seriesId: "series-ucl-2026",
      seriesName: "UEFA Champions League",
      format: "Football",
      status: "LIVE",
      venue: "Santiago Bernabeu, Madrid",
      teamAId: "team-rma",
      teamBId: "team-bar",
      teamAScore: "2 (74')",
      teamBScore: "1 (74')",
      summary: "74' • Real Madrid lead El Clasico European tie 2-1",
      resultText: null,
      offsetMinutes: -74,
      updatedOffsetMinutes: -1
    },
    {
      id: "match-fb-2002",
      slug: "match-fb-2002",
      tournamentId: "t-epl-2026",
      seriesId: "series-epl-2026",
      seriesName: "English Premier League",
      format: "Football",
      status: "LIVE",
      venue: "Emirates Stadium, London",
      teamAId: "team-ars",
      teamBId: "team-mci",
      teamAScore: "1 (HT)",
      teamBScore: "1 (HT)",
      summary: "Half-Time • Saka & Haaland level in North London title battle",
      resultText: null,
      offsetMinutes: -50,
      updatedOffsetMinutes: -2
    },
    {
      id: "match-fb-2003",
      slug: "match-fb-2003",
      tournamentId: "t-ucl-2026",
      seriesId: "series-ucl-2026",
      seriesName: "UEFA Champions League",
      format: "Football",
      status: "LIVE",
      venue: "Anfield, Liverpool",
      teamAId: "team-liv",
      teamBId: "team-bay",
      teamAScore: "3 (82')",
      teamBScore: "2 (82')",
      summary: "82' • Salah brace puts Liverpool ahead at Anfield",
      resultText: null,
      offsetMinutes: -82,
      updatedOffsetMinutes: -3
    },
    {
      id: "match-fb-2004",
      slug: "match-fb-2004",
      tournamentId: "t-ucl-2026",
      seriesId: "series-ucl-2026",
      seriesName: "UEFA Champions League",
      format: "Football",
      status: "UPCOMING",
      venue: "Parc des Princes, Paris",
      teamAId: "team-psg",
      teamBId: "team-int",
      teamAScore: null,
      teamBScore: null,
      summary: "Semi-Final 1st Leg • Kickoff in 3h",
      resultText: "Champions League Semi-Final 1st Leg",
      offsetMinutes: 195,
      updatedOffsetMinutes: -8
    },
    {
      id: "match-fb-2005",
      slug: "match-fb-2005",
      tournamentId: "t-wcq-2026",
      seriesId: null,
      seriesName: "FIFA World Cup Qualifiers",
      format: "Football",
      status: "UPCOMING",
      venue: "Estadio Monumental, Buenos Aires",
      teamAId: "team-arg",
      teamBId: "team-bra",
      teamAScore: null,
      teamBScore: null,
      summary: "Superclasico CONMEBOL Qualifier",
      resultText: "Argentina host Brazil under lights",
      offsetMinutes: 720,
      updatedOffsetMinutes: -14
    },
    {
      id: "match-fb-2006",
      slug: "match-fb-2006",
      tournamentId: "t-epl-2026",
      seriesId: "series-epl-2026",
      seriesName: "English Premier League",
      format: "Football",
      status: "UPCOMING",
      venue: "Etihad Stadium, Manchester",
      teamAId: "team-mci",
      teamBId: "team-liv",
      teamAScore: null,
      teamBScore: null,
      summary: "Premier League Matchday 32 Headliner",
      resultText: "Matchday 32 Clash",
      offsetMinutes: 1560,
      updatedOffsetMinutes: -18
    },
    {
      id: "match-fb-2007",
      slug: "match-fb-2007",
      tournamentId: "t-serie-a-2026",
      seriesId: "series-serie-a-2026",
      seriesName: "Serie A",
      format: "Football",
      status: "LIVE",
      venue: "Allianz Stadium, Turin",
      teamAId: "team-juv",
      teamBId: "team-acm",
      teamAScore: "2 (66')",
      teamBScore: "2 (66')",
      summary: "66' • Vlahovic & Pulisic trade second-half goals in Turin",
      resultText: null,
      offsetMinutes: -66,
      updatedOffsetMinutes: -2
    },
    {
      id: "match-fb-2008",
      slug: "match-fb-2008",
      tournamentId: "t-bundesliga-2026",
      seriesId: "series-bundesliga-2026",
      seriesName: "Bundesliga",
      format: "Football",
      status: "LIVE",
      venue: "Signal Iduna Park, Dortmund",
      teamAId: "team-bvb",
      teamBId: "team-rbl",
      teamAScore: "3 (79')",
      teamBScore: "1 (79')",
      summary: "79' • Yellow Wall roars as Dortmund cruise 3-1",
      resultText: null,
      offsetMinutes: -79,
      updatedOffsetMinutes: -4
    },
    {
      id: "match-fb-2009",
      slug: "match-fb-2009",
      tournamentId: "t-mls-2026",
      seriesId: "series-mls-2026",
      seriesName: "MLS Cup",
      format: "Football",
      status: "LIVE",
      venue: "Chase Stadium, Fort Lauderdale",
      teamAId: "team-mia",
      teamBId: "team-lag",
      teamAScore: "2 (58')",
      teamBScore: "0 (58')",
      summary: "58' • Inter Miami control midfield against LA Galaxy",
      resultText: null,
      offsetMinutes: -58,
      updatedOffsetMinutes: -5
    },
    {
      id: "match-fb-2010",
      slug: "match-fb-2010",
      tournamentId: "t-ucl-2026",
      seriesId: "series-ucl-2026",
      seriesName: "UEFA Champions League",
      format: "Football",
      status: "UPCOMING",
      venue: "Santiago Bernabeu, Madrid",
      teamAId: "team-rma",
      teamBId: "team-bay",
      teamAScore: null,
      teamBScore: null,
      summary: "Quarter-Final 2nd Leg • Heavyweights collide",
      resultText: "Real Madrid host Bayern Munich",
      offsetMinutes: 2100,
      updatedOffsetMinutes: -20
    },
    {
      id: "match-fb-2011",
      slug: "match-fb-2011",
      tournamentId: "t-epl-2026",
      seriesId: "series-epl-2026",
      seriesName: "English Premier League",
      format: "Football",
      status: "UPCOMING",
      venue: "Emirates Stadium, London",
      teamAId: "team-ars",
      teamBId: "team-liv",
      teamAScore: null,
      teamBScore: null,
      summary: "Sunday Superclash for top spot",
      resultText: "Arsenal host Liverpool",
      offsetMinutes: 2700,
      updatedOffsetMinutes: -24
    },
    {
      id: "match-fb-2012",
      slug: "match-fb-2012",
      tournamentId: "t-wcq-2026",
      seriesId: null,
      seriesName: "FIFA World Cup Qualifiers",
      format: "Football",
      status: "UPCOMING",
      venue: "Maracana, Rio de Janeiro",
      teamAId: "team-bra",
      teamBId: "team-arg",
      teamAScore: null,
      teamBScore: null,
      summary: "Return Qualifying Leg in Rio",
      resultText: "Brazil vs Argentina",
      offsetMinutes: 3300,
      updatedOffsetMinutes: -28
    },
    {
      id: "match-fb-comp-1",
      slug: "match-fb-comp-1",
      tournamentId: "t-epl-2026",
      seriesId: "series-epl-2026",
      seriesName: "English Premier League",
      format: "Football",
      status: "COMPLETED",
      venue: "Anfield, Liverpool",
      teamAId: "team-liv",
      teamBId: "team-ars",
      teamAScore: "2 (FT)",
      teamBScore: "0 (FT)",
      summary: "Liverpool won 2-0",
      resultText: "Liverpool won 2-0 at Anfield",
      offsetMinutes: -500,
      updatedOffsetMinutes: -120
    },

    // Other Sports (all 10 categories: Basketball, Tennis, Baseball, Hockey, Rugby, Motorsports, Esports, MMA, Golf, Athletics)
    {
      id: "match-bb-3001",
      slug: "match-bb-3001",
      tournamentId: "t-nba-2026",
      seriesId: "series-nba-2026",
      seriesName: "NBA Finals · Game 6",
      format: "Basketball",
      status: "LIVE",
      venue: "Crypto.com Arena, Los Angeles",
      teamAId: "team-lal",
      teamBId: "team-bos",
      teamAScore: "108 (Q4)",
      teamBScore: "104 (Q4)",
      summary: "Q4 02:14 • Lakers lead Boston by 4 points",
      resultText: null,
      offsetMinutes: -90,
      updatedOffsetMinutes: -1
    },
    {
      id: "match-ten-3002",
      slug: "match-ten-3002",
      tournamentId: "t-wimbledon-2026",
      seriesId: "series-wimbledon-2026",
      seriesName: "Wimbledon Championships Final",
      format: "Tennis",
      status: "LIVE",
      venue: "Centre Court, All England Club",
      teamAId: "team-alc",
      teamBId: "team-djo",
      teamAScore: "6-4, 3-6, 5-4",
      teamBScore: "4-6, 6-3, 4-5",
      summary: "Set 3 • Alcaraz serving at 40-15",
      resultText: null,
      offsetMinutes: -115,
      updatedOffsetMinutes: -2
    },
    {
      id: "match-bsb-3003",
      slug: "match-bsb-3003",
      tournamentId: "t-mlb-2026",
      seriesId: "series-mlb-2026",
      seriesName: "MLB World Series · Game 5",
      format: "Baseball",
      status: "LIVE",
      venue: "Yankee Stadium, New York",
      teamAId: "team-nyy",
      teamBId: "team-lad",
      teamAScore: "5 (Top 8)",
      teamBScore: "3 (Top 8)",
      summary: "Top 8th • Aaron Judge 2-run homer gives NYY lead",
      resultText: null,
      offsetMinutes: -130,
      updatedOffsetMinutes: -3
    },
    {
      id: "match-hky-3004",
      slug: "match-hky-3004",
      tournamentId: "t-nhl-2026",
      seriesId: "series-nhl-2026",
      seriesName: "NHL Stanley Cup Playoffs",
      format: "Hockey",
      status: "LIVE",
      venue: "Scotiabank Arena, Toronto",
      teamAId: "team-tor",
      teamBId: "team-mtl",
      teamAScore: "3 (P3)",
      teamBScore: "2 (P3)",
      summary: "3rd Period 08:40 • Maple Leafs on the power play",
      resultText: null,
      offsetMinutes: -95,
      updatedOffsetMinutes: -4
    },
    {
      id: "match-rgb-3005",
      slug: "match-rgb-3005",
      tournamentId: "t-rugby-2026",
      seriesId: "series-rugby-2026",
      seriesName: "The Rugby Championship",
      format: "Rugby",
      status: "LIVE",
      venue: "Eden Park, Auckland",
      teamAId: "team-nzl-rugby",
      teamBId: "team-rsa-rugby",
      teamAScore: "24 (68')",
      teamBScore: "21 (68')",
      summary: "68' • All Blacks defend 5m line against Springboks scrum",
      resultText: null,
      offsetMinutes: -68,
      updatedOffsetMinutes: -5
    },
    {
      id: "match-mot-3006",
      slug: "match-mot-3006",
      tournamentId: "t-f1-2026",
      seriesId: "series-f1-2026",
      seriesName: "Formula 1 Monaco Grand Prix",
      format: "Motorsports",
      status: "LIVE",
      venue: "Circuit de Monaco, Monte Carlo",
      teamAId: "team-rbr",
      teamBId: "team-fer",
      teamAScore: "Lap 54/78 · P1",
      teamBScore: "P2 (+1.4s)",
      summary: "Lap 54/78 • Red Bull Racing leads Ferrari through Rascasse",
      resultText: null,
      offsetMinutes: -75,
      updatedOffsetMinutes: -6
    },
    {
      id: "match-esp-3007",
      slug: "match-esp-3007",
      tournamentId: "t-vct-2026",
      seriesId: "series-vct-2026",
      seriesName: "Valorant Champions Tour Masters",
      format: "Esports",
      status: "UPCOMING",
      venue: "Riot Arena, Berlin",
      teamAId: "team-fnc",
      teamBId: "team-sen",
      teamAScore: null,
      teamBScore: null,
      summary: "Grand Final · Best of 5 Series",
      resultText: "VCT Masters Grand Final",
      offsetMinutes: 240,
      updatedOffsetMinutes: -10
    },
    {
      id: "match-mma-3008",
      slug: "match-mma-3008",
      tournamentId: "t-ufc-2026",
      seriesId: "series-ufc-2026",
      seriesName: "UFC 315 · Main Event",
      format: "MMA",
      status: "UPCOMING",
      venue: "T-Mobile Arena, Las Vegas",
      teamAId: "team-mak",
      teamBId: "team-tsa",
      teamAScore: null,
      teamBScore: null,
      summary: "Lightweight Title Bout · 5 Rounds",
      resultText: "UFC Lightweight Championship",
      offsetMinutes: 540,
      updatedOffsetMinutes: -14
    },
    {
      id: "match-glf-3009",
      slug: "match-glf-3009",
      tournamentId: "t-ryder-2026",
      seriesId: "series-ryder-2026",
      seriesName: "Ryder Cup · Sunday Singles",
      format: "Golf",
      status: "UPCOMING",
      venue: "Bethpage Black, New York",
      teamAId: "team-eur",
      teamBId: "team-usa",
      teamAScore: null,
      teamBScore: null,
      summary: "Championship Day Fourballs & Singles",
      resultText: "Team Europe vs Team USA",
      offsetMinutes: 1080,
      updatedOffsetMinutes: -16
    },
    {
      id: "match-ath-3010",
      slug: "match-ath-3010",
      tournamentId: "t-diamond-2026",
      seriesId: "series-diamond-2026",
      seriesName: "Wanda Diamond League",
      format: "Athletics",
      status: "UPCOMING",
      venue: "Hayward Field, Eugene",
      teamAId: "team-ust",
      teamBId: "team-jam",
      teamAScore: null,
      teamBScore: null,
      summary: "Men's 100m & 4x100m Relay Finals",
      resultText: "Diamond League Sprint Finals",
      offsetMinutes: 1620,
      updatedOffsetMinutes: -20
    },
    {
      id: "match-ten-3011",
      slug: "match-ten-3011",
      tournamentId: "t-atp-2026",
      seriesId: null,
      seriesName: "ATP Tour Finals · Turin",
      format: "Tennis",
      status: "UPCOMING",
      venue: "Inalpi Arena, Turin",
      teamAId: "team-sin",
      teamBId: "team-zve",
      teamAScore: null,
      teamBScore: null,
      summary: "Group A Indoor Hardcourt Showdown",
      resultText: "ATP Group Stage Match",
      offsetMinutes: 2040,
      updatedOffsetMinutes: -22
    },
    {
      id: "match-bb-3012",
      slug: "match-bb-3012",
      tournamentId: "t-nba-2026",
      seriesId: "series-nba-2026",
      seriesName: "NBA Finals · Game 7",
      format: "Basketball",
      status: "UPCOMING",
      venue: "TD Garden, Boston",
      teamAId: "team-bos",
      teamBId: "team-lal",
      teamAScore: null,
      teamBScore: null,
      summary: "Winner-take-all NBA Finals Decider",
      resultText: "NBA Finals Game 7",
      offsetMinutes: 2880,
      updatedOffsetMinutes: -26
    },
    {
      id: "match-bb-comp-1",
      slug: "match-bb-comp-1",
      tournamentId: "t-nba-2026",
      seriesId: "series-nba-2026",
      seriesName: "NBA Finals · Game 5",
      format: "Basketball",
      status: "COMPLETED",
      venue: "TD Garden, Boston",
      teamAId: "team-bos",
      teamBId: "team-lal",
      teamAScore: "114",
      teamBScore: "109",
      summary: "Boston Celtics won 114-109",
      resultText: "Celtics won 114-109 at TD Garden",
      offsetMinutes: -720,
      updatedOffsetMinutes: -150
    },
    {
      id: "match-mot-comp-1",
      slug: "match-mot-comp-1",
      tournamentId: "t-f1-2026",
      seriesId: "series-f1-2026",
      seriesName: "Formula 1 Italian Grand Prix",
      format: "Motorsports",
      status: "COMPLETED",
      venue: "Autodromo Nazionale Monza",
      teamAId: "team-fer",
      teamBId: "team-rbr",
      teamAScore: "P1 (1:14:40)",
      teamBScore: "P2 (+2.1s)",
      summary: "Scuderia Ferrari won at Monza",
      resultText: "Ferrari took home victory at Monza",
      offsetMinutes: -1440,
      updatedOffsetMinutes: -240
    }
  ].map((m) => ({
    ...m,
    scheduledAt: rel(m.offsetMinutes),
    startAt: rel(m.offsetMinutes),
    lastUpdatedAt: rel(m.updatedOffsetMinutes)
  }));
}

const PLAYERS = [
  { id: "player-vinicius", teamId: "team-rma", fullName: "Vinicius Jr", role: "Forward", battingStyle: "Right-footed", bowlingStyle: "Winger" },
  { id: "player-yamal", teamId: "team-bar", fullName: "Lamine Yamal", role: "Forward", battingStyle: "Left-footed", bowlingStyle: "Right Wing" },
  { id: "player-saka", teamId: "team-ars", fullName: "Bukayo Saka", role: "Forward", battingStyle: "Left-footed", bowlingStyle: "Right Wing" },
  { id: "player-haaland", teamId: "team-mci", fullName: "Erling Haaland", role: "Striker", battingStyle: "Left-footed", bowlingStyle: "Center Forward" },
  { id: "player-lebron", teamId: "team-lal", fullName: "LeBron James", role: "Forward", battingStyle: "Right-handed", bowlingStyle: "All-Around" },
  { id: "player-tatum", teamId: "team-bos", fullName: "Jayson Tatum", role: "Forward", battingStyle: "Right-handed", bowlingStyle: "3PT / Wing" },
  { id: "player-alcaraz", teamId: "team-alc", fullName: "Carlos Alcaraz", role: "Singles", battingStyle: "Right-handed", bowlingStyle: "Two-handed backhand" },
  { id: "player-verstappen", teamId: "team-rbr", fullName: "Max Verstappen", role: "F1 Driver", battingStyle: "Car #1", bowlingStyle: "Pole Pace" },
  { id: "player-judge", teamId: "team-nyy", fullName: "Aaron Judge", role: "Outfielder", battingStyle: "Right-handed", bowlingStyle: "Power Hitter" }
];

const NEWS_ARTICLES = [
  {
    slug: "real-madrid-edge-barcelona-in-champions-league-thriller",
    title: "Real Madrid edge FC Barcelona in Champions League thriller",
    summary: "Vinicius Jr strikes decisively as Madrid take a 2-1 lead past the 70-minute mark at the Bernabeu.",
    content:
      "Santiago Bernabeu witnessed relentless Champions League intensity as Real Madrid surged ahead of FC Barcelona 2-1. Clinical transitions down the left flank tilted momentum late in the second half.",
    minutesAgo: -15
  },
  {
    slug: "lakers-celtics-nba-finals-game-6-crunch-time",
    title: "Lakers and Celtics trade blows in NBA Finals Game 6 crunch time",
    summary: "Los Angeles hold a 108-104 advantage in the final two minutes behind balanced fourth-quarter scoring.",
    content:
      "Every possession carried championship weight in Los Angeles as the Lakers built a four-point cushion late in Q4 against Boston.",
    minutesAgo: -40
  },
  {
    slug: "alcaraz-djokovic-wimbledon-final-reaches-third-set-climax",
    title: "Alcaraz and Djokovic deliver classic Wimbledon Centre Court duel",
    summary: "Carlos Alcaraz serves at 5-4 in the third set after trading break points with Novak Djokovic.",
    content:
      "Centre Court fans rose to an extraordinary display of grass-court tennis as Alcaraz and Djokovic split the opening two sets before another tense decider.",
    minutesAgo: -65
  },
  {
    slug: "red-bull-and-ferrari-lock-horns-through-monaco-harbor",
    title: "Red Bull and Ferrari battle through final stints at Monaco Grand Prix",
    summary: "Just 1.4 seconds separate P1 and P2 past Lap 54 on the tight Monte Carlo street circuit.",
    content:
      "Pit-stop strategy and tire management in traffic defined an engrossing Monaco Grand Prix battle between Red Bull Racing and Scuderia Ferrari.",
    minutesAgo: -90
  }
];

async function main() {
  const { rows: nowRows } = await pool.query("SELECT NOW() AS now");
  const nowMs = new Date(nowRows[0].now).getTime();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const team of TEAMS) {
      await client.query(
        `
        INSERT INTO teams (id, name, short_name, country, home_ground)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          short_name = EXCLUDED.short_name,
          country = EXCLUDED.country,
          home_ground = EXCLUDED.home_ground,
          updated_at = NOW()
        `,
        [team.id, team.name, team.shortName, team.country, team.homeGround]
      );
    }

    const startDate = new Date(nowMs - 30 * 86_400_000).toISOString();
    const endDate = new Date(nowMs + 90 * 86_400_000).toISOString();

    for (const t of TOURNAMENTS) {
      await client.query(
        `
        INSERT INTO tournaments (id, name, season, format, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          season = EXCLUDED.season,
          format = EXCLUDED.format,
          updated_at = NOW()
        `,
        [t.id, t.name, t.season, t.format, startDate, endDate]
      );
    }

    for (const s of SERIES) {
      await client.query(
        `
        INSERT INTO series (id, name, season, format, start_date, end_date, status)
        VALUES ($1, $2, $3, $4, $5::date, $6::date, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          season = EXCLUDED.season,
          format = EXCLUDED.format,
          status = EXCLUDED.status
        `,
        [s.id, s.name, s.season, s.format, startDate.slice(0, 10), endDate.slice(0, 10), s.status]
      );
    }

    const matches = buildMatches(nowMs);
    for (const m of matches) {
      await client.query(
        `
        INSERT INTO matches (
          id, slug, tournament_id, series_id, series_name, format, status,
          venue, home_team_id, away_team_id, team_a_id, team_b_id,
          team_a_score, team_b_score, summary, result_text,
          scheduled_at, start_at, last_updated_at, created_by_id
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $9, $10,
          $11, $12, $13, $14,
          $15, $16, $17, 'admin-1'
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          tournament_id = EXCLUDED.tournament_id,
          series_id = EXCLUDED.series_id,
          series_name = EXCLUDED.series_name,
          format = EXCLUDED.format,
          status = EXCLUDED.status,
          venue = EXCLUDED.venue,
          home_team_id = EXCLUDED.home_team_id,
          away_team_id = EXCLUDED.away_team_id,
          team_a_id = EXCLUDED.team_a_id,
          team_b_id = EXCLUDED.team_b_id,
          team_a_score = EXCLUDED.team_a_score,
          team_b_score = EXCLUDED.team_b_score,
          summary = EXCLUDED.summary,
          result_text = EXCLUDED.result_text,
          scheduled_at = EXCLUDED.scheduled_at,
          start_at = EXCLUDED.start_at,
          last_updated_at = EXCLUDED.last_updated_at,
          updated_at = NOW()
        `,
        [
          m.id,
          m.slug,
          m.tournamentId,
          m.seriesId,
          m.seriesName,
          m.format,
          m.status,
          m.venue,
          m.teamAId,
          m.teamBId,
          m.teamAScore,
          m.teamBScore,
          m.summary,
          m.resultText,
          m.scheduledAt,
          m.startAt,
          m.lastUpdatedAt
        ]
      );
    }

    for (const p of PLAYERS) {
      await client.query(
        `
        INSERT INTO players (id, team_id, full_name, role, batting_style, bowling_style, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, TRUE)
        ON CONFLICT (id) DO UPDATE SET
          team_id = EXCLUDED.team_id,
          full_name = EXCLUDED.full_name,
          role = EXCLUDED.role,
          batting_style = EXCLUDED.batting_style,
          bowling_style = EXCLUDED.bowling_style,
          updated_at = NOW()
        `,
        [p.id, p.teamId, p.fullName, p.role, p.battingStyle, p.bowlingStyle]
      );
    }

    for (const n of NEWS_ARTICLES) {
      const publishedAt = new Date(nowMs + n.minutesAgo * 60_000).toISOString();
      await client.query(
        `
        INSERT INTO news_articles (slug, title, summary, content, published_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          content = EXCLUDED.content,
          published_at = EXCLUDED.published_at
        `,
        [n.slug, n.title, n.summary, n.content, publishedAt]
      );
    }

    await client.query("COMMIT");

    const { rows: summary } = await pool.query(`
      SELECT format, LOWER(status) AS status, COUNT(*)::int AS count
      FROM matches
      GROUP BY format, LOWER(status)
      ORDER BY format, status
    `);
    console.log("Seeded all sports successfully:");
    console.table(summary);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Failed to seed sports:", error);
  process.exit(1);
});
