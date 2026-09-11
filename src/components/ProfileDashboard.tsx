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
} from "lucide-react";

interface ProfileDashboardProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  audit: ProfileAudit | null;
  onRunAudit: () => Promise<void>;
  isAuditing: boolean;
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  profile,
  onUpdateProfile,
  audit,
  onRunAudit,
  isAuditing,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Instagram className="h-4 w-4" />
            <span>Configuração do Perfil & Regras de Roteirização</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dashboard do Criador
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Configure as diretrizes da sua marca pessoal e as regras estritas que a IA seguirá
            ao roteirizar seus Reels e analisar seu desempenho.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="audit-profile-btn"
            onClick={onRunAudit}
            disabled={isAuditing}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-medium transition-all shadow-sm hover:border-slate-600 disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-rose-400" />
                <span>Auditando Perfil com IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-rose-400" />
                <span>Auditar Perfil & Retenção</span>
              </>
            )}
          </button>

          <button
            id="save-profile-btn"
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Salvo no Supabase!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Salvar Configurações</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Form on Left, AI Audit on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Identity & Nicho */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-rose-400" />
                <span>Identidade & Segmentação</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Instagram Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 text-sm">@</span>
                    <input
                      id="input-instagram-handle"
                      type="text"
                      value={formData.instagramHandle}
                      onChange={(e) => handleChange("instagramHandle", e.target.value)}
                      placeholder="seuperfil.oficial"
                      className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Nicho de Atuação
                  </label>
                  <input
                    id="input-niche"
                    type="text"
                    value={formData.niche}
                    onChange={(e) => handleChange("niche", e.target.value)}
                    placeholder="Ex: Finanças, IA, Fitness, Marketing"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Público-Alvo Específico
                </label>
                <input
                  id="input-target-audience"
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => handleChange("targetAudience", e.target.value)}
                  placeholder="Ex: Empreendedores e criadores de conteúdo que querem produzir mais vídeos em menos tempo"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tom de Voz da Marca
                </label>
                <input
                  id="input-tone-of-voice"
                  type="text"
                  value={formData.toneOfVoice}
                  onChange={(e) => handleChange("toneOfVoice", e.target.value)}
                  placeholder="Ex: Enérgico, provocativo, direto ao ponto e baseado em dados"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Bio Atual do Instagram (para auditoria)
                </label>
                <textarea
                  id="input-bio-text"
                  rows={2}
                  value={formData.bioText}
                  onChange={(e) => handleChange("bioText", e.target.value)}
                  placeholder="Cole aqui sua bio atual para receber sugestões de reescrita de alta conversão"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                />
              </div>
            </div>

            {/* Custom Script Rules (CRITICAL FEATURE) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-rose-500/30 shadow-lg shadow-rose-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-rose-400" />
                  <h2 className="text-base font-semibold text-white">
                    Regras Personalizadas de Roteirização (Prompt Constraints)
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  Respeito Estrito
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Estas regras são injetadas diretamente nas instruções do Gemini e serão
                obedecidas sem exceção durante a geração de roteiros e corte dos vídeos.
              </p>

              <textarea
                id="input-custom-script-rules"
                rows={6}
                value={formData.customScriptRules}
                onChange={(e) => handleChange("customScriptRules", e.target.value)}
                placeholder="Exemplo:
1. Comece sempre nos primeiros 2 segundos com contraste ou pergunta provocativa.
2. Proibido introduções ou falar 'E aí pessoal'.
3. Cortes e textos na tela a cada 3 segundos.
4. Call-to-action final solicitando palavra-chave na DM."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors leading-relaxed"
                required
              />

              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Sugestões rápidas:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      "customScriptRules",
                      formData.customScriptRules +
                        "\n- Usar gancho de 'Erro Fatal' nos primeiros 2 segundos."
                    )
                  }
                  className="bg-slate-800/80 hover:bg-slate-700 px-2 py-0.5 rounded-md text-slate-300 transition-colors"
                >
                  + Gancho Erro Fatal
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      "customScriptRules",
                      formData.customScriptRules +
                        "\n- Proibido qualquer fala superior a 15 palavras sem respiro ou B-Roll."
                    )
                  }
                  className="bg-slate-800/80 hover:bg-slate-700 px-2 py-0.5 rounded-md text-slate-300 transition-colors"
                >
                  + Regra de Concisão
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      "customScriptRules",
                      formData.customScriptRules +
                        "\n- CTA focado em salvar o post para consultar mais tarde."
                    )
                  }
                  className="bg-slate-800/80 hover:bg-slate-700 px-2 py-0.5 rounded-md text-slate-300 transition-colors"
                >
                  + CTA de Salvamento
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: AI Profile Audit & Insights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-rose-400" />
                <h3 className="text-base font-semibold text-white">
                  Auditoria de Perfil & Algoritmo
                </h3>
              </div>
              {audit && (
                <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold">
                  <span>Score: {audit.overallScore}/100</span>
                </div>
              )}
            </div>

            {audit ? (
              <div className="space-y-5">
                {/* 3 Pill Scores */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="block text-[11px] text-slate-400 font-medium">Bio UVP</span>
                    <span className="text-lg font-bold text-rose-400">{audit.bioAudit.score}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="block text-[11px] text-slate-400 font-medium">Feed Mix</span>
                    <span className="text-lg font-bold text-amber-400">{audit.feedAudit.score}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="block text-[11px] text-slate-400 font-medium">Retenção</span>
                    <span className="text-lg font-bold text-emerald-400">{audit.retentionStrategies.score}%</span>
                  </div>
                </div>

                {/* Bio Rewrite Suggestion */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Bio Otimizada Recomendada</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                    {audit.bioAudit.recommendedRewrite}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <strong>Clareza:</strong> {audit.bioAudit.clarity}
                  </p>
                </div>

                {/* Retention Strategies */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Diagnóstico de Retenção nos Primeiros 3s</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {audit.retentionStrategies.avgRetentionDropAnalysis}
                  </p>
                  <div className="space-y-1 pt-1">
                    {audit.retentionStrategies.pacingRecommendations.slice(0, 2).map((rec, i) => (
                      <div key={i} className="flex items-start space-x-2 text-[11px] text-slate-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Plan */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Plano de Ação Priorizado
                  </h4>
                  <div className="space-y-2">
                    {audit.actionPlan.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3 text-xs"
                      >
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                            item.priority === "alta"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {item.priority}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-200">{item.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.action}</p>
                          <p className="text-[10px] text-emerald-400 font-medium mt-1">
                            Impacto: {item.expectedImpact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 px-4 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
                  <Sparkles className="h-6 w-6 text-rose-400" />
                </div>
                <h4 className="text-sm font-semibold text-slate-300">
                  Nenhuma auditoria realizada ainda
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Clique no botão "Auditar Perfil & Retenção" acima para gerar o relatório com IA
                  especializada em retenção do Instagram.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
