"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TimelineData {
  date: string;
  totalCriadas: number;
  totalVerificadas: number;
}

export default function TimelineChart() {
  const [data, setData] = useState<TimelineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period] = useState("month");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/graficos/grafico?period=${period}`);
        const timelineData = await response.json();
        setData(timelineData);
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            name="Fichas Criadas"
            dataKey="totalCriadas"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            name="Fichas Verificadas"
            dataKey="totalVerificadas"
            stroke="#22c55e"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
