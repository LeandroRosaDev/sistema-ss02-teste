// src/types/GlobalTypes.ts

// Tipos base
export interface Team {
  id: number;
  name: string;
  supervisor: string;
  serviceType: string;
  member1: string;
  member2?: string;
  member3?: string;
  member4?: string;
  member5?: string;
  member6?: string;
  member7?: string;
  member8?: string;
  profileImage?: string;
  createdAt: Date;
  empresaId: number;
  empresa?: {
    nome: string;
    cnpj: string;
  };
}

export interface Routines {
  id: number;
  name: string;
  routineNumber: string;
  routineType: string;
  recurrence?: string;
  description?: string;
  supervisor: string;
  team?: string;
  taskTime?: string;
  epi?: string;
  tools?: string;
  createdAt: Date;
  updatedAt: Date;
  empresaId: number;

  tasks: RoutineTasks[];
  images: ImageRoutines[];
  docs: DocsRoutines[];
  orders: OrderService[];
}

export interface Company {
  id: number;
  cnpj: string;
  nome: string;
  auctionNumber: string;
  observation?: string;
  providedService?: string;
  responsibleTeam?: string;
  companyDocs?: string;

  // Campos de endereço
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  email?: string;

  // Campos de data
  createdAt: Date;
  updatedAt: Date;

  // Relações
  orders: OrderService[];
  docs: DocsClienteEmpresa[];
}

export interface OrderService {
  id: number;
  name: string;
  osNumber: string;
  team: string;
  supervisor: string;
  responsible: string;
  startDate: Date;
  endDate?: Date;
  serviceType: string;
  auctionNumber: string;
  observations?: string;
  status: 1 | 2 | 3 | 4;
  routineId: number;
  tenantId: number;
  clienteEmpresaId: number;
  recurrence: Date;
  epi?: boolean;
  supervisiorTaskSignature?: string;
  supervisiorTaskName?: string;
  supervisiorTaskPosition?: string;
  elapsedTime?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relações expandidas
  tenant: {
    id: number;
    nome: string;
    cnpj: string;
    logo?: string;
  };

  routine: Routines;

  clienteEmpresa: {
    id: number;
    nome: string;
    cnpj: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    telefone?: string;
    email?: string;
    auctionNumber: string;
  };

  images: {
    id: number;
    url: string;
    description?: string;
    uploadedAt: Date;
    orderServiceId: number;
  }[];
}

// Tipos auxiliares
export interface RoutineTasks {
  id: number;
  task: string;
  routineId: number;
}

export interface ImageRoutines {
  id: number;
  url: string;
  routineId: number;
  uploadedAt: Date;
  description?: string;
}

export interface DocsRoutines {
  id: number;
  url: string;
  routineId: number;
  uploadedAt: Date;
  description?: string;
}

export interface ImageServiceOrder {
  id: number;
  url: string;
  orderServiceId: number;
  uploadedAt: Date;
  description?: string;
}

export interface DocsClienteEmpresa {
  id: number;
  url: string;
  clienteEmpresaId: number;
  uploadedAt: Date;
  description?: string;
}

export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relações
  users: User[];
  routines: Routines[];
  orders: OrderService[];
  teams: Team[];
  preferencias?: Preferencias;
  payment?: Payment;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  role: number;
  empresaId: number;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  userId: number;
  profileImage?: string;
  dateOfBirth: Date;
  cpf: string;
  gender: string;
  technicalRole: string;
  workArea: string;
  personalSignature?: string;
}

export interface Preferencias {
  id: number;
  empresaId: number;
  tema?: string;
  outrasPreferencias?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: number;
  empresaId: number;
  valor: number;
  status: "PENDING" | "PAID" | "OVERDUE";
  dataPagamentoAtual?: Date;
  dataPagamentoAnterior?: Date;
  dataProximoPagamento?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para componentes de tabela
export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

export type OrderServiceColumn = TableColumn<OrderService>;
export type CompanyColumn = TableColumn<Company>;
export type RoutineColumn = TableColumn<Routines>;
export type TeamColumn = TableColumn<Team>;

export interface OrderServicePayload {
  name: string;
  osNumber: string;
  team: string;
  supervisor: string;
  responsible: string;
  recurrence: Date;
  startDate: Date;
  serviceType: string;
  auctionNumber: string;
  observations?: string;
  epi?: boolean;
  supervisiorTaskSignature?: string;
  supervisiorTaskName?: string;
  supervisiorTaskPosition?: string;
  elapsedTime?: string;
  routineId: number;
  companyId: number;
}

// Adicionando um tipo auxiliar para melhor legibilidade
export type OrderStatus = 1 | 2 | 3 | 4;

// Adicionando um objeto de mapeamento para facilitar o uso
export const OrderStatusMap = {
  1: "Aberta",
  2: "Fechada",
  3: "Atrasada",
  4: "Cancelada",
} as const;

// Adicionando um objeto para mapear as cores/variantes do status
export const OrderStatusVariantMap = {
  1: "secondary", // Aberta - Azul
  2: "default", // Fechada - Verde
  3: "warning", // Atrasada - Amarelo
  4: "destructive", // Cancelada - Vermelho
} as const;
