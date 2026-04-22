import { create } from "zustand";
import { TeamKey } from "./app-config";

type TeamFilterState = {
  selectedTeams: TeamKey[];
  toggleTeam: (team: TeamKey) => void;
  setTeams: (teams: TeamKey[]) => void;
  clear: () => void;
};

export const useTeamFilterStore = create<TeamFilterState>((set) => ({
  selectedTeams: [],

  toggleTeam: (team) =>
    set((state) => {
      const exists = state.selectedTeams.includes(team);
      return {
        selectedTeams: exists
          ? state.selectedTeams.filter((t) => t !== team)
          : [...state.selectedTeams, team],
      };
    }),

  setTeams: (teams) => set({ selectedTeams: teams }),

  clear: () => set({ selectedTeams: [] }),
}));
