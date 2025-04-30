import { User } from "@/types/GlobalTypes";
import { create } from "zustand";

// Tipo para os filtros de busca
interface SupervisorFilters {
  name?: string;
  email?: string;
  role?: string;
}

// Definir o tipo da store
interface SupervisorStore {
  supervisors: User[];
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  fetchSupervisors: (
    page?: number,
    filters?: SupervisorFilters
  ) => Promise<void>;
  clearSupervisors: () => void;
}

// Criar a store
const useSupervisorStore = create<SupervisorStore>((set) => ({
  supervisors: [],
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,

  fetchSupervisors: async (page = 1, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());

      if (filters.name) queryParams.append("name", filters.name);
      if (filters.email) queryParams.append("email", filters.email);
      if (filters.role) queryParams.append("role", filters.role);

      const response = await fetch(
        `/api/admin/listar-usuarios?${queryParams.toString()}`
      );

      if (!response.ok) throw new Error("Erro ao buscar supervisores.");

      const { users, totalPages } = await response.json();
      set({
        supervisors: users,
        totalPages,
        currentPage: page,
        loading: false,
      });
    } catch (error: unknown) {
      let errorMessage = "Erro desconhecido.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      console.error("Erro durante o fetch:", errorMessage);

      set({ error: errorMessage, loading: false });
    }
  },

  clearSupervisors: () =>
    set({ supervisors: [], totalPages: 1, currentPage: 1 }),
}));

export default useSupervisorStore;
