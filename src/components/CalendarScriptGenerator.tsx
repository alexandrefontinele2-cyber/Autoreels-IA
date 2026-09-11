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
  Flame,
  Layers,
  ChevronRight,
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
  const [filterType, setFilterType] = useState<"all" | "reels" | "carousel">("all");

  const filteredPlans = plans.filter((p) => {
    if (filterType === "all") return true;
    return p.contentType === filterType;
  });

  const handleScriptRequest = async (title: string) => {
    const result = await onGenerateScript(title);
    if (result) {
      setActiveScript(result);
    }
  };

  const handleCopyScript = () => {
    if (!activeScript) return;
    const text = `TITULO: ${activeScript.title}
DURAÇÃO ESTIMADA: ${activeScript.totalDurationSeconds}s

[GANCHO - 00:00 a 00:03]
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

[CHAMADA PARA AÇÃO (CTA)]
Ação Visual: ${activeScript.cta.visualAction}
Fala: "${activeScript.cta.spokenWords}"
Texto: ${activeScript.cta.onScreenText}

Hashtags: ${activeScript.hashtags?.join(" ") || ""}`;

    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DDE0] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#607D8B] text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarIcon className="h-4 w-4 text-[#C9A96E]" />
            <span>Planejamento Semanal & Melhores Horários</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#252A2E]">
            Calendário de postagem
          </h1>
          <p className="text-sm text-[#607D8B] mt-1 max-w-2xl">
            Organização semanal de conteúdos e horários de pico de engajamento baseados no nicho de @{profile.instagramHandle}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="generate-calendar-btn"
            onClick={onGenerateCalendar}
            disabled={isGeneratingCalendar}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#252A2E] text-white hover:bg-[#343b40] text-xs font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isGeneratingCalendar ? (
              <>
                <div className="h-4 w-4 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                <span>Otimizando Horários...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-[#C9A96E]" />
                <span>Gerar Novo Calendário Semanal</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Melhores Horários de Postagem Resumidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D9DDE0] shadow-xs">
          <span className="text-[11px] font-bold text-[#607D8B] uppercase tracking-wider block mb-1">
            Pico de Segunda a Quarta
          </span>
          <div className="text-lg font-serif font-bold text-[#252A2E]">12h15 e 18h45</div>
          <p className="text-[11px] text-[#607D8B] mt-0.5">Reels educativos e ganchos rápidos</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9DDE0] shadow-xs">
          <span className="text-[11px] font-bold text-[#C9A96E] uppercase tracking-wider block mb-1">
            Pico de Quinta a Sexta
          </span>
          <div className="text-lg font-serif font-bold text-[#252A2E]">17h30 e 20h15</div>
          <p className="text-[11px] text-[#607D8B] mt-0.5">Carrosséis aprofundados e listas</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9DDE0] shadow-xs">
          <span className="text-[11px] font-bold text-[#607D8B] uppercase tracking-wider block mb-1">
            Pico de Fim de Semana
          </span>
          <div className="text-lg font-serif font-bold text-[#252A2E]">10h00 e 19h00</div>
          <p className="text-[11px] text-[#607D8B] mt-0.5">Histórias e conexão emocional</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9DDE0] shadow-xs">
          <span className="text-[11px] font-bold text-[#607D8B] uppercase tracking-wider block mb-1">
            Frequência Alvo
          </span>
          <div className="text-lg font-serif font-bold text-[#C9A96E]">5 a 7 posts/sem</div>
          <p className="text-[11px] text-[#607D8B] mt-0.5">Constância com corte em -30dB</p>
        </div>
      </div>

      {/* Grid Principal: Lista Semanal vs Detalhe do Roteiro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Lista Semanal de Postagens (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9DDE0] pb-3">
              <h2 className="font-serif font-bold text-base text-[#252A2E] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#607D8B]" />
                <span>Programação Semanal ({filteredPlans.length} Publicações)</span>
              </h2>

              {/* Filtro de Formato */}
              <div className="flex items-center bg-[#F8F6F1] p-1 rounded-lg border border-[#D9DDE0] text-xs">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    filterType === "all" ? "bg-[#252A2E] text-white font-semibold" : "text-[#607D8B]"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterType("reels")}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    filterType === "reels" ? "bg-[#252A2E] text-white font-semibold" : "text-[#607D8B]"
                  }`}
                >
                  Reels
                </button>
                <button
                  onClick={() => setFilterType("carousel")}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    filterType === "carousel" ? "bg-[#252A2E] text-white font-semibold" : "text-[#607D8B]"
                  }`}
                >
                  Carrossel
                </button>
              </div>
            </div>

            {/* Itens do Calendário */}
            <div className="space-y-3">
              {filteredPlans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#F8F6F1] border-[#C9A96E] ring-1 ring-[#C9A96E]/40"
                        : "bg-white border-[#D9DDE0] hover:border-[#607D8B]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#252A2E] bg-[#D9DDE0]/50 px-2 py-0.5 rounded">
                          {plan.dayOfWeek}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            plan.contentType === "reels"
                              ? "bg-[#252A2E] text-white"
                              : "bg-[#607D8B]/20 text-[#607D8B]"
                          }`}
                        >
                          {plan.contentType === "reels" ? "Reels (Vídeo)" : "Carrossel"}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#C9A96E] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {plan.suggestedPostingTime || "18:30"}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-sm text-[#252A2E] mb-1">
                      {plan.contentTitle}
                    </h3>

                    <p className="text-xs text-[#607D8B] italic mb-3">
                      Gancho: "{plan.hookPreview}"
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#D9DDE0]/60">
                      <span className="text-[11px] text-[#607D8B]">Objetivo: {plan.objective}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(plan);
                          handleScriptRequest(plan.contentTitle);
                        }}
                        className="text-xs font-semibold text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
                        <span>Gerar Roteiro</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Roteiro Estruturado do Post Selecionado (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9DDE0] pb-3">
              <div>
                <span className="text-[10px] text-[#607D8B] font-bold uppercase block">
                  Roteiro Detalhado
                </span>
                <h3 className="font-serif font-bold text-sm text-[#252A2E] truncate max-w-xs">
                  {selectedPlan?.contentTitle || "Selecione uma postagem"}
                </h3>
              </div>

              {activeScript && (
                <button
                  onClick={handleCopyScript}
                  className="text-xs text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1 bg-[#F8F6F1] px-2.5 py-1 rounded border border-[#D9DDE0] cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-[#C9A96E]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? "Copiado!" : "Copiar"}</span>
                </button>
              )}
            </div>

            {selectedPlan ? (
              <div className="space-y-4">
                {activeScript ? (
                  <div className="space-y-4 text-xs">
                    {/* Gancho */}
                    <div className="p-3.5 rounded-xl bg-[#252A2E] text-white border border-[#C9A96E]/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-[#C9A96E]">
                          Gancho de Retenção (0 - 3s)
                        </span>
                        <span className="text-[10px] text-[#D9DDE0]">Corte seco</span>
                      </div>
                      <p className="font-serif italic text-sm text-[#F8F6F1]">
                        "{activeScript.hook.spokenWords}"
                      </p>
                      <span className="text-[10px] text-[#D9DDE0] block">
                        Ação: {activeScript.hook.visualAction}
                      </span>
                    </div>

                    {/* Passos do Conteúdo */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {activeScript.body.map((step) => (
                        <div key={step.stepNumber} className="p-3 rounded-xl bg-[#F8F6F1] border border-[#D9DDE0]">
                          <span className="font-bold text-[11px] text-[#252A2E] block mb-0.5">
                            Ponto {step.stepNumber} ({step.timestamp})
                          </span>
                          <p className="text-xs text-[#252A2E] leading-relaxed mb-1">
                            "{step.spokenWords}"
                          </p>
                          <span className="text-[10px] text-[#607D8B] block">
                            B-Roll sugerido: {step.bRollSuggestion}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="p-3 rounded-xl bg-[#607D8B]/10 border border-[#607D8B]/30">
                      <span className="font-bold text-[11px] text-[#607D8B] block mb-0.5">
                        Chamada para Ação (Final)
                      </span>
                      <p className="text-xs text-[#252A2E]">
                        "{activeScript.cta.spokenWords}"
                      </p>
                    </div>

                    {/* Botão para Levar ao Estúdio de Vídeo */}
                    <button
                      onClick={() => onSendToStudio(selectedPlan.contentTitle)}
                      className="w-full py-3 rounded-xl bg-[#C9A96E] hover:bg-[#b8955b] text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Gravar e Cortar este Vídeo no Estúdio (-30dB)</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <p className="text-xs text-[#607D8B]">
                      Clique para gerar a estrutura completa deste vídeo com gancho, desenvolvimento e CTA cirúrgico.
                    </p>
                    <button
                      onClick={() => handleScriptRequest(selectedPlan.contentTitle)}
                      disabled={isGeneratingScript}
                      className="px-5 py-2.5 rounded-xl bg-[#252A2E] hover:bg-[#343b40] text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingScript ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                          <span>Gerando Roteiro com IA...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-[#C9A96E]" />
                          <span>Gerar Roteiro Estruturado</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-[#607D8B]">
                Selecione um dia da semana para visualizar e gerar o roteiro.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
