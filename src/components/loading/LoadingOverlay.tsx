"use client";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingOverlayProps {
  /**
   * Define se o loading está ativo ou não. Quando `true`, o overlay será exibido.
   */
  isOpen: boolean;

  /**
   * Mensagem que será exibida abaixo do spinner
   */
  message?: string;

  className?: string;
}

/**
 * Componente de Loading que cria um overlay transparente por cima de todo o conteúdo,
 * exibindo um spinner e uma mensagem.
 */
export function LoadingOverlay({
  isOpen,
  message,
  className = "",
}: LoadingOverlayProps) {
  if (!isOpen) return null; // Se não estiver ativo, não renderiza nada

  return (
    <div
      className={`fixed top-0 left-0 z-50
        w-full h-full
        flex items-center justify-center
        bg-black bg-opacity-50
        p-4 ${className}`}
    >
      {/* Conteúdo do Spinner e da Mensagem */}
      <div className="flex flex-col items-center">
        {/* Ícone de loading */}
        <Loader2 className="h-10 w-10 animate-spin text-white" />

        {/* Mensagem opcional */}
        {message && (
          <p className="mt-3 text-white text-sm text-center max-w-xs">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
