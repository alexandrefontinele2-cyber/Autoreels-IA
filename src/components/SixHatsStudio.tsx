import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Video,
  Copy,
  CheckCircle2,
  Clock,
  Camera,
  Flame,
  FileText,
  Eye,
  Sliders,
  Send,
  Share2,
  RefreshCw,
  Hash,
  ChevronRight,
  Maximize2,
  BookOpen,
} from "lucide-react";
import { SixHatsScriptMatrix, SixHatScriptItem, UserProfile } from "../types";

interface SixHatsStudioProps {
  userProfile: UserProfile;
  initialTopic?: string;
  onSendToVideoStudio?: (script: SixHatScriptItem) => void;
}

export const SixHatsStudio: React.FC<SixHatsStudioProps> = ({
  userProfile,
  initialTopic = "Como reter atenção no Instagram Reels",
  onSendToVideoStudio,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptMatrix, setScriptMatrix] = useState<SixHatsScriptMatrix | null>(null);
  const [activeHatIndex, setActiveHatIndex] = useState(0);
  const [viewFormat, setViewFormat] = useState<"reels" | "carousel">("reels");
  const [teleprompterMode, setTeleprompterMode] = useState(false);
  const [teleprompterFontSize, setTeleprompterFontSize] = useState<"sm" | "base" | "lg" | "xl">("lg");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const presetTopics = [
    "Como dobrar a retenção no Reels sem parecer robô",
    "O erro invisível que destrói o alcance orgânico",
    "Como monetizar no Instagram sem dancinhas",
    "Como produzir 30 vídeos em uma tarde usando IA",
    "A fórmula de roteiro que converte seguidores em clientes",
  ];

  const handleGenerateMatrix = async (customTopic?: string) => {
    const selectedTopic = customTopic || topic.trim() || "Como reter atenção no Instagram Reels";
    setIsGenerating(true);

    try {
      const response = await fetch("/api/scripts/six-hats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          profileConfig: {
            instagramHandle: userProfile.instagramHandle,
            niche: userProfile.niche,
            targetAudience: userProfile.targetAudience,
            toneOfVoice: userProfile.toneOfVoice,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setScriptMatrix(data.data);
        setActiveHatIndex(0);
      }
    } catch (err) {
      console.error("Erro ao gerar matriz dos 6 chapéus:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Carrega automaticamente a matriz inicial caso ainda não esteja carregada
  React.useEffect(() => {
    if (!scriptMatrix) {
      handleGenerateMatrix(initialTopic);
    }
  }, []);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(identifier);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const currentHat: SixHatScriptItem | undefined = scriptMatrix?.scripts[activeHatIndex];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header do Estúdio dos 6 Chapéus */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D9DDE0] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#607D8B]/10 text-[#607D8B] text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Matriz dos 6 Chapéus • Edward de Bono Adaptado</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#252A2E]">
              Gerador de Roteiros em 6 Ângulos Psicológicos
            </h2>
            <p className="text-sm text-[#607D8B] max-w-2xl">
              Gere para cada tema 6 roteiros completos (Fatos, Emoção, Riscos, Ganhos, Criatividade, Método) com formato duplo para <strong>Reels</strong> e <strong>Carrossel</strong>, respeitando a fórmula <span className="text-[#C9A96E] font-semibold">"E... MAS... POR ISSO"</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-[#607D8B] block">Perfil Ativo:</span>
              <span className="text-sm font-semibold text-[#252A2E]">@{userProfile.instagramHandle}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#252A2E] text-white flex items-center justify-center font-serif font-bold">
              {userProfile.instagramHandle.substring(0, 1).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Campo de Busca / Entrada do Tema */}
        <div className="mt-6 pt-6 border-t border-[#D9DDE0]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateMatrix();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Digite qualquer tema para desdobrar em 6 roteiros..."
              className="flex-1 px-4 py-3.5 rounded-xl bg-[#F8F6F1] text-[#252A2E] placeholder-[#607D8B] border border-[#D9DDE0] focus:outline-none focus:border-[#607D8B] text-sm"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-3.5 rounded-xl bg-[#C9A96E] hover:bg-[#b8955b] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gerando 6 Chapéus...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Matriz Completa</span>
                </>
              )}
            </button>
          </form>

          {/* Sugestões de Temas */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-[#607D8B]">Exemplos rápidos:</span>
            {presetTopics.map((pt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTopic(pt);
                  handleGenerateMatrix(pt);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#F8F6F1] hover:bg-[#D9DDE0] text-[#252A2E] border border-[#D9DDE0] transition-colors"
              >
                {pt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navegação entre os 6 Chapéus */}
      {scriptMatrix && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {scriptMatrix.scripts.map((script, idx) => {
              const isSelected = activeHatIndex === idx;
              return (
                <button
                  key={script.hatId}
                  onClick={() => setActiveHatIndex(idx)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? "bg-[#252A2E] text-white border-[#252A2E] shadow-md"
                      : "bg-white text-[#252A2E] border-[#D9DDE0] hover:border-[#607D8B]"
                  }`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full mb-2"
                    style={{ backgroundColor: script.hatColor }}
                  />
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isSelected ? "text-[#C9A96E]" : "text-[#607D8B]"}`}>
                    {script.hatBadge}
                  </span>
                  <div className="text-xs font-semibold mt-0.5 line-clamp-1">
                    {script.hatTitle.split(":")[1]?.trim() || script.hatTitle}
                  </div>
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A96E]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Barra de Formato: Reels vs Carrossel + Ações Rápidas */}
          {currentHat && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#D9DDE0]">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setViewFormat("reels")}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    viewFormat === "reels"
                      ? "bg-[#252A2E] text-white"
                      : "bg-[#F8F6F1] text-[#607D8B] hover:text-[#252A2E]"
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span>Roteiro para Reels (Vídeo 9:16)</span>
                </button>

                <button
                  onClick={() => setViewFormat("carousel")}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    viewFormat === "carousel"
                      ? "bg-[#252A2E] text-white"
                      : "bg-[#F8F6F1] text-[#607D8B] hover:text-[#252A2E]"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span>Formato Carrossel ({currentHat.carouselVersion.slides.length} Slides)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setTeleprompterMode(!teleprompterMode)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    teleprompterMode
                      ? "bg-[#C9A96E] text-white border-[#C9A96E]"
                      : "bg-[#F8F6F1] text-[#252A2E] border-[#D9DDE0] hover:bg-[#D9DDE0]"
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{teleprompterMode ? "Fechar Teleprompter" : "Modo Teleprompter"}</span>
                </button>

                {onSendToVideoStudio && (
                  <button
                    onClick={() => onSendToVideoStudio(currentHat)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#607D8B] hover:bg-[#526a76] text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Gravar no Estúdio</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TELEPROMPTER VIEW (SE ATIVO) */}
          {teleprompterMode && currentHat && (
            <div className="bg-[#252A2E] text-white p-6 sm:p-10 rounded-2xl border-2 border-[#C9A96E] shadow-2xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#607D8B]/40 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-wider">
                    Teleprompter Ao Vivo • {currentHat.estimatedDurationSeconds} segundos sugeridos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#D9DDE0]">Fonte:</span>
                  {(["sm", "base", "lg", "xl"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setTeleprompterFontSize(size)}
                      className={`px-2 py-1 text-xs rounded uppercase font-mono ${
                        teleprompterFontSize === size ? "bg-[#C9A96E] text-[#252A2E] font-bold" : "bg-white/10 text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  <button
                    onClick={() => handleCopy(currentHat.teleprompterReadyText, "teleprompter")}
                    className="ml-3 px-3 py-1 bg-white/10 hover:bg-white/20 text-xs rounded flex items-center gap-1 text-[#D9DDE0]"
                  >
                    {copiedItem === "teleprompter" ? <CheckCircle2 className="w-3 h-3 text-[#C9A96E]" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar Texto</span>
                  </button>
                </div>
              </div>

              <div
                className={`max-h-[350px] overflow-y-auto leading-relaxed font-serif tracking-wide text-[#F8F6F1] p-4 bg-[#1e2225] rounded-xl border border-[#607D8B]/30 ${
                  teleprompterFontSize === "sm"
                    ? "text-base"
                    : teleprompterFontSize === "base"
                    ? "text-xl"
                    : teleprompterFontSize === "lg"
                    ? "text-2xl"
                    : "text-3xl"
                }`}
              >
                {currentHat.teleprompterReadyText}
              </div>

              <div className="text-xs text-[#D9DDE0] bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-between">
                <span><strong>Direção Técnica:</strong> {currentHat.recordingDirection}</span>
                <span className="text-[#C9A96E]">Role o texto durante a gravação</span>
              </div>
            </div>
          )}

          {/* CONTEÚDO PRINCIPAL DO ROTEIRO ATUAL */}
          {currentHat && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Coluna Esquerda (2/3): Roteiro para Reels OU Carrossel */}
              <div className="lg:col-span-2 space-y-6">
                {viewFormat === "reels" ? (
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D9DDE0] shadow-sm space-y-6">
                    {/* Título & Badge do Chapéu */}
                    <div className="border-b border-[#D9DDE0] pb-4">
                      <div className="flex items-center justify-between">
                        <span
                          className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                          style={{ backgroundColor: currentHat.hatColor }}
                        >
                          {currentHat.hatBadge}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-[#607D8B]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Duração: ~{currentHat.estimatedDurationSeconds}s</span>
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#252A2E] mt-2">
                        {currentHat.hatTitle}
                      </h3>
                      <p className="text-xs text-[#607D8B] mt-1">{currentHat.hatDescription}</p>
                    </div>

                    {/* FÓRMULA DE CONEXÃO EM DESTAQUE (E... MAS... POR ISSO) */}
                    <div className="p-4 rounded-xl bg-[#252A2E] text-white border-l-4 border-[#C9A96E] space-y-1.5">
                      <span className="text-[11px] font-bold text-[#C9A96E] uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" />
                        Fórmula de Conexão no Clímax ("E... MAS... POR ISSO"):
                      </span>
                      <p className="text-xs sm:text-sm italic text-[#D9DDE0] leading-relaxed">
                        "{currentHat.connectionFormulaSnippet}"
                      </p>
                    </div>

                    {/* Gancho (0 - 3s) */}
                    <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#D9DDE0] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-wider">
                          1. Gancho Cirúrgico ({currentHat.hook.timestamp})
                        </span>
                        <button
                          onClick={() => handleCopy(currentHat.hook.spokenWords, "hook")}
                          className="text-xs text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1"
                        >
                          {copiedItem === "hook" ? <CheckCircle2 className="w-3 h-3 text-[#C9A96E]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedItem === "hook" ? "Copiado" : "Copiar"}</span>
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-[#252A2E]">
                        "{currentHat.hook.spokenWords}"
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#607D8B] pt-1">
                        <div><strong>Ação Visual:</strong> {currentHat.hook.visualAction}</div>
                        <div><strong>Texto na Tela:</strong> <span className="font-mono text-[#252A2E]">{currentHat.hook.onScreenText}</span></div>
                      </div>
                    </div>

                    {/* Passos do Corpo */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-[#252A2E] uppercase tracking-wider block">
                        2. Desenvolvimento & Storytelling
                      </span>
                      {currentHat.body.map((step) => (
                        <div key={step.stepNumber} className="p-4 rounded-xl bg-white border border-[#D9DDE0] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#607D8B]">
                              Passo {step.stepNumber} • {step.timestamp}
                            </span>
                            <button
                              onClick={() => handleCopy(step.spokenWords, `step_${step.stepNumber}`)}
                              className="text-xs text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1"
                            >
                              {copiedItem === `step_${step.stepNumber}` ? <CheckCircle2 className="w-3 h-3 text-[#C9A96E]" /> : <Copy className="w-3 h-3" />}
                              <span>Copiar</span>
                            </button>
                          </div>
                          <p className="text-sm text-[#252A2E]">{step.spokenWords}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#607D8B] bg-[#F8F6F1] p-2.5 rounded-lg">
                            <div><strong>Câmera:</strong> {step.visualAction}</div>
                            <div><strong>B-Roll:</strong> {step.bRollSuggestion}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Final */}
                    <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#D9DDE0] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#607D8B] uppercase tracking-wider">
                          3. Chamada para Ação ({currentHat.cta.timestamp})
                        </span>
                        <button
                          onClick={() => handleCopy(currentHat.cta.spokenWords, "cta")}
                          className="text-xs text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1"
                        >
                          {copiedItem === "cta" ? <CheckCircle2 className="w-3 h-3 text-[#C9A96E]" /> : <Copy className="w-3 h-3" />}
                          <span>Copiar</span>
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-[#252A2E]">
                        "{currentHat.cta.spokenWords}"
                      </p>
                      <div className="text-[11px] text-[#607D8B]">
                        <strong>Texto na Tela:</strong> <span className="font-mono text-[#252A2E]">{currentHat.cta.onScreenText}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* FORMATO CARROSSEL ADAPTADO */
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D9DDE0] shadow-sm space-y-6">
                    <div className="border-b border-[#D9DDE0] pb-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-wider">
                          Post em Carrossel Adaptado ({currentHat.hatBadge})
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-[#252A2E] mt-1">
                          {currentHat.carouselVersion.headline}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          const allSlidesText = currentHat.carouselVersion.slides
                            .map((s) => `[Slide ${s.slideNumber}: ${s.title}]\n${s.bodyText}\nFrase Destaque: ${s.highlightPhrase}`)
                            .join("\n\n");
                          handleCopy(`${currentHat.carouselVersion.headline}\n\n${allSlidesText}\n\nCTA: ${currentHat.carouselVersion.finalCta}`, "carousel_all");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#F8F6F1] text-xs font-semibold text-[#252A2E] border border-[#D9DDE0] flex items-center gap-1 hover:bg-[#D9DDE0]"
                      >
                        {copiedItem === "carousel_all" ? <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A96E]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copiar Todos os Slides</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {currentHat.carouselVersion.slides.map((slide) => (
                        <div key={slide.slideNumber} className="p-4 rounded-xl bg-[#F8F6F1] border border-[#D9DDE0] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#252A2E] px-2.5 py-0.5 rounded bg-white border border-[#D9DDE0]">
                              Slide {slide.slideNumber}
                            </span>
                            <span className="text-xs text-[#607D8B] italic">
                              Layout: {slide.visualLayout}
                            </span>
                          </div>
                          <h4 className="text-base font-serif font-bold text-[#252A2E]">{slide.title}</h4>
                          <p className="text-xs text-[#252A2E] leading-relaxed">{slide.bodyText}</p>
                          <div className="text-[11px] bg-white p-2 rounded border border-[#D9DDE0] text-[#607D8B]">
                            <strong>Elemento em Destaque:</strong> <span className="text-[#C9A96E] font-medium">"{slide.highlightPhrase}"</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl bg-[#252A2E] text-white text-xs space-y-1">
                      <span className="text-[#C9A96E] font-bold uppercase tracking-wider block">Slide Final (Chamada para Ação):</span>
                      <p className="text-sm font-serif italic text-[#F8F6F1]">{currentHat.carouselVersion.finalCta}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Coluna Direita (1/3): Especificações Técnicas & Capa */}
              <div className="space-y-6">
                {/* Sugestão de Capa */}
                <div className="bg-white p-6 rounded-2xl border border-[#D9DDE0] shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C9A96E] uppercase tracking-wider">
                    <Camera className="w-4 h-4" />
                    <span>Sugestão de Capa do Vídeo</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#252A2E] text-white space-y-2">
                    <span className="text-[10px] text-[#607D8B] uppercase tracking-widest block">Texto na Capa:</span>
                    <h4 className="text-lg font-serif font-bold text-[#C9A96E] leading-tight">
                      {currentHat.coverSuggestion.headline}
                    </h4>
                    <p className="text-xs text-[#D9DDE0] pt-1 border-t border-white/10">
                      <strong>Cenário/Visual:</strong> {currentHat.coverSuggestion.visualDescription}
                    </p>
                  </div>
                </div>

                {/* Direção Técnica de Gravação */}
                <div className="bg-white p-6 rounded-2xl border border-[#D9DDE0] shadow-sm space-y-3">
                  <span className="text-xs font-bold text-[#252A2E] uppercase tracking-wider block">
                    Direção de Gravação & Edição
                  </span>
                  <p className="text-xs text-[#607D8B] leading-relaxed">
                    {currentHat.recordingDirection}
                  </p>
                </div>

                {/* Legenda & Hashtags */}
                <div className="bg-white p-6 rounded-2xl border border-[#D9DDE0] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#252A2E] uppercase tracking-wider">
                      Legenda Completa
                    </span>
                    <button
                      onClick={() => handleCopy(`${currentHat.captionText}\n\n${currentHat.hashtags.join(" ")}`, "caption_full")}
                      className="text-xs text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1"
                    >
                      {copiedItem === "caption_full" ? <CheckCircle2 className="w-3 h-3 text-[#C9A96E]" /> : <Copy className="w-3 h-3" />}
                      <span>Copiar</span>
                    </button>
                  </div>
                  <div className="p-3 bg-[#F8F6F1] rounded-xl text-xs text-[#252A2E] whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto border border-[#D9DDE0]">
                    {currentHat.captionText}
                  </div>

                  {/* Hashtags */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-[#607D8B] block mb-1">Hashtags Estratégicas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentHat.hashtags.map((h, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-[#F8F6F1] border border-[#D9DDE0] text-[#607D8B]">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
