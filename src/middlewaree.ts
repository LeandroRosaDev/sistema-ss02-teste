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
   * 3) Se existe token, checar o role do usuário
   * 1 = SUPERADMIN, 2 = ADMIN, 3 = MODERATOR, 4 = USER
   */
  const role = Number(token.role);

  switch (role) {
    case 4: // USER
      if (
        pathname === "/" ||
        pathname.startsWith("/perfil") ||
        pathname.startsWith("/erro-acesso") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/consultar/") // Permite apenas consultas
      ) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/erro-acesso", req.url));

    case 3: // MODERATOR
      if (
        pathname.startsWith("/cadastrar/") ||
        pathname.startsWith("/consultar/") ||
        pathname === "/" ||
        pathname.startsWith("/perfil") ||
        pathname.startsWith("/api")
      ) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/erro-acesso", req.url));

    case 2: // ADMIN
    case 1: // SUPERADMIN
      return NextResponse.next();

    default:
      return NextResponse.redirect(new URL("/erro-acesso", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
