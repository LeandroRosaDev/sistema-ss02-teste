import { Company } from "@/types/GlobalTypes";
import { create } from "zustand";

interface CompanyStore {
  companies: Company[];
  loading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
}

const useCompanyStore = create<CompanyStore>((set) => ({
  companies: [],
  loading: false,
  error: null,

  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/consultar/empresa/get");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar empresas");
      }

      const data = await response.json();

      // Verifica se os dados retornados são válidos
      if (!data.empresas || !Array.isArray(data.empresas)) {
        throw new Error("Formato de dados inválido");
      }

      set({
        companies: data.empresas,
        loading: false,
      });
    } catch (error) {
      console.error("Erro durante o fetch:", error);

      set({
        error:
          error instanceof Error ? error.message : "Erro ao buscar empresas",
        loading: false,
        companies: [],
      });
    }
  },
}));

export default useCompanyStore;
