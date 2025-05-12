import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { minioClient, createBucketIfNotExists } from "@/services/client";

export async function POST(request: NextRequest) {
  try {
    // Receber os dados do formulário
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucketName = process.env.MINIO_BUCKET_NAME!;
    let objectName = formData.get("objectName") as string | null;

    // Validar os dados recebidos
    if (!file) {
      return NextResponse.json(
        { error: "Arquivo não fornecido" },
        { status: 400 }
      );
    }

    // Garantir que o bucket existe
    await createBucketIfNotExists(bucketName);

    // Gerar um nome único para o objeto, se não foi fornecido
    if (!objectName) {
      const uniqueId = nanoid();
      objectName = `${uniqueId}-${file.name}`;
    }

    // Converter o arquivo para buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload para o Minio
    await minioClient.putObject(bucketName, objectName, buffer);

    // Construir URL para acesso ao arquivo
    const minioUrl = process.env.NEXT_PUBLIC_MINIO_URL || "";
    const fileUrl = `${minioUrl}/${bucketName}/${objectName}`;

    // Retornar informações sobre o arquivo salvo
    return NextResponse.json({
      success: true,
      bucketName,
      objectName,
      fileUrl,
      contentType: file.type,
      size: buffer.length,
    });
  } catch (error) {
    console.error("Erro ao fazer upload para o Minio:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json(
      { error: `Falha no upload: ${errorMessage}` },
      { status: 500 }
    );
  }
}
