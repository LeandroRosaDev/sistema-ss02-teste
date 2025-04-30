import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import fs from "fs";
import path from "path";
import { User } from "next-auth";

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

          // Se recebemos uma imagem da API
          if (data.image) {
            try {
              // Verifica se a imagem já contém o prefixo data:image
              const base64Data = data.image.startsWith("data:image")
                ? data.image.split(",")[1]
                : data.image;

              // Converte a string base64 para buffer
              const imageBuffer = Buffer.from(base64Data, "base64");

              // Cria o diretório de imagens de usuário se não existir
              const userImagesDir = path.join(
                process.cwd(),
                "public",
                "user-images"
              );
              if (!fs.existsSync(userImagesDir)) {
                fs.mkdirSync(userImagesDir, { recursive: true });
              }

              // Define o caminho do arquivo com base no NIP do usuário
              const imagePath = path.join(userImagesDir, `${data.nip}.jpg`);

              // Salva o buffer como arquivo
              fs.writeFileSync(imagePath, imageBuffer);

              // Define o caminho relativo da imagem para ser usado pelo cliente
              const imageUrl = `/user-images/${data.nip}.jpg`;

              const user: User = {
                id: data.nip,
                email: data.nip,
                name: data.name,
                image: imageUrl, // Agora armazenamos apenas o caminho da imagem
              };

              return user;
            } catch (imageError) {
              console.error("Erro ao processar imagem:", imageError);
              // Em caso de erro no processamento da imagem, prossegue sem a imagem
              const user: User = {
                id: data.nip,
                email: data.nip,
                name: data.name,
                image: "", // Use string vazia em vez de null
              };
              return user;
            }
          } else {
            const user: User = {
              id: data.nip,
              email: data.nip,
              name: data.name,
              image: "", // Use string vazia em vez de null
            };
            return user;
          }
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
