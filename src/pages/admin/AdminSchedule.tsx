import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Check, X, Send, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function AdminSchedule() {
  const { schedules, users, services, quotes, updateScheduleStatus, sendQuote, currentUser } = useApp();
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [pixKey, setPixKey] = useState("");

  const handleSendQuote = (scheduleId: string, clientId: string, serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setQuoteAmount(service?.price || 0);
    setSelectedSchedule(scheduleId);
    setShowQuoteModal(true);
  };

  const submitQuote = () => {
    if (!selectedSchedule) return;
    const schedule = schedules.find(s => s.id === selectedSchedule);
    if (!schedule) return;
    
    sendQuote({
      scheduleId: selectedSchedule,
      clientId: schedule.clientId,
      serviceId: schedule.serviceId,
      amount: quoteAmount,
      status: "enviado",
      pixKey: pixKey || "studio@pix.com",
      sentAt: new Date().toISOString()
    });
    setShowQuoteModal(false);
    setPixKey("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie os horários de gravação</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Agenda do Estúdio
        </h3>
        
        <div className="space-y-3">
          {schedules.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum agendamento encontrado</p>
          ) : (
            schedules.map(schedule => {
              const client = users.find(u => u.id === schedule.clientId);
              const service = services.find(s => s.id === schedule.serviceId);
              const hasQuote = quotes.some(q => q.scheduleId === schedule.id);
              
              return (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{client?.name}</p>
                      <p className="text-gray-400 text-sm">{service?.name}</p>
                      <p className="text-gray-500 text-xs">{schedule.date} • {schedule.startTime} - {schedule.endTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      schedule.status === "confirmado" ? "bg-green-500/20 text-green-300" :
                      schedule.status === "pendente" ? "bg-amber-500/20 text-amber-300" :
                      schedule.status === "concluido" ? "bg-blue-500/20 text-blue-300" :
                      "bg-red-500/20 text-red-300"
                    }`}>
                      {schedule.status}
                    </span>
                    
                    {schedule.status === "pendente" && (
                      <>
                        <button
                          onClick={() => updateScheduleStatus(schedule.id, "confirmado")}
                          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          title="Confirmar"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateScheduleStatus(schedule.id, "cancelado")}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          title="Cancelar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    {!hasQuote && schedule.status === "confirmado" && (
                      <button
                        onClick={() => handleSendQuote(schedule.id, schedule.clientId, schedule.serviceId)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm"
                      >
                        <Send className="w-4 h-4" />
                        Enviar Orçamento
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Grade de horários */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Horários Disponíveis - Hoje</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {Array.from({ length: 12 }, (_, i) => {
            const hour = `${(8 + i).toString().padStart(2, "0")}:00`;
            const isBooked = schedules.some(s => s.date === new Date().toISOString().split("T")[0] && s.startTime === hour);
            return (
              <div
                key={hour}
                className={`p-3 rounded-lg text-center text-sm font-medium ${
                  isBooked
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-green-500/10 text-green-300 border border-green-500/20 hover:bg-green-500/20 cursor-pointer"
                }`}
              >
                {hour}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Orçamento */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-semibold text-lg mb-4">Enviar Orçamento via PIX</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Valor (R$)</label>
                <input
                  type="number"
                  value={quoteAmount}
                  onChange={e => setQuoteAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Chave PIX</label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={e => setPixKey(e.target.value)}
                  placeholder="CPF, e-mail, telefone..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              {/* PIX Code simulado */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-400 mb-2">Código PIX Copia e Cola:</p>
                <code className="text-xs text-purple-300 break-all">
                  00020126580014br.gov.bcb.pix0136{pixKey || "studio@pix.com"}5204000053039865406{quoteAmount.toFixed(2)}5802BR
                </code>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowQuoteModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors">
                Cancelar
              </button>
              <button onClick={submitQuote} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all">
                Enviar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
