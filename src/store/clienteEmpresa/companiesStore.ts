import { Company } from "@/types/GlobalTypes";
import { create } from "zustand";

interface CompanyFilters {
  cnpj?: string;
  nome?: string;
  auctionNumber?: string;
  page?: number;
}

interface CompanyResponse {
  empresas: Company[];
  totalPages: number;
}

interface CompanyStore {
  companies: Company[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  filters: CompanyFilters;
  fetchCompanies: (filters?: CompanyFilters) => Promise<void>;
  clearCompanies: () => void;
  setFilters: (filters: CompanyFilters) => void;
  setPage: (page: number) => void;
}

const useCompanyStore = create<CompanyStore>((set, get) => ({
  companies: [],
  totalPages: 1,
  loading: false,
  error: null,
  currentPage: 1,
  filters: {},

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    }));
    // Chama fetchCompanies automaticamente quando os filtros são atualizados
    get().fetchCompanies({ ...get().filters, ...newFilters });
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchCompanies({ ...get().filters, page });
  },

  fetchCompanies: async (filters?: CompanyFilters) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      const currentFilters = filters || get().filters;

      // Adiciona os filtros à query string apenas se tiverem valor
      if (currentFilters.cnpj?.trim())
        queryParams.append("cnpj", currentFilters.cnpj.trim());
      if (currentFilters.nome?.trim())
        queryParams.append("nome", currentFilters.nome.trim());
      if (currentFilters.auctionNumber?.trim())
        queryParams.append(
          "auctionNumber",
          currentFilters.auctionNumber.trim()
        );
      if (currentFilters.page)
        queryParams.append("page", currentFilters.page.toString());

      const response = await fetch(`/api/consultar/empresa/get?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar empresas");
      }

      const data: CompanyResponse = await response.json();

      // Verifica se os dados retornados são válidos
      if (!data.empresas || !Array.isArray(data.empresas)) {
        throw new Error("Formato de dados inválido");
      }

      set({
        companies: data.empresas,
        totalPages: data.totalPages,
        loading: false,
        filters: currentFilters,
      });
    } catch (error) {
      console.error("Erro durante o fetch:", error);

      set({
        error:
          error instanceof Error ? error.message : "Erro ao buscar empresas",
        loading: false,
        companies: [],
        totalPages: 1,
      });
    }
  },

  clearCompanies: () => {
    set({
      companies: [],
      totalPages: 1,
      currentPage: 1,
      filters: {},
      error: null,
    });
    // Recarrega os dados após limpar
    get().fetchCompanies();
  },
}));

export default useCompanyStore;
