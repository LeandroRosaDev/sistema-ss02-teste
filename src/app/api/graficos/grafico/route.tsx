import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimelineDataPoint {
  date: string;
  totalCriadas: number;
  totalVerificadas: number;
}

interface GroupedData {
  [key: string]: TimelineDataPoint;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";

    let startDate = new Date();
    switch (period) {
      case "week":
        startDate = subDays(new Date(), 7);
        break;
      case "month":
        startDate = subDays(new Date(), 30);
        break;
      case "year":
        startDate = subMonths(new Date(), 12);
        break;
      default:
        startDate = subDays(new Date(), 30);
    }

    // Buscar todas as fichas no período
    const fichas = await prisma.ficha_individual.findMany({
      where: {
        created_at: {
          gte: startOfDay(startDate),
        },
      },
      select: {
        created_at: true,
        updated_at: true,
        status: true,
      },
    });

    // Agrupar por data
    const groupedData = fichas.reduce((acc: GroupedData, ficha) => {
      const date = format(ficha.created_at, "dd/MM/yyyy", { locale: ptBR });

      if (!acc[date]) {
        acc[date] = {
          date,
          totalCriadas: 0,
          totalVerificadas: 0,
        };
      }

      // Incrementar total de fichas criadas
      acc[date].totalCriadas++;

      // Verificar se a ficha foi verificada (status true)
      if (ficha.status === true) {
        acc[date].totalVerificadas++;
      }

      return acc;
    }, {});

    // Converter para array e ordenar por data
    const timelineData = Object.values(groupedData).sort(
      (a: TimelineDataPoint, b: TimelineDataPoint) => {
        const [diaA, mesA, anoA] = a.date.split("/");
        const [diaB, mesB, anoB] = b.date.split("/");
        return (
          new Date(Number(anoA), Number(mesA) - 1, Number(diaA)).getTime() -
          new Date(Number(anoB), Number(mesB) - 1, Number(diaB)).getTime()
        );
      }
    );

    return NextResponse.json(timelineData);
  } catch (error) {
    console.error("Erro ao buscar dados do gráfico:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do gráfico" },
      { status: 500 }
    );
  }
}
