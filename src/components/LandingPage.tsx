import React, { useState } from "react";
import {
  Sparkles,
  Play,
  Scissors,
  CheckCircle2,
  Lock,
  ArrowRight,
  Video,
  Layers,
  BarChart3,
  Flame,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileText,
  Copy,
  Zap,
  Crown,
} from "lucide-react";
import { PaywallModal } from "./PaywallModal";
import { AdminLoginModal } from "./AdminLoginModal";

interface LandingPageProps {
  onEnterDashboard: () => void;
  isPaidUser: boolean;
  onAdminBypass?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  isPaidUser,
  onAdminBypass,
}) => {
  const [topicInput, setTopicInput] = useState("");
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [demoResult, setDemoResult] = useState<{
    hook: string;
    videoIdea: string;
    connectionFormulaSample: string;
  } | null>(null);

  // Controle do Paywall e Acesso Restrito
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [paywallSource, setPaywallSource] = useState("Matriz Completa dos 6 Chapéus");
  const [copiedHook, setCopiedHook] = useState(false);

  const suggestedTopics = [
    "Como reter 70% nos primeiros 3s do Reels",
    "Como vender serviços de alto valor no Instagram",
    "O erro invisível que destrói o alcance orgânico",
    "Como gravar 30 vídeos em uma tarde sem travar",
  ];

  const handleGenerateQuickDemo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTopic = topicInput.trim() || "Como reter atenção no Instagram Reels";
    setIsGeneratingDemo(true);

    try {
      const response = await fetch("/api/landing/quick-hook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: cleanTopic }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setDemoResult(data.data);
      } else {
        setDemoResult({
          hook: `Pare de perder 60% do seu alcance falando sobre "${cleanTopic}" do jeito errado.`,
          videoIdea: `O roteiro oculto de 35 segundos que dobra a taxa de conclusão de vídeos sobre ${cleanTopic}.`,
          connectionFormulaSample: `Você tem domínio sobre ${cleanTopic} E quer crescer no Instagram, MAS seu tempo médio de visualização está abaixo de 4 segundos. POR ISSO, este corte cirúrgico é indispensável...`,
        });
      }
    } catch {
      setDemoResult({
        hook: `Se você ainda grava sobre "${cleanTopic}" sem cortar as pausas de áudio, seus seguidores estão deslizando a tela.`,
        videoIdea: `O roteiro oculto de 35 segundos que dobra a taxa de conclusão de vídeos sobre ${cleanTopic}.`,
        connectionFormulaSample: `Você quer autoridade com ${cleanTopic} E atrai visitantes, MAS a falta de ritmo faz o público sair antes do meio. POR ISSO, aplique esta estrutura de 6 chapéus...`,
      });
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const handleOpenPaywall = (source: string) => {
    if (isPaidUser) {
      onEnterDashboard();
      return;
    }
    setPaywallSource(source);
    setIsPaywallOpen(true);
  };

  const handleCopyHook = () => {
    if (demoResult?.hook) {
      navigator.clipboard.writeText(demoResult.hook);
      setCopiedHook(true);
      setTimeout(() => setCopiedHook(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#252A2E] font-sans selection:bg-[#C9A96E] selection:text-white">
      {/* Top Bar de Anúncio / Status */}
      <div className="bg-[#252A2E] text-white py-2 px-4 text-center text-xs border-b border-[#607D8B]/30 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-pulse shrink-0" />
        <span className="text-[#D9DDE0] truncate">
          Motor Gemini 3.8 Flash + Microserviço FFmpeg ativo com corte em <strong>-30dB</strong>
        </span>
        <span className="hidden md:inline-block text-[#607D8B]">•</span>
        <a
          href="#precos"
          className="hidden md:inline-block text-[#C9A96E] hover:underline font-semibold whitespace-nowrap"
        >
          Planos a partir de R$ 24,90/mês →
        </a>
      </div>

      {/* Header / Navbar da Landing Page */}
      <header className="sticky top-0 z-40 bg-[#F8F6F1]/95 backdrop-blur-md border-b border-[#D9DDE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Subtítulo estruturados sem quebras estranhas */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#252A2E] flex items-center justify-center shadow-md border border-[#C9A96E]/40 shrink-0">
              <Video className="w-5 h-5 text-[#C9A96E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl tracking-tight text-[#252A2E] whitespace-nowrap">
                  AutoReels<span className="text-[#C9A96E]">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#607D8B]/15 text-[#607D8B] whitespace-nowrap">
                  SaaS Pro
                </span>
              </div>
              <p className="text-[11px] text-[#607D8B] hidden lg:block whitespace-nowrap">
                Automação Cirúrgica de Vídeos para Instagram
              </p>
            </div>
          </div>

          {/* Links de navegação com espaçamento proporcional */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#607D8B] whitespace-nowrap">
            <a href="#playground" className="hover:text-[#252A2E] transition-colors whitespace-nowrap">
              Testar IA
            </a>
            <a href="#beneficios" className="hover:text-[#252A2E] transition-colors whitespace-nowrap">
              Os 6 Chapéus
            </a>
            <a href="#video-studio" className="hover:text-[#252A2E] transition-colors whitespace-nowrap">
              Corte de Silêncios
            </a>
            <a href="#precos" className="hover:text-[#252A2E] transition-colors whitespace-nowrap">
              Planos & Preços
            </a>
          </nav>

          {/* Ação Principal */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isPaidUser ? (
              <button
                onClick={onEnterDashboard}
                className="px-5 py-2.5 rounded-xl bg-[#252A2E] text-white hover:bg-[#343b40] font-semibold text-xs tracking-wide shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap transition-all"
              >
                <span>Acessar Painel Pro</span>
                <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
              </button>
            ) : (
              <button
                onClick={() => handleOpenPaywall("Assinar Agora")}
                className="px-5 py-2.5 rounded-xl bg-[#C9A96E] hover:bg-[#b8955b] text-white font-semibold text-xs tracking-wide shadow-md shadow-[#C9A96E]/20 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Começar Agora</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Elemento de iluminação e textura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#C9A96E]/10 via-[#607D8B]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#607D8B]/10 border border-[#607D8B]/20 text-[#607D8B] text-xs font-semibold tracking-wide mb-6">
            <Flame className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Fórmula Comprovada "E... MAS... POR ISSO" + Corte em -30dB</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#252A2E] tracking-tight leading-[1.08] mb-6">
            Transforme vídeos brutos em{" "}
            <span className="italic font-normal text-[#C9A96E]">máquinas de retenção</span> e vendas no Instagram.
          </h1>

          <p className="text-lg sm:text-xl text-[#607D8B] max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            Elimine hesitações e silêncios automaticamente, gere a matriz de{" "}
            <strong className="text-[#252A2E] font-semibold">6 roteiros pelos 6 Chapéus</strong> com formatos para Reels e Carrossel, e receba as 2 variações prontas para teste A/B.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#playground"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#252A2E] text-white hover:bg-[#343b40] font-semibold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-[#C9A96E]" />
              <span>Experimentar Gerador Grátis</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleOpenPaywall("Assinatura Pro Hero")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C9A96E] text-white hover:bg-[#b8955b] font-semibold text-sm shadow-lg shadow-[#C9A96E]/25 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <Lock className="w-4 h-4" />
              <span>Desbloquear SaaS Completo</span>
            </button>
          </div>

          {/* Prova Social e Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-[#D9DDE0]/80">
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#252A2E]">67%</div>
              <p className="text-xs text-[#607D8B] mt-0.5">Retenção Média Alcançada</p>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C9A96E]">-30dB</div>
              <p className="text-xs text-[#607D8B] mt-0.5">Limiar de Silêncio Cortado</p>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#252A2E]">6 Ângulos</div>
              <p className="text-xs text-[#607D8B] mt-0.5">Chapéus por Tema</p>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#607D8B]">2 Versões</div>
              <p className="text-xs text-[#607D8B] mt-0.5">Teste A/B Automático</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEMONSTRAÇÃO LIMITADA (INTERACTIVE PLAYGROUND COM PAYWALL) */}
      <section id="playground" className="py-16 bg-[#252A2E] text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/40 text-xs font-semibold tracking-wider uppercase rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Demonstração Limitada
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F8F6F1]">
              Experimente a IA Agora Mesmo
            </h2>
            <p className="text-sm sm:text-base text-[#D9DDE0] mt-2 max-w-xl mx-auto">
              Digite o assunto sobre o qual você deseja gravar. Veja como o algoritmo cria um gancho cirúrgico baseado na fórmula <span className="text-[#C9A96E]">"E... MAS... POR ISSO"</span>.
            </p>
          </div>

          {/* Caixa de Entrada Interativa */}
          <div className="bg-[#343b40] p-6 rounded-2xl border border-[#607D8B]/40 shadow-2xl">
            <form onSubmit={handleGenerateQuickDemo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#D9DDE0] mb-2">
                  Qual é o tema do seu próximo vídeo?
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="Ex: Como dobrar o tempo de retenção nos Reels..."
                    className="flex-1 px-4 py-3.5 rounded-xl bg-[#252A2E] text-white placeholder-[#607D8B] border border-[#607D8B]/50 focus:outline-none focus:border-[#C9A96E] text-sm"
                  />
                  <button
                    type="submit"
                    disabled={isGeneratingDemo}
                    className="px-6 py-3.5 rounded-xl bg-[#C9A96E] hover:bg-[#b8955b] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingDemo ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Criando Gancho...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Gerar Gancho Rápido</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Temas Sugeridos */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-[#607D8B]">Sugestões rápidas:</span>
                {suggestedTopics.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopicInput(t);
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#252A2E] hover:bg-[#607D8B]/30 text-[#D9DDE0] border border-[#607D8B]/30 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </form>

            {/* Resultado da Demonstração */}
            {demoResult && (
              <div className="mt-6 pt-6 border-t border-[#607D8B]/40 space-y-4 animate-fade-in">
                {/* 1. Gancho Rápido */}
                <div className="bg-[#252A2E] p-4 rounded-xl border border-[#C9A96E]/30 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#C9A96E] uppercase tracking-wide">
                      <Flame className="w-3.5 h-3.5" />
                      Gancho Rápido (0 - 3s)
                    </span>
                    <button
                      onClick={handleCopyHook}
                      className="text-xs text-[#D9DDE0] hover:text-white flex items-center gap-1 bg-[#343b40] px-2.5 py-1 rounded-md"
                    >
                      {copiedHook ? <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A96E]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedHook ? "Copiado!" : "Copiar"}</span>
                    </button>
                  </div>
                  <p className="text-base font-serif italic text-white leading-relaxed">
                    "{demoResult.hook}"
                  </p>
                </div>

                {/* 2. Fórmula de Conexão */}
                <div className="bg-[#252A2E] p-4 rounded-xl border border-[#607D8B]/30">
                  <span className="block text-xs font-semibold text-[#607D8B] uppercase tracking-wide mb-1">
                    Fórmula de Conexão no Clímax (E... MAS... POR ISSO):
                  </span>
                  <p className="text-xs text-[#D9DDE0] leading-relaxed">
                    {demoResult.connectionFormulaSample}
                  </p>
                </div>

                {/* 3. Barreira / Paywall Interativo */}
                <div className="relative rounded-xl overflow-hidden p-6 bg-gradient-to-br from-[#252A2E] via-[#343b40] to-[#252A2E] border-2 border-[#C9A96E] shadow-xl">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96E] uppercase tracking-wider">
                        <Lock className="w-4 h-4" />
                        5 Roteiros Restantes Bloqueados
                      </div>
                      <h4 className="text-lg font-serif font-bold text-white">
                        Quer a Matriz Completa dos 6 Chapéus + Carrossel?
                      </h4>
                      <p className="text-xs text-[#D9DDE0] max-w-lg">
                        Libere agora os roteiros de Fatos, Emoção profunda, Erros fatais, Benefício direto, Ideia disruptiva e Método organizado, além do estúdio de corte em -30dB.
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenPaywall("Desbloqueio da Matriz dos 6 Chapéus")}
                      className="px-6 py-3 rounded-xl bg-[#C9A96E] hover:bg-[#b8955b] text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-[#C9A96E]/20 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-transform hover:scale-105"
                    >
                      <span>Desbloquear por R$ 97</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO DE VENDAS & BENEFÍCIOS (OS 4 PILARES DO SAAS) */}
      <section id="beneficios" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96E] block mb-2">
            Engenharia de Retenção & IA
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#252A2E] tracking-tight">
            Tudo o que você precisa para dominar o algoritmo do Instagram.
          </h2>
          <p className="text-base text-[#607D8B] mt-4">
            Uma suíte integrada que resolve desde a estratégia de perfil até o corte cirúrgico na timeline de vídeo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Matriz dos 6 Chapéus */}
          <div className="bg-white p-8 rounded-2xl border border-[#D9DDE0] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#607D8B]/10 text-[#607D8B] flex items-center justify-center mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-wider">
              Pilar 01 • Roteirização Estruturada
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#252A2E] mt-1 mb-3">
              A Matriz dos 6 Chapéus do Conteúdo
            </h3>
            <p className="text-sm text-[#607D8B] leading-relaxed mb-4">
              Cada tema inserido é desdobrado em 6 ângulos neuropsicológicos distintos: Fatos concretos, Emoção visceral, Erros fatais, Oportunidade direta, Criatividade contraintuitiva e Método de processo.
            </p>
            <ul className="space-y-2 text-xs text-[#252A2E] font-medium mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Fórmula de conexão "E... MAS... POR ISSO" obrigatória</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Versão para Reels (9:16) e Carrossel (slides 1 a 6)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Teleprompter integrado com direção de gravação</span>
              </li>
            </ul>
            <button
              onClick={() => handleOpenPaywall("Roteirizador 6 Chapéus")}
              className="text-xs font-bold text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explorar matriz de roteiros</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Microserviço de Vídeo */}
          <div className="bg-white p-8 rounded-2xl border border-[#D9DDE0] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/15 text-[#C9A96E] flex items-center justify-center mb-6">
              <Scissors className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-wider">
              Pilar 02 • Corte de Silêncios
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#252A2E] mt-1 mb-3">
              Corte Automático em -30dB com FFmpeg
            </h3>
            <p className="text-sm text-[#607D8B] leading-relaxed mb-4">
              Nosso microserviço em Python analisa as faixas de áudio e extrai cirurgicamente qualquer pausa superior a 0.25 segundos, eliminando o tédio inconsciente do espectador.
            </p>
            <ul className="space-y-2 text-xs text-[#252A2E] font-medium mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Geração de Versão A (Hiperdinâmica / 0.05s)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Geração de Versão B (Cadência Natural / 0.25s)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Player sincronizado lado a lado para teste A/B</span>
              </li>
            </ul>
            <button
              onClick={() => handleOpenPaywall("Estúdio de Edição")}
              className="text-xs font-bold text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver estúdio de corte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Auditoria de Perfil & UVP */}
          <div className="bg-white p-8 rounded-2xl border border-[#D9DDE0] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#607D8B]/10 text-[#607D8B] flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-wider">
              Pilar 03 • Estratégia de Perfil
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#252A2E] mt-1 mb-3">
              Auditoria de Bio, UVP e Consistência
            </h3>
            <p className="text-sm text-[#607D8B] leading-relaxed mb-4">
              Não adianta viralizar no Reels se sua bio não converte visitantes em seguidores e clientes. A IA analisa sua proposta única de valor e entrega reescritas validadas.
            </p>
            <ul className="space-y-2 text-xs text-[#252A2E] font-medium mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Pontuação de 0 a 100 de clareza da Bio</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Diagnóstico dos 3 pilares de conteúdo do feed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Plano de ação prioritário (Alta, Média, Baixa)</span>
              </li>
            </ul>
            <button
              onClick={() => handleOpenPaywall("Auditoria de Perfil")}
              className="text-xs font-bold text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Auditar perfil com IA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Legendas A/B & Melhores Horários */}
          <div className="bg-white p-8 rounded-2xl border border-[#D9DDE0] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/15 text-[#C9A96E] flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-wider">
              Pilar 04 • Distribuição do Algoritmo
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#252A2E] mt-1 mb-3">
              Legendas A/B & Janelas de Postagem
            </h3>
            <p className="text-sm text-[#607D8B] leading-relaxed mb-4">
              Gere legendas no ângulo Racional (dados, curiosidade, debate nos comentários) e no ângulo Emocional (storytelling, alívio, salvamentos) cruzadas com o horário de pico do seu nicho.
            </p>
            <ul className="space-y-2 text-xs text-[#252A2E] font-medium mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Hashtags de densidade estratégica</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Recomendação de horários (ex: 12:15 e 18:30)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                <span>Cópia de legenda pronta em 1 clique</span>
              </li>
            </ul>
            <button
              onClick={() => handleOpenPaywall("Legendas A/B")}
              className="text-xs font-bold text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver testes A/B</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. TABELA DE PREÇOS & PLANO MENSAL */}
      <section id="precos" className="py-20 bg-[#252A2E] text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96E] block mb-2">
              Planos Transparentes
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#F8F6F1]">
              Comece a Criar Vídeos com Retenção Cirúrgica
            </h2>
            <p className="text-sm sm:text-base text-[#D9DDE0] mt-3">
              Acesso total e imediato à inteligência dos 6 Chapéus e ao motor de corte de silêncio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Plano Mensal Pro */}
            <div className="bg-[#343b40] p-8 rounded-2xl border border-[#607D8B]/40 flex flex-col justify-between relative shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#D9DDE0]">
                    Plano Mensal Pro
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#607D8B]/20 text-[#D9DDE0]">
                    Sem Fidelidade
                  </span>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-serif font-bold text-white">R$ 39,90</span>
                    <span className="text-sm text-[#D9DDE0]">/mês</span>
                  </div>
                  <p className="text-xs text-[#D9DDE0]/70 mt-1">Cobrança mensal recorrente • Cancele quando quiser</p>
                </div>

                <ul className="space-y-3 text-xs text-[#D9DDE0] mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                    <span>Geração ilimitada da Matriz dos 6 Chapéus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                    <span>Formatos duplos para cada tema (Reels + Carrossel)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                    <span>Corte automático de silêncios (&lt; -30dB)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                    <span>Exportação de 2 versões (Versão A e B)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                    <span>Auditoria completa de perfil do Instagram</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenPaywall("Plano Mensal Pro")}
                className="w-full py-4 rounded-xl bg-white text-[#252A2E] hover:bg-[#D9DDE0] font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <span>Assinar Plano Mensal • R$ 39,90</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Plano Creator Anual (Destaque) */}
            <div className="bg-[#252A2E] p-8 rounded-2xl border-2 border-[#C9A96E] flex flex-col justify-between relative shadow-2xl">
              <span className="absolute -top-3 right-6 bg-[#C9A96E] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap">
                Mais Popular • Economize 37% • Até 12x
              </span>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#C9A96E]">
                    Plano Creator Anual
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#C9A96E]/20 text-[#C9A96E]">
                    Melhor Custo-Benefício
                  </span>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-serif font-bold text-[#C9A96E]">R$ 24,90</span>
                    <span className="text-sm text-[#D9DDE0]">/mês</span>
                  </div>
                  <p className="text-xs text-[#D9DDE0]/80 mt-1">12x de R$ 24,90 no cartão (total de R$ 298,80/ano)</p>
                </div>

                <ul className="space-y-3 text-xs text-[#D9DDE0] mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                    <span>Tudo o que está incluído no Plano Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                    <span>Prioridade máxima na fila de renderização FFmpeg</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                    <span>Acesso antecipado aos novos modelos de ganchos virais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                    <span>Suporte VIP direto via WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                    <span>Garantia incondicional de 7 dias ou seu dinheiro de volta</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenPaywall("Plano Creator Anual")}
                className="w-full py-4 rounded-xl bg-[#C9A96E] hover:bg-[#b8955b] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#C9A96E]/25 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <span>Assinar Plano Anual • 12x de R$ 24,90</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-12 text-center flex items-center justify-center gap-6 text-xs text-[#607D8B]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C9A96E]" />
              <span>Garantia de 7 Dias</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C9A96E]" />
              <span>Ativação Imediata</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C9A96E]" />
              <span>Pagamento Seguro Criptografado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Elegante com Acesso Restrito Discreto */}
      <footer className="py-12 bg-[#F8F6F1] border-t border-[#D9DDE0] text-center text-xs text-[#607D8B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#252A2E]">
            <Video className="w-4 h-4 text-[#C9A96E]" />
            <span>AutoReels AI</span>
          </div>
          <p>© {new Date().getFullYear()} AutoReels SaaS. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="#playground" className="hover:text-[#252A2E] transition-colors">Playground</a>
            <a href="#precos" className="hover:text-[#252A2E] transition-colors">Preços</a>
            <button
              onClick={() => handleOpenPaywall("Footer Login")}
              className="hover:text-[#252A2E] cursor-pointer transition-colors"
            >
              Área de Membros
            </button>
            {/* Link discreto para autenticação de administrador com senha */}
            <button
              onClick={() => setIsAdminLoginOpen(true)}
              className="text-[#607D8B]/50 hover:text-[#252A2E] flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
              title="Acesso reservado"
            >
              <Lock className="w-3 h-3 text-[#607D8B]/50" />
              <span>Acesso Restrito</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Acesso Restrito com Senha para Administrador */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          if (onAdminBypass) {
            onAdminBypass();
          } else {
            onEnterDashboard();
          }
        }}
      />

      {/* Modal de Paywall e Checkout */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccessUnlock={() => {
          setIsPaywallOpen(false);
          onEnterDashboard();
        }}
        initialTopic={topicInput}
        sourceFeature={paywallSource}
      />
    </div>
  );
};
