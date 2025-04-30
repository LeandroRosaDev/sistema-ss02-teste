import { Routines } from "@/types/GlobalTypes";
import { create } from "zustand";

interface RoutineStore {
  routines: Routines[];
  loading: boolean;
  error: string | null;
  fetchRoutines: () => Promise<void>;
}

const useRoutineStore = create<RoutineStore>((set) => ({
  routines: [],
  loading: false,
  error: null,

  fetchRoutines: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/consultar/rotina/get");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar rotinas");
      }

      const data = await response.json();

      // Verifica se os dados retornados são válidos
      if (!data.rotinas || !Array.isArray(data.rotinas)) {
        throw new Error("Formato de dados inválido");
      }

      set({
        routines: data.rotinas,
        loading: false,
      });
    } catch (error) {
      console.error("Erro durante o fetch:", error);

      set({
        error:
          error instanceof Error ? error.message : "Erro ao buscar rotinas",
        loading: false,
        routines: [],
      });
    }
  },
}));

export default useRoutineStore;
