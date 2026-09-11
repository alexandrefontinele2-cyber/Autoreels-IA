/**
 * Main Application Component: AutoReels AI SaaS
 * Suíte de Análise de Perfil, Roteirização em 6 Chapéus, Edição em -30dB, Calendário e Gestão de Perfil
 */
import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { ProfileDashboard } from "./components/ProfileDashboard";
import { SixHatsStudio } from "./components/SixHatsStudio";
import { VideoStudio } from "./components/VideoStudio";
import { CalendarScriptGenerator } from "./components/CalendarScriptGenerator";
import { UserProfileManager } from "./components/UserProfileManager";
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
  MainAppTab,
  UserAccountData,
} from "./types";
import { Sparkles, Crown, Eye, CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  // Controle de Navegação Principal: Landing Page vs Dashboard
  const [viewMode, setViewMode] = useState<"landing" | "dashboard">("dashboard");

  // As 5 Abas Oficiais do SaaS
  const [activeTab, setActiveTab] = useState<MainAppTab>("analyze_profile");

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

  // Dados do Usuário e os 2 Perfis do Instagram Vinculados (Regra: Máximo 2 perfis)
  const [userAccount, setUserAccount] = useState<UserAccountData>({
    fullName: "Alexandre Fontinele",
    email: "alexandre.fontinele2@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isAdmin: true,
    subscriptionPlan: "pro_annual",
    linkedAccounts: [
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
    ],
  });

  // Loading States
  const [isAuditing, setIsAuditing] = useState(false);
  const [isGeneratingCalendar, setIsGeneratingCalendar] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Consulta status inicial da assinatura e dados do usuário
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

    fetch("/api/user/account")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUserAccount(data.data);
          const active = data.data.linkedAccounts?.find((a: any) => a.isActive);
          if (active) {
            setProfile((prev) => ({
              ...prev,
              instagramHandle: active.handle,
              niche: active.niche,
            }));
          }
        }
      })
      .catch(() => {});
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
      showNotification("Modo Visitante ativo: Teste o Paywall e a conversão como um visitante comum.");
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
        showNotification(`Auditoria de bio, feed e retenção de @${profile.instagramHandle} concluída!`);
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
          contentTitle: d.theme,
          objective: d.objective,
          hookIdea: d.hookIdea,
          hookPreview: d.hookIdea,
          captionIdea: d.captionIdea,
          suggestedPostingTime: d.suggestedTime,
          status: "draft",
        }));
        setPlans(newPlans);
        showNotification("Calendário semanal e horários de pico gerados com sucesso!");
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
  const handleGenerateScript = async (ideaTitle: string): Promise<GeneratedScript | null> => {
    setIsGeneratingScript(true);
    try {
      const response = await fetch("/api/scripts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: ideaTitle,
          customScriptRules: profile.customScriptRules,
          targetAudience: profile.targetAudience,
          toneOfVoice: profile.toneOfVoice,
          durationTargetSeconds: 45,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setActiveScript(resData.data);
        showNotification(`Roteiro estruturado gerado para "${ideaTitle}"!`);
        return resData.data;
      } else {
        throw new Error(resData.error || "Falha ao gerar roteiro");
      }
    } catch (err: any) {
      console.error("Erro no roteiro:", err);
      showNotification(err.message || "Erro de conexão com o Gemini", "error");
      return null;
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // 4. Video Processing via Python FastAPI / FFmpeg silence cutting
  const handleProcessVideo = async (
    title: string,
    duration: number,
    silenceDb: number,
    fileName: string
  ) => {
    setIsProcessingVideo(true);
    try {
      const response = await fetch("/api/v1/cut-silence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_url: null,
          silence_threshold_db: silenceDb,
          margin_seconds: 0.1,
          detect_hesitations: true,
        }),
      });

      const resData = await response.json();

      // Também aciona o job no servidor
      await fetch("/api/video/process-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: title,
          originalDuration: duration,
          silenceDb,
          fileName,
        }),
      });

      setVideoJob((prev) => ({
        ...prev,
        title,
        status: "completed",
        silenceThresholdDb: silenceDb,
      }));

      showNotification(
        `Corte de silêncios (< ${silenceDb}dB) concluído! Vídeo MP4 pronto para download.`
      );
    } catch (err: any) {
      console.error("Erro no processamento:", err);
      showNotification(err.message || "Erro no processamento de vídeo", "error");
    } finally {
      setIsProcessingVideo(false);
    }
  };

  // 5. Generate Captions
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
        showNotification("Legendas estratégicas e hashtags de alto alcance geradas!");
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
    setActiveTab("video_edit");
    showNotification(`Roteiro "${scriptItem.hatBadge}" carregado no Estúdio de Vídeo!`);
  };

  const handleSendToStudio = (ideaTitle: string) => {
    setVideoJob((prev) => ({
      ...prev,
      title: ideaTitle,
    }));
    setActiveTab("video_edit");
    showNotification(`Tema "${ideaTitle}" enviado para o Estúdio de Vídeo!`);
  };

  // Se o usuário estiver na Landing Page de conversão:
  if (viewMode === "landing") {
    return (
      <>
        {notification && (
          <div
            className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center space-x-2 animate-bounce ${
              notification.type === "success"
                ? "bg-[#252A2E] border-[#C9A96E] text-[#C9A96E]"
                : "bg-red-900 border-red-500 text-white"
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
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center space-x-2 animate-bounce ${
            notification.type === "success"
              ? "bg-[#252A2E] border-[#C9A96E] text-[#C9A96E]"
              : "bg-red-900 border-red-500 text-white"
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
              <span>Painel do Administrador Master (Alexandre Fontinele)</span>
            </span>
            <span className="text-[#607D8B] hidden sm:inline">•</span>
            <span className="text-[#D9DDE0] text-[11px] hidden sm:inline">
              Automação de Conteúdo, Microserviço Python (-30dB) & Supabase RLS Ativos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVisitorMode}
              className="px-2.5 py-1 rounded bg-[#343b40] hover:bg-[#454e54] text-[#D9DDE0] hover:text-white font-medium text-[11px] flex items-center gap-1.5 cursor-pointer border border-white/10 transition-colors"
              title="Alterna para a visão do visitante para testar a landing page e o Paywall"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Testar como Visitante</span>
            </button>
          </div>
        </div>
      )}

      {/* Navbar Responsiva com as 5 Abas Oficiais */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        instagramHandle={profile.instagramHandle}
        onGoToLanding={() => setViewMode("landing")}
        onResetSubscription={handleResetSubscription}
        isAdmin={isAdminMode}
        onToggleVisitorMode={handleToggleVisitorMode}
      />

      {/* Main Content Area: Renderização das 5 Telas Oficiais */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. "Analise seu perfil" */}
        {activeTab === "analyze_profile" && (
          <ProfileDashboard
            profile={profile}
            onUpdateProfile={(updated) => {
              setProfile(updated);
              showNotification("Diretrizes e configurações do perfil salvas!");
            }}
            audit={audit}
            onRunAudit={handleRunAudit}
            isAuditing={isAuditing}
            linkedProfiles={userAccount.linkedAccounts.map((a) => ({
              handle: a.handle,
              niche: a.niche,
            }))}
          />
        )}

        {/* 2. "Roteirize sua ideia" */}
        {activeTab === "script_idea" && (
          <SixHatsStudio
            userProfile={profile}
            initialTopic={videoJob.title || "Como reter atenção no Instagram Reels"}
            onSendToVideoStudio={handleSendHatScriptToStudio}
          />
        )}

        {/* 3. "Edite seu vídeo" */}
        {activeTab === "video_edit" && (
          <VideoStudio
            currentJob={videoJob}
            onProcessVideo={handleProcessVideo}
            isProcessing={isProcessingVideo}
            profile={profile}
            onGenerateCaptions={handleGenerateCaptions}
            isGeneratingCaptions={isGeneratingCaptions}
          />
        )}

        {/* 4. "Calendário de postagem" */}
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

        {/* 5. "Perfil" */}
        {activeTab === "account_profile" && (
          <UserProfileManager
            userAccount={userAccount}
            onUpdateAccount={(updated) => {
              setUserAccount(updated);
              showNotification("Dados de perfil e contas vinculadas atualizados!");
            }}
            onSelectActiveInstagram={(handle) => {
              const acc = userAccount.linkedAccounts.find((a) => a.handle === handle);
              if (acc) {
                setProfile((prev) => ({
                  ...prev,
                  instagramHandle: acc.handle,
                  niche: acc.niche,
                  bioText: acc.bioText,
                  followersCount: acc.followersCount,
                  averageViews: acc.averageViews,
                }));
              }
            }}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Footer Sofisticado */}
      <footer className="border-t border-[#D9DDE0] bg-[#F8F6F1] py-6 text-center text-xs text-[#607D8B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-[#C9A96E] animate-pulse"></span>
            <span>AutoReels AI Pro • Python FastAPI (-30dB) • Supabase RLS • Gemini 3.8 Flash</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode("landing")}
              className="hover:text-[#252A2E] underline cursor-pointer"
            >
              Ver Landing Page
            </button>
            <p>© {new Date().getFullYear()} AutoReels SaaS. Todos os direitos reservados.</p>
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
