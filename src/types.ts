export type UserRole = "admin" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  active: boolean;
}

export type ServiceType = "gravacao" | "mixagem" | "masterizacao" | "ensaio" | "podcast" | "producao";

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  price: number;
  duration: number; // em horas
  description: string;
}

export type ScheduleStatus = "pendente" | "confirmado" | "cancelado" | "concluido";

export interface Schedule {
  id: string;
  clientId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  notes?: string;
  createdAt: string;
}

export type QuoteStatus = "pendente" | "enviado" | "aprovado" | "rejeitado";

export interface Quote {
  id: string;
  scheduleId: string;
  clientId: string;
  serviceId: string;
  amount: number;
  status: QuoteStatus;
  pixCode?: string;
  pixKey?: string;
  createdAt: string;
  sentAt?: string;
}

export type PaymentStatus = "pendente" | "aguardando_comprovante" | "confirmado" | "recusado";

export interface Payment {
  id: string;
  quoteId: string;
  clientId: string;
  amount: number;
  status: PaymentStatus;
  receiptUrl?: string;
  confirmedAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  type: "text" | "receipt" | "quote" | "pix";
  attachmentUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  services: Service[];
  schedules: Schedule[];
  quotes: Quote[];
  payments: Payment[];
  messages: ChatMessage[];
  notifications: Notification[];
}
