import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Removemos a importação da imagem de fallback e usaremos uma URL absoluta
import { LoadingOverlay } from "../loading/LoadingOverlay";

export default function InfoUser() {
  const { data: session, status } = useSession();
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    // Verifica se tem imagem na sessão
    if (session?.user?.image) {
      // Se a imagem na sessão já for um caminho para a pasta pública
      setUserImage(session.user.image);
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
          <Image
            src={userImage}
            alt="Foto de Perfil"
            fill
            className="rounded-full object-cover border border-orange-700"
          />
        ) : (
          <div className="bg-gray-300 rounded-full border border-orange-700 w-full h-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-xl">
              {session?.user?.name
                ? session.user.name.charAt(0).toUpperCase()
                : "U"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
