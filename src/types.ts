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
  image?: string;
  features?: string[];
}

export type ProductCategory = "merch" | "acessorios" | "midias" | "pacotes";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image?: string;
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  type: "service" | "product";
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  duration?: number;
}

export type OrderStatus = "pendente" | "aprovado" | "em_producao" | "concluido" | "cancelado";

export interface Order {
  id: string;
  clientId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  approvedAt?: string;
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
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  schedules: Schedule[];
  quotes: Quote[];
  payments: Payment[];
  messages: ChatMessage[];
  notifications: Notification[];
}
