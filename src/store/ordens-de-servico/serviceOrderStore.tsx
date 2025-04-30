import { OrderService } from "@/types/GlobalTypes";
import { create } from "zustand";

// Definir o tipo da store
interface ServiceOrderStore {
  serviceOrders: OrderService[];
  loading: boolean;
  error: string | null;
  fetchServiceOrders: () => Promise<void>;
}

// Criar a store
const useServiceOrderStore = create<ServiceOrderStore>((set) => ({
  serviceOrders: [],
  loading: false,
  error: null,

  fetchServiceOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/consultar/ordem-de-servico/get");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar ordens de serviço");
      }

      const data = await response.json();

      // Verifica se os dados retornados são válidos
      if (!data.orders || !Array.isArray(data.orders)) {
        throw new Error("Formato de dados inválido");
      }

      set({
        serviceOrders: data.orders,
        loading: false,
      });
    } catch (error) {
      console.error("Erro durante o fetch:", error);

      set({
        error:
          error instanceof Error
            ? error.message
            : "Erro ao buscar ordens de serviço",
        loading: false,
        serviceOrders: [],
      });
    }
  },
}));

export default useServiceOrderStore;
