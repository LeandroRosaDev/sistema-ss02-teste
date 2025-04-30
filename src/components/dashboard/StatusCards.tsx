"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface CardStats {
  total: number;
  verificadas: number;
  naoVerificadas: number;
}

export default function StatusCards() {
  const [stats, setStats] = useState<CardStats>({
    total: 0,
    verificadas: 0,
    naoVerificadas: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/graficos/cards");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar contagens:", error);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: "Total de Fichas",
      subtitle: "Número total de fichas cadastradas",
      value: stats.total,
      icon: (
        <Clock className="h-8 w-8 text-white bg-yellow-500 p-2 rounded-full" />
      ),
      color: "border-t-yellow-500",
      textColor: "text-yellow-500",
    },
    {
      title: "Fichas Verificadas",
      subtitle: "Total de fichas verificadas",
      value: stats.verificadas,
      icon: (
        <CheckCircle2 className="h-8 w-8 text-white bg-teal-500 p-2 rounded-full" />
      ),
      color: "border-t-teal-500",
      textColor: "text-teal-500",
    },
    {
      title: "Fichas Não Verificadas",
      subtitle: "Total de fichas pendentes",
      value: stats.naoVerificadas,
      icon: (
        <XCircle className="h-8 w-8 text-white bg-blue-500 p-2 rounded-full" />
      ),
      color: "border-t-blue-500",
      textColor: "text-blue-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`border-t-4 ${card.color} overflow-hidden`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base text-gray-600 font-bold">
                {card.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
            <div className="rounded-full w-10 h-10 flex items-center justify-center">
              {card.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-5xl font-bold ${card.textColor}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
