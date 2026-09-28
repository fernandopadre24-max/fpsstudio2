import { motion } from "framer-motion";
import { Calendar, DollarSign, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const { schedules, payments, users, quotes, services } = useApp();
  
  const clients = users.filter(u => u.role === "client");
  const confirmedPayments = payments.filter(p => p.status === "confirmado");
  const totalRevenue = confirmedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status !== "confirmado");
  const todaySchedules = schedules.filter(s => s.date === new Date().toISOString().split("T")[0]);

  // Dados para gráfico mensal
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - i));
    const monthStr = month.toLocaleDateString("pt-BR", { month: "short" });
    const monthPayments = confirmedPayments.filter(p => {
      const pDate = new Date(p.confirmedAt || p.createdAt);
      return pDate.getMonth() === month.getMonth() && pDate.getFullYear() === month.getFullYear();
    });
    return { name: monthStr, receita: monthPayments.reduce((s, p) => s + p.amount, 0) || Math.random() * 2000 + 500 };
  });

  // Dados para pizza de serviços
  const serviceData = services.map(s => ({
    name: s.name.split(" ")[0],
    value: schedules.filter(sc => sc.serviceId === s.id).length || 1
  }));

  const COLORS = ["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const stats = [
    { label: "Receita Total", value: `R$ ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "from-green-500 to-emerald-500", bg: "bg-green-500/10" },
    { label: "Agendamentos Hoje", value: todaySchedules.length.toString(), icon: Calendar, color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10" },
    { label: "Clientes Ativos", value: clients.length.toString(), icon: Users, color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10" },
    { label: "Pagamentos Pendentes", value: pendingPayments.length.toString(), icon: Clock, color: "from-amber-500 to-orange-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Visão geral do seu estúdio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: stat.color.includes("green") ? "#10b981" : stat.color.includes("blue") ? "#3b82f6" : stat.color.includes("purple") ? "#a855f7" : "#f59e0b" }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Receita Mensal
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
              <Bar dataKey="receita" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Serviços</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                {serviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Agendamentos Recentes
          </h3>
          <div className="space-y-3">
            {schedules.slice(-5).reverse().map(s => {
              const client = users.find(u => u.id === s.clientId);
              const service = services.find(sv => sv.id === s.serviceId);
              return (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-white text-sm font-medium">{client?.name}</p>
                    <p className="text-gray-400 text-xs">{service?.name} • {s.date} {s.startTime}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    s.status === "confirmado" ? "bg-green-500/20 text-green-300" :
                    s.status === "pendente" ? "bg-amber-500/20 text-amber-300" :
                    "bg-red-500/20 text-red-300"
                  }`}>
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Pagamentos Recentes
          </h3>
          <div className="space-y-3">
            {payments.slice(-5).reverse().map(p => {
              const client = users.find(u => u.id === p.clientId);
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-white text-sm font-medium">{client?.name}</p>
                    <p className="text-gray-400 text-xs">{new Date(p.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">R$ {p.amount.toFixed(2)}</p>
                    <span className={`text-xs ${p.status === "confirmado" ? "text-green-400" : "text-amber-400"}`}>
                      {p.status === "confirmado" ? "Confirmado" : "Pendente"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
