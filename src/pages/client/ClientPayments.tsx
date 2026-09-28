import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Copy, Check, QrCode, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function ClientPayments() {
  const { quotes, payments, addPayment, services, currentUser } = useApp();
  const [copiedPix, setCopiedPix] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState<string | null>(null);

  const myQuotes = quotes.filter(q => q.clientId === currentUser?.id);
  const myPayments = payments.filter(p => p.clientId === currentUser?.id);

  const copyPix = (quoteId: string, pixKey: string) => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(quoteId);
    setTimeout(() => setCopiedPix(null), 2000);
  };

  const sendReceipt = (quoteId: string, amount: number) => {
    addPayment({
      quoteId,
      clientId: currentUser?.id || "",
      amount,
      status: "aguardando_comprovante",
      receiptUrl: "comprovante_simulado.jpg"
    });
    setShowReceipt(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pagamentos</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie seus pagamentos via PIX</p>
      </div>

      {/* Orçamentos pendentes */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          Orçamentos Disponíveis
        </h3>
        {myQuotes.filter(q => q.status === "enviado" || q.status === "aprovado").length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nenhum orçamento pendente</p>
        ) : (
          <div className="space-y-4">
            {myQuotes.filter(q => q.status === "enviado" || q.status === "aprovado").map(quote => {
              const service = services.find(s => s.id === quote.serviceId);
              const pixCode = `00020126580014br.gov.bcb.pix0136${quote.pixKey || "studio@pix.com"}5204000053039865406${quote.amount.toFixed(2)}5802BR`;
              const hasPayment = myPayments.some(p => p.quoteId === quote.id);

              return (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">{service?.name}</p>
                      <p className="text-gray-400 text-xs mt-1">Orçamento emitido em {new Date(quote.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <p className="text-2xl font-bold text-green-400">R$ {quote.amount.toFixed(2)}</p>
                  </div>

                  {/* PIX */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <QrCode className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-white text-sm font-medium">Pagamento via PIX</p>
                        <p className="text-gray-400 text-xs">Chave: {quote.pixKey}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-black/20">
                      <code className="flex-1 text-xs text-green-300 break-all">{pixCode}</code>
                      <button
                        onClick={() => copyPix(quote.id, pixCode)}
                        className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex-shrink-0"
                      >
                        {copiedPix === quote.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {!hasPayment && (
                      <button
                        onClick={() => setShowReceipt(quote.id)}
                        className="w-full mt-3 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-500 hover:to-emerald-500 transition-all text-sm"
                      >
                        Já paguei - Enviar Comprovante
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Histórico */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Histórico de Pagamentos
        </h3>
        {myPayments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nenhum pagamento realizado</p>
        ) : (
          <div className="space-y-3">
            {myPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    payment.status === "confirmado" ? "bg-green-500/20" :
                    payment.status === "aguardando_comprovante" ? "bg-amber-500/20" :
                    "bg-red-500/20"
                  }`}>
                    {payment.status === "confirmado" ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                     payment.status === "aguardando_comprovante" ? <Clock className="w-5 h-5 text-amber-400" /> :
                     <AlertCircle className="w-5 h-5 text-red-400" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">R$ {payment.amount.toFixed(2)}</p>
                    <p className="text-gray-400 text-xs">{new Date(payment.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  payment.status === "confirmado" ? "bg-green-500/20 text-green-300" :
                  payment.status === "aguardando_comprovante" ? "bg-amber-500/20 text-amber-300" :
                  payment.status === "recusado" ? "bg-red-500/20 text-red-300" :
                  "bg-gray-500/20 text-gray-300"
                }`}>
                  {payment.status === "confirmado" ? "Confirmado" :
                   payment.status === "aguardando_comprovante" ? "Aguardando" :
                   payment.status === "recusado" ? "Recusado" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de envio de comprovante */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-semibold text-lg mb-4">Enviar Comprovante</h3>
            <p className="text-gray-400 text-sm mb-4">
              O comprovante será enviado ao estúdio via chat para confirmação.
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
              <p className="text-gray-400 text-xs mb-2">Simulação de upload:</p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 text-sm">comprovante_pix.jpg</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReceipt(null)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
                Cancelar
              </button>
              <button
                onClick={() => {
                  const quote = myQuotes.find(q => q.id === showReceipt);
                  if (quote) sendReceipt(quote.id, quote.amount);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold"
              >
                Confirmar Envio
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
