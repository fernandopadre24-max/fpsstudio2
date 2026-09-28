import { motion } from "framer-motion";
import { Calendar, DollarSign, Clock, CheckCircle, Music } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function ClientDashboard() {
  const { currentUser, schedules, payments, quotes, services } = useApp();

  const mySchedules = schedules.filter(s => s.clientId === currentUser?.id);
  const myPayments = payments.filter(p => p.clientId === currentUser?.id);
  const myQuotes = quotes.filter(q => q.clientId === currentUser?.id);
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

      {/* Orçamentos */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
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
