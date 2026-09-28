import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Check, CheckCheck, Image } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function AdminChat() {
  const { users, messages, sendMessage, markMessagesRead, currentUser, payments, confirmPayment, rejectPayment } = useApp();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const clients = users.filter(u => u.role === "client");
  
  const chatMessages = selectedClient
    ? messages.filter(m =>
        (m.fromId === selectedClient && m.toId === currentUser?.id) ||
        (m.fromId === currentUser?.id && m.toId === selectedClient)
      ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  useEffect(() => {
    if (selectedClient && currentUser) {
      markMessagesRead(selectedClient, currentUser.id);
    }
  }, [selectedClient, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  const handleSend = () => {
    if (!messageText.trim() || !selectedClient || !currentUser) return;
    sendMessage({ fromId: currentUser.id, toId: selectedClient, content: messageText, type: "text" });
    setMessageText("");
  };

  const pendingReceipts = payments.filter(p => p.status === "aguardando_comprovante");

  const unreadCount = (clientId: string) =>
    messages.filter(m => m.fromId === clientId && m.toId === currentUser?.id && !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Chat</h1>
        <p className="text-gray-400 text-sm mt-1">Comunique-se com seus clientes</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
        <div className="flex h-full">
          {/* Lista de contatos */}
          <div className="w-80 border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-semibold text-sm">Clientes</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {clients.map(client => {
                const lastMsg = messages
                  .filter(m => m.fromId === client.id || m.toId === client.id)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                const unread = unreadCount(client.id);
                
                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client.id)}
                    className={`w-full flex items-center gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                      selectedClient === client.id ? "bg-purple-500/10 border-l-2 border-l-purple-500" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-medium truncate">{client.name}</p>
                        {unread > 0 && (
                          <span className="w-5 h-5 bg-purple-500 rounded-full text-white text-xs flex items-center justify-center">{unread}</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs truncate">{lastMsg?.content || "Sem mensagens"}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área de chat */}
          <div className="flex-1 flex flex-col">
            {!selectedClient ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400">Selecione um cliente para iniciar a conversa</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {clients.find(c => c.id === selectedClient)?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{clients.find(c => c.id === selectedClient)?.name}</p>
                    <p className="text-green-400 text-xs">Online</p>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                            <div className="mb-2 p-2 rounded-lg bg-white/10 text-xs">
                              <Image className="w-4 h-4 inline mr-1" />
                              Comprovante de pagamento
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

                {/* Comprovantes pendentes */}
                {pendingReceipts.filter(p => p.clientId === selectedClient).length > 0 && (
                  <div className="px-4 py-2 border-t border-white/10 bg-amber-500/5">
                    <p className="text-amber-300 text-xs font-medium mb-2">⚠️ Comprovantes aguardando confirmação:</p>
                    {pendingReceipts.filter(p => p.clientId === selectedClient).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 mb-1">
                        <span className="text-white text-sm">R$ {p.amount.toFixed(2)}</span>
                        <div className="flex gap-2">
                          <button onClick={() => confirmPayment(p.id)} className="px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs hover:bg-green-500/30">
                            ✓ Confirmar
                          </button>
                          <button onClick={() => rejectPayment(p.id)} className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs hover:bg-red-500/30">
                            ✗ Recusar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      <Paperclip className="w-5 h-5" />
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
