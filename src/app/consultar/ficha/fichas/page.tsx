"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import LoadingCard from "@/components/loading/LoadingCard";
import { DataTable, Column } from "@/components/ui/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Search, FileDown, RefreshCw } from "lucide-react";
import ImageDialog from "@/components/ui/modal/ImageDialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Função para extrair o nome do OCR
function extractNameFromOCR(ocr: string): string {
  try {
    const pattern = /Nome[\s.:]*([^.]*?)(?=Data|Idade|Natural)/i;
    const match = ocr.match(pattern);
    if (match && match[1]) {
      const name = match[1]
        .replace(/[\n\r]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
      return name || "Nome não encontrado";
    }
    return "Nome não encontrado";
  } catch (error) {
    console.error("Erro ao extrair nome do OCR:", error);
    return "Erro na extração";
  }
}

// Função para extrair o registro do OCR
function extractRegistroFromOCR(ocr: string): string {
  try {
    const pattern = /Registro[\s.:]*([0-9.-]+)/i;
    const match = ocr.match(pattern);
    if (match && match[1]) {
      const registro = match[1].replace(/[^0-9-]/g, "").trim();
      return registro || "Registro não encontrado";
    }

    const alternativePattern = /Registr[o0][\s.:]*([0-9][0-9.'_-]+)/i;
    const altMatch = ocr.match(alternativePattern);
    if (altMatch && altMatch[1]) {
      const registro = altMatch[1].replace(/[^0-9-]/g, "").trim();
      return registro || "Registro não encontrado";
    }

    return "Registro não encontrado";
  } catch (error) {
    console.error("Erro ao extrair registro do OCR:", error);
    return "Erro na extração";
  }
}

interface Ficha {
  id_ficha: number;
  registro: string;
  nome: string;
  ocr_ficha: string;
  ocr_name?: string;
  ocr_registro?: string;
  status?: boolean | null;
  created_at: Date;
  updated_at: Date;
}

interface ImagemFicha {
  imagem_frente_ficha: number[] | null;
  imagem_verso_ficha: number[] | null;
}

export default function FichasPage() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [searchOcr, setSearchOcr] = useState("");
  const [searchNome, setSearchNome] = useState("");
  const [searchRegistro, setSearchRegistro] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const debouncedOcr = useDebounce(searchOcr, 500);
  const debouncedNome = useDebounce(searchNome, 500);
  const debouncedRegistro = useDebounce(searchRegistro, 500);

  const fetchFichas = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(debouncedOcr && { ocr: debouncedOcr }),
        ...(debouncedNome && { nome: debouncedNome }),
        ...(debouncedRegistro && { registro: debouncedRegistro }),
      });

      const response = await fetch(`/api/fichas/get?${queryParams}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar fichas");
      }

      const data = await response.json();

      const processedFichas = data.fichas.map((ficha: Ficha) => ({
        ...ficha,
        ocr_name: extractNameFromOCR(ficha.ocr_ficha),
        ocr_registro: extractRegistroFromOCR(ficha.ocr_ficha),
      }));

      setFichas(processedFichas);
      setTotalPages(data.totalPages);
      setTotalResults(data.total || processedFichas.length);
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as fichas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (showRefresh) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFichas();
  }, [currentPage, debouncedOcr, debouncedNome, debouncedRegistro]);

  const loadFichaImages = useCallback(
    async (id: number, tipo: "frente" | "verso") => {
      try {
        setLoadingImage(id);
        const response = await fetch(`/api/fichas/${id}/imagens`);

        if (!response.ok) {
          throw new Error("Erro ao carregar imagens");
        }

        const data: ImagemFicha = await response.json();

        const imageArray =
          tipo === "frente"
            ? data.imagem_frente_ficha
            : data.imagem_verso_ficha;
        if (!imageArray) {
          throw new Error("Imagem não encontrada");
        }

        const blob = new Blob([new Uint8Array(imageArray)], {
          type: "image/jpeg",
        });
        const imageUrl = URL.createObjectURL(blob);

        setSelectedImage(imageUrl);
        setIsDialogOpen(true);
      } catch (error) {
        console.error("Erro ao carregar imagem:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a imagem.",
          variant: "destructive",
        });
      } finally {
        setLoadingImage(null);
      }
    },
    [toast]
  );

  const handleRefresh = () => {
    fetchFichas(true);
  };

  if (loading) {
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
            <Button onClick={handleRefresh}>Tentar novamente</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const columns: Column<Ficha>[] = [
    {
      header: "Nome",
      accessor: (item) => <div className="font-medium">{item.nome || "—"}</div>,
    },
    {
      header: "Registro",
      accessor: (item) => (
        <Badge variant="outline" className="font-mono">
          {item.registro || "—"}
        </Badge>
      ),
    },
    {
      header: "Nome OCR",
      accessor: (item) => (
        <div
          className="text-sm text-gray-600 max-w-xs truncate"
          title={item.ocr_name}
        >
          {item.ocr_name}
        </div>
      ),
    },
    {
      header: "Registro OCR",
      accessor: (item) => (
        <div className="text-sm font-mono text-gray-600">
          {item.ocr_registro}
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
            className="rounded-full h-8 w-8 p-0"
            disabled={loadingImage === item.id_ficha}
          >
            {loadingImage === item.id_ficha ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
    {
      header: "Imagem Verso",
      accessor: (item) => (
        <div className="flex justify-center">
          <Button
            onClick={() => loadFichaImages(item.id_ficha, "verso")}
            variant="ghost"
            size="sm"
            className="rounded-full h-8 w-8 p-0"
            disabled={loadingImage === item.id_ficha}
          >
            {loadingImage === item.id_ficha ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-md border-0">
        <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Consulta de Fichas
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-white hover:bg-white/20"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filtros */}
          <div className="bg-slate-50 p-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center mb-3">
              <Search className="h-5 w-5 text-slate-400 mr-2" />
              <h3 className="text-sm font-medium text-slate-600">
                Filtros de Busca
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  placeholder="Buscar por Nome..."
                  value={searchNome}
                  onChange={(e) => setSearchNome(e.target.value)}
                  className="w-full bg-white pl-8 focus-visible:ring-sky-500"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <div className="relative">
                <Input
                  placeholder="Buscar por Registro..."
                  value={searchRegistro}
                  onChange={(e) => setSearchRegistro(e.target.value)}
                  className="w-full bg-white pl-8 focus-visible:ring-sky-500"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <div className="relative">
                <Input
                  placeholder="Buscar por OCR..."
                  value={searchOcr}
                  onChange={(e) => setSearchOcr(e.target.value)}
                  className="w-full bg-white pl-8 focus-visible:ring-sky-500"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Resumo dos resultados */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-slate-600">
              Mostrando <span className="font-medium">{fichas.length}</span>{" "}
              resultados
              {totalResults > 0 && (
                <>
                  {" "}
                  de <span className="font-medium">{totalResults}</span> no
                  total
                </>
              )}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <FileDown className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          {/* Tabela */}
          <div className="rounded-lg overflow-hidden border border-slate-200 [&_th]:bg-slate-50 [&_th]:text-slate-700 [&_tr:hover]:bg-slate-50/80">
            <DataTable<Ficha>
              data={fichas}
              columns={columns}
              isLoading={loading}
            />
          </div>

          {/* Paginação */}
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="gap-1"
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
              <span className="text-sm text-gray-600">
                Página <span className="font-medium">{currentPage}</span> de{" "}
                <span className="font-medium">{totalPages}</span>
              </span>
            </div>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="gap-1"
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
          if (selectedImage) {
            URL.revokeObjectURL(selectedImage);
            setSelectedImage(null);
          }
        }}
        imageSrc={selectedImage}
      />
    </div>
  );
}
