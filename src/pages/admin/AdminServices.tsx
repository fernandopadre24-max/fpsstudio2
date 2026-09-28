import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Plus, Minus, X, Music, Package, Sparkles,
  Check, Star, Clock, Tag, ShoppingBag, Trash2, ArrowRight, Search
} from "lucide-react";
import { useApp } from "../../context/AppContext";

type Category = "todos" | "servicos" | "merch" | "acessorios" | "midias" | "pacotes";

export default function AdminServices() {
  const { services, products } = useApp();
  const [category, setCategory] = useState<Category>("todos");
  const [search, setSearch] = useState("");

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
      <div>
        <h1 className="text-2xl font-bold text-white">Catálogo de Serviços & Produtos</h1>
        <p className="text-gray-400 text-sm mt-1">Visualize todos os itens disponíveis para seus clientes</p>
      </div>

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
          <h2 className="text-3xl font-bold text-white mb-2">
            Catálogo Completo 🎵
          </h2>
          <p className="text-white/90 text-lg">
            {services.length} serviços e {products.length} produtos disponíveis
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar serviços ou produtos..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
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
                      <p className="text-gray-400 text-xs">Preço</p>
                      <p className="text-2xl font-bold text-white">R$ {service.price}</p>
                    </div>
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
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Produtos */}
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
