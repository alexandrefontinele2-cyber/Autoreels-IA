import React, { useState } from "react";
import { Lock, Crown, Eye, EyeOff, ShieldCheck, ArrowRight, X, AlertCircle, CheckCircle2 } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState("alexandre.fontinele2@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("autoreels_admin_auth", "true");
        onSuccess();
        onClose();
      } else {
        setErrorMessage(data.error || "Senha ou e-mail de administrador inválidos.");
      }
    } catch {
      setErrorMessage("Erro de comunicação com o servidor de autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252A2E]/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#252A2E] text-white rounded-2xl shadow-2xl border border-[#C9A96E]/40 overflow-hidden">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#D9DDE0]/70 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="p-6 pb-4 text-center border-b border-white/10">
          <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Crown className="w-6 h-6 text-[#C9A96E]" />
          </div>
          <h3 className="font-serif font-bold text-xl tracking-tight text-[#F8F6F1]">
            Acesso do Administrador
          </h3>
          <p className="text-xs text-[#D9DDE0]/80 mt-1">
            Painel restrito de gerenciamento e bypass master
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#D9DDE0] mb-1.5">
              E-mail ou Usuário
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alexandre.fontinele2@gmail.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-white/15 bg-[#343b40] text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A96E] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D9DDE0] mb-1.5">
              Senha Master
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha de administrador"
                className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-white/15 bg-[#343b40] text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A96E] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#C9A96E] hover:bg-[#b8955b] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#C9A96E]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? "Validando Acesso..." : "Entrar no Painel Master"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 text-center text-[11px] text-[#D9DDE0]/60 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Área reservada para Alexandre Fontinele</span>
          </div>
        </form>
      </div>
    </div>
  );
};
