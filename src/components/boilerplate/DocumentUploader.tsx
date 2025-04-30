"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FileWithDescription {
  file: File;
  description: string;
}

interface DocumentUploaderProps {
  label: string;
  uploadPreset: string;
  cloudName?: string;
  onUrlsChange: (urls: { url: string; description: string }[]) => void;
  isRequired?: boolean;
  helpText?: string;
  files: FileWithDescription[];
  setFiles: (files: FileWithDescription[]) => void;
}

export function DocumentUploader({
  label,
  uploadPreset,
  cloudName = "dihthobrv",
  onUrlsChange,
  isRequired = false,
  helpText,
  files,
  setFiles,
}: DocumentUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [fileUrls, setFileUrls] = useState<
    { url: string; description: string }[]
  >([]);

  // Estado para o diálogo de descrição
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [currentDescription, setCurrentDescription] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = { uploadPreset, cloudName }; // Referência aos parâmetros para evitar o aviso

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      description: file.name, // Usar o nome do arquivo como descrição padrão
    }));

    setFiles([...files, ...newFiles]);
    setError(null);

    console.log(
      `Arquivos selecionados: ${newFiles.length}, total: ${
        files.length + newFiles.length
      }`
    );
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    console.log(`Arquivo removido, restantes: ${updatedFiles.length}`);
  };

  const openDescriptionDialog = (index: number) => {
    setCurrentFileIndex(index);
    setCurrentDescription(files[index].description);
    setIsDescriptionDialogOpen(true);
  };

  const saveDescription = () => {
    if (currentFileIndex !== null) {
      const updated = [...files];
      updated[currentFileIndex] = {
        ...updated[currentFileIndex],
        description: currentDescription,
      };
      setFiles(updated);
      setIsDescriptionDialogOpen(false);
      setCurrentFileIndex(null);
    }
  };

  // Atualizar o estado quando os arquivos mudam
  useEffect(() => {
    // Limpar URLs quando não há arquivos
    if (files.length === 0 && fileUrls.length > 0) {
      setFileUrls([]);
      onUrlsChange([]);
    }

    console.log(`Estado de arquivos atualizado: ${files.length} arquivos`);
  }, [files, fileUrls.length, onUrlsChange]);

  return (
    <>
      <FormItem>
        <FormLabel>
          {label} {isRequired && <span className="text-red-500">*</span>}
        </FormLabel>
        <FormControl>
          <div className="space-y-4">
            <Input
              type="file"
              accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="cursor-pointer"
              multiple
            />

            {files.length > 0 && (
              <div className="border rounded-md p-3 bg-muted/30">
                <p className="text-sm font-medium mb-2">
                  Arquivos selecionados: {files.length}
                </p>
                <ul className="space-y-2">
                  {files.map((fileWithDesc, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-sm bg-background p-2 rounded"
                    >
                      <div className="flex flex-col">
                        <span className="truncate max-w-[250px] font-medium">
                          {fileWithDesc.file.name}
                        </span>
                        {fileWithDesc.description !==
                          fileWithDesc.file.name && (
                          <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                            Descrição: {fileWithDesc.description}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => openDescriptionDialog(index)}
                          title="Editar descrição"
                        >
                          <Edit2 className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(index)}
                          title="Remover arquivo"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {fileUrls.length > 0 && (
              <div className="border rounded-md p-3 bg-green-50 dark:bg-green-950/20">
                <p className="text-sm font-medium mb-2 text-green-700 dark:text-green-400">
                  {fileUrls.length}{" "}
                  {fileUrls.length === 1
                    ? "arquivo enviado"
                    : "arquivos enviados"}{" "}
                  com sucesso
                </p>
              </div>
            )}

            {helpText && !error && (
              <p className="text-sm text-muted-foreground">{helpText}</p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>

      {/* Diálogo para editar a descrição */}
      <Dialog
        open={isDescriptionDialogOpen}
        onOpenChange={setIsDescriptionDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar descrição ao arquivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descreva o conteúdo deste documento"
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDescriptionDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={saveDescription}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook para facilitar o uso do componente
export function useDocumentUploader() {
  const [documentUrls, setDocumentUrls] = useState<
    { url: string; description: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [files, setFiles] = useState<FileWithDescription[]>([]);

  const handleUrlsChange = (urls: { url: string; description: string }[]) => {
    setDocumentUrls(urls);
  };

  // Função para realizar o upload quando o formulário for submetido
  const uploadDocuments = async (
    preset: string,
    cloudName = "dihthobrv"
  ): Promise<{ url: string; description: string }[]> => {
    if (files.length === 0) {
      console.log("Nenhum arquivo para upload");
      return [];
    }

    console.log(
      `Iniciando upload de ${files.length} arquivos com preset: ${preset}`
    );
    setIsUploading(true);
    setUploadError(null);
    const urls: { url: string; description: string }[] = [];

    try {
      for (const fileWithDesc of files) {
        console.log(`Enviando arquivo: ${fileWithDesc.file.name}`);
        const formData = new FormData();
        formData.append("file", fileWithDesc.file);
        formData.append("upload_preset", preset);

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
        console.log(`Enviando para: ${url}`);

        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Resposta de erro da API:", errorData);
          throw new Error(
            errorData.error?.message || "Falha ao enviar arquivo"
          );
        }

        const data = await response.json();
        console.log("Resposta da API:", data);

        urls.push({
          url: data.secure_url,
          description: fileWithDesc.description,
        });

        console.log(
          `Arquivo ${fileWithDesc.file.name} enviado com sucesso: ${data.secure_url}`
        );
      }

      console.log(`Upload concluído: ${urls.length} arquivos enviados`);
      setDocumentUrls(urls);
      return urls;
    } catch (error) {
      console.error("Erro durante o upload:", error);
      const err =
        error instanceof Error
          ? error
          : new Error("Erro desconhecido no upload");
      setUploadError(err);
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    documentUrls,
    isUploading,
    uploadError,
    files,
    setFiles,
    handleUrlsChange,
    uploadDocuments,
  };
}
