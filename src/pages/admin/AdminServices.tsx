import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Plus, Minus, X, Music, Package, Sparkles,
  Check, Star, Clock, Tag, ShoppingBag, Trash2, ArrowRight, Search,
  Edit, Save, Image as ImageIcon, Upload
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Service, Product } from "../../types";

type Category = "todos" | "servicos" | "merch" | "acessorios" | "midias" | "pacotes";

export default function AdminServices() {
  const { services, products, generateId } = useApp();
  const [category, setCategory] = useState<Category>("todos");
  const [search, setSearch] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNewService, setShowNewService] = useState(false);
  const [showNewProduct, setShowNewProduct] = useState(false);

  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    type: "gravacao",
    price: 0,
    duration: 1,
    description: "",
    features: [],
    image: ""
  });

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    category: "merch",
    price: 0,
    description: "",
    stock: 0,
    featured: false,
    image: ""
  });

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "service" | "product") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === "service" && editingService) {
          setEditingService({ ...editingService, image: base64 });
        } else if (type === "product" && editingProduct) {
          setEditingProduct({ ...editingProduct, image: base64 });
        } else if (type === "service" && showNewService) {
          setNewService({ ...newService, image: base64 });
        } else if (type === "product" && showNewProduct) {
          setNewProduct({ ...newProduct, image: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveService = () => {
    if (!editingService) return;
    // Atualizar no localStorage
    const savedData = JSON.parse(localStorage.getItem("studio_music_data") || "{}");
    const updatedServices = savedData.services.map((s: Service) => 
      s.id === editingService.id ? editingService : s
    );
    localStorage.setItem("studio_music_data", JSON.stringify({ ...savedData, services: updatedServices }));
    window.location.reload();
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;
    const savedData = JSON.parse(localStorage.getItem("studio_music_data") || "{}");
    const updatedProducts = savedData.products.map((p: Product) => 
      p.id === editingProduct.id ? editingProduct : p
    );
    localStorage.setItem("studio_music_data", JSON.stringify({ ...savedData, products: updatedProducts }));
    window.location.reload();
  };

  const handleCreateService = () => {
    const savedData = JSON.parse(localStorage.getItem("studio_music_data") || "{}");
    const service: Service = {
      id: generateId(),
      name: newService.name || "",
      type: newService.type || "gravacao",
      price: newService.price || 0,
      duration: newService.duration || 1,
      description: newService.description || "",
      features: newService.features || [],
      image: newService.image || ""
    };
    localStorage.setItem("studio_music_data", JSON.stringify({ 
      ...savedData, 
      services: [...savedData.services, service] 
    }));
    window.location.reload();
  };

  const handleCreateProduct = () => {
    const savedData = JSON.parse(localStorage.getItem("studio_music_data") || "{}");
    const product: Product = {
      id: generateId(),
      name: newProduct.name || "",
      category: newProduct.category || "merch",
      price: newProduct.price || 0,
      description: newProduct.description || "",
      stock: newProduct.stock || 0,
      featured: newProduct.featured || false,
      image: newProduct.image || ""
    };
    localStorage.setItem("studio_music_data", JSON.stringify({ 
      ...savedData, 
      products: [...savedData.products, product] 
    }));
    window.location.reload();
  };

  const handleDeleteService = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    const savedData = JSON.parse(localStorage.getItem("studio_music_data") || "{}");
    const updatedServices = savedData.services.filter((s: Service) => s.id !== id);
    localStorage.setItem("studio_music_data", JSON.stringify({ ...savedData, services: updatedServices }));
    window.location.reload();
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    const savedData = JSON.parse(localStorage.getItem("studio_music_data") || "{}");
    const updatedProducts = savedData.products.filter((p: Product) => p.id !== id);
    localStorage.setItem("studio_music_data", JSON.stringify({ ...savedData, products: updatedProducts }));
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Catálogo de Serviços & Produtos</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie todos os itens disponíveis</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewService(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-5 h-5" />
            Novo Serviço
          </button>
          <button
            onClick={() => setShowNewProduct(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </button>
        </div>
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
                <div className={`h-32 bg-gradient-to-br ${service.image ? "" : serviceGradients[service.type]} p-5 relative overflow-hidden`}>
                  {service.image ? (
                    <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 opacity-20">
                      <Music className="absolute -right-4 -bottom-4 w-32 h-32 text-white" />
                    </div>
                  )}
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingService(service)}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold shadow-lg z-10">
                    ⭐ DESTAQUE
                  </div>
                )}
                <div className={`h-32 bg-gradient-to-br ${pkg.image ? "" : productGradients[pkg.category]} p-5 relative overflow-hidden`}>
                  {pkg.image ? (
                    <img src={pkg.image} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 opacity-20">
                      <Package className="absolute -right-4 -bottom-4 w-32 h-32 text-white" />
                    </div>
                  )}
                  <div className="relative">
                    <h3 className="text-white font-bold text-xl">{pkg.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <p className="text-2xl font-bold text-white">R$ {pkg.price.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(pkg)}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(pkg.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                  <div className={`h-24 bg-gradient-to-br ${product.image ? "" : productGradients[product.category]} relative overflow-hidden flex items-center justify-center`}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <Package className="w-12 h-12 text-white/40" />
                    )}
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
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Modal de Edição de Serviço */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Editar Serviço</h3>
                <button onClick={() => setEditingService(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Nome</label>
                  <input
                    type="text"
                    value={editingService.name}
                    onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Tipo</label>
                  <select
                    value={editingService.type}
                    onChange={e => setEditingService({ ...editingService, type: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="gravacao">Gravação</option>
                    <option value="mixagem">Mixagem</option>
                    <option value="masterizacao">Masterização</option>
                    <option value="ensaio">Ensaio</option>
                    <option value="podcast">Podcast</option>
                    <option value="producao">Produção</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Preço (R$)</label>
                    <input
                      type="number"
                      value={editingService.price}
                      onChange={e => setEditingService({ ...editingService, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Duração (horas)</label>
                    <input
                      type="number"
                      value={editingService.duration}
                      onChange={e => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Descrição</label>
                  <textarea
                    value={editingService.description}
                    onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Features (uma por linha)</label>
                  <textarea
                    value={editingService.features?.join("\n") || ""}
                    onChange={e => setEditingService({ ...editingService, features: e.target.value.split("\n").filter(f => f.trim()) })}
                    rows={4}
                    placeholder="Microfones Neumann&#10;Mesa SSL&#10;Cabine acústica"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Imagem</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={editingService.image || ""}
                      onChange={e => setEditingService({ ...editingService, image: e.target.value })}
                      placeholder="URL da imagem ou faça upload"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <label className="px-4 py-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, "service")}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editingService.image && (
                    <div className="mt-3 relative">
                      <img src={editingService.image} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                      <button
                        onClick={() => setEditingService({ ...editingService, image: "" })}
                        className="absolute top-2 right-2 p-1 rounded bg-red-500/80 text-white hover:bg-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditingService(null)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
                  Cancelar
                </button>
                <button onClick={handleSaveService} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  Salvar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Edição de Produto */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Editar Produto</h3>
                <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Nome</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Categoria</label>
                    <select
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="merch">Merch</option>
                      <option value="acessorios">Acessórios</option>
                      <option value="midias">Mídias</option>
                      <option value="pacotes">Pacotes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Descrição</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Estoque</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.featured || false}
                        onChange={e => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                        className="w-5 h-5 rounded bg-white/5 border border-white/10 text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-gray-300">Destaque</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Imagem</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={editingProduct.image || ""}
                      onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="URL da imagem ou faça upload"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <label className="px-4 py-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, "product")}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editingProduct.image && (
                    <div className="mt-3 relative">
                      <img src={editingProduct.image} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                      <button
                        onClick={() => setEditingProduct({ ...editingProduct, image: "" })}
                        className="absolute top-2 right-2 p-1 rounded bg-red-500/80 text-white hover:bg-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditingProduct(null)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
                  Cancelar
                </button>
                <button onClick={handleSaveProduct} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  Salvar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Novo Serviço */}
      <AnimatePresence>
        {showNewService && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Novo Serviço</h3>
                <button onClick={() => setShowNewService(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Nome</label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={e => setNewService({ ...newService, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Nome do serviço"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Tipo</label>
                  <select
                    value={newService.type}
                    onChange={e => setNewService({ ...newService, type: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="gravacao">Gravação</option>
                    <option value="mixagem">Mixagem</option>
                    <option value="masterizacao">Masterização</option>
                    <option value="ensaio">Ensaio</option>
                    <option value="podcast">Podcast</option>
                    <option value="producao">Produção</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Preço (R$)</label>
                    <input
                      type="number"
                      value={newService.price}
                      onChange={e => setNewService({ ...newService, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Duração (horas)</label>
                    <input
                      type="number"
                      value={newService.duration}
                      onChange={e => setNewService({ ...newService, duration: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Descrição</label>
                  <textarea
                    value={newService.description}
                    onChange={e => setNewService({ ...newService, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Descrição do serviço"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Features (uma por linha)</label>
                  <textarea
                    value={newService.features?.join("\n") || ""}
                    onChange={e => setNewService({ ...newService, features: e.target.value.split("\n").filter(f => f.trim()) })}
                    rows={4}
                    placeholder="Microfones Neumann&#10;Mesa SSL&#10;Cabine acústica"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Imagem</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newService.image}
                      onChange={e => setNewService({ ...newService, image: e.target.value })}
                      placeholder="URL da imagem ou faça upload"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <label className="px-4 py-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, "service")}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {newService.image && (
                    <img src={newService.image} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-xl" />
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowNewService(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
                  Cancelar
                </button>
                <button onClick={handleCreateService} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Criar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Novo Produto */}
      <AnimatePresence>
        {showNewProduct && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Novo Produto</h3>
                <button onClick={() => setShowNewProduct(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Nome</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Nome do produto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Categoria</label>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="merch">Merch</option>
                      <option value="acessorios">Acessórios</option>
                      <option value="midias">Mídias</option>
                      <option value="pacotes">Pacotes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Descrição</label>
                  <textarea
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Descrição do produto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Estoque</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProduct.featured}
                        onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })}
                        className="w-5 h-5 rounded bg-white/5 border border-white/10 text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-gray-300">Destaque</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Imagem</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newProduct.image}
                      onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                      placeholder="URL da imagem ou faça upload"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <label className="px-4 py-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, "product")}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {newProduct.image && (
                    <img src={newProduct.image} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-xl" />
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowNewProduct(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
                  Cancelar
                </button>
                <button onClick={handleCreateProduct} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Criar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
