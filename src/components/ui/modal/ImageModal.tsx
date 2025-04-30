import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <Dialog.Title className="text-lg font-bold">Imagem</Dialog.Title>
          <div className="flex justify-center items-center mt-4">
            {imageSrc ? (
              <img
                src={`data:image/jpeg;base64,${imageSrc}`}
                alt="Imagem"
                className="max-w-full max-h-full"
              />
            ) : (
              <p>Não há imagem para exibir</p>
            )}
          </div>
          <div className="mt-4">
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ImageModal;
