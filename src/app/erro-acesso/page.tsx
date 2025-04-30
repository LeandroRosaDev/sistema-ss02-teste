// src/app/erro-acesso/page.tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErroAcessoPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-3">
      <Alert className="max-w-lg">
        <AlertTitle>Acesso Negado</AlertTitle>
        <AlertDescription>
          Você não tem permissão para acessar esta página. Contate o
          administrador para mais detalhes. Erro
        </AlertDescription>
      </Alert>
      <Link href="/">
        {" "}
        <Button>Voltar para a página de início</Button>{" "}
      </Link>
    </div>
  );
}
