// src/store/useTeamStore.ts
import { Team } from "@/types/GlobalTypes";
import { create } from "zustand";

interface TeamStore {
  teams: Team[];
  loading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  loading: false,
  error: null,

  fetchTeams: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/consultar/equipe/get");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar equipes");
      }

      const data = await response.json();

      // Verifica se os dados retornados são válidos
      if (!data.teams || !Array.isArray(data.teams)) {
        throw new Error("Formato de dados inválido");
      }

      set({
        teams: data.teams,
        loading: false,
      });
    } catch (error) {
      console.error("Erro durante o fetch:", error);

      set({
        error:
          error instanceof Error ? error.message : "Erro ao buscar equipes",
        loading: false,
        teams: [],
      });
    }
  },
}));
