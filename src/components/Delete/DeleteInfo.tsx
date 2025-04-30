"use client";

import { useToast } from "@/hooks/use-toast";

interface DeleteInfoProps {
  endpoint: string;
  id: number;
  itemName?: string;
  onSuccess?: () => void;
}

export function useDeleteInfo() {
  const { toast } = useToast();

  const deleteInfo = async ({
    endpoint,
    id,
    itemName = "Item",
    onSuccess,
  }: DeleteInfoProps) => {
    try {
      const res = await fetch(`${endpoint}?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Sucesso",
          description: `${itemName} excluído(a) com sucesso`,
        });

        if (onSuccess) {
          onSuccess();
        }

        return true;
      } else {
        toast({
          title: "Erro",
          description:
            data.error || `Erro ao excluir ${itemName.toLowerCase()}`,
          variant: "destructive",
        });
        return false;
      }
    } catch {
      toast({
        title: "Erro",
        description: `Erro ao excluir ${itemName.toLowerCase()}`,
        variant: "destructive",
      });
      return false;
    }
  };

  return { deleteInfo };
}
