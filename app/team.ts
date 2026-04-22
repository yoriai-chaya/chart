import { TEAM_FROM_CSV, TEAM_META, TeamKey } from "./app-config";

// CSV -> Internal Key
export const csvToTeamKey = (csv: string): TeamKey | null => {
  return TEAM_FROM_CSV[csv] ?? null;
};

// Internal Key -> CSV (Inverse)
export const teamKeyToCsvMap: Record<TeamKey, string> = Object.fromEntries(
  Object.entries(TEAM_FROM_CSV).map(([csv, key]) => [key, csv]),
) as Record<TeamKey, string>;

export const teamKeyToCsv = (key: TeamKey): string => {
  return teamKeyToCsvMap[key];
};

// CSV -> Display
export const getTeamMeta = (csv: string) => {
  const key = csvToTeamKey(csv);
  if (!key) return null;
  return TEAM_META[key];
};
