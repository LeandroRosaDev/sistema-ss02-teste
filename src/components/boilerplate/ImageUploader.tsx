"use client";

import React, { useState, useEffect } from "react";
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
import { ImageConvert } from "@/components/Convert-Image/Image-Convert";
import Image from "next/image";

// Tipo para imagem com descrição
interface ImageWithDescription {
  file: File;
  preview: string;
  description: string;
}

// Props do componente
interface ImageUploaderProps {
  label: string;
  uploadPreset: string;
  cloudName?: string;
  onUrlsChange: (urls: { url: string; description: string }[]) => void;
  isRequired?: boolean;
  helpText?: string;
  maxWidth?: number;
  maxHeight?: number;
  images: ImageWithDescription[];
  setImages: (images: ImageWithDescription[]) => void;
}

export function ImageUploader({
  label,
  uploadPreset,
  cloudName = "dihthobrv",
  onUrlsChange,
  isRequired = false,
  helpText,
  maxWidth = 800,
  maxHeight = 600,
  images,
  setImages,
}: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<
    { url: string; description: string }[]
  >([]);

  // Estado para o diálogo de descrição
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  const [currentDescription, setCurrentDescription] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = { uploadPreset, cloudName }; // Referência aos parâmetros para evitar o aviso

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const filesArray = Array.from(selectedFiles);
    const newImages: ImageWithDescription[] = [];

    for (const file of filesArray) {
      try {
        // Converter para WebP e redimensionar
        const webpFile = await ImageConvert(file, maxWidth, maxHeight);

        // Criar preview
        const preview = URL.createObjectURL(webpFile);

        newImages.push({
          file: webpFile,
          preview,
          description: file.name, // Usar o nome do arquivo como descrição padrão
        });
      } catch (error) {
        console.error("Erro ao converter imagem:", error);
        setError("Erro ao processar uma ou mais imagens.");
      }
    }

    setImages([...images, ...newImages]);
    setError(null);

    console.log(
      `Imagens selecionadas: ${newImages.length}, total: ${
        images.length + newImages.length
      }`
    );
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    // Liberar URL de preview para evitar vazamento de memória
    URL.revokeObjectURL(images[index].preview);

    console.log(`Imagem removida, restantes: ${updatedImages.length}`);
  };

  const openDescriptionDialog = (index: number) => {
    setCurrentImageIndex(index);
    setCurrentDescription(images[index].description);
    setIsDescriptionDialogOpen(true);
  };

  // Limpar URLs de preview quando o componente for desmontado
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [images]);

  // Atualizar o estado quando as imagens mudam
  useEffect(() => {
    // Limpar URLs quando não há imagens
    if (images.length === 0 && imageUrls.length > 0) {
      setImageUrls([]);
      onUrlsChange([]);
    }

    console.log(`Estado de imagens atualizado: ${images.length} imagens`);
  }, [images, imageUrls.length, onUrlsChange]);

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
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
              multiple
            />

            {images.length > 0 && (
              <div className="border rounded-md p-3 bg-muted/30">
                <p className="text-sm font-medium mb-2">
                  Imagens selecionadas: {images.length}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {images.map((imageWithDesc, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-md overflow-hidden"
                      onClick={() => openDescriptionDialog(index)}
                      role="button"
                      tabIndex={0}
                      style={{ cursor: "pointer" }}
                    >
                      <Image
                        src={imageWithDesc.preview}
                        alt={imageWithDesc.description}
                        className="w-full h-32 object-cover"
                        width={160}
                        height={160}
                        style={{ objectFit: "contain" }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="text-white text-xs truncate">
                          {imageWithDesc.description}
                        </div>
                        <div className="flex justify-end space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDescriptionDialog(index);
                            }}
                            title="Editar descrição"
                            className="h-7 w-7 bg-white/20 hover:bg-white/40"
                          >
                            <Edit2 className="h-3 w-3 text-white" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            title="Remover imagem"
                            className="h-7 w-7 bg-white/20 hover:bg-white/40"
                          >
                            <Trash2 className="h-3 w-3 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imageUrls.length > 0 && (
              <div className="border rounded-md p-3 bg-green-50 dark:bg-green-950/20">
                <p className="text-sm font-medium mb-2 text-green-700 dark:text-green-400">
                  {imageUrls.length}{" "}
                  {imageUrls.length === 1
                    ? "imagem enviada"
                    : "imagens enviadas"}{" "}
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
            <DialogTitle>Adicionar descrição à imagem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {currentImageIndex !== null && (
              <div className="flex justify-center">
                <Image
                  src={images[currentImageIndex]?.preview}
                  alt="Preview"
                  className="max-h-40 object-contain rounded-md"
                  width={160}
                  height={160}
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descreva esta imagem"
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
            <Button
              type="button"
              onClick={() => {
                if (currentImageIndex !== null) {
                  const updated = [...images];
                  updated[currentImageIndex] = {
                    ...updated[currentImageIndex],
                    description: currentDescription,
                  };
                  setImages(updated);
                  setIsDescriptionDialogOpen(false);
                  setCurrentImageIndex(null);
                }
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook para facilitar o uso do componente
export function useImageUploader() {
  const [imageUrls, setImageUrls] = useState<
    { url: string; description: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [images, setImages] = useState<ImageWithDescription[]>([]);

  const handleUrlsChange = (urls: { url: string; description: string }[]) => {
    setImageUrls(urls);
  };

  // Função para realizar o upload quando o formulário for submetido
  const uploadImages = async (
    preset: string,
    cloudName = "dihthobrv"
  ): Promise<{ url: string; description: string }[]> => {
    if (images.length === 0) {
      console.log("Nenhuma imagem para upload");
      return [];
    }

    console.log(
      `Iniciando upload de ${images.length} imagens com preset: ${preset}`
    );
    setIsUploading(true);
    setUploadError(null);
    const urls: { url: string; description: string }[] = [];

    try {
      for (const imageWithDesc of images) {
        console.log(`Enviando imagem: ${imageWithDesc.file.name}`);
        const formData = new FormData();
        formData.append("file", imageWithDesc.file);
        formData.append("upload_preset", preset);

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        console.log(`Enviando para: ${url}`);

        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Resposta de erro da API:", errorData);
          throw new Error(errorData.error?.message || "Falha ao enviar imagem");
        }

        const data = await response.json();
        console.log("Resposta da API:", data);

        urls.push({
          url: data.secure_url,
          description: imageWithDesc.description,
        });

        console.log(
          `Imagem ${imageWithDesc.file.name} enviada com sucesso: ${data.secure_url}`
        );
      }

      console.log(`Upload concluído: ${urls.length} imagens enviadas`);
      setImageUrls(urls);
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
    imageUrls,
    isUploading,
    uploadError,
    images,
    setImages,
    handleUrlsChange,
    uploadImages,
  };
}
