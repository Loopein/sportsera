-- Schema based on lib/mock/data.ts and types/*.ts
-- Postgres dialect.

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  logo TEXT,
  home_ground TEXT,
  captain TEXT,
  coach TEXT
);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  batting_style TEXT,
  bowling_style TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS player_career_stats (
  id BIGSERIAL PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  format TEXT NOT NULL,
  matches INTEGER NOT NULL,
  runs INTEGER,
  wickets INTEGER,
  average NUMERIC(8,2),
  strike_rate NUMERIC(8,2)
);

CREATE TABLE IF NOT EXISTS player_recent_form (
  id BIGSERIAL PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  entry_order INTEGER NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS team_squad_members (
  id BIGSERIAL PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id TEXT REFERENCES players(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  is_captain BOOLEAN DEFAULT FALSE,
  is_wicket_keeper BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS series (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  season TEXT NOT NULL,
  format TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ongoing','upcoming','completed'))
);

CREATE TABLE IF NOT EXISTS series_standings (
  id BIGSERIAL PRIMARY KEY,
  series_id TEXT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
  team_name TEXT NOT NULL,
  played INTEGER NOT NULL,
  won INTEGER NOT NULL,
  lost INTEGER NOT NULL,
  points INTEGER NOT NULL,
  net_run_rate NUMERIC(8,3) NOT NULL
);

CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('live','innings_break','upcoming','completed')),
  format TEXT NOT NULL,
  series_id TEXT REFERENCES series(id) ON DELETE SET NULL,
  series_name TEXT NOT NULL,
  venue TEXT NOT NULL,
  toss TEXT,
  summary TEXT,
  result_text TEXT,
  start_at TIMESTAMPTZ,
  last_updated_at TIMESTAMPTZ,
  current_run_rate NUMERIC(8,2),
  required_run_rate NUMERIC(8,2),
  target INTEGER,
  overs TEXT,
  team_a_id TEXT NOT NULL REFERENCES teams(id),
  team_b_id TEXT NOT NULL REFERENCES teams(id),
  team_a_score TEXT,
  team_b_score TEXT
);

CREATE INDEX IF NOT EXISTS matches_status_idx ON matches(status);
CREATE INDEX IF NOT EXISTS matches_series_idx ON matches(series_id);
CREATE INDEX IF NOT EXISTS matches_start_at_idx ON matches(start_at);

CREATE TABLE IF NOT EXISTS match_current_batters (
  id BIGSERIAL PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  runs INTEGER NOT NULL,
  balls INTEGER NOT NULL,
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS match_current_bowlers (
  id BIGSERIAL PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  overs TEXT NOT NULL,
  runs INTEGER NOT NULL,
  wickets INTEGER NOT NULL,
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS match_recent_overs (
  id BIGSERIAL PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  over_index INTEGER NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS match_playing_xi (
  id BIGSERIAL PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id TEXT REFERENCES players(id) ON DELETE SET NULL,
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS scorecards (
  match_id TEXT PRIMARY KEY REFERENCES matches(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scorecard_innings (
  id BIGSERIAL PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total TEXT NOT NULL,
  extras TEXT,
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS scorecard_fall_of_wickets (
  id BIGSERIAL PRIMARY KEY,
  innings_id BIGINT NOT NULL REFERENCES scorecard_innings(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scorecard_batters (
  id BIGSERIAL PRIMARY KEY,
  innings_id BIGINT NOT NULL REFERENCES scorecard_innings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dismissal TEXT NOT NULL,
  runs INTEGER NOT NULL,
  balls INTEGER NOT NULL,
  fours INTEGER NOT NULL,
  sixes INTEGER NOT NULL,
  strike_rate NUMERIC(8,2) NOT NULL,
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS scorecard_bowlers (
  id BIGSERIAL PRIMARY KEY,
  innings_id BIGINT NOT NULL REFERENCES scorecard_innings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  overs TEXT NOT NULL,
  maidens INTEGER NOT NULL,
  runs INTEGER NOT NULL,
  wickets INTEGER NOT NULL,
  economy NUMERIC(8,2) NOT NULL,
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS match_commentary (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  over TEXT NOT NULL,
  ball TEXT NOT NULL,
  text TEXT NOT NULL,
  runs INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS match_commentary_match_idx ON match_commentary(match_id);

CREATE TABLE IF NOT EXISTS match_stats (
  match_id TEXT PRIMARY KEY REFERENCES matches(id) ON DELETE CASCADE,
  run_rate NUMERIC(8,2) NOT NULL,
  required_run_rate NUMERIC(8,2)
);

CREATE TABLE IF NOT EXISTS match_partnerships (
  id BIGSERIAL PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  wickets TEXT NOT NULL,
  runs INTEGER NOT NULL,
  balls INTEGER NOT NULL,
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS match_wagon_wheel (
  id BIGSERIAL PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  zone TEXT NOT NULL,
  runs INTEGER NOT NULL,
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS match_matchup_notes (
  id BIGSERIAL PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS standings_seasons (
  season TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS standings_series (
  season TEXT NOT NULL REFERENCES standings_seasons(season) ON DELETE CASCADE,
  id TEXT NOT NULL,
  label TEXT NOT NULL,
  PRIMARY KEY (season, id)
);

CREATE TABLE IF NOT EXISTS standings_stages (
  season TEXT NOT NULL,
  series_id TEXT NOT NULL,
  id TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  PRIMARY KEY (season, series_id, id),
  FOREIGN KEY (season, series_id) REFERENCES standings_series(season, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS standings_groups (
  season TEXT NOT NULL,
  series_id TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  id TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  PRIMARY KEY (season, series_id, stage_id, id),
  FOREIGN KEY (season, series_id, stage_id) REFERENCES standings_stages(season, series_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS standings_rows (
  season TEXT NOT NULL,
  series_id TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
  team_name TEXT NOT NULL,
  short_code TEXT NOT NULL,
  played INTEGER NOT NULL,
  won INTEGER NOT NULL,
  lost INTEGER NOT NULL,
  net_run_rate NUMERIC(8,3) NOT NULL,
  points INTEGER NOT NULL,
  highlight BOOLEAN DEFAULT FALSE,
  row_index INTEGER NOT NULL,
  PRIMARY KEY (season, series_id, stage_id, group_id, team_id),
  FOREIGN KEY (season, series_id, stage_id, group_id)
    REFERENCES standings_groups(season, series_id, stage_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rankings (
  id BIGSERIAL PRIMARY KEY,
  team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
  team_name TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('test','odi','t20')),
  rank INTEGER NOT NULL,
  rating INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tournament_player_stats (
  id BIGSERIAL PRIMARY KEY,
  player_id TEXT REFERENCES players(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
  team_name TEXT NOT NULL,
  matches INTEGER NOT NULL,
  innings INTEGER NOT NULL,
  runs INTEGER NOT NULL,
  highest_score INTEGER NOT NULL,
  batting_average NUMERIC(8,2) NOT NULL,
  strike_rate NUMERIC(8,2) NOT NULL,
  fours INTEGER NOT NULL,
  sixes INTEGER NOT NULL,
  wickets INTEGER NOT NULL,
  bowling_average NUMERIC(8,2) NOT NULL,
  economy NUMERIC(8,2) NOT NULL,
  overs NUMERIC(8,1) NOT NULL,
  best_bowling TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS news_articles (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL
);
