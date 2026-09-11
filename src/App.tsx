/**
 * Main Application Component: AutoReels AI SaaS
 * Suíte de Roteirização em 6 Chapéus, Edição em -30dB e Landing Page de Conversão com Paywall
 */
import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { SixHatsStudio } from "./components/SixHatsStudio";
import { ProfileDashboard } from "./components/ProfileDashboard";
import { CalendarScriptGenerator } from "./components/CalendarScriptGenerator";
import { VideoStudio } from "./components/VideoStudio";
import { ArchitectureDocsModal } from "./components/ArchitectureDocsModal";
import { PaywallModal } from "./components/PaywallModal";
import {
  initialProfile,
  initialAudit,
  initialContentPlans,
  initialVideoJob,
} from "./data/initialData";
import {
  UserProfile,
  ProfileAudit,
  ContentPlanItem,
  VideoJob,
  GeneratedScript,
  SixHatScriptItem,
} from "./types";
import { Sparkles, CheckCircle2, AlertCircle, Crown, Eye, ShieldCheck } from "lucide-react";

export default function App() {
  // Controle de Navegação Principal: Landing Page vs Dashboard
  const [viewMode, setViewMode] = useState<"landing" | "dashboard">("dashboard");
  const [activeTab, setActiveTab] = useState<"six_hats" | "studio" | "profile" | "calendar" | "architecture">("six_hats");

  // Estado de Assinatura & Modo Administrador (Alexandre Fontinele)
  const [isPaidUser, setIsPaidUser] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(true);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Core SaaS State
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [audit, setAudit] = useState<ProfileAudit | null>(initialAudit);
  const [plans, setPlans] = useState<ContentPlanItem[]>(initialContentPlans);
  const [videoJob, setVideoJob] = useState<VideoJob>(initialVideoJob);
  const [activeScript, setActiveScript] = useState<GeneratedScript | null>(null);

  // Loading States
  const [isAuditing, setIsAuditing] = useState(false);
  const [isGeneratingCalendar, setIsGeneratingCalendar] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Consulta status inicial da assinatura
  useEffect(() => {
    fetch("/api/subscription/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setIsPaidUser(data.data.isPaid);
          if (data.data.isAdmin) {
            setIsAdminMode(true);
          }
        }
      })
      .catch((err) => console.error("Erro ao checar assinatura:", err));
  }, []);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Desbloqueio e Acesso ao Dashboard (Padrão ou Checkout)
  const handleEnterDashboard = () => {
    setIsPaidUser(true);
    setViewMode("dashboard");
    showNotification("Assinatura Pro ativada! Bem-vindo ao Dashboard.");
  };

  // Bypass Imediato para o Administrador Alexandre Fontinele após login autenticado
  const handleAdminBypass = () => {
    setIsPaidUser(true);
    setIsAdminMode(true);
    setViewMode("dashboard");
    showNotification("👑 Acesso de Administrador Master ativado (Alexandre Fontinele)!");
  };

  // Alternar para modo visitante (para testar o paywall e landing page como cliente)
  const handleToggleVisitorMode = async () => {
    try {
      await fetch("/api/admin/toggle-visitor", { method: "POST" });
      setIsPaidUser(false);
      setViewMode("landing");
      showNotification("👁️ Modo Visitante ativo: Teste o Paywall e a conversão como um cliente comum.");
    } catch {
      setIsPaidUser(false);
      setViewMode("landing");
    }
  };

  const handleResetSubscription = async () => {
    try {
      await fetch("/api/subscription/reset", { method: "POST" });
      setIsPaidUser(false);
      setViewMode("landing");
      showNotification("Modo teste: Assinatura resetada para demonstração.");
    } catch {
      setIsPaidUser(false);
      setViewMode("landing");
    }
  };

  // 1. Audit Profile via Gemini API
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const response = await fetch("/api/profile/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagramHandle: profile.instagramHandle,
          niche: profile.niche,
          targetAudience: profile.targetAudience,
          currentBio: profile.bioText,
          averageViews: profile.averageViews,
          followersCount: profile.followersCount,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setAudit(resData.data);
        showNotification("Auditoria de perfil e retenção concluída com sucesso!");
      } else {
        throw new Error(resData.error || "Falha ao auditar perfil");
      }
    } catch (err: any) {
      console.error("Erro na auditoria:", err);
      showNotification(err.message || "Erro de conexão com o Gemini", "error");
    } finally {
      setIsAuditing(false);
    }
  };

  // 2. Generate Content Calendar via Gemini API
  const handleGenerateCalendar = async () => {
    setIsGeneratingCalendar(true);
    try {
      const response = await fetch("/api/calendar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagramHandle: profile.instagramHandle,
          targetAudience: profile.targetAudience,
          toneOfVoice: profile.toneOfVoice,
          niche: profile.niche,
          postingDaysPerWeek: 7,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data?.days) {
        const newPlans: ContentPlanItem[] = resData.data.days.map((d: any, idx: number) => ({
          id: `plan_gen_${Date.now()}_${idx}`,
          dayOfWeek: d.dayOfWeek,
          postingTime: d.suggestedTime,
          contentType: d.format as any,
          theme: d.theme,
          objective: d.objective,
          hookIdea: d.hookIdea,
          captionIdea: d.captionIdea,
          status: "draft",
        }));
        setPlans(newPlans);
        showNotification("Calendário editorial de 7 dias gerado com sucesso!");
      } else {
        throw new Error(resData.error || "Falha ao gerar calendário");
      }
    } catch (err: any) {
      console.error("Erro no calendário:", err);
      showNotification(err.message || "Erro de conexão com o Gemini", "error");
    } finally {
      setIsGeneratingCalendar(false);
    }
  };

  // 3. Generate Script for a Calendar Item
  const handleGenerateScript = async (plan: ContentPlanItem) => {
    setIsGeneratingScript(true);
    try {
      const response = await fetch("/api/script/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: plan.theme,
          profileConfig: {
            instagramHandle: profile.instagramHandle,
            targetAudience: profile.targetAudience,
            toneOfVoice: profile.toneOfVoice,
            niche: profile.niche,
            customScriptRules: profile.customScriptRules,
          },
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setActiveScript(resData.data);
        showNotification(`Roteiro estruturado gerado para "${plan.theme}"!`);
      } else {
        throw new Error(resData.error || "Falha ao gerar roteiro");
      }
    } catch (err: any) {
      console.error("Erro no roteiro:", err);
      showNotification(err.message || "Erro de conexão com o Gemini", "error");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // 4. Video Processing Simulator (FFmpeg / auto-editor silence cutting)
  const handleProcessVideo = async (
    title: string,
    duration: number,
    silenceDb: number,
    fileName: string
  ) => {
    setIsProcessingVideo(true);
    try {
      const response = await fetch("/api/video/process-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: title,
          originalDuration: duration,
          silenceDb,
          fileName,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setVideoJob((prev) => ({
          ...prev,
          title: resData.data.title,
          rawDurationSec: resData.data.rawDurationSec,
          v1DurationSec: resData.data.v1DurationSec,
          v2DurationSec: resData.data.v2DurationSec,
          silenceThresholdDb: resData.data.silenceThresholdDb,
          silenceSegmentsDetected: resData.data.silenceSegmentsDetected,
          status: "completed",
        }));
        showNotification(
          `Corte de silêncios (< ${silenceDb}dB) concluído! Versão A (-38%) e B (-20%) geradas.`
        );
      } else {
        throw new Error(resData.error || "Falha no corte de silêncio");
      }
    } catch (err: any) {
      console.error("Erro no processamento:", err);
      showNotification(err.message || "Erro no processamento de vídeo", "error");
    } finally {
      setIsProcessingVideo(false);
    }
  };

  // 5. Generate AB Captions
  const handleGenerateCaptions = async (transcription: string) => {
    setIsGeneratingCaptions(true);
    try {
      const response = await fetch("/api/captions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTranscription: transcription,
          instagramHandle: profile.instagramHandle,
          niche: profile.niche,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setVideoJob((prev) => ({
          ...prev,
          captions: resData.data,
        }));
        showNotification("Legendas A/B e melhores horários de postagem calculados!");
      } else {
        throw new Error(resData.error || "Falha ao gerar legendas");
      }
    } catch (err: any) {
      console.error("Erro nas legendas:", err);
      showNotification(err.message || "Erro na geração de legendas", "error");
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  // 6. Enviar Roteiro dos 6 Chapéus para o Estúdio de Edição
  const handleSendHatScriptToStudio = (scriptItem: SixHatScriptItem) => {
    setVideoJob((prev) => ({
      ...prev,
      title: `${scriptItem.hatBadge}: ${scriptItem.hatTitle}`,
    }));
    setActiveTab("studio");
    showNotification(`Roteiro "${scriptItem.hatBadge}" carregado no Estúdio de Gravação!`);
  };

  const handleSendToStudio = (ideaTitle: string) => {
    setVideoJob((prev) => ({
      ...prev,
      title: ideaTitle,
    }));
    setActiveTab("studio");
    showNotification(`Tema "${ideaTitle}" enviado para o Estúdio de Edição!`);
  };

  // Se o usuário estiver na Landing Page de conversão:
  if (viewMode === "landing") {
    return (
      <>
        {/* Global Toast Notification */}
        {notification && (
          <div
            className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center space-x-2 animate-bounce ${
              notification.type === "success"
                ? "bg-[#252A2E] border-[#C9A96E] text-[#C9A96E]"
                : "bg-rose-950 border-rose-500 text-rose-200"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{notification.message}</span>
          </div>
        )}

        <LandingPage
          onEnterDashboard={() => setViewMode("dashboard")}
          isPaidUser={isPaidUser}
          onAdminBypass={handleAdminBypass}
        />
      </>
    );
  }

  // Dashboard do SaaS Pro
  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#252A2E] flex flex-col font-sans selection:bg-[#C9A96E] selection:text-white">
      {/* Global Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center space-x-2 animate-bounce ${
            notification.type === "success"
              ? "bg-[#252A2E] border-[#C9A96E] text-[#C9A96E]"
              : "bg-rose-950 border-rose-500 text-rose-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Master Admin Top Bar no Dashboard */}
      {isAdminMode && (
        <div className="bg-[#252A2E] text-white px-4 py-1.5 border-b border-[#C9A96E]/30 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[#C9A96E] font-bold">
              <Crown className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Painel do Administrador (Alexandre Fontinele)</span>
            </span>
            <span className="text-[#607D8B] hidden sm:inline">•</span>
            <span className="text-[#D9DDE0] text-[11px] hidden sm:inline">
              Todas as ferramentas liberadas (6 Chapéus, Corte -30dB, Carrossel, Legendas A/B)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVisitorMode}
              className="px-2.5 py-1 rounded bg-[#343b40] hover:bg-[#454e54] text-[#D9DDE0] hover:text-white font-medium text-[11px] flex items-center gap-1.5 cursor-pointer border border-white/10 transition-colors"
              title="Alterna para a visão do visitante comum para você testar a landing page e o Paywall"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Testar como Visitante (Paywall)</span>
            </button>
          </div>
        </div>
      )}

      {/* Navbar com Navegação Pro */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        instagramHandle={profile.instagramHandle}
        onGoToLanding={() => setViewMode("landing")}
        onResetSubscription={handleResetSubscription}
        isAdmin={isAdminMode}
        onToggleVisitorMode={handleToggleVisitorMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "six_hats" && (
          <SixHatsStudio
            userProfile={profile}
            initialTopic={videoJob.title || "Como reter atenção no Instagram Reels"}
            onSendToVideoStudio={handleSendHatScriptToStudio}
          />
        )}

        {activeTab === "studio" && (
          <VideoStudio
            currentJob={videoJob}
            onProcessVideo={handleProcessVideo}
            isProcessing={isProcessingVideo}
            profile={profile}
            onGenerateCaptions={handleGenerateCaptions}
            isGeneratingCaptions={isGeneratingCaptions}
          />
        )}

        {activeTab === "profile" && (
          <ProfileDashboard
            profile={profile}
            onUpdateProfile={(updated) => {
              setProfile(updated);
              showNotification("Diretrizes de perfil e regras atualizadas no Supabase!");
            }}
            audit={audit}
            onRunAudit={handleRunAudit}
            isAuditing={isAuditing}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarScriptGenerator
            plans={plans}
            profile={profile}
            onGenerateCalendar={handleGenerateCalendar}
            isGeneratingCalendar={isGeneratingCalendar}
            onGenerateScript={handleGenerateScript}
            isGeneratingScript={isGeneratingScript}
            activeScript={activeScript}
            setActiveScript={setActiveScript}
            onSendToStudio={handleSendToStudio}
          />
        )}

        {activeTab === "architecture" && <ArchitectureDocsModal />}
      </main>

      {/* Footer Sofisticado */}
      <footer className="border-t border-[#D9DDE0] bg-[#F8F6F1] py-6 text-center text-xs text-[#607D8B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-[#C9A96E] animate-pulse"></span>
            <span>AutoReels AI Pro • Supabase RLS • FFmpeg -30dB • Gemini 3.8 Flash</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode("landing")}
              className="hover:text-[#252A2E] underline cursor-pointer"
            >
              Voltar à Landing Page
            </button>
            <p>© {new Date().getFullYear()} AutoReels SaaS. Automação de Vídeos para Instagram.</p>
          </div>
        </div>
      </footer>

      {/* Modal de Paywall caso necessário */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccessUnlock={handleEnterDashboard}
      />
    </div>
  );
}
