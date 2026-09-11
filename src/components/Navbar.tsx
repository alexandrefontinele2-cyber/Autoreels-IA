import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Video,
  Calendar,
  User,
  Crown,
  Home,
  LogOut,
  Eye,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import { MainAppTab } from "../types";

interface NavbarProps {
  activeTab: MainAppTab;
  setActiveTab: (tab: MainAppTab) => void;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{
    id: MainAppTab;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
  }> = [
    {
      id: "analyze_profile",
      label: "Analise seu perfil",
      shortLabel: "Analise seu perfil",
      icon: UserCheck,
    },
    {
      id: "script_idea",
      label: "Roteirize sua ideia",
      shortLabel: "Roteirize sua ideia",
      icon: Layers,
    },
    {
      id: "video_edit",
      label: "Edite seu vídeo",
      shortLabel: "Edite seu vídeo",
      icon: Video,
    },
    {
      id: "calendar",
      label: "Calendário de postagem",
      shortLabel: "Calendário",
      icon: Calendar,
    },
    {
      id: "account_profile",
      label: "Perfil",
      shortLabel: "Perfil",
      icon: User,
    },
  ];

  const handleTabClick = (tabId: MainAppTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D9DDE0] bg-[#F8F6F1]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer shrink-0"
          onClick={onGoToLanding}
          title="Ir para a Landing Page"
        >
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
                Pro
              </span>
            </div>
            <p className="text-[11px] text-[#607D8B] hidden xl:block whitespace-nowrap">
              Automação de Conteúdo & Edição
            </p>
          </div>
        </div>

        {/* Desktop Navigation - 5 Itens Oficiais Estritos */}
        <nav className="hidden lg:flex items-center space-x-1 bg-[#D9DDE0]/50 p-1 rounded-xl border border-[#D9DDE0] shrink-0">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}-btn`}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#252A2E] text-white shadow-xs"
                    : "text-[#607D8B] hover:text-[#252A2E] hover:bg-white/60"
                }`}
              >
                <IconComponent className={`h-3.5 w-3.5 ${isActive ? "text-[#C9A96E]" : "text-[#607D8B]"}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Account / Actions Info */}
        <div className="flex items-center space-x-2 shrink-0">
          {isAdmin && (
            <div className="hidden md:flex items-center space-x-1.5 bg-[#252A2E] text-[#C9A96E] border border-[#C9A96E]/50 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs whitespace-nowrap">
              <Crown className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Admin Master</span>
            </div>
          )}

          <div
            onClick={() => setActiveTab("account_profile")}
            className="hidden sm:flex items-center space-x-2 bg-white border border-[#D9DDE0] px-2.5 py-1.5 rounded-lg cursor-pointer hover:border-[#607D8B] transition-colors whitespace-nowrap"
            title="Gerenciar perfis vinculados"
          >
            <span className="h-2 w-2 rounded-full bg-[#C9A96E] animate-pulse"></span>
            <span className="text-xs font-medium text-[#252A2E]">
              @{instagramHandle}
            </span>
          </div>

          {onToggleVisitorMode && (
            <button
              onClick={onToggleVisitorMode}
              title="Testar experiência de visitante (com Paywall)"
              className="hidden sm:flex px-2.5 py-1.5 rounded-lg bg-white border border-[#D9DDE0] text-[#607D8B] hover:text-[#252A2E] hover:border-[#607D8B] text-xs font-semibold items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5 text-[#607D8B]" />
              <span className="hidden xl:inline">Testar Paywall</span>
            </button>
          )}

          <button
            onClick={onGoToLanding}
            title="Ver Landing Page Comercial"
            className="p-2 rounded-lg text-[#607D8B] hover:text-[#252A2E] hover:bg-[#D9DDE0]/50 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#252A2E] hover:bg-[#D9DDE0]/50 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D9DDE0] bg-[#F8F6F1] px-4 py-3 space-y-1 shadow-lg animate-fadeIn">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? "bg-[#252A2E] text-white"
                    : "text-[#607D8B] hover:text-[#252A2E] hover:bg-white"
                }`}
              >
                <IconComponent className={`h-4 w-4 ${isActive ? "text-[#C9A96E]" : "text-[#607D8B]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#D9DDE0] flex items-center justify-between text-xs text-[#607D8B]">
            <span>Perfil ativo: @{instagramHandle}</span>
            {onToggleVisitorMode && (
              <button
                onClick={onToggleVisitorMode}
                className="text-[#252A2E] font-semibold underline"
              >
                Testar Paywall
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
