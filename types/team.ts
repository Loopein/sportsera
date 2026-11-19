export type TeamSquadMember = {
  playerId: string;
  name: string;
  role: string;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
};

export type TeamProfile = {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  homeGround?: string;
  captain?: string;
  coach?: string;
  squad: TeamSquadMember[];
};
