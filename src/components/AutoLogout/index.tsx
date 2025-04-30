"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const AUTO_LOGOUT_TIME = 8 * 60 * 60 * 1000; // 8 horas em milissegundos
const WARNING_TIME = 5 * 60 * 1000; // 5 minutos antes do logout

export function AutoLogout() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const pathname = usePathname();
  const logoutTimeout = useRef<NodeJS.Timeout>();
  const warningTimeout = useRef<NodeJS.Timeout>();

  const resetTimers = () => {
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);

    // Configura o aviso
    warningTimeout.current = setTimeout(() => {
      toast({
        title: "Aviso de Sessão",
        description:
          "Sua sessão irá expirar em 5 minutos. Faça logout e login novamente para continuar.",
        duration: 10000, // 10 segundos
        variant: "default",
      });
    }, AUTO_LOGOUT_TIME - WARNING_TIME);

    // Configura o logout
    logoutTimeout.current = setTimeout(() => {
      toast({
        title: "Sessão Expirada",
        description: "Sua sessão expirou. Por favor, faça login novamente.",
        duration: 5000,
        variant: "destructive",
      });
      signOut({ callbackUrl: "/login" });
    }, AUTO_LOGOUT_TIME);
  };

  useEffect(() => {
    // Não inicia os timers se estiver na página de login ou não houver sessão
    if (
      !session ||
      pathname === "/login" ||
      pathname === "/esqueci-senha" ||
      pathname === "/erro-acesso"
    ) {
      return;
    }

    // Eventos para resetar o timer
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    // Reseta os timers na primeira montagem
    resetTimers();

    // Adiciona listeners para cada evento
    const resetTimersOnActivity = () => resetTimers();
    events.forEach((event) => {
      window.addEventListener(event, resetTimersOnActivity);
    });

    // Cleanup
    return () => {
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
      if (warningTimeout.current) clearTimeout(warningTimeout.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimersOnActivity);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, pathname]);

  return null;
}
