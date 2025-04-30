"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GetRequestHandlerProps<T> {
  endpoint: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error | unknown) => void;
  loadingMessage?: string;
  errorMessage?: string;
}

export function useGetRequestHandler<T>({
  endpoint,
  onSuccess,
  onError,
  errorMessage = "Erro ao buscar dados.",
}: GetRequestHandlerProps<T>) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleRequest = async (
    queryParams?: string | Record<string, unknown>
  ) => {
    setLoading(true);

    try {
      let url = endpoint;

      if (typeof queryParams === "string") {
        url = `${endpoint}${queryParams}`;
      } else if (queryParams && typeof queryParams === "object") {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        url = `${endpoint}?${params.toString()}`;
      }

      console.log("URL da requisição:", url); // Debug

      const response = await fetch(url, { method: "GET" });
      const data = (await response.json()) as T;

      if (!response.ok) {
        throw new Error((data as string) || errorMessage);
      }

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (error) {
      if (onError) {
        onError(error);
      }

      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : errorMessage,
        variant: "destructive",
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRequest,
    loading,
  };
}
