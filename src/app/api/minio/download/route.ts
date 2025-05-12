import { NextRequest, NextResponse } from "next/server";
import * as Minio from "minio";

// Cliente Minio para uso no servidor
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "",
  secretKey: process.env.MINIO_SECRET_KEY || "",
});

export async function GET(request: NextRequest) {
  try {
    // Obter parâmetros da requisição
    const { searchParams } = new URL(request.url);
    const bucketName = searchParams.get("bucketName");
    const objectName = searchParams.get("objectName");

    // Validar parâmetros
    if (!bucketName || !objectName) {
      return NextResponse.json(
        { error: "bucketName e objectName são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o bucket existe
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      return NextResponse.json(
        { error: `Bucket ${bucketName} não encontrado` },
        { status: 404 }
      );
    }

    try {
      // Verificar se o objeto existe obtendo suas estatísticas
      await minioClient.statObject(bucketName, objectName);
    } catch {
      // Se o objeto não existe, retornamos 404
      return NextResponse.json(
        {
          error: `Objeto ${objectName} não encontrado no bucket ${bucketName}`,
        },
        { status: 404 }
      );
    }

    // Gerar URL temporária para acesso ao arquivo
    const presignedUrl = await minioClient.presignedGetObject(
      bucketName,
      objectName,
      24 * 60 * 60 // URL válida por 24 horas (em segundos)
    );

    // Alternativa: retornar URL pública se configurada
    const minioUrl = process.env.NEXT_PUBLIC_MINIO_URL;
    const publicUrl = minioUrl
      ? `${minioUrl}/${bucketName}/${objectName}`
      : null;

    return NextResponse.json({
      success: true,
      presignedUrl,
      publicUrl,
      bucketName,
      objectName,
    });
  } catch (error) {
    console.error("Erro ao gerar URL para download:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json(
      { error: `Falha ao gerar URL: ${errorMessage}` },
      { status: 500 }
    );
  }
}
