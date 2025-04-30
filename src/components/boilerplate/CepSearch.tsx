"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CepSearchProps {
  onAddressFound: (address: {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
  }) => void;
  label?: string;
  isRequired?: boolean;
  helpText?: string;
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export function CepSearch({
  onAddressFound,
  label = "CEP",
  isRequired = false,
  helpText,
}: CepSearchProps) {
  const [cep, setCep] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para formatar o CEP enquanto o usuário digita
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos
    let value = e.target.value.replace(/\D/g, "");

    // Limita a 8 dígitos
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    // Formata como 00000-000 se tiver mais de 5 dígitos
    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }

    setCep(value);
    setError(null);
  };

  // Função para buscar o endereço pelo CEP
  const searchAddress = async () => {
    // Remove caracteres não numéricos para a busca
    const cepNumbers = cep.replace(/\D/g, "");

    // Validação básica
    if (cepNumbers.length !== 8) {
      setError("O CEP deve conter 8 dígitos");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepNumbers}/json/`
      );
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setError("CEP não encontrado");
        return;
      }

      // Chama a função de callback com os dados do endereço
      onAddressFound(data);

      console.log("Endereço encontrado:", data);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setError("Erro ao buscar o CEP. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  // Função para lidar com o evento de pressionar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchAddress();
    }
  };

  return (
    <FormItem>
      <FormLabel>
        {label} {isRequired && <span className="text-red-500">*</span>}
      </FormLabel>
      <div className="flex space-x-2">
        <FormControl>
          <Input
            type="text"
            placeholder="00000-000"
            value={cep}
            onChange={handleCepChange}
            onKeyDown={handleKeyDown}
            maxLength={9}
            className="w-full"
          />
        </FormControl>
        <Button
          type="button"
          variant="outline"
          onClick={searchAddress}
          disabled={isSearching}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}

      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
