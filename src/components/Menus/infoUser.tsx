import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Imagem fallback
import imgMasc from "@/profile-masc.webp";
import { LoadingOverlay } from "../loading/LoadingOverlay";

export default function InfoUser() {
  const { data: session, status } = useSession();
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    // Se temos uma imagem em base64 na sessão
    if (session?.user?.image) {
      // Verificar se já contém o prefixo data:image
      if (session.user.image.startsWith("data:image")) {
        setUserImage(session.user.image);
      } else {
        // Adicionar o prefixo data:image se não estiver presente
        setUserImage(`data:image/jpeg;base64,${session.user.image}`);
      }
    }
  }, [session]);

  // Lida com estado de carregamento
  if (status === "loading") {
    return (
      <LoadingOverlay
        className="bg-blue-700 bg-opacity-100"
        isOpen={true}
        message="Carregando Informações do usuário"
      />
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <div className="flex justify-end items-start flex-col">
        <h1 className="text-gray-600 font-bold md:text-xl dark:text-white">
          {session?.user?.name || "Usuário"}
        </h1>
        <h1 className="text-gray-600 font-bold text-xs dark:text-white">
          NIP: {session?.user?.userId || "--"}
        </h1>
      </div>

      <div className="w-12 h-12 relative">
        {userImage ? (
          <img
            src={userImage}
            alt="Foto de Perfil"
            className="rounded-full object-cover border border-orange-700 w-full h-full"
          />
        ) : (
          <Image
            src={imgMasc}
            alt="Foto de Perfil"
            fill
            className="rounded-full object-cover border border-orange-700"
          />
        )}
      </div>
    </div>
  );
}
