// next.config.mjs
import nextPwa from "next-pwa";

// Crie a instância do plugin configurando apenas as opções do PWA
const withPWA = nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Se quiser customizar cache, etc., aqui é o local
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dihthobrv/image/upload/**",
      },
    ],
  },
  future: { webpack5: true },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  // Qualquer outra config do Next.js que você precise (redirects, etc.)
};

// Exportamos a junção do config do Next com as opções do plugin PWA
export default withPWA(nextConfig);
