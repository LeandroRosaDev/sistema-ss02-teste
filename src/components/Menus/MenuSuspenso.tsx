"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import InfoUser from "@/components/Menus/infoUser";

export default function MenuSuspenso() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("pt-BR");
      setCurrentTime(formattedTime);
    };

    // Atualiza a cada segundo
    const timer = setInterval(updateTime, 1000);

    // Chama a função imediatamente para não esperar 1 segundo para mostrar o tempo correto
    updateTime();

    return () => clearInterval(timer);
  }, []);

  const hideMenu =
    pathname === "/login" ||
    pathname === "/esqueci-senha" ||
    pathname === "/erro-acesso";

  const getPageTitle = () => {
    // Página inicial e perfil
    if (pathname === "/") return "Painel";

    if (pathname === "/cadastrar") return "Cadastrar Fichas";
    // Consultas

    if (pathname === "/consultar/ficha/fichas") return "Consultar Fichas";
    return "Painel";
  };

  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="fixed top-0 right-0 z-40 bg-white border-b border-gray-200 dark:border-gray-700 md:left-64">
      {!hideMenu && (
        <div className="flex justify-between items-center px-4 py-2 p761rint:hidden">
          <div>
            <h1 className="text-gray-700 font-bold md:text-3xl dark:text-white">
              {getPageTitle()}
            </h1>
            <span className="flex gap-1 text-gray-600 font-bold text-xs dark:text-white">
              {formattedDate}{" "}
              {currentTime && (
                <span className="hidden md:block text-gray-600 font-bold text-xs dark:text-white">
                  {currentTime}
                </span>
              )}
            </span>
          </div>
          <InfoUser />
        </div>
      )}
    </div>
  );
}
