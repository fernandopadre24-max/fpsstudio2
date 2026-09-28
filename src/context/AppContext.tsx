import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppState, User, Schedule, Quote, Payment, ChatMessage, Notification, Service, Product, CartItem, Order } from "../types";

const STORAGE_KEY = "studio_music_data";

const defaultServices: Service[] = [
  { id: "s1", name: "Gravação Profissional", type: "gravacao", price: 250, duration: 2, description: "Sessão de gravação em estúdio profissional com equipamento de ponta", features: ["Microfones Neumann", "Mesa SSL", "Cabine acústica", "Engenheiro de som"] },
  { id: "s2", name: "Mixagem", type: "mixagem", price: 350, duration: 3, description: "Mixagem profissional de até 8 tracks", features: ["Até 8 tracks", "Plugins premium", "2 revisões inclusas", "Entrega em WAV/MP3"] },
  { id: "s3", name: "Masterização", type: "masterizacao", price: 200, duration: 1, description: "Masterização profissional para plataformas digitais", features: ["Padrão Spotify/Apple", "Loudness otimizado", "Entrega em 24h", "1 revisão inclusa"] },
  { id: "s4", name: "Ensaio", type: "ensaio", price: 100, duration: 2, description: "Sala de ensaio com isolamento acústico", features: ["Bateria completa", "Amplificadores", "PA profissional", "Ar condicionado"] },
  { id: "s5", name: "Gravação Podcast", type: "podcast", price: 180, duration: 2, description: "Gravação de podcast com até 4 participantes", features: ["Até 4 microfones", "Edição básica inclusa", "Mesa de som Rode", "Ambiente climatizado"] },
  { id: "s6", name: "Produção Musical", type: "producao", price: 800, duration: 4, description: "Produção musical completa com arranjos", features: ["Composição", "Arranjos", "Gravação completa", "Mix e Master"] },
];

const defaultProducts: Product[] = [
  { id: "p1", name: "Camiseta Studio Pro", category: "merch", price: 79.90, description: "Camiseta oficial do estúdio em algodão premium", stock: 50, featured: true },
  { id: "p2", name: "Boné Studio Pro", category: "merch", price: 59.90, description: "Boné bordado com logo do estúdio", stock: 30, featured: true },
  { id: "p3", name: "Caneca Personalizada", category: "merch", price: 39.90, description: "Caneca de cerâmica com estampa exclusiva", stock: 40 },
  { id: "p4", name: "CD Virgem Premium", category: "midias", price: 15.00, description: "CD-R virgem de alta qualidade 700MB", stock: 100 },
  { id: "p5", name: "Pen Drive 32GB", category: "midias", price: 89.90, description: "Pen drive para entrega de áudios em alta qualidade", stock: 25, featured: true },
  { id: "p6", name: "Cabo P10 Profissional", category: "acessorios", price: 45.00, description: "Cabo balanceado P10 de 3 metros", stock: 20 },
  { id: "p7", name: "Palheta Premium (kit 12)", category: "acessorios", price: 35.00, description: "Kit com 12 palhetas de diversas espessuras", stock: 60 },
  { id: "p8", name: "Pacote Iniciante", category: "pacotes", price: 499.00, description: "Gravação + Mix + Master de 1 música", stock: 999, featured: true },
  { id: "p9", name: "Pacote Artista", category: "pacotes", price: 1499.00, description: "Gravação + Mix + Master de 3 músicas + 1 ensaio", stock: 999, featured: true },
  { id: "p10", name: "Pacote Banda", category: "pacotes", price: 2999.00, description: "EP completo com 5 músicas + produção + ensaios", stock: 999 },
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
  products: defaultProducts,
  cart: [],
  orders: [],
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
  // Cart
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // Orders
  createOrder: (notes?: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialState, ...parsed, products: parsed.products || defaultProducts, cart: parsed.cart || [], orders: parsed.orders || [] };
      } catch { return initialState; }
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
    setState(s => ({ ...s, schedules: s.schedules.map(sc => sc.id === id ? { ...sc, status } : sc) }));
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
    setState(s => ({ ...s, payments: s.payments.map(p => p.id === id ? { ...p, status: "recusado" as const } : p) }));
  };

  const sendMessage = (msg: Omit<ChatMessage, "id" | "createdAt" | "read">) => {
    const newMsg: ChatMessage = { ...msg, id: generateId(), createdAt: new Date().toISOString(), read: false };
    setState(s => ({ ...s, messages: [...s.messages, newMsg] }));
  };

  const markMessagesRead = (fromId: string, toId: string) => {
    setState(s => ({
      ...s,
      messages: s.messages.map(m => m.fromId === fromId && m.toId === toId ? { ...m, read: true } : m)
    }));
  };

  const markNotificationRead = (id: string) => {
    setState(s => ({ ...s, notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  };

  const addUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = { ...user, id: generateId(), createdAt: new Date().toISOString() };
    setState(s => ({ ...s, users: [...s.users, newUser] }));
  };

  // Cart
  const addToCart = (item: Omit<CartItem, "id">) => {
    setState(s => {
      const existing = s.cart.find(c => c.itemId === item.itemId && c.type === item.type);
      if (existing) {
        return {
          ...s,
          cart: s.cart.map(c => c.id === existing.id ? { ...c, quantity: c.quantity + item.quantity } : c)
        };
      }
      return { ...s, cart: [...s.cart, { ...item, id: generateId() }] };
    });
  };

  const removeFromCart = (id: string) => {
    setState(s => ({ ...s, cart: s.cart.filter(c => c.id !== id) }));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setState(s => ({ ...s, cart: s.cart.filter(c => c.id !== id) }));
    } else {
      setState(s => ({ ...s, cart: s.cart.map(c => c.id === id ? { ...c, quantity } : c) }));
    }
  };

  const clearCart = () => setState(s => ({ ...s, cart: [] }));

  // Orders
  const createOrder = (notes?: string) => {
    if (state.cart.length === 0 || !state.currentUser) return;
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: generateId(),
      clientId: state.currentUser.id,
      items: [...state.cart],
      total,
      status: "pendente",
      notes,
      createdAt: new Date().toISOString()
    };
    setState(s => ({
      ...s,
      orders: [...s.orders, newOrder],
      cart: [],
      notifications: [...s.notifications, {
        id: generateId(),
        userId: "u1",
        title: "Novo pedido recebido",
        message: `${s.currentUser?.name} fez um pedido de R$ ${total.toFixed(2)}`,
        type: "info",
        read: false,
        createdAt: new Date().toISOString()
      }, {
        id: generateId(),
        userId: s.currentUser?.id || "",
        title: "Pedido confirmado",
        message: `Seu pedido de R$ ${total.toFixed(2)} foi recebido!`,
        type: "success",
        read: false,
        createdAt: new Date().toISOString()
      }]
    }));
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setState(s => ({
      ...s,
      orders: s.orders.map(o => o.id === id ? { ...o, status, approvedAt: status === "aprovado" ? new Date().toISOString() : o.approvedAt } : o)
    }));
  };

  return (
    <AppContext.Provider value={{
      ...state, login, logout, addSchedule, updateScheduleStatus,
      sendQuote, updateQuoteStatus, addPayment, confirmPayment, rejectPayment,
      sendMessage, markMessagesRead, markNotificationRead, addUser, generateId,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      createOrder, updateOrderStatus
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
