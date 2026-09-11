import React, { useState } from "react";
import { ContentPlanItem, UserProfile, GeneratedScript } from "../types";
import {
  Calendar as CalendarIcon,
  Sparkles,
  Video,
  FileText,
  Clock,
  CheckCircle,
  Copy,
  Check,
  X,
  PlayCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Flame,
} from "lucide-react";

interface CalendarScriptGeneratorProps {
  plans: ContentPlanItem[];
  profile: UserProfile;
  onGenerateCalendar: () => Promise<void>;
  isGeneratingCalendar: boolean;
  onGenerateScript: (ideaTitle: string) => Promise<GeneratedScript | null>;
  isGeneratingScript: boolean;
  activeScript: GeneratedScript | null;
  setActiveScript: (script: GeneratedScript | null) => void;
  onSendToStudio: (ideaTitle: string) => void;
}

export const CalendarScriptGenerator: React.FC<CalendarScriptGeneratorProps> = ({
  plans,
  profile,
  onGenerateCalendar,
  isGeneratingCalendar,
  onGenerateScript,
  isGeneratingScript,
  activeScript,
  setActiveScript,
  onSendToStudio,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<ContentPlanItem | null>(plans[0] || null);
  const [customIdeaInput, setCustomIdeaInput] = useState("");
  const [copiedScript, setCopiedScript] = useState(false);

  const handleScriptRequest = async (title: string) => {
    const result = await onGenerateScript(title);
    if (result) {
      setActiveScript(result);
    }
  };

  const handleCopyScript = () => {
    if (!activeScript) return;
    const text = `TITULO: ${activeScript.title}
DURAÇÃO: ${activeScript.targetDuration}

[HOOK - 0s a 3s]
Ação Visual: ${activeScript.hook.visualAction}
Texto na Tela: ${activeScript.hook.onScreenText}
Fala: "${activeScript.hook.spokenWords}"

[DESENVOLVIMENTO]
${activeScript.body
  .map(
    (step) =>
      `Passo ${step.stepNumber} (${step.timestamp}):
- Fala: "${step.spokenWords}"
- Texto: ${step.onScreenText}
- B-Roll: ${step.bRollSuggestion}`
  )
  .join("\n\n")}

[CTA FINAL]
Ação Visual: ${activeScript.cta.visualAction}
Fala: "${activeScript.cta.spokenWords}"
Texto: ${activeScript.cta.onScreenText}

DICAS DE GRAVAÇÃO:
${activeScript.filmingTips.map((t) => `- ${t}`).join("\n")}`;

    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Planejamento Editorial & Roteirizador Estruturado</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Calendário & Gerador de Roteiros
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Planejamento semanal inteligente com horários de pico e roteiros gerados sob as regras
            estritas de @{profile.instagramHandle}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="generate-calendar-btn"
            onClick={onGenerateCalendar}
            disabled={isGeneratingCalendar}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {isGeneratingCalendar ? "Gerando Novo Plano com IA..." : "Gerar Calendário da Semana"}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Custom Idea Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 shrink-0">
          <Flame className="h-4 w-4" />
          <span>Roteirizar Ideia Avulsa:</span>
        </div>
        <input
          type="text"
          value={customIdeaInput}
          onChange={(e) => setCustomIdeaInput(e.target.value)}
          placeholder="Ex: Como dobrar a retenção de Reels cortando hesitações de áudio..."
          className="flex-1 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
        />
        <button
          id="custom-script-btn"
          disabled={!customIdeaInput.trim() || isGeneratingScript}
          onClick={() => handleScriptRequest(customIdeaInput)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all disabled:opacity-50 shrink-0 flex items-center justify-center space-x-1.5"
        >
          <FileText className="h-3.5 w-3.5 text-rose-400" />
          <span>{isGeneratingScript ? "Roteirizando..." : "Gerar Roteiro pelas Regras"}</span>
        </button>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan?.id === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? "bg-slate-900/90 border-rose-500 shadow-lg shadow-rose-950/20"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    {plan.dayOfWeek}
                  </span>
                  <span className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <span>{plan.suggestedPostingTime}</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        plan.contentType === "reels"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : plan.contentType === "carousel"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {plan.contentType}
                    </span>
                    <span className="text-[10px] text-slate-500">{plan.estimatedEffort}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
                    {plan.contentTitle}
                  </h3>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                    Gancho Inicial (0-3s)
                  </span>
                  <p className="italic text-slate-300">"{plan.hookPreview}"</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 capitalize">
                  Status: <strong className="text-slate-200">{plan.status}</strong>
                </span>

                <button
                  id={`btn-script-${plan.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan);
                    handleScriptRequest(plan.contentTitle);
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-all"
                >
                  <FileText className="h-3 w-3" />
                  <span>Roteirizar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Structured Script View Modal / Drawer */}
      {activeScript && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 border border-rose-500/30 text-rose-400">
                    Roteiro Estruturado
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Duração estimada: {activeScript.targetDuration}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white leading-snug">
                  {activeScript.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveScript(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Rules Followed Banner */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start space-x-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-emerald-400 block">
                    Regras personalizadas rigorosamente aplicadas:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-0.5 list-disc list-inside">
                    {activeScript.rulesFollowedSummary.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 1. HOOK SECTION */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-400 uppercase tracking-wider">
                    1. GANCHO (HOOK) - 0s a 3s
                  </span>
                  <span className="font-mono text-slate-400">{activeScript.hook.timestamp}</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-300">
                    <strong>Ação Visual:</strong> {activeScript.hook.visualAction}
                  </p>
                  <p className="text-slate-100 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-medium leading-relaxed">
                    <strong>Fala:</strong> "{activeScript.hook.spokenWords}"
                  </p>
                  <p className="text-amber-300 text-[11px]">
                    <strong>Texto na Tela (Overlays):</strong> {activeScript.hook.onScreenText}
                  </p>
                </div>
              </div>

              {/* 2. BODY STEPS */}
              <div className="space-y-3">
                <span className="font-bold text-slate-300 text-xs uppercase tracking-wider block">
                  2. DESENVOLVIMENTO DO VÍDEO
                </span>
                {activeScript.body.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">
                        Passo {step.stepNumber}
                      </span>
                      <span className="font-mono text-slate-500">{step.timestamp}</span>
                    </div>
                    <p className="text-slate-300">
                      <strong>Câmera / Ação:</strong> {step.visualAction}
                    </p>
                    <p className="text-slate-100 bg-slate-900 p-2 rounded-lg border border-slate-800 font-medium">
                      <strong>Fala:</strong> "{step.spokenWords}"
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <p className="text-amber-400">
                        <strong>Texto tela:</strong> {step.onScreenText}
                      </p>
                      <p className="text-cyan-400">
                        <strong>B-Roll / Imagem:</strong> {step.bRollSuggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 3. CTA */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400 uppercase tracking-wider">
                    3. CALL TO ACTION (CTA)
                  </span>
                  <span className="font-mono text-slate-500">{activeScript.cta.timestamp}</span>
                </div>
                <p className="text-slate-100 bg-slate-900 p-2 rounded-lg border border-slate-800 font-medium">
                  <strong>Fala:</strong> "{activeScript.cta.spokenWords}"
                </p>
                <p className="text-slate-300">
                  <strong>Ação Final:</strong> {activeScript.cta.visualAction}
                </p>
              </div>

              {/* Filming Tips */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 block">
                  Dicas para gravação de alta retenção:
                </span>
                <ul className="space-y-1 list-disc list-inside">
                  {activeScript.filmingTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleCopyScript}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
              >
                {copiedScript ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copiar Roteiro Completo</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onSendToStudio(activeScript.title);
                  setActiveScript(null);
                }}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all"
              >
                <Video className="h-4 w-4" />
                <span>Gravar ou Enviar Vídeo no Estúdio</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
