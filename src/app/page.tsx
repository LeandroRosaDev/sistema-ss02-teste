import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const TimelineChart = dynamic(
  () => import("@/components/dashboard/TimelineChart"),
  { ssr: false }
);
const StatusCards = dynamic(
  () => import("@/components/dashboard/StatusCards"),
  { ssr: false }
);

export default async function HomePage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <StatusCards />

      <div className="h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral das Fichas de Identidade</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs className="mb-4" defaultValue="month">
              <TabsList>
                <TabsTrigger value="week">7 dias</TabsTrigger>
                <TabsTrigger value="month">30 dias</TabsTrigger>
                <TabsTrigger value="year">12 meses</TabsTrigger>
              </TabsList>
              <TimelineChart />
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
