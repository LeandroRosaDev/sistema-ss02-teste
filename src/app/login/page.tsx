"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import logotipo from "@/logotipo-ss02.png";

const nips = [
  "87354675",
  "08031428",
  "06033911",
  "99204614",
  "13131419",
  "13129252",
  "24402923",
  "99195216",
  "16017510",
];

export default function LoginPage() {
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Extrai apenas os números do NIP
    const numerosNip = nip.replace(/\D/g, "");

    // Verifica se o número está na lista de permitidos
    if (!nips.includes(numerosNip)) {
      setIsLoading(false);
      toast({
        title: "Acesso Negado",
        description: "Seu NIP não está autorizado a acessar o sistema.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        nip: numerosNip,
        password,
      });

      if (res?.error) {
        toast({
          title: "Erro no Login",
          description: res.error,
          variant: "destructive",
        });
      } else {
        window.location.href = "/";
      }
    } catch {
      toast({
        title: "Erro no Login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br -mt-20">
      {/* Coluna da esquerda */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={logotipo}
              alt="SS-02"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold  mb-2">SS-02</h1>
          <p className="text-xl ">Sistema SIM-02</p>
        </div>
      </div>

      {/* Coluna da direita */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold  mb-8 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm  mb-2">NIP</label>
              <Input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Digite seu NIP"
                required
                maxLength={10}
                className="bg-white/10 border-slate-600  placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm  mb-2">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="bg-white/10 border-slate-600  placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
