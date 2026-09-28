import { motion } from "framer-motion";
import { Calendar, DollarSign, Clock, CheckCircle, Music, Package, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function ClientDashboard() {
  const { currentUser, schedules, payments, quotes, services, orders } = useApp();

  const mySchedules = schedules.filter(s => s.clientId === currentUser?.id);
  const myPayments = payments.filter(p => p.clientId === currentUser?.id);
  const myQuotes = quotes.filter(q => q.clientId === currentUser?.id);
  const myOrders = orders.filter(o => o.clientId === currentUser?.id);
  const totalSpent = myPayments.filter(p => p.status === "confirmado").reduce((s, p) => s + p.amount, 0);
  const upcomingSchedules = mySchedules.filter(s => s.status === "confirmado" || s.status === "pendente");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Olá, {currentUser?.name?.split(" ")[0]}! 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Bem-vindo ao seu painel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Agendamentos", value: mySchedules.length, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Total Gasto", value: `R$ ${totalSpent.toFixed(2)}`, icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Orçamentos", value: myQuotes.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Pagamentos OK", value: myPayments.filter(p => p.status === "confirmado").length, icon: CheckCircle, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Próximos agendamentos */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Próximos Agendamentos
        </h3>
        {upcomingSchedules.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nenhum agendamento pendente</p>
        ) : (
          <div className="space-y-3">
            {upcomingSchedules.map(s => {
              const service = services.find(sv => sv.id === s.serviceId);
              return (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Music className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{service?.name}</p>
                      <p className="text-gray-400 text-xs">{s.date} • {s.startTime} - {s.endTime}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    s.status === "confirmado" ? "bg-green-500/20 text-green-300" : "bg-amber-500/20 text-amber-300"
                  }`}>
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* CTA Serviços */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Link
          to="/cliente/servicos"
          className="block p-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Faça seu pedido agora!
              </h3>
              <p className="text-white/80 text-sm mt-1">Explore nossos serviços e produtos exclusivos</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Meus Pedidos */}
      {myOrders.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              Meus Pedidos
            </h3>
            <Link to="/cliente/pedidos" className="text-purple-300 hover:text-purple-200 text-sm">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-2">
            {myOrders.slice(-3).reverse().map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-white text-sm font-medium">#{order.id.slice(0, 6).toUpperCase()}</p>
                  <p className="text-gray-400 text-xs">{order.items.length} {order.items.length === 1 ? "item" : "itens"} • {new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">R$ {order.total.toFixed(2)}</p>
                  <span className={`text-xs ${
                    order.status === "concluido" ? "text-green-400" :
                    order.status === "pendente" ? "text-amber-400" :
                    order.status === "cancelado" ? "text-red-400" : "text-blue-400"
                  }`}>
                    {order.status === "pendente" ? "Pendente" : order.status === "aprovado" ? "Aprovado" : order.status === "em_producao" ? "Em produção" : order.status === "concluido" ? "Concluído" : "Cancelado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Orçamentos */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          Meus Orçamentos
        </h3>
        {myQuotes.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nenhum orçamento recebido</p>
        ) : (
          <div className="space-y-3">
            {myQuotes.map(q => {
              const service = services.find(s => s.id === q.serviceId);
              return (
                <div key={q.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-white text-sm font-medium">{service?.name}</p>
                    <p className="text-gray-400 text-xs">Emitido em {new Date(q.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">R$ {q.amount.toFixed(2)}</p>
                    <span className={`text-xs ${
                      q.status === "aprovado" ? "text-green-400" :
                      q.status === "enviado" ? "text-blue-400" :
                      q.status === "pendente" ? "text-amber-400" : "text-red-400"
                    }`}>
                      {q.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
