"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: number[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const userRole = Number(session.user?.role) || 0;
    if (!allowedRoles.includes(userRole)) {
      router.push("/erro-acesso");
    }
  }, [session, status, router, allowedRoles]);

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  return <>{children}</>;
}
