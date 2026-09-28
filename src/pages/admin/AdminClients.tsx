import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, Phone, Mail, Calendar, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function AdminClients() {
  const { users, schedules, payments, addUser } = useApp();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", password: "123456", phone: "", role: "client" as const, active: true });

  const clients = users.filter(u => u.role === "client");
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) return;
    addUser(newClient);
    setShowModal(false);
    setNewClient({ name: "", email: "", password: "123456", phone: "", role: "client", active: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-gray-400 text-sm mt-1">{clients.length} clientes cadastrados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client, i) => {
          const clientSchedules = schedules.filter(s => s.clientId === client.id);
          const clientPayments = payments.filter(p => p.clientId === client.id);
          const totalSpent = clientPayments.filter(p => p.status === "confirmado").reduce((s, p) => s + p.amount, 0);

          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-medium">{client.name}</h3>
                  <p className="text-gray-400 text-xs">{client.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {client.phone && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Desde {new Date(client.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{clientSchedules.length}</p>
                  <p className="text-gray-400 text-xs">Agendamentos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-400">R$ {totalSpent.toFixed(0)}</p>
                  <p className="text-gray-400 text-xs">Total</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Novo Cliente</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Nome</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">E-mail</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Telefone</label>
                <input
                  type="text"
                  value={newClient.phone}
                  onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Senha</label>
                <input
                  type="text"
                  value={newClient.password}
                  onChange={e => setNewClient({ ...newClient, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
                Cancelar
              </button>
              <button onClick={handleAddClient} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold">
                Cadastrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
