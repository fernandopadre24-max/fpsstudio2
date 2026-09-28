import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppState, User, Schedule, Quote, Payment, ChatMessage, Notification, Service } from "../types";

const STORAGE_KEY = "studio_music_data";

const defaultServices: Service[] = [
  { id: "s1", name: "Gravação Profissional", type: "gravacao", price: 250, duration: 2, description: "Sessão de gravação em estúdio profissional com equipamento de ponta" },
  { id: "s2", name: "Mixagem", type: "mixagem", price: 350, duration: 3, description: "Mixagem profissional de até 8 tracks" },
  { id: "s3", name: "Masterização", type: "masterizacao", price: 200, duration: 1, description: "Masterização profissional para plataformas digitais" },
  { id: "s4", name: "Ensaio", type: "ensaio", price: 100, duration: 2, description: "Sala de ensaio com isolamento acústico" },
  { id: "s5", name: "Gravação Podcast", type: "podcast", price: 180, duration: 2, description: "Gravação de podcast com até 4 participantes" },
  { id: "s6", name: "Produção Musical", type: "producao", price: 800, duration: 4, description: "Produção musical completa com arranjos" },
];

const defaultUsers: User[] = [
  { id: "u1", name: "Studio Admin", email: "admin@studio.com", password: "admin123", role: "admin", phone: "(11) 99999-0000", createdAt: "2024-01-01", active: true },
  { id: "u2", name: "João Silva", email: "joao@email.com", password: "123456", role: "client", phone: "(11) 98888-1111", createdAt: "2024-02-15", active: true },
  { id: "u3", name: "Maria Santos", email: "maria@email.com", password: "123456", role: "client", phone: "(11) 97777-2222", createdAt: "2024-03-10", active: true },
  { id: "u4", name: "Pedro Costa", email: "pedro@email.com", password: "123456", role: "client", phone: "(11) 96666-3333", createdAt: "2024-04-05", active: true },
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];

const defaultSchedules: Schedule[] = [
  { id: "sc1", clientId: "u2", serviceId: "s1", date: fmt(today), startTime: "10:00", endTime: "12:00", status: "confirmado", createdAt: "2024-06-01" },
  { id: "sc2", clientId: "u3", serviceId: "s5", date: fmt(today), startTime: "14:00", endTime: "16:00", status: "pendente", createdAt: "2024-06-02" },
  { id: "sc3", clientId: "u4", serviceId: "s2", date: fmt(new Date(today.getTime() + 86400000)), startTime: "09:00", endTime: "12:00", status: "confirmado", createdAt: "2024-06-03" },
];

const defaultQuotes: Quote[] = [
  { id: "q1", scheduleId: "sc1", clientId: "u2", serviceId: "s1", amount: 250, status: "aprovado", pixKey: "11999990000", createdAt: "2024-06-01", sentAt: "2024-06-01" },
  { id: "q2", scheduleId: "sc2", clientId: "u3", serviceId: "s5", amount: 180, status: "enviado", pixKey: "11999990000", createdAt: "2024-06-02", sentAt: "2024-06-02" },
];

const defaultPayments: Payment[] = [
  { id: "p1", quoteId: "q1", clientId: "u2", amount: 250, status: "confirmado", confirmedAt: "2024-06-01", createdAt: "2024-06-01" },
];

const defaultMessages: ChatMessage[] = [
  { id: "m1", fromId: "u2", toId: "u1", content: "Olá! Gostaria de agendar uma gravação para esta semana.", type: "text", read: true, createdAt: "2024-06-01T10:00:00" },
  { id: "m2", fromId: "u1", toId: "u2", content: "Olá João! Temos horário disponível na quinta às 14h. Posso reservar?", type: "text", read: true, createdAt: "2024-06-01T10:05:00" },
  { id: "m3", fromId: "u2", toId: "u1", content: "Perfeito! Pode reservar sim.", type: "text", read: true, createdAt: "2024-06-01T10:10:00" },
];

const defaultNotifications: Notification[] = [
  { id: "n1", userId: "u1", title: "Novo agendamento", message: "Maria Santos agendou Gravação Podcast", type: "info", read: false, createdAt: new Date().toISOString() },
  { id: "n2", userId: "u2", title: "Orçamento aprovado", message: "Seu orçamento de Gravação foi aprovado", type: "success", read: false, createdAt: new Date().toISOString() },
];

