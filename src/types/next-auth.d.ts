// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
  }

  interface Session {
    user: User & {
      userId: string;
      image?: string;
    };
  }

  interface JWT {
    role: string;
    empresaId: number;
    userId: number;
  }
}
