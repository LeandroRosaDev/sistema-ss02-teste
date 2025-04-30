"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Menus/app-sidebar";
import { useSession, SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation"; // Importa usePathname para verificar a rota atual

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionContent>{children}</SessionContent>
    </SessionProvider>
  );
}

function SessionContent({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname(); // Obtem a rota atual

  const hideSidebar =
    pathname === "/login" ||
    pathname === "/esqueci-senha" ||
    pathname === "/erro-acesso";

  return (
    <div className="flex">
      {!hideSidebar && (
        <>
          <SidebarProvider className="w-auto print:hidden hidden md:block z-50">
            <AppSidebar userRole={session?.user?.role} />
            <SidebarTrigger className="mt-4 print:hidden hidden md:block" />
          </SidebarProvider>
        </>
      )}
      <main className="w-full pt-20">{children}</main>
    </div>
  );
}
