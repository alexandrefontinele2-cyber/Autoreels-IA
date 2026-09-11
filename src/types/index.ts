/**
 * Types & Interfaces for AutoReels SaaS
 * Luxury & High-Retention Architecture
 */

export type HatType =
  | "hat_white_facts"       // Roteiro 1: Fatos reais e dados sobre o tema
  | "hat_red_emotions"      // Roteiro 2: Sentimentos e conexão emocional profunda
  | "hat_black_cautious"    // Roteiro 3: O que pode dar errado / Erros fatais
  | "hat_yellow_benefits"   // Roteiro 4: Benefício claro e transformação direta
  | "hat_green_creative"    // Roteiro 5: Ideia criativa, disruptiva e fora da caixa
  | "hat_blue_process";     // Roteiro 6: Organização, prioridade, ordem e método

export type MainAppTab =
  | "analyze_profile"   // 1. Analise seu perfil (Instagram @, Bio, Feed, Retenção - máx 2 perfis)
  | "script_idea"       // 2. Roteirize sua ideia (6 Chapéus, Fatos, Emoção, Erros, Benefício, Criativo, Organização)
  | "video_edit"        // 3. Edite seu vídeo (Upload .mp4/.mov, corte em -30dB, player e download)
  | "calendar"          // 4. Calendário de postagem (Organização semanal e melhores horários)
  | "account_profile";  // 5. Perfil (Gestão de foto, nome, email, senha e 2 perfis vinculados)

export interface LinkedInstagramAccount {
  id: string;
  handle: string;
  niche: string;
  followersCount: number;
  averageViews: number;
  bioText: string;
  isActive: boolean;
  addedAt: string;
}

export interface UserAccountData {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  linkedAccounts: LinkedInstagramAccount[]; // limite estrito de no máximo 2 perfis
  planName: string;
  isAdmin: boolean;
}

export interface UserSubscription {
  status: "trial" | "active" | "canceled" | "unpaid";
  planName: "Pro Mensal" | "Creator Anual";
  price: number;
  periodEnd: string;
  isPaid: boolean;
}

export interface UserProfile {
  id: string;
  instagramHandle: string;
  targetAudience: string;
  toneOfVoice: string;
  customScriptRules: string;
  bioText: string;
  niche: string;
  followersCount: number;
  averageViews: number;
  subscription?: UserSubscription;
}

export interface ProfileAudit {
  overallScore: number;
  bioAudit: {
    score: number;
    clarity: string;
    ctaEffectiveness: string;
    recommendedRewrite: string;
    missingElements: string[];
  };
  feedAudit: {
    score: number;
    visualConsistency: string;
    contentMixAssessment: string;
    topPerformingPillars: string[];
  };
  retentionStrategies: {
    score: number;
    hookEffectiveness: string;
    pacingRecommendations: string[];
    avgRetentionDropAnalysis: string;
  };
  actionPlan: Array<{
    priority: "alta" | "media" | "baixa";
    title: string;
    action: string;
    expectedImpact: string;
  }>;
}

export interface ContentPlanItem {
  id: string;
  dayOfWeek: string;
  contentTitle: string;
  contentType: "reels" | "carousel" | "story" | "post";
  hookPreview: string;
  objective: string;
  suggestedPostingTime: string;
  estimatedEffort?: string;
  formatDetails?: string;
  status: "draft" | "scheduled" | "recording" | "edited" | "published";
  scriptBody?: string;
  theme?: string;
  postingTime?: string;
  hookIdea?: string;
  captionIdea?: string;
}

export interface GeneratedScript {
  title: string;
  hook: {
    visualAction: string;
    spokenWords: string;
    onScreenText: string;
    durationSeconds: number;
  };
  body: ScriptStep[];
  cta: {
    visualAction: string;
    spokenWords: string;
    onScreenText: string;
    durationSeconds: number;
  };
  connectionFormula?: string;
  totalDurationSeconds: number;
  hashtags: string[];
}

export interface ScriptStep {
  stepNumber: number;
  timestamp: string;
  visualAction: string;
  spokenWords: string;
  onScreenText: string;
  bRollSuggestion: string;
}

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  bodyText: string;
  visualLayout: string;
  highlightPhrase: string;
}

export interface SixHatScriptItem {
  hatId: HatType;
  hatTitle: string;
  hatBadge: string;
  hatColor: string; // Hex color identifier
  hatDescription: string;
  connectionFormulaSnippet: string; // Trecho com conector lógico "E... MAS... POR ISSO..."
  hook: {
    timestamp: string;
    visualAction: string;
    spokenWords: string;
    onScreenText: string;
  };
  body: ScriptStep[];
  cta: {
    timestamp: string;
    visualAction: string;
    spokenWords: string;
    onScreenText: string;
  };
  // Especificações técnicas requisitadas
  teleprompterReadyText: string;
  recordingDirection: string; // ex: "Plano fechado nos primeiros 3s com zoom digital, transição por corte seco aos 12s"
  estimatedDurationSeconds: number;
  coverSuggestion: {
    headline: string;
    visualDescription: string;
  };
  captionText: string;
  hashtags: string[];
  // Adaptação em Carrossel requisitada
  carouselVersion: {
    headline: string;
    slides: CarouselSlide[];
    finalCta: string;
  };
}

export interface SixHatsScriptMatrix {
  topicTitle: string;
  targetAudience: string;
  toneOfVoice: string;
  scripts: SixHatScriptItem[];
}

export interface ABCaptionsData {
  recommendedPostingWindow: {
    bestHour: string;
    secondaryHour: string;
    reasoning: string;
  };
  versionA: {
    hookConcept: string;
    captionText: string;
    ctaType: string;
    hashtags: string[];
    angle: string;
  };
  versionB: {
    hookConcept: string;
    captionText: string;
    ctaType: string;
    hashtags: string[];
    angle: string;
  };
  abTestingTip: string;
}

export interface VideoJob {
  jobId: string;
  title: string;
  fileName: string;
  status: "pending" | "processing" | "completed" | "failed";
  originalDuration: number;
  silenceThresholdDb: number;
  silenceSegments: Array<{ start: number; end: number; duration: number; note?: string }>;
  totalSilenceDuration: number;
  versionA: {
    name?: string;
    badge?: string;
    videoUrl: string;
    durationSeconds: number;
    cutSavingsPercent: number;
    cutsCount: number;
    bestFor: string;
    margin?: number;
    marginSeconds?: number;
    playbackRate?: number;
  };
  versionB: {
    name?: string;
    badge?: string;
    videoUrl: string;
    durationSeconds: number;
    cutSavingsPercent: number;
    cutsCount: number;
    bestFor: string;
    margin?: number;
    marginSeconds?: number;
    playbackRate?: number;
  };
  recommendedPostingTime?: string;
  captions?: ABCaptionsData;
  rawDurationSec?: number;
  v1DurationSec?: number;
  v2DurationSec?: number;
  silenceSegmentsDetected?: number;
}
