import { useMemo } from "react";
import { useTeamFilterStore } from "./useTeamFilterStore";
import { teamKeyToCsv } from "./team";

export const useTeamFilterQuery = () => {
  const selectedTeams = useTeamFilterStore((s) => s.selectedTeams);

  return useMemo(() => {
    if (selectedTeams.length === 0) return "";

    const csvTeams = selectedTeams.map(teamKeyToCsv);

    return `?teams=${csvTeams.join(",")}`;
  }, [selectedTeams]);
};
