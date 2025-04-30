"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface RequestHandlerProps {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error | unknown) => void;
  redirectOnSuccess?: string;
  resetFormOnSuccess?: boolean;
  resetForm?: () => void;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function useRequestHandler({
  endpoint,
  method = "POST",
  onSuccess,
  onError,
  redirectOnSuccess,
  resetFormOnSuccess = false,
  resetForm,
  loadingMessage = "Processando...",
  successMessage = "Operação realizada com sucesso!",
  errorMessage = "Erro ao processar a solicitação.",
}: RequestHandlerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | null>(loadingMessage);

  const handleRequest = async (data: unknown) => {
    setLoading(true);
    setLoadingText(loadingMessage);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || errorMessage);
      }

      // Exibir mensagem de sucesso
      toast({
        title: "Sucesso",
        description: successMessage,
        variant: "default",
      });

      // Executar callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess(responseData);
      }

      // Resetar formulário se necessário
      if (resetFormOnSuccess && resetForm) {
        resetForm();
      }

      // Redirecionar se necessário
      if (redirectOnSuccess) {
        router.push(redirectOnSuccess);
      }

      return responseData;
    } catch (error) {
      // Exibir mensagem de erro
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : errorMessage,
        variant: "destructive",
      });

      // Executar callback de erro se fornecido
      if (onError) {
        onError(error);
      }

      console.error("Erro na requisição:", error);
      return null;
    } finally {
      setLoading(false);
      setLoadingText(null);
    }
  };

  return {
    handleRequest,
    loading,
    loadingText,
    setLoadingText,
  };
}
