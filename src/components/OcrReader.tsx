"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface ImageResult {
  id: string;
  file: File;
  preview: string;
  text?: string;
  isProcessing: boolean;
}

const OcrReader = () => {
  const [images, setImages] = useState<ImageResult[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        isProcessing: false,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const processImage = async (image: ImageResult) => {
    const worker = await createWorker("por", 1, {
      logger: (m) => console.log(m),
    });

    try {
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, isProcessing: true } : img
        )
      );

      const {
        data: { text },
      } = await worker.recognize(image.file);

      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, text, isProcessing: false } : img
        )
      );

      toast.success("Imagem processada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar imagem.");
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, isProcessing: false } : img
        )
      );
    } finally {
      await worker.terminate();
    }
  };

  const processAllImages = () => {
    images.forEach((image) => {
      if (!image.text) {
        processImage(image);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <label className="cursor-pointer">
            <span className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
              Selecionar Imagens
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Arraste e solte ou clique para selecionar
          </p>
        </div>
      </Card>

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Imagens Selecionadas ({images.length})
            </h2>
            <Button onClick={processAllImages}>
              Processar Todas as Imagens
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="p-4">
                <div className="relative">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{image.file.name}</p>
                    <Button
                      onClick={() => processImage(image)}
                      disabled={image.isProcessing}
                    >
                      {image.isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Processar"
                      )}
                    </Button>
                  </div>

                  {image.text && (
                    <div className="bg-muted p-2 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">
                        {image.text}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OcrReader;
