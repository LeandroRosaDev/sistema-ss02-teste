"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface StatusCounts {
  abertas: number;
  fechadas: number;
  atrasadas: number;
  canceladas: number;
}

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#9ca3af"];

export default function StatusPieChart() {
  const [data, setData] = useState<StatusCounts>({
    abertas: 0,
    fechadas: 0,
    atrasadas: 0,
    canceladas: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/graficos/os-status");
        const statusData = await response.json();
        setData(statusData);
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: "Abertas", value: data.abertas },
    { name: "Fechadas", value: data.fechadas },
    { name: "Atrasadas", value: data.atrasadas },
    { name: "Canceladas", value: data.canceladas },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de OS por Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
