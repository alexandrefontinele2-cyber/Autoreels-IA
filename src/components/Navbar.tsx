import React from "react";
import { Video, Calendar, Sparkles, UserCheck, Terminal, Layers, Crown, Home, LogOut, Eye, ShieldCheck } from "lucide-react";

interface NavbarProps {
  activeTab: "six_hats" | "studio" | "profile" | "calendar" | "architecture";
  setActiveTab: (tab: "six_hats" | "studio" | "profile" | "calendar" | "architecture") => void;
  instagramHandle: string;
  onGoToLanding: () => void;
  onResetSubscription?: () => void;
  isAdmin?: boolean;
  onToggleVisitorMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  instagramHandle,
  onGoToLanding,
  onResetSubscription,
  isAdmin = true,
  onToggleVisitorMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D9DDE0] bg-[#F8F6F1]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={onGoToLanding}>
          <div className="h-10 w-10 rounded-xl bg-[#252A2E] p-0.5 shadow-md border border-[#C9A96E]/40 flex items-center justify-center shrink-0">
            <Video className="h-5 w-5 text-[#C9A96E]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-lg tracking-tight text-[#252A2E] whitespace-nowrap">
                AutoReels<span className="text-[#C9A96E]">.ai</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/40 flex items-center gap-1 whitespace-nowrap">
                <Crown className="w-2.5 h-2.5" />
                Pro Ativo
              </span>
            </div>
            <p className="text-[11px] text-[#607D8B] hidden lg:block whitespace-nowrap">
              SaaS de Automação & Roteirização Cirúrgica
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-[#D9DDE0]/50 p-1 rounded-xl border border-[#D9DDE0] shrink-0">
          <button
            id="tab-six-hats-btn"
            onClick={() => setActiveTab("six_hats")}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "six_hats"
                ? "bg-[#252A2E] text-white shadow-sm"
                : "text-[#607D8B] hover:text-[#252A2E] hover:bg-white/60"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-[#C9A96E]" />
            <span className="hidden md:inline whitespace-nowrap">Matriz 6 Chapéus</span>
            <span className="md:hidden whitespace-nowrap">6 Chapéus</span>
          </button>

          <button
            id="tab-studio-btn"
            onClick={() => setActiveTab("studio")}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "studio"
                ? "bg-[#252A2E] text-white shadow-sm"
                : "text-[#607D8B] hover:text-[#252A2E] hover:bg-white/60"
            }`}
          >
            <Video className="h-3.5 w-3.5 text-[#C9A96E]" />
            <span className="hidden md:inline whitespace-nowrap">Estúdio Vídeo (-30dB)</span>
            <span className="md:hidden whitespace-nowrap">Estúdio</span>
          </button>

          <button
            id="tab-profile-btn"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-[#252A2E] text-white shadow-sm"
                : "text-[#607D8B] hover:text-[#252A2E] hover:bg-white/60"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span className="hidden xl:inline whitespace-nowrap">Auditoria de Bio</span>
            <span className="xl:hidden whitespace-nowrap">Bio</span>
          </button>

          <button
            id="tab-calendar-btn"
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "calendar"
                ? "bg-[#252A2E] text-white shadow-sm"
                : "text-[#607D8B] hover:text-[#252A2E] hover:bg-white/60"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span className="hidden xl:inline whitespace-nowrap">Calendário Semanal</span>
            <span className="xl:hidden whitespace-nowrap">Agenda</span>
          </button>

          <button
            id="tab-architecture-btn"
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "architecture"
                ? "bg-[#607D8B] text-white shadow-sm"
                : "text-[#607D8B] hover:text-[#252A2E] hover:bg-white/60"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-[#C9A96E]" />
            <span className="hidden xl:inline whitespace-nowrap">Arquitetura</span>
            <span className="xl:hidden whitespace-nowrap">Docs</span>
          </button>
        </nav>

        {/* User Account / Status Info */}
        <div className="flex items-center space-x-2">
          {isAdmin && (
            <div className="hidden md:flex items-center space-x-1.5 bg-[#252A2E] text-[#C9A96E] border border-[#C9A96E]/50 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs">
              <Crown className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Admin Master</span>
            </div>
          )}

          <div className="hidden sm:flex items-center space-x-2 bg-white border border-[#D9DDE0] px-2.5 py-1.5 rounded-lg">
            <span className="h-2 w-2 rounded-full bg-[#C9A96E] animate-pulse"></span>
            <span className="text-xs font-medium text-[#252A2E]">
              @{instagramHandle}
            </span>
          </div>

          {onToggleVisitorMode && (
            <button
              onClick={onToggleVisitorMode}
              title="Testar experiência de visitante (com Paywall)"
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D9DDE0] text-[#607D8B] hover:text-[#252A2E] hover:border-[#607D8B] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#607D8B]" />
              <span className="hidden lg:inline">Testar Paywall</span>
            </button>
          )}

          <button
            onClick={onGoToLanding}
            title="Ver Landing Page de Conversão"
            className="p-2 rounded-lg text-[#607D8B] hover:text-[#252A2E] hover:bg-[#D9DDE0]/50 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
          </button>

          {onResetSubscription && (
            <button
              onClick={onResetSubscription}
              title="Resetar assinatura de teste"
              className="p-2 rounded-lg text-[#607D8B] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
