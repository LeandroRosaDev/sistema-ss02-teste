import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  isOpen,
  onClose,
  imageSrc,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Visualização da Imagem</DialogTitle>
            <DialogDescription>
              {imageSrc
                ? "Utilize a rolagem do mouse para aumentar/diminuir o zoom."
                : "Não há imagem para exibir."}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex justify-center items-center mt-4 overflow-auto max-h-[80vh]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Visualização da Ficha"
              className="max-w-full h-auto object-contain"
              style={{ maxHeight: "70vh" }}
            />
          ) : (
            <p className="text-muted-foreground">Não há imagem para exibir</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