const initialState: AppState = {
  currentUser: null,
  users: defaultUsers,
  services: defaultServices,
  schedules: defaultSchedules,
  quotes: defaultQuotes,
  payments: defaultPayments,
  messages: defaultMessages,
  notifications: defaultNotifications,
};

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addSchedule: (schedule: Omit<Schedule, "id" | "createdAt">) => void;
  updateScheduleStatus: (id: string, status: Schedule["status"]) => void;
  sendQuote: (quote: Omit<Quote, "id" | "createdAt">) => void;
  updateQuoteStatus: (id: string, status: Quote["status"]) => void;
  addPayment: (payment: Omit<Payment, "id" | "createdAt">) => void;
  confirmPayment: (id: string) => void;
  rejectPayment: (id: string) => void;
  sendMessage: (msg: Omit<ChatMessage, "id" | "createdAt" | "read">) => void;
  markMessagesRead: (fromId: string, toId: string) => void;
  markNotificationRead: (id: string) => void;
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  generateId: () => string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialState; }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const login = (email: string, password: string): boolean => {
    const user = state.users.find(u => u.email === email && u.password === password && u.active);
    if (user) {
      setState(s => ({ ...s, currentUser: user }));
      return true;
    }
    return false;
  };

  const logout = () => setState(s => ({ ...s, currentUser: null }));

  const addSchedule = (schedule: Omit<Schedule, "id" | "createdAt">) => {
    const newSchedule: Schedule = { ...schedule, id: generateId(), createdAt: new Date().toISOString() };
    setState(s => ({
      ...s,
      schedules: [...s.schedules, newSchedule],
      notifications: [...s.notifications, {
        id: generateId(), userId: "u1", title: "Novo agendamento",
        message: `${s.users.find(u => u.id === schedule.clientId)?.name} agendou ${s.services.find(sv => sv.id === schedule.serviceId)?.name}`,
        type: "info", read: false, createdAt: new Date().toISOString()
      }]
    }));
  };

  const updateScheduleStatus = (id: string, status: Schedule["status"]) => {
    setState(s => ({
      ...s,
      schedules: s.schedules.map(sc => sc.id === id ? { ...sc, status } : sc)
    }));
  };

  const sendQuote = (quote: Omit<Quote, "id" | "createdAt">) => {
    const newQuote: Quote = { ...quote, id: generateId(), createdAt: new Date().toISOString() };
    setState(s => ({
      ...s,
      quotes: [...s.quotes, newQuote],
      notifications: [...s.notifications, {
        id: generateId(), userId: quote.clientId, title: "Novo orçamento",
        message: `Novo orçamento de R$ ${quote.amount.toFixed(2)} disponível`,
        type: "info", read: false, createdAt: new Date().toISOString()
      }]
    }));
  };

  const updateQuoteStatus = (id: string, status: Quote["status"]) => {
    setState(s => ({ ...s, quotes: s.quotes.map(q => q.id === id ? { ...q, status } : q) }));
  };

  const addPayment = (payment: Omit<Payment, "id" | "createdAt">) => {
    const newPayment: Payment = { ...payment, id: generateId(), createdAt: new Date().toISOString() };
    setState(s => ({
      ...s,
      payments: [...s.payments, newPayment],
      notifications: [...s.notifications, {
        id: generateId(), userId: "u1", title: "Comprovante recebido",
        message: `Comprovante de R$ ${payment.amount.toFixed(2)} aguardando confirmação`,
        type: "warning", read: false, createdAt: new Date().toISOString()
      }]
    }));
  };

  const confirmPayment = (id: string) => {
    setState(s => ({
      ...s,
      payments: s.payments.map(p => p.id === id ? { ...p, status: "confirmado" as const, confirmedAt: new Date().toISOString() } : p),
      notifications: [...s.notifications, {
        id: generateId(),
        userId: s.payments.find(p => p.id === id)?.clientId || "",
        title: "Pagamento confirmado",
        message: "Seu pagamento foi confirmado com sucesso!",
        type: "success", read: false, createdAt: new Date().toISOString()
      }]
    }));
  };

  const rejectPayment = (id: string) => {
    setState(s => ({
      ...s,
      payments: s.payments.map(p => p.id === id ? { ...p, status: "recusado" as const } : p)
    }));
  };

  const sendMessage = (msg: Omit<ChatMessage, "id" | "createdAt" | "read">) => {
    const newMsg: ChatMessage = { ...msg, id: generateId(), createdAt: new Date().toISOString(), read: false };
    setState(s => ({ ...s, messages: [...s.messages, newMsg] }));
  };

  const markMessagesRead = (fromId: string, toId: string) => {
    setState(s => ({
      ...s,
      messages: s.messages.map(m =>
        m.fromId === fromId && m.toId === toId ? { ...m, read: true } : m
      )
    }));
  };

  const markNotificationRead = (id: string) => {
    setState(s => ({
      ...s,
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const addUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = { ...user, id: generateId(), createdAt: new Date().toISOString() };
    setState(s => ({ ...s, users: [...s.users, newUser] }));
  };

  return (
    <AppContext.Provider value={{
      ...state, login, logout, addSchedule, updateScheduleStatus,
      sendQuote, updateQuoteStatus, addPayment, confirmPayment, rejectPayment,
      sendMessage, markMessagesRead, markNotificationRead, addUser, generateId
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
