"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import LoadingCard from "@/components/loading/LoadingCard";
import { DataTable, Column } from "@/components/ui/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Eye, Search, XCircle } from "lucide-react";
import ImageDialog from "@/components/ui/modal/ImageDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Ficha {
  id_ficha: number;
  registro: string;
  nome: string;
  ocr_ficha: string;
  status?: boolean | null;
  created_at: Date;
  updated_at: Date;
}

// Função para formatar nome com iniciais maiúsculas
const formatName = (name: string): string => {
  if (!name) return "—";

  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function FichasPage() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Campos de formulário para filtros
  const [searchOcr, setSearchOcr] = useState("");
  const [searchNome, setSearchNome] = useState("");
  const [searchRegistro, setSearchRegistro] = useState("");

  // Valores aplicados para a busca
  const [appliedFilters, setAppliedFilters] = useState({
    ocr: "",
    nome: "",
    registro: "",
  });

  const [totalResults, setTotalResults] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const fetchFichas = async () => {
    try {
      setIsSearching(true);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(appliedFilters.ocr && { ocr: appliedFilters.ocr }),
        ...(appliedFilters.nome && { nome: appliedFilters.nome }),
        ...(appliedFilters.registro && { registro: appliedFilters.registro }),
      });

      const response = await fetch(`/api/fichas/get?${queryParams}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar fichas");
      }

      const data = await response.json();
      setFichas(data.fichas);
      setTotalPages(data.totalPages);
      setTotalResults(data.total || data.fichas.length);
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as fichas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Acionar a busca quando a página mudar ou quando os filtros aplicados mudarem
  useEffect(() => {
    fetchFichas();
  }, [currentPage, appliedFilters]);

  // Função para aplicar os filtros ao clicar no botão de pesquisa
  const handleSearch = () => {
    setCurrentPage(1); // Voltar para a primeira página ao realizar uma nova busca
    setAppliedFilters({
      ocr: searchOcr,
      nome: searchNome,
      registro: searchRegistro,
    });
  };

  // Função para limpar os filtros
  const clearFilters = () => {
    setSearchOcr("");
    setSearchNome("");
    setSearchRegistro("");
    setAppliedFilters({
      ocr: "",
      nome: "",
      registro: "",
    });
  };

  const loadFichaImages = async (id: number, tipo: "frente" | "verso") => {
    try {
      const response = await fetch(`/api/fichas/${id}/imagens`);

      if (!response.ok) {
        throw new Error("Erro ao carregar imagens");
      }

      const data = await response.json();

      // Verificar se temos a URL para o tipo solicitado
      if (tipo === "frente" && !data.frente) {
        throw new Error("Imagem de frente não encontrada");
      }

      if (tipo === "verso" && !data.verso) {
        throw new Error("Imagem de verso não encontrada");
      }

      // Obter a URL pré-assinada
      const imageUrl = tipo === "frente" ? data.frente.url : data.verso.url;

      setSelectedImage(imageUrl);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a imagem.",
        variant: "destructive",
      });
    }
  };

  if (loading && !isSearching) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <Card className="mx-auto mt-8">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 9v4"></path>
                <path d="M12 16h.01"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Ocorreu um erro</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchFichas}>Tentar novamente</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const columns: Column<Ficha>[] = [
    {
      header: "Nome",
      accessor: (item) => (
        <div className="font-medium text-blue-800">{formatName(item.nome)}</div>
      ),
    },
    {
      header: "Registro",
      accessor: (item) => (
        <Badge
          variant="outline"
          className="font-mono bg-blue-50 text-blue-700 border-blue-200"
        >
          {item.registro || "—"}
        </Badge>
      ),
    },
    {
      header: "OCR",
      accessor: (item) => (
        <div
          className="text-sm text-gray-600 max-w-xs truncate"
          title={item.ocr_ficha}
        >
          {item.ocr_ficha ? item.ocr_ficha.substring(0, 50) + "..." : "—"}
        </div>
      ),
    },
    {
      header: "Imagem Frente",
      accessor: (item) => (
        <div className="flex justify-center">
          <Button
            onClick={() => loadFichaImages(item.id_ficha, "frente")}
            variant="ghost"
            size="sm"
            className="rounded-full h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-center",
    },
    {
      header: "Imagem Verso",
      accessor: (item) => (
        <div className="flex justify-center">
          <Button
            onClick={() => loadFichaImages(item.id_ficha, "verso")}
            variant="ghost"
            size="sm"
            className="rounded-full h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <div className="container-info-page">
      <Card className="shadow-md border-0">
        <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold">
            Consulta de Fichas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filtros */}
          <div className="bg-blue-50 p-5 rounded-lg mb-6 shadow-sm border border-blue-100">
            <div className="flex items-center mb-3">
              <Search className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-sm font-medium text-blue-800">
                Filtros de Busca
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Input
                  placeholder="Buscar por Nome..."
                  value={searchNome}
                  onChange={(e) => setSearchNome(e.target.value)}
                  className="w-full bg-white pl-8 focus-visible:ring-blue-500 border-blue-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
                {searchNome && (
                  <button
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchNome("")}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  placeholder="Buscar por Registro..."
                  value={searchRegistro}
                  onChange={(e) => setSearchRegistro(e.target.value)}
                  className="w-full bg-white pl-8 focus-visible:ring-blue-500 border-blue-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
                {searchRegistro && (
                  <button
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchRegistro("")}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  placeholder="Buscar por OCR..."
                  value={searchOcr}
                  onChange={(e) => setSearchOcr(e.target.value)}
                  className="w-full bg-white pl-8 focus-visible:ring-blue-500 border-blue-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
                {searchOcr && (
                  <button
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchOcr("")}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={
                  isSearching || (!searchNome && !searchRegistro && !searchOcr)
                }
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Limpar
              </Button>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSearching ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Pesquisando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Pesquisar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Resumo dos resultados */}
          <div className="text-sm text-blue-700 mb-4 bg-blue-50 p-2 rounded-md inline-block">
            Mostrando <span className="font-medium">{fichas.length}</span>{" "}
            resultados
            {totalResults > 0 && (
              <>
                {" "}
                de <span className="font-medium">{totalResults}</span> no total
              </>
            )}
          </div>

          {/* Tabela */}
          <div className="rounded-lg overflow-hidden border border-blue-200 [&_th]:bg-blue-50 [&_th]:text-blue-800 [&_tr:hover]:bg-blue-50/80">
            <DataTable<Ficha>
              data={fichas}
              columns={columns}
              isLoading={isSearching}
            />
          </div>

          {/* Paginação */}
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isSearching}
              variant="outline"
              size="sm"
              className="gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Anterior
            </Button>
            <div className="flex items-center">
              <span className="text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-md">
                Página <span className="font-medium">{currentPage}</span> de{" "}
                <span className="font-medium">{totalPages}</span>
              </span>
            </div>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || isSearching}
              variant="outline"
              size="sm"
              className="gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Próxima
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal para exibir a imagem */}
      <ImageDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedImage(null);
        }}
        imageSrc={selectedImage}
      />
    </div>
  );
}
