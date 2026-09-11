import React, { useState } from "react";
import { UserAccountData, LinkedInstagramAccount } from "../types";
import {
  User,
  Mail,
  Lock,
  Instagram,
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Crown,
  KeyRound,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface UserProfileManagerProps {
  userAccount: UserAccountData;
  onUpdateAccount: (updated: UserAccountData) => void;
  onSelectActiveInstagram: (handle: string) => void;
  onNavigateToTab: (tab: "analyze_profile" | "script_idea" | "video_edit" | "calendar" | "account_profile") => void;
}

export const UserProfileManager: React.FC<UserProfileManagerProps> = ({
  userAccount,
  onUpdateAccount,
  onSelectActiveInstagram,
  onNavigateToTab,
}) => {
  const [formData, setFormData] = useState({
    fullName: userAccount.fullName || "Alexandre Fontinele",
    email: userAccount.email || "alexandre.fontinele2@gmail.com",
    avatarUrl: userAccount.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [accounts, setAccounts] = useState<LinkedInstagramAccount[]>(
    userAccount.linkedAccounts && userAccount.linkedAccounts.length > 0
      ? userAccount.linkedAccounts
      : [
          {
            id: "acc_1",
            handle: "alexandre.reels",
            niche: "Marketing & Infoprodutos",
            followersCount: 14200,
            averageViews: 3800,
            bioText: "Estrategista de Reels | Transformando vídeos brutos em autoridade e faturamento",
            isActive: true,
            addedAt: "2025-01-15",
          },
          {
            id: "acc_2",
            handle: "criadorpro",
            niche: "Produção de Vídeo & IA",
            followersCount: 8900,
            averageViews: 2400,
            bioText: "Edição sem esforço e ganchos de alta retenção no Instagram & TikTok",
            isActive: false,
            addedAt: "2025-02-01",
          },
        ]
  );

  const [newHandleInput, setNewHandleInput] = useState("");
  const [newNicheInput, setNewNicheInput] = useState("Criador de Conteúdo");
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Salvar dados pessoais
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAccount({
      ...userAccount,
      fullName: formData.fullName,
      email: formData.email,
      avatarUrl: formData.avatarUrl,
      linkedAccounts: accounts,
    });
    showFeedback("Dados do perfil atualizados com sucesso!");
  };

  // Alterar senha
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword) {
      showFeedback("Digite sua senha atual para confirmar a alteração.", "error");
      return;
    }
    if (formData.newPassword.length < 6) {
      showFeedback("A nova senha deve ter no mínimo 6 caracteres.", "error");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      showFeedback("A confirmação de senha não coincide com a nova senha.", "error");
      return;
    }

    setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    showFeedback("Senha de acesso atualizada com sucesso!");
  };

  // Ativar um perfil de Instagram como principal
  const handleSetActive = (id: string) => {
    const updated = accounts.map((acc) => ({
      ...acc,
      isActive: acc.id === id,
    }));
    setAccounts(updated);
    const activeAcc = updated.find((a) => a.isActive);
    if (activeAcc) {
      onSelectActiveInstagram(activeAcc.handle);
    }
    onUpdateAccount({
      ...userAccount,
      linkedAccounts: updated,
    });
    showFeedback(`Perfil @${activeAcc?.handle} selecionado como principal!`);
  };

  // Remover perfil do Instagram
  const handleRemoveAccount = (id: string) => {
    if (accounts.length <= 1) {
      showFeedback("Mantenha ao menos 1 perfil do Instagram cadastrado.", "error");
      return;
    }
    const filtered = accounts.filter((a) => a.id !== id);
    if (!filtered.some((a) => a.isActive)) {
      filtered[0].isActive = true;
      onSelectActiveInstagram(filtered[0].handle);
    }
    setAccounts(filtered);
    onUpdateAccount({
      ...userAccount,
      linkedAccounts: filtered,
    });
    showFeedback("Perfil desvinculado com sucesso. Você agora tem espaço para adicionar outro.");
  };

  // Adicionar novo perfil (respeitando limite de 2)
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (accounts.length >= 2) {
      showFeedback("Limite máximo de 2 perfis por conta atingido. Remova um para adicionar outro.", "error");
      return;
    }
    const cleanHandle = newHandleInput.replace("@", "").trim();
    if (!cleanHandle) {
      showFeedback("Digite o @ do perfil do Instagram.", "error");
      return;
    }

    const newAcc: LinkedInstagramAccount = {
      id: `acc_${Date.now()}`,
      handle: cleanHandle,
      niche: newNicheInput,
      followersCount: 1000,
      averageViews: 500,
      bioText: "Perfil em crescimento no Instagram",
      isActive: accounts.length === 0,
      addedAt: new Date().toISOString().split("T")[0],
    };

    const updated = [...accounts, newAcc];
    setAccounts(updated);
    setNewHandleInput("");
    setIsAddingAccount(false);
    onUpdateAccount({
      ...userAccount,
      linkedAccounts: updated,
    });
    showFeedback(`Perfil @${cleanHandle} vinculado com sucesso!`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header do Perfil */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DDE0] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#607D8B] text-xs font-semibold uppercase tracking-wider mb-1">
            <User className="h-4 w-4 text-[#C9A96E]" />
            <span>Área da Conta & Segurança</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#252A2E]">
            Gestão do Perfil
          </h1>
          <p className="text-sm text-[#607D8B] mt-1">
            Gerencie seus dados pessoais, senha e os 2 perfis do Instagram vinculados à sua conta.
          </p>
        </div>

        {/* Status da Assinatura */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#252A2E] text-white border border-[#C9A96E]/50 shadow-sm flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#C9A96E]" />
            <div className="text-left">
              <span className="block text-[10px] text-[#D9DDE0] uppercase font-bold tracking-wider">
                Assinatura Ativa
              </span>
              <span className="text-xs font-semibold text-[#C9A96E]">
                {userAccount.isAdmin ? "Administrador Master" : "Plano Pro Anual (R$ 24,90/mês)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            feedbackMessage.type === "success"
              ? "bg-[#607D8B]/10 border-[#607D8B]/30 text-[#252A2E]"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedbackMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-[#C9A96E] shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          )}
          <span className="font-medium">{feedbackMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Dados Pessoais & Foto */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card: Dados do Usuário */}
          <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-serif font-bold text-[#252A2E] mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#607D8B]" />
              <span>Informações Pessoais</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Foto de Perfil */}
              <div className="flex items-center gap-6 pb-6 border-b border-[#D9DDE0]">
                <div className="relative">
                  <img
                    src={formData.avatarUrl}
                    alt={formData.fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#C9A96E] shadow-md"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#252A2E] text-white hover:bg-[#343b40] cursor-pointer shadow-md transition-colors"
                    title="Trocar Foto"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#C9A96E]" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setFormData((prev) => ({ ...prev, avatarUrl: url }));
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#252A2E]">{formData.fullName}</h3>
                  <p className="text-xs text-[#607D8B] mt-0.5">{formData.email}</p>
                  <p className="text-[11px] text-[#C9A96E] mt-1 font-medium">
                    Foto visível no cabeçalho e nos relatórios de auditoria
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9DDE0] bg-[#F8F6F1]/50 text-[#252A2E] focus:outline-none focus:border-[#607D8B] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                    E-mail de Acesso
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D9DDE0] bg-[#F8F6F1]/50 text-[#252A2E] focus:outline-none focus:border-[#607D8B] text-sm"
                    />
                    <Mail className="w-4 h-4 text-[#607D8B] absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#607D8B] hover:bg-[#506874] text-white font-semibold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvar Informações</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card: Alteração de Senha */}
          <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-serif font-bold text-[#252A2E] mb-2 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#607D8B]" />
              <span>Segurança & Senha</span>
            </h2>
            <p className="text-xs text-[#607D8B] mb-6">
              Mantenha sua conta protegida com uma senha forte e segura.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D9DDE0] bg-[#F8F6F1]/50 text-[#252A2E] focus:outline-none focus:border-[#607D8B] text-sm"
                  />
                  <Lock className="w-4 h-4 text-[#607D8B] absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Mínimo 6 dígitos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9DDE0] bg-[#F8F6F1]/50 text-[#252A2E] focus:outline-none focus:border-[#607D8B] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Repita a senha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9DDE0] bg-[#F8F6F1]/50 text-[#252A2E] focus:outline-none focus:border-[#607D8B] text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#252A2E] hover:bg-[#343b40] text-white font-semibold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span>Atualizar Senha</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Coluna Direita: Os 2 Perfis do Instagram Vinculados */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-[#C9A96E]" />
                <h2 className="text-base font-serif font-bold text-[#252A2E]">
                  Perfis do Instagram
                </h2>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  accounts.length >= 2
                    ? "bg-[#C9A96E]/20 text-[#C9A96E] border-[#C9A96E]/40"
                    : "bg-[#607D8B]/10 text-[#607D8B] border-[#607D8B]/20"
                }`}
              >
                {accounts.length} de 2 vinculados
              </span>
            </div>

            <p className="text-xs text-[#607D8B] mb-5 leading-relaxed">
              Sua conta permite vincular no máximo <strong>2 perfis do Instagram</strong> para roteirização e análise personalizada.
            </p>

            {/* Lista dos Perfis Vinculados */}
            <div className="space-y-3">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className={`p-4 rounded-xl border transition-all ${
                    acc.isActive
                      ? "bg-[#F8F6F1] border-[#C9A96E] ring-1 ring-[#C9A96E]/30"
                      : "bg-white border-[#D9DDE0] hover:border-[#607D8B]/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#252A2E]">@{acc.handle}</span>
                        {acc.isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C9A96E] text-white uppercase">
                            Principal
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#607D8B]">{acc.niche}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {!acc.isActive && (
                        <button
                          onClick={() => handleSetActive(acc.id)}
                          className="text-xs text-[#607D8B] hover:text-[#252A2E] px-2 py-1 rounded bg-[#D9DDE0]/50 hover:bg-[#D9DDE0] transition-colors"
                          title="Definir como perfil ativo"
                        >
                          Ativar
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveAccount(acc.id)}
                        className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Desvincular perfil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#252A2E]/80 line-clamp-2 italic mb-3">
                    "{acc.bioText}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#607D8B] border-t border-[#D9DDE0]/60 pt-2">
                    <span>Seguidores: {acc.followersCount.toLocaleString("pt-BR")}</span>
                    <span>Views Médias: {acc.averageViews.toLocaleString("pt-BR")}</span>
                  </div>

                  {acc.isActive && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => onNavigateToTab("analyze_profile")}
                        className="w-full py-1.5 rounded-lg bg-[#252A2E] text-white hover:bg-[#343b40] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#C9A96E]" />
                        <span>Auditar @{acc.handle} agora</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Adicionar Perfil ou Aviso de Limite */}
            {accounts.length < 2 ? (
              <div className="mt-4 pt-4 border-t border-[#D9DDE0]">
                {isAddingAccount ? (
                  <form onSubmit={handleAddAccount} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#252A2E] mb-1">
                        @ do Instagram
                      </label>
                      <input
                        type="text"
                        value={newHandleInput}
                        onChange={(e) => setNewHandleInput(e.target.value)}
                        placeholder="ex: seunome.oficial"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#D9DDE0] text-xs focus:outline-none focus:border-[#607D8B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#252A2E] mb-1">
                        Nicho de Atuação
                      </label>
                      <input
                        type="text"
                        value={newNicheInput}
                        onChange={(e) => setNewNicheInput(e.target.value)}
                        placeholder="ex: Saúde, Vendas, Tecnologia"
                        className="w-full px-3 py-2 rounded-xl border border-[#D9DDE0] text-xs focus:outline-none focus:border-[#607D8B]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-[#607D8B] text-white text-xs font-semibold hover:bg-[#506874] transition-colors"
                      >
                        Salvar Perfil
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingAccount(false)}
                        className="px-3 py-2 rounded-xl bg-gray-100 text-[#252A2E] text-xs font-medium hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingAccount(true)}
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#D9DDE0] hover:border-[#607D8B] text-xs font-semibold text-[#607D8B] hover:text-[#252A2E] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar 2º Perfil do Instagram</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 p-3 rounded-xl bg-[#F8F6F1] border border-[#D9DDE0] text-xs text-[#607D8B]">
                <span className="font-semibold text-[#252A2E] block mb-0.5">
                  Limite de 2 perfis atingido
                </span>
                Para vincular um novo perfil, desvincule um dos perfis acima clicando no ícone de lixeira.
              </div>
            )}
          </div>

          {/* Dica de Segurança & Suporte */}
          <div className="p-4 rounded-2xl bg-[#252A2E] text-white border border-[#607D8B]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C9A96E]">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacidade & RLS Ativos</span>
            </div>
            <p className="text-[11px] text-[#D9DDE0] leading-relaxed">
              Todos os seus dados e históricos de roteiros são criptografados e protegidos por Row Level Security no Supabase. Somente você tem acesso aos seus vídeos e métricas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
