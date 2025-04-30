/**
 * Redimensiona e converte uma imagem para WebP usando <canvas>.
 * @param file O arquivo de imagem original (File)
 * @param targetWidth Largura desejada
 * @param targetHeight Altura desejada
 * @param quality Qualidade (0 a 1) para compressão WebP (opcional, default=0.8)
 * @returns Um novo File (em formato WebP) pronto para envio
 */
export async function ImageConvert(
  file: File,
  targetWidth: number,
  targetHeight: number,
  quality = 1.2
): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Criar canvas com dimensões desejadas
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Falha ao obter contexto do canvas."));
        }

        /**
         * Desenhar a imagem na proporção exata 3:4:
         *   - Se a imagem original não tiver proporção 3:4, pode haver "sobras":
         *     Você pode preferir recortar (crop) ou simplesmente "esticar".
         *   - Neste exemplo, vamos simplesmente fazer o "cover" da imagem original
         *     mas sem recortar nada. Se precisar recortar, é só adaptar a lógica.
         */

        // Ajuste simples: "cover" sem recorte (poderá distorcer se a imagem original
        // não for 3:4).
        // Caso queira recortar, é preciso calcular offsets.

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Converter para Blob (WebP)
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              return reject(new Error("Falha ao converter imagem em blob."));
            }

            // Criar um novo File a partir do blob
            const webpFile = new File(
              [blob],
              `${file.name.split(".")[0]}.webp`,
              {
                type: "image/webp",
                lastModified: Date.now(),
              }
            );

            resolve(webpFile);
          },
          "image/webp", // MIME type
          quality // Qualidade
        );
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = (error) => reject(error);
    // Inicia leitura do arquivo
    reader.readAsDataURL(file);
  });
}
