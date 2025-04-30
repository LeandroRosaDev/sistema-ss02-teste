import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        nip: { label: "NIP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.nip || !credentials?.password) {
          throw new Error("Por favor, insira o seu NIP e senha.");
        }

        try {
          const response = await fetch(
            process.env.NEXT_PUBLIC_API_AUTH_URL || "",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
              },
              body: JSON.stringify({
                nip: credentials.nip,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Credenciais inválidas");
          }

          const data = await response.json();

          return {
            id: data.nip,
            email: data.nip,
            name: data.name,
            image: data.image,
          };
        } catch (error) {
          console.error("Erro na autenticação:", error);
          throw new Error("Erro ao autenticar. Tente novamente.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.userId as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
