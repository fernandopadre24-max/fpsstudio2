import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "O e-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Digite um e-mail válido";
    }

    if (!password) {
      newErrors.password = "A senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    // Simula uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setSuccessMessage("Login realizado com sucesso! Redirecionando...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Card de Login */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Logo / Header */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4 shadow-lg shadow-purple-500/30">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
            <p className="text-gray-300 mt-2 text-sm">
              Faça login para acessar sua conta
            </p>
          </motion.div>

          {/* Mensagem de sucesso */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 text-sm text-center"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo de E-mail */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-1.5"
              >
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="seu@email.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${
                    errors.email
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/10 focus:ring-purple-400"
                  } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-400"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Campo de Senha */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border ${
                    errors.password
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/10 focus:ring-purple-400"
                  } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-400"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Lembrar-me e Esqueci a senha */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-400 focus:ring-offset-0 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors">
                  Lembrar-me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-purple-300 hover:text-purple-200 transition-colors hover:underline"
              >
                Esqueceu a senha?
              </a>
            </motion.div>

            {/* Botão de Login */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Entrar</span>
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 text-gray-400 bg-transparent">ou</span>
            </div>
          </div>

          {/* Login Social */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="grid grid-cols-2 gap-3"
          >
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </button>
          </motion.div>

          {/* Link para cadastro */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-6 text-center text-sm text-gray-400"
          >
            Não tem uma conta?{" "}
            <a
              href="#"
              className="text-purple-300 hover:text-purple-200 font-medium transition-colors hover:underline"
            >
              Cadastre-se gratuitamente
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
