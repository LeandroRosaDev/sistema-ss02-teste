// src/store/useUserStore.ts
import { create } from "zustand";

// Ajuste conforme o shape retornado pelo seu backend
interface UserProfile {
  profileImage?: string | null;
  cpf?: string;
  dateOfBirth?: string;
  gender?: string;
  workArea?: string;
  technicalRole?: string;
  personalSignature?: string | null;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  profile?: UserProfile;
}

interface UserState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
}

// Exemplo de URL do endpoint que retorna informações do user
// Supondo que você já tem GET /api/user-profile (ou /api/perfil-user/get)
const ENDPOINT_GET_USER = "/api/perfil-user/get";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(ENDPOINT_GET_USER);
      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }

      const data: UserData = await response.json();
      set({ user: data, loading: false });
    } catch (error) {
      let errorMessage = "Erro desconhecido.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      console.error("Erro durante o fetch de user:", errorMessage);

      set({ error: errorMessage, loading: false });
    }
  },
}));
