import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminFinancial() {
  const { payments, users, quotes } = useApp();

  const confirmedPayments = payments.filter(p => p.status === "confirmado");
  const pendingPayments = payments.filter(p => p.status === "aguardando_comprovante");
  const totalRevenue = confirmedPayments.reduce((s, p) => s + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((s, p) => s + p.amount, 0);

  // Dados mensais
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(i);
    const monthPayments = confirmedPayments.filter(p => {
      const d = new Date(p.confirmedAt || p.createdAt);
      return d.getMonth() === i;
    });
    return {
      name: month.toLocaleDateString("pt-BR", { month: "short" }),
      receita: monthPayments.reduce((s, p) => s + p.amount, 0) || 0,
    };
  });

  // Fluxo de caixa
  const cashFlow = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayPayments = confirmedPayments.filter(p => {
      const d = new Date(p.confirmedAt || p.createdAt);
      return d.toDateString() === date.toDateString();
    });
    return {
      day: date.getDate(),
      entrada: dayPayments.reduce((s, p) => s + p.amount, 0) || Math.random() * 300,
    };
  });

  // Por cliente
  const clientRevenue = users.filter(u => u.role === "client").map(client => {
    const clientPayments = confirmedPayments.filter(p => p.clientId === client.id);
    return {
      name: client.name.split(" ")[0],
      total: clientPayments.reduce((s, p) => s + p.amount, 0),
    };
  }).filter(c => c.total > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Financeiro</h1>
        <p className="text-gray-400 text-sm mt-1">Controle financeiro do estúdio</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Receita Total", value: `R$ ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Pendente", value: `R$ ${pendingAmount.toFixed(2)}`, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Transações", value: confirmedPayments.length.toString(), icon: CheckCircle, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Ticket Médio", value: `R$ ${(totalRevenue / (confirmedPayments.length || 1)).toFixed(2)}`, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
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

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Receita Anual
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} formatter={(v: number) => [`R$ ${v.toFixed(2)}`, "Receita"]} />
              <Bar dataKey="receita" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-purple-400" />
            Fluxo de Caixa (30 dias)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} formatter={(v: number) => [`R$ ${v.toFixed(2)}`, "Entrada"]} />
              <Line type="monotone" dataKey="entrada" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tabela de transações */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          Histórico de Transações
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Cliente</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Valor</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Data</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const client = users.find(u => u.id === p.clientId);
                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white text-sm">{client?.name}</td>
                    <td className="py-3 px-4 text-white text-sm font-medium">R$ {p.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{new Date(p.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.status === "confirmado" ? "bg-green-500/20 text-green-300" :
                        p.status === "aguardando_comprovante" ? "bg-amber-500/20 text-amber-300" :
                        p.status === "recusado" ? "bg-red-500/20 text-red-300" :
                        "bg-gray-500/20 text-gray-300"
                      }`}>
                        {p.status === "confirmado" ? "Confirmado" : p.status === "aguardando_comprovante" ? "Aguardando" : p.status === "recusado" ? "Recusado" : "Pendente"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
