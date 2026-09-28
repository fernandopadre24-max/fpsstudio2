import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Check, CheckCheck, Upload, Image } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function ClientChat() {
  const { messages, sendMessage, currentUser } = useApp();
  const [messageText, setMessageText] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ADMIN_ID = "u1";

  const chatMessages = messages.filter(m =>
    (m.fromId === currentUser?.id && m.toId === ADMIN_ID) ||
    (m.fromId === ADMIN_ID && m.toId === currentUser?.id)
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  const handleSend = () => {
    if (!messageText.trim() || !currentUser) return;
    sendMessage({ fromId: currentUser.id, toId: ADMIN_ID, content: messageText, type: "text" });
    setMessageText("");
  };

  const handleSendReceipt = () => {
    if (!currentUser) return;
    sendMessage({
      fromId: currentUser.id,
      toId: ADMIN_ID,
      content: "Segue comprovante de pagamento",
      type: "receipt",
      attachmentUrl: "comprovante_simulado.jpg"
    });
    setShowUpload(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Chat com o Estúdio</h1>
        <p className="text-gray-400 text-sm mt-1">Envie mensagens e comprovantes de pagamento</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <p className="text-white font-medium">Studio Pro</p>
              <p className="text-green-400 text-xs">Online</p>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400">Inicie uma conversa com o estúdio</p>
              </div>
            )}
            {chatMessages.map(msg => {
              const isMine = msg.fromId === currentUser?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMine
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md"
                      : "bg-white/10 text-white rounded-bl-md"
                  }`}>
                    {msg.type === "receipt" && (
                      <div className="mb-2 p-2 rounded-lg bg-white/10 text-xs flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        <span>Comprovante de pagamento</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] opacity-60">
                        {new Date(msg.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {isMine && (msg.read ? <CheckCheck className="w-3 h-3 opacity-60" /> : <Check className="w-3 h-3 opacity-60" />)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Upload de comprovante */}
          {showUpload && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-4 py-3 border-t border-white/10 bg-amber-500/5">
              <p className="text-amber-300 text-sm mb-2">📎 Enviar comprovante de pagamento</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-colors">
                  Selecionar arquivo
                </button>
                <button onClick={handleSendReceipt} className="py-2 px-4 rounded-lg bg-green-500/20 text-green-300 text-sm hover:bg-green-500/30 transition-colors">
                  Enviar comprovante
                </button>
                <button onClick={() => setShowUpload(false)} className="py-2 px-4 rounded-lg bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 transition-colors">
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Enviar comprovante"
              >
                <Upload className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!messageText.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
