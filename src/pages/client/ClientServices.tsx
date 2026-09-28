import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Plus, Minus, X, Music, Package, Sparkles,
  Check, Star, Clock, Tag, ShoppingBag, Trash2, ArrowRight, Search
} from "lucide-react";
import { useApp } from "../../context/AppContext";

type Category = "todos" | "servicos" | "merch" | "acessorios" | "midias" | "pacotes";

export default function ClientServices() {
  const { services, products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, createOrder } = useApp();
  const [category, setCategory] = useState<Category>("todos");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ type: "service" | "product"; id: string } | null>(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredServices = services.filter(s =>
    (category === "todos" || category === "servicos") &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredProducts = products.filter(p =>
    (category === "todos" || category === p.category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = [
    { id: "todos" as Category, label: "Todos", icon: Sparkles },
    { id: "servicos" as Category, label: "Serviços", icon: Music },
    { id: "pacotes" as Category, label: "Pacotes", icon: Tag },
    { id: "merch" as Category, label: "Merch", icon: ShoppingBag },
    { id: "acessorios" as Category, label: "Acessórios", icon: Package },
    { id: "midias" as Category, label: "Mídias", icon: Star },
  ];

  const handleAddService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    addToCart({
      type: "service",
      itemId: service.id,
      name: service.name,
      price: service.price,
      quantity: 1,
      duration: service.duration
    });
  };

  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    addToCart({
      type: "product",
      itemId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  const handleFinishOrder = () => {
    if (cart.length === 0) return;
    createOrder(orderNotes);
    setOrderNotes("");
    setCartOpen(false);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  const serviceGradients: Record<string, string> = {
    gravacao: "from-purple-500 to-pink-500",
    mixagem: "from-blue-500 to-cyan-500",
    masterizacao: "from-green-500 to-emerald-500",
    ensaio: "from-amber-500 to-orange-500",
    podcast: "from-red-500 to-rose-500",
    producao: "from-indigo-500 to-purple-500",
  };

  const productGradients: Record<string, string> = {
    merch: "from-pink-500 to-rose-500",
    acessorios: "from-blue-500 to-indigo-500",
    midias: "from-green-500 to-teal-500",
    pacotes: "from-amber-500 to-yellow-500",
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-8"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full filter blur-3xl" />
        </div>
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Serviços & Produtos 🎵
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            Explore nosso catálogo completo de serviços profissionais e produtos exclusivos do estúdio.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
              ✨ Entrega rápida
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
              💎 Qualidade profissional
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
              🎧 Equipamento de ponta
            </span>
          </div>
        </div>
      </motion.div>

      {orderSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 flex items-center gap-3">
          <Check className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Pedido realizado com sucesso!</p>
            <p className="text-sm opacity-80">O estúdio entrará em contato para confirmação.</p>
          </div>
        </motion.div>
      )}

      {/* Search + Cart Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar serviços ou produtos..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Carrinho</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
              category === cat.id
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Serviços */}
      {(category === "todos" || category === "servicos") && filteredServices.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-400" />
            Serviços Profissionais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all"
              >
                <div className={`h-32 bg-gradient-to-br ${serviceGradients[service.type]} p-5 relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <Music className="absolute -right-4 -bottom-4 w-32 h-32 text-white" />
                  </div>
                  <div className="relative">
                    <span className="px-2 py-1 rounded-md bg-black/20 text-white text-xs font-medium backdrop-blur-sm">
                      {service.type.toUpperCase()}
                    </span>
                    <h3 className="text-white font-bold text-lg mt-2">{service.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-400 text-sm mb-3">{service.description}</p>
                  
                  {service.features && (
                    <div className="space-y-1.5 mb-4">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <Clock className="w-3 h-3" />
                    <span>{service.duration}h de duração</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div>
                      <p className="text-gray-400 text-xs">A partir de</p>
                      <p className="text-2xl font-bold text-white">R$ {service.price}</p>
                    </div>
                    <button
                      onClick={() => handleAddService(service.id)}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Pacotes */}
      {(category === "todos" || category === "pacotes") && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            Pacotes Especiais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.filter(p => p.category === "pacotes" && p.name.toLowerCase().includes(search.toLowerCase())).map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all ${pkg.featured ? "border-amber-500/50" : "border-white/10"}`}
              >
                {pkg.featured && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold shadow-lg">
                    ⭐ DESTAQUE
                  </div>
                )}
                <div className={`h-32 bg-gradient-to-br ${productGradients[pkg.category]} p-5 relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <Package className="absolute -right-4 -bottom-4 w-32 h-32 text-white" />
                  </div>
                  <div className="relative">
                    <h3 className="text-white font-bold text-xl">{pkg.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <p className="text-2xl font-bold text-white">R$ {pkg.price.toFixed(2)}</p>
                    <button
                      onClick={() => handleAddProduct(pkg.id)}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-sm font-medium hover:from-amber-500 hover:to-yellow-500 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Produtos (Merch, Acessórios, Mídias) */}
      {["merch", "acessorios", "midias"].map(cat => {
        const catProducts = filteredProducts.filter(p => p.category === cat);
        if (catProducts.length === 0) return null;
        const labels: Record<string, { title: string; icon: any; color: string }> = {
          merch: { title: "Merch Oficial", icon: ShoppingBag, color: "text-pink-400" },
          acessorios: { title: "Acessórios", icon: Package, color: "text-blue-400" },
          midias: { title: "Mídias", icon: Star, color: "text-green-400" },
        };
        const { title, icon: Icon, color } = labels[cat];
        return (
          <div key={cat}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Icon className={`w-5 h-5 ${color}`} />
              {title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {catProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all"
                >
                  <div className={`h-24 bg-gradient-to-br ${productGradients[product.category]} relative overflow-hidden flex items-center justify-center`}>
                    <Package className="w-12 h-12 text-white/40" />
                    {product.featured && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold">
                        NOVO
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-white text-sm font-medium truncate">{product.name}</h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2 h-8">{product.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-lg font-bold text-white">R$ {product.price.toFixed(2)}</p>
                      <button
                        onClick={() => handleAddProduct(product.id)}
                        className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Carrinho lateral */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-900 border-l border-white/10 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Seu Carrinho
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">{cartCount} {cartCount === 1 ? "item" : "itens"}</p>
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-10 h-10 text-gray-600" />
                    </div>
                    <p className="text-gray-400">Seu carrinho está vazio</p>
                    <p className="text-gray-500 text-sm mt-1">Adicione serviços ou produtos</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.type === "service" ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30" : "bg-gradient-to-br from-blue-500/30 to-cyan-500/30"
                        }`}>
                          {item.type === "service" ? <Music className="w-5 h-5 text-purple-300" /> : <Package className="w-5 h-5 text-blue-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.name}</p>
                          <p className="text-gray-400 text-xs">R$ {item.price.toFixed(2)} {item.duration ? `• ${item.duration}h` : ""}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-white/5 text-white hover:bg-white/10 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-white/5 text-white hover:bg-white/10 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300 mt-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-gray-900/95">
                  <div className="mb-4">
                    <label className="text-sm text-gray-400 mb-1 block">Observações (opcional)</label>
                    <textarea
                      value={orderNotes}
                      onChange={e => setOrderNotes(e.target.value)}
                      placeholder="Alguma observação sobre o pedido?"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-2xl font-bold text-white">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                    >
                      Limpar
                    </button>
                    <button
                      onClick={handleFinishOrder}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                    >
                      Finalizar Pedido
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating cart button (mobile) */}
      {cartCount > 0 && !cartOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-30 lg:hidden w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/40 flex items-center justify-center"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {cartCount}
          </span>
        </motion.button>
      )}
    </div>
  );
}
