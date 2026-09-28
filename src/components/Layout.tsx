import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, MessageCircle, DollarSign, FileText,
  Users, LogOut, Bell, Music, Menu, X, ChevronRight, Package, ShoppingBag
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, notifications, logout, markNotificationRead } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userNotifs = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifs.filter(n => !n.read).length;

  const adminLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/agendamentos", icon: Calendar, label: "Agendamentos" },
    { to: "/admin/servicos", icon: ShoppingBag, label: "Serviços & Produtos" },
    { to: "/admin/pedidos", icon: Package, label: "Pedidos" },
    { to: "/admin/chat", icon: MessageCircle, label: "Chat" },
    { to: "/admin/financeiro", icon: DollarSign, label: "Financeiro" },
    { to: "/admin/relatorios", icon: FileText, label: "Relatórios" },
    { to: "/admin/clientes", icon: Users, label: "Clientes" },
  ];

  const clientLinks = [
    { to: "/cliente", icon: LayoutDashboard, label: "Meu Painel" },
    { to: "/cliente/servicos", icon: Package, label: "Serviços & Produtos" },
    { to: "/cliente/pedidos", icon: ShoppingBag, label: "Meus Pedidos" },
    { to: "/cliente/agendar", icon: Calendar, label: "Agendar" },
    { to: "/cliente/chat", icon: MessageCircle, label: "Chat" },
    { to: "/cliente/pagamentos", icon: DollarSign, label: "Pagamentos" },
  ];

  const links = currentUser?.role === "admin" ? adminLinks : clientLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Studio Pro</h1>
                <p className="text-gray-400 text-xs">Sistema de Gestão</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {links.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{currentUser?.name}</p>
                <p className="text-gray-400 text-xs truncate">{currentUser?.role === "admin" ? "Administrador" : "Cliente"}</p>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors" title="Sair">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1" />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <h3 className="text-white font-semibold text-sm">Notificações</h3>
                      <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {userNotifs.length === 0 ? (
                        <p className="p-4 text-gray-400 text-sm text-center">Nenhuma notificação</p>
                      ) : (
                        userNotifs.slice(-10).reverse().map(n => (
                          <button
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? "bg-purple-500/5" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? "bg-purple-400" : "bg-gray-600"}`} />
                              <div>
                                <p className="text-white text-sm font-medium">{n.title}</p>
                                <p className="text-gray-400 text-xs mt-0.5">{n.message}</p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
