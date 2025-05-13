import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { minioClient } from "@/services/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de ficha inválido" },
        { status: 400 }
      );
    }

    // Buscar a ficha no banco de dados
    const ficha = await prisma.ficha_individual.findUnique({
      where: { id_ficha: id },
      select: {
        frente_object_name: true,
        verso_object_name: true,
      },
    });

    if (!ficha) {
      return NextResponse.json(
        { error: "Ficha não encontrada" },
        { status: 404 }
      );
    }

    if (!ficha.frente_object_name && !ficha.verso_object_name) {
      return NextResponse.json(
        { error: "Ficha não possui imagens associadas" },
        { status: 404 }
      );
    }

    // Verificar se o cliente está configurado corretamente
    if (!process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
      return NextResponse.json(
        { error: "Credenciais do MinIO não configuradas" },
        { status: 500 }
      );
    }

    const bucketName = process.env.MINIO_BUCKET_NAME!;

    // Gerar URLs pré-assinadas para os objetos
    const resultado: {
      frente?: { url: string; objectName: string };
      verso?: { url: string; objectName: string };
    } = {};

    // Verificar e gerar URL para a imagem de frente
    if (ficha.frente_object_name) {
      try {
        const presignedUrl = await minioClient.presignedUrl(
          "GET",
          bucketName,
          ficha.frente_object_name,
          24 * 60 * 60
        );

        resultado.frente = {
          url: presignedUrl,
          objectName: ficha.frente_object_name,
        };
      } catch (error) {
        console.error(
          `Erro ao gerar URL para o objeto frente (${ficha.frente_object_name}):`,
          error
        );
      }
    }

    // Verificar e gerar URL para a imagem de verso
    if (ficha.verso_object_name) {
      try {
        const presignedUrl = await minioClient.presignedUrl(
          "GET",
          bucketName,
          ficha.verso_object_name,
          24 * 60 * 60
        );

        resultado.verso = {
          url: presignedUrl,
          objectName: ficha.verso_object_name,
        };
      } catch (error) {
        console.error(
          `Erro ao gerar URL para o objeto verso (${ficha.verso_object_name}):`,
          error
        );
      }
    }

    if (!resultado.frente && !resultado.verso) {
      return NextResponse.json(
        { error: "Não foi possível gerar URLs para as imagens" },
        { status: 500 }
      );
    }

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar imagens da ficha:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json(
      { error: `Falha ao buscar imagens: ${errorMessage}` },
      { status: 500 }
    );
  }
}
