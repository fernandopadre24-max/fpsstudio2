import { motion } from "framer-motion";
import { Package, CheckCircle, Clock, XCircle, AlertCircle, Music, ShoppingBag, Eye } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function AdminOrders() {
  const { orders, users, updateOrderStatus } = useApp();
  const [filter, setFilter] = useState<string>("todos");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = filter === "todos" ? orders : orders.filter(o => o.status === filter);
  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const statusConfig: Record<string, { label: string; color: string; icon: any; bg: string }> = {
    pendente: { label: "Pendente", color: "text-amber-400", icon: Clock, bg: "bg-amber-500/20" },
    aprovado: { label: "Aprovado", color: "text-blue-400", icon: CheckCircle, bg: "bg-blue-500/20" },
    em_producao: { label: "Em Produção", color: "text-purple-400", icon: AlertCircle, bg: "bg-purple-500/20" },
    concluido: { label: "Concluído", color: "text-green-400", icon: CheckCircle, bg: "bg-green-500/20" },
    cancelado: { label: "Cancelado", color: "text-red-400", icon: XCircle, bg: "bg-red-500/20" },
  };

  const totalPending = orders.filter(o => o.status === "pendente").reduce((s, o) => s + o.total, 0);
  const totalApproved = orders.filter(o => o.status === "aprovado" || o.status === "em_producao").reduce((s, o) => s + o.total, 0);
  const totalCompleted = orders.filter(o => o.status === "concluido").reduce((s, o) => s + o.total, 0);

  const filters = [
    { id: "todos", label: "Todos" },
    { id: "pendente", label: "Pendentes" },
    { id: "aprovado", label: "Aprovados" },
    { id: "em_producao", label: "Em Produção" },
    { id: "concluido", label: "Concluídos" },
    { id: "cancelado", label: "Cancelados" },
  ];

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pedidos</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie os pedidos dos clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Pendentes</p>
          <p className="text-2xl font-bold text-amber-400">R$ {totalPending.toFixed(2)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Em Andamento</p>
          <p className="text-2xl font-bold text-blue-400">R$ {totalApproved.toFixed(2)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Concluídos</p>
          <p className="text-2xl font-bold text-green-400">R$ {totalCompleted.toFixed(2)}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
              filter === f.id
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {sortedOrders.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedOrders.map((order, i) => {
            const client = users.find(u => u.id === order.clientId);
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {client?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{client?.name}</p>
                      <p className="text-gray-400 text-xs">
                        #{order.id.slice(0, 6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                    <p className="text-white font-bold">R$ {order.total.toFixed(2)}</p>
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.items.slice(0, 3).map(item => (
                    <span key={item.id} className="px-2 py-1 rounded-md bg-white/5 text-gray-300 text-xs">
                      {item.name} ({item.quantity}x)
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="px-2 py-1 rounded-md bg-white/5 text-gray-400 text-xs">
                      +{order.items.length - 3} itens
                    </span>
                  )}
                </div>

                {/* Actions */}
                {order.status === "pendente" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => updateOrderStatus(order.id, "aprovado")}
                      className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 text-sm font-medium transition-colors"
                    >
                      ✓ Aprovar
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "cancelado")}
                      className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm font-medium transition-colors"
                    >
                      ✗ Cancelar
                    </button>
                  </div>
                )}
                {order.status === "aprovado" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => updateOrderStatus(order.id, "em_producao")}
                      className="flex-1 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-sm font-medium transition-colors"
                    >
                      Iniciar Produção
                    </button>
                  </div>
                )}
                {order.status === "em_producao" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => updateOrderStatus(order.id, "concluido")}
                      className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 text-sm font-medium transition-colors"
                    >
                      ✓ Marcar como Concluído
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal de detalhes */}
      {selectedOrderData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Detalhes do Pedido</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-gray-400 text-xs mb-1">Cliente</p>
                <p className="text-white font-medium">{users.find(u => u.id === selectedOrderData.clientId)?.name}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-gray-400 text-xs mb-3">Itens</p>
                <div className="space-y-2">
                  {selectedOrderData.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2">
                        {item.type === "service" ? <Music className="w-4 h-4 text-purple-400" /> : <ShoppingBag className="w-4 h-4 text-blue-400" />}
                        <div>
                          <p className="text-white text-sm">{item.name}</p>
                          <p className="text-gray-400 text-xs">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="text-white font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrderData.notes && (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-300 font-medium mb-1">Observações:</p>
                  <p className="text-gray-300 text-sm">{selectedOrderData.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <span className="text-gray-300">Total:</span>
                <span className="text-2xl font-bold text-white">R$ {selectedOrderData.total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => setSelectedOrder(null)} className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
              Fechar
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
