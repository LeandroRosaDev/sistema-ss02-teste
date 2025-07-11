// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  /**
   * 1) Se não existir token => permitir apenas:
   *    - /login
   *    - /erro-acesso
   *    - /api/auth
   *    Caso contrário => redireciona para /login
   */
  if (!token) {
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/erro-acesso") ||
      pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /**
   * 2) Se existe token e a rota é /login, redirecione para /
   */
  if (pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  /**
   * 3) Se existe token válido, permitir acesso a todas as rotas protegidas
   */
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
