import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle, AlertCircle, Music, ShoppingBag } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function ClientOrders() {
  const { orders, currentUser } = useApp();
  const myOrders = orders.filter(o => o.clientId === currentUser?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const statusConfig: Record<string, { label: string; color: string; icon: any; bg: string }> = {
    pendente: { label: "Pendente", color: "text-amber-400", icon: Clock, bg: "bg-amber-500/20" },
    aprovado: { label: "Aprovado", color: "text-blue-400", icon: CheckCircle, bg: "bg-blue-500/20" },
    em_producao: { label: "Em Produção", color: "text-purple-400", icon: AlertCircle, bg: "bg-purple-500/20" },
    concluido: { label: "Concluído", color: "text-green-400", icon: CheckCircle, bg: "bg-green-500/20" },
    cancelado: { label: "Cancelado", color: "text-red-400", icon: XCircle, bg: "bg-red-500/20" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Meus Pedidos</h1>
        <p className="text-gray-400 text-sm mt-1">Acompanhe o status dos seus pedidos</p>
      </div>

      {myOrders.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-gray-400 text-lg">Nenhum pedido realizado</p>
          <p className="text-gray-500 text-sm mt-1">Explore nosso catálogo e faça seu primeiro pedido!</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order, i) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold">Pedido #{order.id.slice(0, 6).toUpperCase()}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">
                      Realizado em {new Date(order.createdAt).toLocaleDateString("pt-BR")} às {new Date(order.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Total</p>
                    <p className="text-2xl font-bold text-white">R$ {order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="p-5">
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Itens do pedido</p>
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.type === "service" ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30" : "bg-gradient-to-br from-blue-500/30 to-cyan-500/30"
                        }`}>
                          {item.type === "service" ? <Music className="w-5 h-5 text-purple-300" /> : <ShoppingBag className="w-5 h-5 text-blue-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.name}</p>
                          <p className="text-gray-400 text-xs">
                            {item.quantity}x R$ {item.price.toFixed(2)}
                            {item.duration ? ` • ${item.duration}h` : ""}
                          </p>
                        </div>
                        <p className="text-white font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <p className="text-xs text-purple-300 font-medium mb-1">Observações:</p>
                      <p className="text-gray-300 text-sm">{order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="px-5 pb-5">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${["pendente", "aprovado", "em_producao", "concluido"].includes(order.status) ? "text-green-400" : "text-gray-500"}`}>
                      <div className={`w-2 h-2 rounded-full ${["pendente", "aprovado", "em_producao", "concluido"].includes(order.status) ? "bg-green-400" : "bg-gray-600"}`} />
                      Recebido
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className={`flex items-center gap-1 ${["aprovado", "em_producao", "concluido"].includes(order.status) ? "text-blue-400" : "text-gray-500"}`}>
                      <div className={`w-2 h-2 rounded-full ${["aprovado", "em_producao", "concluido"].includes(order.status) ? "bg-blue-400" : "bg-gray-600"}`} />
                      Aprovado
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className={`flex items-center gap-1 ${["em_producao", "concluido"].includes(order.status) ? "text-purple-400" : "text-gray-500"}`}>
                      <div className={`w-2 h-2 rounded-full ${["em_producao", "concluido"].includes(order.status) ? "bg-purple-400" : "bg-gray-600"}`} />
                      Produção
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className={`flex items-center gap-1 ${order.status === "concluido" ? "text-green-400" : "text-gray-500"}`}>
                      <div className={`w-2 h-2 rounded-full ${order.status === "concluido" ? "bg-green-400" : "bg-gray-600"}`} />
                      Concluído
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
