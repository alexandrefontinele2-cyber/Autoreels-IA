import React, { useState } from "react";
import { UserProfile, ProfileAudit } from "../types";
import {
  Sparkles,
  Save,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Eye,
  Instagram,
  FileText,
  Sliders,
  Check,
  RefreshCw,
  Lightbulb,
  Copy,
  ChevronRight,
  ShieldCheck,
  Users,
} from "lucide-react";

interface ProfileDashboardProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  audit: ProfileAudit | null;
  onRunAudit: () => Promise<void>;
  isAuditing: boolean;
  linkedProfiles?: Array<{ handle: string; niche: string }>;
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  profile,
  onUpdateProfile,
  audit,
  onRunAudit,
  isAuditing,
  linkedProfiles = [
    { handle: "alexandre.reels", niche: "Marketing & Infoprodutos" },
    { handle: "criadorpro", niche: "Produção de Vídeo & IA" },
  ],
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedRewrite, setCopiedRewrite] = useState(false);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSelectQuickHandle = (handle: string, niche: string) => {
    setFormData((prev) => ({
      ...prev,
      instagramHandle: handle,
      niche: niche || prev.niche,
    }));
  };

  const handleCopyRewrite = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DDE0] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#607D8B] text-xs font-semibold uppercase tracking-wider mb-1">
            <Instagram className="h-4 w-4 text-[#C9A96E]" />
            <span>Auditoria de Bio, Feed & Retenção com Gemini</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#252A2E]">
            Analise seu perfil
          </h1>
          <p className="text-sm text-[#607D8B] mt-1 max-w-2xl">
            Insira o @ do Instagram para receber um raio-x cirúrgico da sua bio, coerência do feed e pontos de perda de retenção nos Reels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-[#607D8B] uppercase tracking-wider block">
              Limite de Contas
            </span>
            <span className="text-xs font-semibold text-[#252A2E]">
              {linkedProfiles.length} de 2 perfis cadastrados
            </span>
          </div>

          <button
            id="audit-profile-btn"
            onClick={onRunAudit}
            disabled={isAuditing}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#252A2E] text-white hover:bg-[#343b40] text-xs font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-[#C9A96E]" />
                <span>Auditando Perfil com IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-[#C9A96E]" />
                <span>Auditar Perfil Agora</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Seletor de Perfil Vinculado (Limite de 2 Perfis por Conta) */}
      <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#607D8B]" />
            <span className="text-xs font-semibold text-[#252A2E] uppercase tracking-wider">
              Perfis Vinculados (Máximo de 2 por conta):
            </span>
          </div>
          <span className="text-xs text-[#607D8B] bg-[#F8F6F1] px-2.5 py-1 rounded-md border border-[#D9DDE0]">
            Clique em um perfil para carregar automaticamente
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {linkedProfiles.map((p, idx) => {
            const isSelected = formData.instagramHandle.toLowerCase() === p.handle.toLowerCase();
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuickHandle(p.handle, p.niche)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#F8F6F1] border-[#C9A96E] ring-1 ring-[#C9A96E]/40"
                    : "bg-white border-[#D9DDE0] hover:border-[#607D8B]/40"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#252A2E]">
                    <span>@{p.handle}</span>
                    {isSelected && (
                      <span className="px-1.5 py-0.5 rounded bg-[#C9A96E] text-white text-[9px] uppercase font-bold">
                        Ativo
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#607D8B]">{p.niche}</span>
                </div>
                <div className="text-right text-[11px] text-[#607D8B]">
                  Perfil #{idx + 1}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Principal: Formulário de Análise vs Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Dados do Perfil */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs space-y-5">
            <h2 className="text-base font-serif font-bold text-[#252A2E] flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-[#607D8B]" />
              <span>Configurações do Perfil</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                @ do Instagram para Análise
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-[#607D8B] text-sm">@</span>
                <input
                  id="input-instagram-handle"
                  type="text"
                  value={formData.instagramHandle}
                  onChange={(e) => handleChange("instagramHandle", e.target.value.replace("@", ""))}
                  placeholder="seuperfil.oficial"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-[#F8F6F1]/50 border border-[#D9DDE0] rounded-xl text-sm text-[#252A2E] focus:outline-none focus:border-[#607D8B]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                  Nicho de Atuação
                </label>
                <input
                  id="input-niche"
                  type="text"
                  value={formData.niche}
                  onChange={(e) => handleChange("niche", e.target.value)}
                  placeholder="Ex: Finanças, IA, Moda"
                  className="w-full px-3 py-2 bg-[#F8F6F1]/50 border border-[#D9DDE0] rounded-xl text-xs text-[#252A2E] focus:outline-none focus:border-[#607D8B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                  Seguidores Atuais
                </label>
                <input
                  type="number"
                  value={formData.followersCount || 5400}
                  onChange={(e) => handleChange("followersCount", Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F8F6F1]/50 border border-[#D9DDE0] rounded-xl text-xs text-[#252A2E] focus:outline-none focus:border-[#607D8B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                Texto Atual da sua Bio
              </label>
              <textarea
                id="input-bio"
                rows={3}
                value={formData.bioText}
                onChange={(e) => handleChange("bioText", e.target.value)}
                placeholder="Cole o texto exato da sua biografia atual..."
                className="w-full px-3.5 py-2.5 bg-[#F8F6F1]/50 border border-[#D9DDE0] rounded-xl text-xs text-[#252A2E] focus:outline-none focus:border-[#607D8B] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                Público-Alvo Específico
              </label>
              <input
                id="input-target-audience"
                type="text"
                value={formData.targetAudience}
                onChange={(e) => handleChange("targetAudience", e.target.value)}
                placeholder="Ex: Empreendedores que querem viralizar nos Reels"
                className="w-full px-3.5 py-2.5 bg-[#F8F6F1]/50 border border-[#D9DDE0] rounded-xl text-xs text-[#252A2E] focus:outline-none focus:border-[#607D8B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                Tom de Voz Desejado
              </label>
              <input
                id="input-tone-of-voice"
                type="text"
                value={formData.toneOfVoice}
                onChange={(e) => handleChange("toneOfVoice", e.target.value)}
                placeholder="Ex: Enérgico, provocativo, direto ao ponto"
                className="w-full px-3.5 py-2.5 bg-[#F8F6F1]/50 border border-[#D9DDE0] rounded-xl text-xs text-[#252A2E] focus:outline-none focus:border-[#607D8B]"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#607D8B] text-white hover:bg-[#506874] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvo no Supabase!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Dados</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onRunAudit}
                disabled={isAuditing}
                className="px-4 py-2 rounded-xl bg-[#252A2E] text-white hover:bg-[#343b40] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>Auditar com Gemini</span>
              </button>
            </div>
          </form>
        </div>

        {/* Coluna Direita: Relatório de Auditoria com Gemini */}
        <div className="lg:col-span-7 space-y-6">
          {audit ? (
            <div className="space-y-6">
              {/* Score Geral */}
              <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#607D8B]">
                    Pontuação Geral de Retenção & Conversão
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#252A2E] mt-1">
                    @{formData.instagramHandle}
                  </h3>
                  <p className="text-xs text-[#607D8B] mt-0.5">
                    Análise ponderada de Bio, Coerência de Feed e Gancho dos Reels
                  </p>
                </div>

                <div className="h-18 w-18 rounded-2xl bg-[#252A2E] text-white border-2 border-[#C9A96E] flex flex-col items-center justify-center shadow-md">
                  <span className="text-2xl font-serif font-bold text-[#C9A96E]">
                    {audit.overallScore}
                  </span>
                  <span className="text-[10px] text-[#D9DDE0] uppercase font-bold">/ 100</span>
                </div>
              </div>

              {/* 1. Bio Audit */}
              <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#D9DDE0] pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#607D8B]" />
                    <h4 className="font-serif font-bold text-base text-[#252A2E]">
                      1. Auditoria da Biografia
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#607D8B]/10 text-[#607D8B]">
                    Nota: {audit.bioAudit.score}/100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F8F6F1] border border-[#D9DDE0]">
                    <span className="font-semibold text-[#252A2E] block mb-1">Clareza da Promessa:</span>
                    <p className="text-[#607D8B] leading-relaxed">{audit.bioAudit.clarity}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8F6F1] border border-[#D9DDE0]">
                    <span className="font-semibold text-[#252A2E] block mb-1">Eficácia do CTA:</span>
                    <p className="text-[#607D8B] leading-relaxed">{audit.bioAudit.ctaEffectiveness}</p>
                  </div>
                </div>

                {/* Reescrita Recomendada da Bio */}
                <div className="p-4 rounded-xl bg-[#252A2E] text-white border border-[#C9A96E]/40 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#C9A96E] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Reescrita Sugerida pelo Gemini:
                    </span>
                    <button
                      onClick={() => handleCopyRewrite(audit.bioAudit.recommendedRewrite)}
                      className="text-[11px] text-[#D9DDE0] hover:text-white bg-[#343b40] px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedRewrite ? <CheckCircle2 className="w-3 h-3 text-[#C9A96E]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRewrite ? "Copiado!" : "Copiar"}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-serif italic text-[#F8F6F1] leading-relaxed">
                    "{audit.bioAudit.recommendedRewrite}"
                  </p>
                </div>
              </div>

              {/* 2. Feed Audit & 3. Retenção */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Feed Audit */}
                <div className="bg-white rounded-2xl border border-[#D9DDE0] p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#D9DDE0] pb-2">
                    <h4 className="font-serif font-bold text-sm text-[#252A2E]">
                      2. Auditoria do Feed
                    </h4>
                    <span className="text-xs font-bold text-[#607D8B]">
                      {audit.feedAudit.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-[#607D8B] leading-relaxed">
                    {audit.feedAudit.visualConsistency}
                  </p>
                  <div>
                    <span className="text-[11px] font-semibold text-[#252A2E] block mb-1">
                      Pilares Mais Fortes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {audit.feedAudit.topPerformingPillars.map((pillar, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#F8F6F1] border border-[#D9DDE0] text-[11px] text-[#252A2E]"
                        >
                          {pillar}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Retenção */}
                <div className="bg-white rounded-2xl border border-[#D9DDE0] p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#D9DDE0] pb-2">
                    <h4 className="font-serif font-bold text-sm text-[#252A2E]">
                      3. Diagnóstico de Retenção
                    </h4>
                    <span className="text-xs font-bold text-[#C9A96E]">
                      {audit.retentionStrategies.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-[#607D8B] leading-relaxed">
                    {audit.retentionStrategies.avgRetentionDropAnalysis}
                  </p>
                  <div className="p-2.5 rounded-lg bg-[#607D8B]/10 text-[11px] text-[#252A2E] leading-relaxed">
                    <span className="font-bold block text-[#607D8B]">Recomendação de Corte:</span>
                    Eliminar hesitações &gt; 0.2s nos primeiros 4 segundos para evitar abandono imediato.
                  </div>
                </div>
              </div>

              {/* Plano de Ação Estratégico */}
              <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs">
                <h4 className="font-serif font-bold text-base text-[#252A2E] mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#C9A96E]" />
                  <span>Plano de Ação Imediato</span>
                </h4>

                <div className="space-y-3">
                  {audit.actionPlan.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-[#D9DDE0] bg-[#F8F6F1] flex items-start gap-3"
                    >
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 mt-0.5 ${
                          action.priority === "alta"
                            ? "bg-[#252A2E] text-white"
                            : "bg-[#607D8B]/20 text-[#607D8B]"
                        }`}
                      >
                        {action.priority}
                      </span>
                      <div className="space-y-0.5">
                        <h5 className="font-semibold text-xs text-[#252A2E]">{action.title}</h5>
                        <p className="text-xs text-[#607D8B] leading-relaxed">{action.action}</p>
                        <span className="text-[11px] text-[#C9A96E] font-medium block pt-0.5">
                          Impacto: {action.expectedImpact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#D9DDE0] p-12 text-center shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F8F6F1] border border-[#D9DDE0] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#C9A96E]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#252A2E] mb-2">
                Nenhuma auditoria realizada ainda
              </h3>
              <p className="text-xs sm:text-sm text-[#607D8B] max-w-md mx-auto mb-6">
                Clique no botão abaixo para analisar a bio, feed e retenção do perfil @{formData.instagramHandle} via IA.
              </p>
              <button
                onClick={onRunAudit}
                disabled={isAuditing}
                className="px-6 py-3 rounded-xl bg-[#252A2E] hover:bg-[#343b40] text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C9A96E]" />
                <span>Iniciar Auditoria com Gemini</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
