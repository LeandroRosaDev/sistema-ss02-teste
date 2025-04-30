import { User } from "@/types/GlobalTypes";
import { create } from "zustand";

interface UserFilters {
  name?: string;
  email?: string;
  role?: string;
}

// Definir o tipo da store
interface UserStore {
  users: User[];
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  fetchUsers: (page?: number, filters?: UserFilters) => Promise<void>;
  clearUsers: () => void;
}

// Criar a store
const useUserStore = create<UserStore>((set) => ({
  users: [],
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,

  fetchUsers: async (page = 1, filters = {}) => {
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

      if (!response.ok) throw new Error("Erro ao buscar usuários.");

      const { users, totalPages } = await response.json();
      set({
        users,
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

  clearUsers: () => set({ users: [], totalPages: 1, currentPage: 1 }),
}));

export default useUserStore;
