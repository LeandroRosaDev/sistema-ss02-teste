"use client";

import { useState, useRef, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Scissors,
  FileImage,
  Trash2,
  Upload,
  ImagePlus,
  Clock,
} from "lucide-react";
import "react-image-crop/dist/ReactCrop.css";
import { nanoid } from "nanoid";

interface UploadedImage {
  id: string;
  src: string;
  file: File;
  type: "digitais" | "informacoes";
}

interface ProcessedFicha {
  id: string;
  digitalImage: string;
  infoImage: string;
  ocrText?: string;
  nome?: string;
  registro?: string;
  isProcessing: boolean;
  isSaved?: boolean;
}

interface ProcessingStats {
  startTime: number;
  processedCount: number;
  totalCount: number;
  elapsedTime: number;
  estimatedTimeRemaining: number;
}

// Nova interface para o retorno da API de upload
interface MinioUploadResponse {
  success: boolean;
  bucketName: string;
  objectName: string;
  fileUrl: string;
  contentType: string;
  size: number;
  error?: string;
}

const FichaProcessor = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFichas, setProcessedFichas] = useState<ProcessedFicha[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [firstImageType, setFirstImageType] = useState<
    "digitais" | "informacoes"
  >("digitais");
  const [processingStats, setProcessingStats] =
    useState<ProcessingStats | null>(null);
  const [totalProcessingTime, setTotalProcessingTime] = useState<number>(0);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [processedImagesCount, setProcessedImagesCount] = useState(0);
  const [classPolEsq, setClassPolEsq] = useState<string>("");
  const [classPolDir, setClassPolDir] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Timer para atualizar o tempo decorrido
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isProcessing && processingStats) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsedTime = now - processingStats.startTime;
        const processedCount = processingStats.processedCount;
        const totalCount = processingStats.totalCount;

        // Calcular tempo estimado restante
        const timePerItem =
          processedCount > 0 ? elapsedTime / processedCount : 0;
        const remainingItems = totalCount - processedCount;
        const estimatedTimeRemaining = timePerItem * remainingItems;

        setProcessingStats((prev) =>
          prev
            ? {
                ...prev,
                elapsedTime,
                estimatedTimeRemaining,
              }
            : null
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, processingStats]);

  // Função auxiliar para formatar o tempo em minutos e segundos
  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const files = Array.from(event.target.files);

    // Processar cada arquivo
    const newImagesPromises = files.map((file, index) => {
      return new Promise<UploadedImage>((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
          // Determinar o tipo com base no índice e no tipo da primeira imagem
          // Se firstImageType é "digitais", então:
          // - Índices pares (0, 2, 4...) são "digitais"
          // - Índices ímpares (1, 3, 5...) são "informacoes"
          // Se firstImageType é "informacoes", então é o inverso
          const currentImagesCount = uploadedImages.length;
          const imageIndex = currentImagesCount + index;
          const isEven = imageIndex % 2 === 0;

          const type = isEven
            ? firstImageType
            : firstImageType === "digitais"
            ? "informacoes"
            : "digitais";

          resolve({
            id: `img-${Date.now()}-${index}`,
            src: reader.result as string,
            file,
            type,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagesPromises).then((newImages) => {
      setUploadedImages((prev) => [...prev, ...newImages]);
    });

    // Limpar o input de arquivo para permitir selecionar os mesmos arquivos novamente
    if (event.target.value) {
      event.target.value = "";
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAllImages = () => {
    setUploadedImages([]);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Função para dividir a imagem em 3 partes iguais verticalmente
  const divideImage = (imgSrc: string, canvas: HTMLCanvasElement) => {
    return new Promise<string[]>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Definir a dimensão do canvas para corresponder à imagem
        canvas.width = img.width;
        canvas.height = img.height;

        // Desenhar a imagem completa no canvas
        ctx.drawImage(img, 0, 0);

        // Calcular a altura de cada divisão (1/3 da altura total)
        const divisionHeight = Math.floor(img.height / 3);

        // Criar as 3 divisões
        const divisions: string[] = [];

        for (let i = 0; i < 3; i++) {
          // Criar um novo canvas para cada divisão
          const divCanvas = document.createElement("canvas");
          const divCtx = divCanvas.getContext("2d");
          if (!divCtx) continue;

          // Dimensões da divisão
          divCanvas.width = img.width;
          divCanvas.height = divisionHeight;

          // Copiar a parte da imagem para a divisão
          divCtx.drawImage(
            canvas,
            0,
            i * divisionHeight, // Origem no canvas original
            img.width,
            divisionHeight, // Tamanho no canvas original
            0,
            0, // Destino no novo canvas
            img.width,
            divisionHeight // Tamanho no novo canvas
          );

          // Converter para base64 e adicionar à lista de divisões
          divisions.push(divCanvas.toDataURL("image/jpeg"));
        }

        resolve(divisions);
      };
      img.src = imgSrc;
    });
  };

  // Processar todas as imagens e gerar fichas
  const processImages = async () => {
    if (uploadedImages.length < 2) {
      toast.error(
        "É necessário fazer upload de pelo menos 2 imagens (1 par de digitais/informações)"
      );
      return;
    }

    if (uploadedImages.length % 2 !== 0) {
      toast.error(
        "É necessário um número par de imagens (cada par de digitais/informações gera até 3 fichas)"
      );
      return;
    }

    setIsProcessingImages(true);
    const startTime = Date.now();
    try {
      // Criar canvas se não existir
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }

      // Agrupar as imagens em pares (digitais + informações)
      const newProcessedFichas: ProcessedFicha[] = [];
      setProcessedImagesCount(0);

      // Processar cada par de imagens
      for (let i = 0; i < uploadedImages.length; i += 2) {
        const imageA = uploadedImages[i];
        const imageB = uploadedImages[i + 1];

        if (!imageA || !imageB) {
          continue; // Pular se não tivermos um par completo
        }

        // Identificar qual é a imagem de digitais e qual é a de informações
        const digitalImage = imageA.type === "digitais" ? imageA : imageB;
        const infoImage = imageA.type === "informacoes" ? imageA : imageB;

        // Dividir cada imagem em 3 partes
        const digitalParts = await divideImage(
          digitalImage.src,
          canvasRef.current
        );
        const infoParts = await divideImage(infoImage.src, canvasRef.current);

        // Para cada parte, criar uma ficha
        for (
          let j = 0;
          j < Math.min(digitalParts.length, infoParts.length);
          j++
        ) {
          newProcessedFichas.push({
            id: `ficha-${i / 2}-${j}`,
            digitalImage: digitalParts[j],
            infoImage: infoParts[j],
            isProcessing: false,
          });
        }

        // Atualizar o progresso
        setProcessedImagesCount(i + 2);

        // Feedback de progresso para o usuário
        toast.success(
          `Processado par de imagens ${i / 2 + 1} de ${
            uploadedImages.length / 2
          }`
        );
      }

      setProcessedFichas(newProcessedFichas);
      setActiveTab("process");
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      setTotalProcessingTime(totalTime);
      toast.success(
        `Todas as imagens foram processadas! ${newProcessedFichas.length} fichas geradas.`
      );
    } catch (error) {
      console.error("Erro ao processar imagens:", error);
      toast.error("Erro ao processar imagens");
    } finally {
      setIsProcessingImages(false);
      setProcessedImagesCount(0);
    }
  };

  // Extrai texto de uma imagem usando OCR
  const extractText = async (index: number) => {
    if (!processedFichas[index]) return;

    try {
      const ficha = processedFichas[index];

      // Atualizar estado para mostrar que está processando
      setProcessedFichas((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], isProcessing: true };
        return updated;
      });

      // Iniciar o worker do Tesseract
      const worker = await createWorker("por", 1, {
        logger: (m) => console.log(m),
      });

      // Processar a imagem de informações
      const {
        data: { text },
      } = await worker.recognize(ficha.infoImage);

      // Extrair nome e registro usando regex
      const nomeRegex = /Nome[:\s]*([^\n]+)/i;
      const registroRegex = /Registro[:\s]*([^\n]+)/i;

      const nomeMatch = text.match(nomeRegex);
      const registroMatch = text.match(registroRegex);

      const nome = nomeMatch ? nomeMatch[1].trim() : undefined;
      const registro = registroMatch ? registroMatch[1].trim() : undefined;

      // Atualizar o estado das fichas processadas
      setProcessedFichas((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          ocrText: text,
          nome,
          registro,
          isProcessing: false,
        };
        return updated;
      });

      await worker.terminate();
      toast.success(`Ficha ${index + 1} processada com sucesso!`);
    } catch (error) {
      console.error(`Erro ao processar ficha ${index + 1}:`, error);
      toast.error(`Erro ao processar ficha ${index + 1}`);

      // Resetar o estado de processamento
      setProcessedFichas((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], isProcessing: false };
        return updated;
      });
    }
  };

  // Processar todas as fichas com OCR
  const processAllFichas = async () => {
    if (processedFichas.length === 0) {
      toast.error("Não há fichas para processar");
      return;
    }

    setIsProcessing(true);
    setProcessingStats({
      startTime: Date.now(),
      processedCount: 0,
      totalCount: processedFichas.length,
      elapsedTime: 0,
      estimatedTimeRemaining: 0,
    });

    try {
      const batchSize = 5;
      const totalBatches = Math.ceil(processedFichas.length / batchSize);

      for (let i = 0; i < processedFichas.length; i += batchSize) {
        const batch = processedFichas.slice(i, i + batchSize);
        const currentBatch = Math.floor(i / batchSize) + 1;

        // Processar o lote atual
        await Promise.all(
          batch.map(async (_, index) => {
            await extractText(i + index);

            // Atualizar o progresso após cada ficha individual
            setProcessingStats((prev) =>
              prev
                ? {
                    ...prev,
                    processedCount: Math.min(
                      prev.processedCount + 1,
                      processedFichas.length
                    ),
                  }
                : null
            );
          })
        );

        // Feedback do progresso do lote
        toast.success(
          `Processado lote ${currentBatch} de ${totalBatches} (${Math.min(
            i + batchSize,
            processedFichas.length
          )} fichas)`
        );
      }

      toast.success(
        `Processamento concluído! ${processedFichas.length} fichas processadas com OCR.`
      );
    } catch (error) {
      console.error("Erro ao processar fichas:", error);
      toast.error("Erro ao processar fichas");
    } finally {
      setIsProcessing(false);
      setProcessingStats(null);
    }
  };

  // Função para fazer upload de um arquivo para o Minio via API
  const uploadFileToMinio = async (
    file: File | Blob,
    objectName: string,
    bucketName: string = "fichas"
  ): Promise<MinioUploadResponse> => {
    try {
      // Criar um arquivo a partir do blob, se necessário
      const fileToUpload =
        file instanceof Blob && !(file instanceof File)
          ? new File([file], objectName, { type: "image/jpeg" })
          : file;

      // Preparar FormData para envio
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("bucketName", bucketName);
      formData.append("objectName", objectName);

      // Fazer a requisição para a API
      const response = await fetch("/api/minio/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao fazer upload");
      }

      // Retornar os dados de sucesso
      return await response.json();
    } catch (error) {
      console.error("Erro ao fazer upload para o Minio:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";

      throw new Error(`Falha no upload: ${errorMessage}`);
    }
  };

  // Função auxiliar para converter base64 para Blob
  const base64ToBlob = async (base64: string): Promise<Blob> => {
    try {
      // Remover o prefixo data:image/...;base64,
      const base64Data = base64.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: "image/jpeg" });
    } catch (error) {
      console.error("Erro ao converter base64 para Blob:", error);
      throw new Error("Falha ao converter imagem");
    }
  };

  // Salvar fichas no banco de dados
  const saveFichas = async () => {
    if (processedFichas.length === 0) {
      toast.error("Não há fichas para salvar");
      return;
    }

    setIsProcessing(true);

    try {
      let successCount = 0;
      let errorCount = 0;
      const errorDetails = [];

      for (const ficha of processedFichas) {
        if (ficha.isSaved) {
          console.log(`Ficha ${ficha.id} já foi salva anteriormente, pulando.`);
          successCount++;
          continue;
        }

        if (!ficha.nome || !ficha.registro) {
          toast.error(`Ficha ${ficha.id} não possui nome ou registro`);
          errorCount++;
          errorDetails.push({
            fichaId: ficha.id,
            error: "Nome ou registro faltando",
          });
          continue;
        }

        try {
          console.log(`Iniciando processamento da ficha ${ficha.id}`);

          // Converter as imagens base64 para Blob
          const digitalImageBlob = await base64ToBlob(ficha.digitalImage);
          const infoImageBlob = await base64ToBlob(ficha.infoImage);

          // Gerar nomes únicos para os arquivos
          const slugNome = ficha.nome
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9-]/g, "");
          const slugRegistro = ficha.registro
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9-]/g, "");
          const frenteNameFile = `${nanoid()}-frente-${slugNome}-${slugRegistro}.jpg`;
          const versoNameFile = `${nanoid()}-verso-${slugNome}-${slugRegistro}.jpg`;

          console.log(`Nomes dos arquivos gerados:`, {
            frenteNameFile,
            versoNameFile,
          });

          // Upload dos arquivos para o Minio através da API
          console.log("Iniciando upload das imagens para o Minio via API...");

          // Upload da imagem frente
          const frenteUploadResult = await uploadFileToMinio(
            infoImageBlob,
            frenteNameFile
          );
          console.log("Frente enviada com sucesso:", frenteUploadResult);

          // Upload da imagem verso
          const versoUploadResult = await uploadFileToMinio(
            digitalImageBlob,
            versoNameFile
          );
          console.log("Verso enviado com sucesso:", versoUploadResult);

          // Criar FormData com os dados para o backend
          const formData = new FormData();
          formData.append("nome", ficha.nome);
          formData.append("registro", ficha.registro);
          formData.append("ocr_ficha", ficha.ocrText || "");

          // Adicionar URLs das imagens
          formData.append("imagem_frente_ficha", frenteUploadResult.fileUrl);
          formData.append("imagem_verso_ficha", versoUploadResult.fileUrl);

          // Adicionar classificações dos polegares
          formData.append("class_polegar_esq", classPolEsq || "");
          formData.append("class_polegar_dir", classPolDir || "");

          // Adicionar informações do bucket para persistência
          formData.append("frente_bucket_name", frenteUploadResult.bucketName);
          formData.append("frente_object_name", frenteUploadResult.objectName);
          formData.append("verso_bucket_name", versoUploadResult.bucketName);
          formData.append("verso_object_name", versoUploadResult.objectName);

          console.log("Enviando dados para o backend...");

          // Enviar para o backend
          const response = await fetch("/api/fichas", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            console.error("Resposta de erro da API:", error);
            errorDetails.push({
              fichaId: ficha.id,
              error: error.message || "Erro ao salvar no banco de dados",
            });
            throw new Error(error.message || "Erro ao salvar ficha");
          }

          console.log(`Ficha ${ficha.id} salva com sucesso no banco de dados`);

          // Marcar a ficha como salva
          setProcessedFichas((prev) =>
            prev.map((item) =>
              item.id === ficha.id ? { ...item, isSaved: true } : item
            )
          );

          successCount++;
        } catch (error: Error | unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Erro desconhecido";

          console.error(`Erro ao salvar ficha ${ficha.id}:`, error);
          errorCount++;
          errorDetails.push({
            fichaId: ficha.id,
            error: errorMessage,
          });
        }
      }

      // Exibir informações detalhadas sobre erros no console
      if (errorDetails.length > 0) {
        console.error("Detalhes dos erros:", errorDetails);
      }

      if (successCount > 0) {
        toast.success(`${successCount} fichas salvas com sucesso!`);
      }

      if (errorCount > 0) {
        toast.error(
          `${errorCount} fichas não puderam ser salvas. Verifique o console para detalhes.`
        );
      }

      if (successCount === processedFichas.length) {
        setProcessedFichas([]);
        setUploadedImages([]);
        setActiveTab("upload");
      }
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";

      console.error("Erro ao salvar fichas:", error);
      toast.error(`Erro ao salvar fichas: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overlay de Loading para Processamento de OCR */}
      {isProcessing && processingStats && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Processando Fichas</h3>
                <p className="text-sm text-muted-foreground">
                  {processingStats.processedCount} de{" "}
                  {processingStats.totalCount} fichas processadas
                </p>
              </div>

              <div className="space-y-2">
                <Progress
                  value={
                    (processingStats.processedCount /
                      processingStats.totalCount) *
                    100
                  }
                  className="h-3"
                />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round(
                    (processingStats.processedCount /
                      processingStats.totalCount) *
                      100
                  )}
                  %
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="text-center space-y-1.5">
                  <p className="text-muted-foreground font-medium">
                    Tempo Decorrido
                  </p>
                  <div className="flex items-center justify-center bg-muted px-3 py-2 rounded-md">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    {formatTime(processingStats.elapsedTime)}
                  </div>
                </div>
                <div className="text-center space-y-1.5">
                  <p className="text-muted-foreground font-medium">
                    Tempo Restante
                  </p>
                  <div className="flex items-center justify-center bg-muted px-3 py-2 rounded-md">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    {formatTime(processingStats.estimatedTimeRemaining)}
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Aguarde enquanto processamos suas fichas. Não feche esta janela.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay de Loading para Processamento Inicial das Imagens */}
      {isProcessingImages && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Processando Imagens</h3>
                <p className="text-sm text-muted-foreground">
                  {processedImagesCount} de {uploadedImages.length} imagens
                  processadas
                </p>
              </div>

              <div className="space-y-2">
                <Progress
                  value={(processedImagesCount / uploadedImages.length) * 100}
                  className="h-3"
                />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round(
                    (processedImagesCount / uploadedImages.length) * 100
                  )}
                  %
                </p>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Aguarde enquanto dividimos as imagens em fichas individuais...
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload de Imagens</TabsTrigger>
          <TabsTrigger value="process" disabled={processedFichas.length === 0}>
            Processamento ({processedFichas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Tipo da primeira imagem:</Label>
                  <RadioGroup
                    value={firstImageType}
                    onValueChange={(value) =>
                      setFirstImageType(value as "digitais" | "informacoes")
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="digitais" id="digitais" />
                      <Label htmlFor="digitais">Imagem com Digitais</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="informacoes" id="informacoes" />
                      <Label htmlFor="informacoes">
                        Imagem com Informações
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground mt-2">
                    As imagens serão alternadas automaticamente entre digitais e
                    informações na ordem em que forem enviadas.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="class-pol-esq" className="mb-2 block">
                      Classificação do Polegar Esquerdo:
                    </Label>
                    <Input
                      id="class-pol-esq"
                      value={classPolEsq}
                      onChange={(e) => setClassPolEsq(e.target.value)}
                      maxLength={2}
                      placeholder="Ex: A"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Será aplicado a todas as fichas processadas.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="class-pol-dir" className="mb-2 block">
                      Classificação do Polegar Direito:
                    </Label>
                    <Input
                      id="class-pol-dir"
                      value={classPolDir}
                      onChange={(e) => setClassPolDir(e.target.value)}
                      maxLength={2}
                      placeholder="Ex: W"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Será aplicado a todas as fichas processadas.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label>Upload de Múltiplas Imagens:</Label>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearAllImages}
                        disabled={uploadedImages.length === 0}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Limpar Tudo
                      </Button>
                      <Button size="sm" onClick={triggerFileInput}>
                        <Upload className="h-4 w-4 mr-1" />
                        Selecionar Imagens
                      </Button>
                    </div>
                  </div>

                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    className="hidden"
                  />

                  <div className="mt-4">
                    <div
                      className="bg-muted p-4 rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/25 cursor-pointer"
                      onClick={triggerFileInput}
                      style={{ minHeight: "120px" }}
                    >
                      {uploadedImages.length === 0 ? (
                        <div className="text-center">
                          <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Clique para selecionar ou arraste as imagens aqui
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            Selecione múltiplas imagens de digitais e
                            informações
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            {uploadedImages.length} imagens selecionadas
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Clique para adicionar mais imagens
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">
                    Imagens Selecionadas:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uploadedImages.map((img, index) => (
                      <div key={img.id} className="relative group">
                        <div className="aspect-square rounded overflow-hidden border bg-muted">
                          <img
                            src={img.src}
                            alt={`Imagem ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                          <div className="self-end">
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-6 w-6"
                              onClick={() => removeImage(img.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="bg-black/60 text-white text-xs p-1 rounded">
                            {index + 1}:{" "}
                            {img.type === "digitais"
                              ? "Digitais"
                              : "Informações"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={processImages}
                      disabled={uploadedImages.length < 2 || isProcessingImages}
                      className="mt-4"
                    >
                      {isProcessingImages ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Scissors className="mr-2 h-4 w-4" />
                          Processar {uploadedImages.length} Imagens
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Fichas Processadas</h2>
                  <p className="text-sm text-muted-foreground">
                    Total: {processedFichas.length} fichas extraídas
                  </p>
                  {totalProcessingTime > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Tempo total de processamento:{" "}
                      {formatTime(totalProcessingTime)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={processAllFichas}
                    disabled={isProcessing || processedFichas.length === 0}
                    variant="outline"
                  >
                    <FileImage className="mr-2 h-4 w-4" />
                    Processar Todas
                  </Button>
                  <Button
                    onClick={saveFichas}
                    disabled={isProcessing || processedFichas.length === 0}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar{" "}
                    {processedFichas.filter((f) => !f.isSaved).length ||
                      processedFichas.length}{" "}
                    no Banco
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            {processedFichas.map((ficha, index) => (
              <Card key={ficha.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">
                        Ficha {index + 1} - Digitais
                      </h3>
                      <img
                        src={ficha.digitalImage}
                        alt={`Digitais da ficha ${index + 1}`}
                        className="w-full h-auto border rounded"
                      />
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">
                        Ficha {index + 1} - Informações
                      </h3>
                      <img
                        src={ficha.infoImage}
                        alt={`Informações da ficha ${index + 1}`}
                        className="w-full h-auto border rounded"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Dados Extraídos:</h4>
                      <div className="flex items-center gap-2">
                        {ficha.isSaved && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            Salvo
                          </span>
                        )}
                        <Button
                          size="sm"
                          onClick={() => extractText(index)}
                          disabled={ficha.isProcessing}
                        >
                          {ficha.isProcessing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <FileImage className="mr-2 h-4 w-4" />
                          )}
                          {ficha.ocrText ? "Reprocessar" : "Extrair Texto"}
                        </Button>
                      </div>
                    </div>

                    {ficha.isProcessing ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Processando...</span>
                      </div>
                    ) : ficha.ocrText ? (
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`nome-${index}`}>Nome:</Label>
                          <Input
                            id={`nome-${index}`}
                            value={ficha.nome || ""}
                            onChange={(e) => {
                              const updatedFichas = [...processedFichas];
                              updatedFichas[index] = {
                                ...updatedFichas[index],
                                nome: e.target.value,
                              };
                              setProcessedFichas(updatedFichas);
                            }}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`registro-${index}`}>Registro:</Label>
                          <Input
                            id={`registro-${index}`}
                            value={ficha.registro || ""}
                            onChange={(e) => {
                              const updatedFichas = [...processedFichas];
                              updatedFichas[index] = {
                                ...updatedFichas[index],
                                registro: e.target.value,
                              };
                              setProcessedFichas(updatedFichas);
                            }}
                            className="mt-1"
                          />
                        </div>

                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-muted-foreground">
                            Ver texto completo extraído
                          </summary>
                          <div className="mt-2 p-2 bg-muted rounded text-xs whitespace-pre-wrap">
                            {ficha.ocrText}
                          </div>
                        </details>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted rounded text-center text-sm text-muted-foreground">
                        Clique em &quot;Extrair Texto&quot; para processar esta
                        ficha
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {processedFichas.length > 5 && (
            <div className="flex justify-center mt-6">
              <Button onClick={saveFichas} disabled={isProcessing} size="lg">
                <Save className="mr-2 h-5 w-5" />
                Salvar{" "}
                {processedFichas.filter((f) => !f.isSaved).length ||
                  processedFichas.length}{" "}
                Fichas no Banco
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FichaProcessor;
