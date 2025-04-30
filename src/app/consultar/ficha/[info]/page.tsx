"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import useSupervisorStore from "@/store/admin/SupervisorStore";
import { Team } from "@/types/GlobalTypes";
import LoadingCard from "@/components/loading/LoadingCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Users2,
  UserCog,
  Calendar,
  Building,
  FileText,
  CalendarPlus,
  CalendarCheck,
  Building2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { format } from "date-fns";
import ComboboxSelect from "@/components/boilerplate/ComboboxSelect";
import { Button } from "@/components/ui/button";
import { ptBR } from "date-fns/locale";
import { RoleGuard } from "@/components/RoleGuard";
import { Badge } from "@/components/ui/badge";

const teamSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  supervisor: z.string().min(1, "Supervisor é obrigatório"),
  serviceType: z.string().min(1, "Tipo de serviço é obrigatório"),
  member1: z.string().optional(),
  member2: z.string().optional(),
  member3: z.string().optional(),
  member4: z.string().optional(),
  member5: z.string().optional(),
  member6: z.string().optional(),
  member7: z.string().optional(),
  member8: z.string().optional(),
  profileImage: z.string().optional(),
});

const serviceTypes = [
  "Manutenção",
  "Instalação",
  "Reparo",
  "Limpeza",
  "Inspeção",
  "Outros",
];

export default function TeamPage({ params }: { params: { info: string } }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { supervisors, fetchSupervisors } = useSupervisorStore();

  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      supervisor: "",
      serviceType: "",
      member1: "",
      member2: "",
      member3: "",
      member4: "",
      member5: "",
      member6: "",
      member7: "",
      member8: "",
      profileImage: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  // Função única para carregar dados da equipe
  const loadTeamData = async () => {
    try {
      const response = await fetch(`/api/consultar/equipe/${params.info}`);
      if (!response.ok) throw new Error("Equipe não encontrada");

      const teamData: Team = await response.json();
      setTeam(teamData);

      reset({
        name: teamData.name || "",
        supervisor: teamData.supervisor || "",
        serviceType: teamData.serviceType || "",
        member1: teamData.member1 || "",
        member2: teamData.member2 || "",
        member3: teamData.member3 || "",
        member4: teamData.member4 || "",
        member5: teamData.member5 || "",
        member6: teamData.member6 || "",
        member7: teamData.member7 || "",
        member8: teamData.member8 || "",
        profileImage: teamData.profileImage || "",
      });
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as informações da equipe",
        variant: "destructive",
      });
      router.push("/404");
    }
  };

  // Efeito único para inicialização
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadTeamData(), fetchSupervisors()]);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: z.infer<typeof teamSchema>) => {
    if (!team?.id) return;

    try {
      const response = await fetch(`/api/consultar/equipe/put/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: team.id }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar informações");

      toast({
        title: "Sucesso",
        description: "Informações atualizadas com sucesso.",
        variant: "default",
      });

      await loadTeamData();
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao atualizar informações",
        variant: "destructive",
      });
    }
  };

  const renderMembersList = (team: Team) => {
    const members = [
      team.member1,
      team.member2,
      team.member3,
      team.member4,
      team.member5,
      team.member6,
      team.member7,
      team.member8,
    ];

    return members
      .filter((member) => member && member !== "N/A")
      .map((member, index) => (
        <div key={index} className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {member}
        </div>
      ));
  };

  if (isLoading) return <LoadingCard />;
  if (!team) return null;

  return (
    <RoleGuard allowedRoles={[1, 2, 3]}>
      <Tabs className="m-6 mr-12" defaultValue="equipe">
        <TabsList className="w-full flex flex-wrap justify-start h-full p-4 gap-2">
          <TabsTrigger value="equipe">Informações da Equipe</TabsTrigger>
          <TabsTrigger value="editar">Editar Informações</TabsTrigger>
        </TabsList>

        <TabsContent value="equipe">
          <Card className="text-gray-700 dark:text-white">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  {team.name}
                </CardTitle>
                <Badge variant="outline" className="text-sm">
                  {team.serviceType} Teste
                </Badge>
              </div>
              <CardDescription className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span>Supervisor: {team.supervisor}</span>
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Users2 className="h-4 w-4" />
                      Membros da Equipe
                    </h3>
                    <div className="grid gap-2 text-sm">
                      {renderMembersList(team)}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Informações da Empresa
                    </h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>Empresa: {team.empresa?.nome || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>CNPJ: {team.empresa?.cnpj || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Datas
                    </h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Criação:{" "}
                          {format(new Date(team.createdAt), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Atualização:{" "}
                          {format(new Date(team.createdAt), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between mt-6">
              <Button onClick={() => router.back()} variant="outline">
                Voltar
              </Button>
              <Button onClick={() => form.reset(team)}>Restaurar Dados</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="editar">
          <Card className="text-gray-700 dark:text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <UserCog className="h-6 w-6" />
                Editar Equipe
              </CardTitle>
              <CardDescription>
                Atualize as informações da equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-2 gap-6"
                >
                  <div className="space-y-4">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Equipe</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="supervisor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supervisor</FormLabel>
                          <FormControl>
                            <ComboboxSelect
                              label="Supervisor"
                              data={supervisors}
                              value={field.value ? Number(field.value) : null}
                              onSelect={(id) => field.onChange(String(id))}
                              displayKey="name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Serviço</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de serviço" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                        const memberKey = `member${num}` as keyof z.infer<
                          typeof teamSchema
                        >;
                        const memberValue = team[memberKey];

                        if (!memberValue || memberValue === "N/A") return null;

                        return (
                          <FormField
                            key={num}
                            control={control}
                            name={memberKey}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Membro {num}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                      })}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const nextMemberNum = [1, 2, 3, 4, 5, 6, 7, 8].find(
                          (num) =>
                            !team[`member${num}` as keyof Team] &&
                            !form.getValues(
                              `member${num}` as keyof z.infer<typeof teamSchema>
                            )
                        );

                        if (nextMemberNum) {
                          form.setValue(
                            `member${nextMemberNum}` as keyof z.infer<
                              typeof teamSchema
                            >,
                            ""
                          );
                          setTeam((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  [`member${nextMemberNum}`]: "",
                                }
                              : null
                          );
                        } else {
                          toast({
                            title: "Limite atingido",
                            description: "Número máximo de membros atingido",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Adicionar Membro
                    </Button>

                    <FormField
                      control={control}
                      name="profileImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL da Imagem de Perfil</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    Salvar Alterações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </RoleGuard>
  );
}
