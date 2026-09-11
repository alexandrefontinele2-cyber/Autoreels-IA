import { UserProfile, ContentPlanItem, VideoJob, ProfileAudit } from "../types";

export const initialProfile: UserProfile = {
  id: "usr_alex_001",
  instagramHandle: "techflow.growth",
  niche: "Automação, IA & Produtividade Digital",
  targetAudience: "Fundadores, criadores de conteúdo e profissionais autônomos buscando escala com IA",
  toneOfVoice: "Enérgico, ultra-prático, baseado em dados e sem rodeios (high-retention)",
  customScriptRules: `1. GANCHO EM 2 SEGUNDOS: O primeiro segundo deve começar no meio de uma afirmação chocante ou contraste (Ex: "Pare de perder 3 horas editando Reels").
2. TEXTO EM CAIXA ALTA NA TELA: Todo corte deve ter no máximo 4 palavras de destaque visual.
3. PROIBIDO APRESENTAÇÃO: Nunca diga "Olá pessoal" ou "No vídeo de hoje". Comece direto no problema.
4. CORTE DINÂMICO A CADA 3-4 SEGUNDOS: Alternar entre câmera principal, tela do app e B-Roll de teclado/celular.
5. CTA MAGNÉTICO: Finalize pedindo uma palavra-chave no comentário para automação de direct (Ex: "Comente 'AUTO' para receber o prompt").`,
  bioText: "🚀 Ajudo criadores e experts a automatizarem vídeos curtos com IA | +100k views por semana | 👇 Acesse o blueprint gratuito",
  followersCount: 18450,
  averageViews: 8600,
};

export const initialAudit: ProfileAudit = {
  overallScore: 84,
  bioAudit: {
    score: 88,
    clarity: "Excelente proposta de valor e nicho bem demarcado com números de prova social.",
    ctaEffectiveness: "Forte, direcionando para link na bio com promessa tangível.",
    recommendedRewrite: "⚡ Automação de Reels & IA para Criadores | +100k views/mês sem gravar o dia todo | 👇 Digite 'ROTEIRO' na DM para receber o kit",
    missingElements: [
      "Adicionar palavra-chave específica na linha de nome (@handle)",
      "Destacar prova social verificável nos Destaques (Highlights)",
    ],
  },
  feedAudit: {
    score: 82,
    visualConsistency: "Cores primárias bem definidas (Dark + Neon), thumbnails legíveis no feed.",
    contentMixAssessment: "70% Reels de topo de funil, 20% carrosséis técnicos e 10% provas sociais. Mix equilibrado.",
    topPerformingPillars: [
      "Tutoriais rápidos passo a passo (< 35s)",
      "Comparações de ferramentas (Antes vs Depois)",
      "Desmistificação de mitos sobre o algoritmo",
    ],
  },
  retentionStrategies: {
    score: 83,
    hookEffectiveness: "Ganchos verbais fortes, porém recomenda-se acelerar o corte do primeiro suspiro em 0.3s.",
    pacingRecommendations: [
      "Eliminar qualquer silêncio superior a 0.25s para reter a atenção",
      "Inserir zoom-in dinâmico nos momentos de revelação da dica",
      "Utilizar legenda animada palavra por palavra com destaque amarelo",
    ],
    avgRetentionDropAnalysis: "Queda típica de 18% nos primeiros 3.2 segundos. Com corte agressivo (-30dB), a retenção estimada sobe para 92% na introdução.",
  },
  actionPlan: [
    {
      priority: "alta",
      title: "Eliminação de Hesitações e Silêncios",
      action: "Processar todos os vídeos brutos pelo corte de silêncios (< -30dB com margem de 0.05s).",
      expectedImpact: "+34% de taxa de conclusão média no Reels.",
    },
    {
      priority: "alta",
      title: "Teste A/B Sistemático de Ganchos",
      action: "Testar a versão racional vs a versão provocativa nas primeiras 48h de postagem.",
      expectedImpact: "Identificar o gatilho com 2.4x mais cliques na bio.",
    },
    {
      priority: "media",
      title: "Otimização da Janela de Postagem",
      action: "Concentrar publicações nas terças e quintas entre 18h15 e 18h45.",
      expectedImpact: "Aceleração do boost algorítmico na primeira hora.",
    },
  ],
};

export const initialContentPlans: ContentPlanItem[] = [
  {
    id: "plan_1",
    dayOfWeek: "Segunda-feira",
    contentTitle: "3 Ferramentas de IA Secretas que Cortam Vídeos Sozinhas",
    contentType: "reels",
    hookPreview: "Você ainda passa 2 horas cortando silêncio na mão? Olha isso aqui...",
    objective: "Topo de funil, viralização e retenção rápida",
    suggestedPostingTime: "12:15",
    estimatedEffort: "30 min de gravação",
    formatDetails: "Reels de 38s em ritmo agressivo com tela gravada",
    status: "scheduled",
    scriptBody: "Hook rápido -> Revelação da ferramenta 1 -> Ferramenta 2 -> CTA para direct.",
  },
  {
    id: "plan_2",
    dayOfWeek: "Terça-feira",
    contentTitle: "A Anatomia do Gancho de 3 Segundos no Instagram",
    contentType: "carousel",
    hookPreview: "Por que 80% das pessoas pulam seus Reels no segundo 2.",
    objective: "Autoridade, salvamentos e compartilhamentos",
    suggestedPostingTime: "18:30",
    estimatedEffort: "45 min de design",
    formatDetails: "Carrossel de 7 slides de alto contraste",
    status: "draft",
    scriptBody: "Slide 1: O erro fatal do gancho; Slide 2: Gráfico de retenção; Slide 3-5: 3 modelos prontos; Slide 6: Checklist; Slide 7: Salve para consultar.",
  },
  {
    id: "plan_3",
    dayOfWeek: "Quarta-feira",
    contentTitle: "Cortei 18 Segundos de 'Hum' e 'Ééé' Desse Vídeo",
    contentType: "reels",
    hookPreview: "Esse vídeo tinha 54 segundos. Virou 36 segundos e performou 4x mais.",
    objective: "Demonstração de produto, prova prática e autoridade",
    suggestedPostingTime: "18:45",
    estimatedEffort: "20 min",
    formatDetails: "Reels com split-screen: Versão Bruta vs Versão Cortada",
    status: "published",
    scriptBody: "Mostre o áudio com ruído e silêncio. Em seguida o corte dinâmico. Termine com CTA.",
  },
  {
    id: "plan_4",
    dayOfWeek: "Quinta-feira",
    contentTitle: "Como Programar Seus Reels para o Horário de Pico",
    contentType: "reels",
    hookPreview: "Postar no horário errado é jogar seu roteiro no lixo.",
    objective: "Engajamento e comentários",
    suggestedPostingTime: "19:00",
    estimatedEffort: "25 min",
    formatDetails: "Reels falado direto para câmera com overlay de analytics",
    status: "draft",
    scriptBody: "Demonstração prática dos horários onde o algoritmo mais distribui Reels no Brasil.",
  },
  {
    id: "plan_5",
    dayOfWeek: "Sexta-feira",
    contentTitle: "Checklist de Gravação Rápida para o Fim de Semana",
    contentType: "story",
    hookPreview: "Vou gravar 5 vídeos em 40 minutos hoje. Quem quer o roteiro?",
    objective: "Geração de leads via DM e engajamento nos Stories",
    suggestedPostingTime: "11:30",
    estimatedEffort: "15 min",
    formatDetails: "Sequência de 4 stories com caixinha de perguntas e enquete",
    status: "scheduled",
    scriptBody: "Story 1: Setup; Story 2: Prompt usado; Story 3: Enquete; Story 4: Link na DM.",
  },
  {
    id: "plan_6",
    dayOfWeek: "Sábado",
    contentTitle: "Estudo de Caso: De 500 para 45.000 Views com Ritmo Dinâmico",
    contentType: "reels",
    hookPreview: "Essa única mudança de edição triplicou a retenção desse perfil.",
    objective: "Prova social e branding",
    suggestedPostingTime: "15:00",
    estimatedEffort: "35 min",
    formatDetails: "Narrativa com gráficos de métricas reais",
    status: "draft",
    scriptBody: "Apresente o caso, a dor do criador, a intervenção de corte agressivo e o resultado.",
  },
  {
    id: "plan_7",
    dayOfWeek: "Domingo",
    contentTitle: "Planejamento da Semana: O que Postar nos Próximos 7 Dias",
    contentType: "post",
    hookPreview: "Seu calendário de conteúdo para não ficar sem ideias amanhã.",
    objective: "Preparação para a semana e salvamentos",
    suggestedPostingTime: "20:15",
    estimatedEffort: "20 min",
    formatDetails: "Post único com infográfico em alta resolução",
    status: "draft",
    scriptBody: "Infográfico resumido com os 7 temas da semana para o nicho de tecnologia/produtividade.",
  },
];

export const initialVideoJob: VideoJob = {
  jobId: "job_sample_8821a",
  title: "Reels: Como Automatizar Cortes de Silêncio no Instagram",
  fileName: "gravação_bruta_alex_v1.mp4",
  status: "completed",
  silenceThresholdDb: -30.0,
  originalDuration: 52.4,
  silenceSegments: [
    { start: 0.0, end: 1.4, duration: 1.4, note: "Pausa inicial antes da fala" },
    { start: 8.2, end: 9.8, duration: 1.6, note: "Hesitação e respiro entre gancho e ponto 1" },
    { start: 17.5, end: 19.3, duration: 1.8, note: "Silêncio enquanto olhava a tela" },
    { start: 28.1, end: 30.5, duration: 2.4, note: "Pausa longa de raciocínio" },
    { start: 39.0, end: 41.2, duration: 2.2, note: "Troca de posição e gagueira" },
    { start: 49.8, end: 52.4, duration: 2.6, note: "Encerramento até desligar gravação" },
  ],
  totalSilenceDuration: 12.0,
  versionA: {
    name: "Versão A (Corte Agressivo)",
    badge: "Hiperdinâmico",
    marginSeconds: 0.05,
    durationSeconds: 32.5,
    cutSavingsPercent: 38,
    playbackRate: 1.0,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    bestFor: "Reels de Topo de Funil, TikTok & retenção imediata nos primeiros 3s",
    cutsCount: 14,
  },
  versionB: {
    name: "Versão B (Corte Moderado)",
    badge: "Natural & Humano",
    marginSeconds: 0.25,
    durationSeconds: 42.1,
    cutSavingsPercent: 20,
    playbackRate: 1.0,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    bestFor: "Aulas práticas, tutoriais técnicos e autoridade conversacional",
    cutsCount: 8,
  },
  recommendedPostingTime: "Terça-feira às 18:30 (Pico de audiência do nicho)",
  captions: {
    recommendedPostingWindow: {
      bestHour: "18:30",
      secondaryHour: "12:15",
      reasoning: "Maior concentração de fundadores e profissionais no Instagram pós-expediente.",
    },
    versionA: {
      hookConcept: "Gatilho de Curiosidade & Perda de Tempo",
      captionText: `Você ainda passa horas assistindo a própria gravação para cortar silêncios e "ééés" manualmente? 🤯

A verdade: cada segundo de silêncio nos seus primeiros 3s derruba 40% da sua retenção no Reels. 

Neste vídeo mostro o pipeline que faz cortes cirúrgicos em volumes abaixo de -30dB automaticamente e entrega 2 versões para teste A/B no Instagram.

👉 Salve este post para configurar o seu fluxo de edição automática.

#AutomacaoDeVideo #ReelsDicas #CriadoresDeConteudo #EdicaoDeVideo #Produtividade`,
      ctaType: "Salvamento / Bookmark",
      hashtags: ["#AutomacaoDeVideo", "#ReelsDicas", "#CriadoresDeConteudo", "#EdicaoDeVideo", "#Produtividade"],
      angle: "Racional / Eficiência de Tempo",
    },
    versionB: {
      hookConcept: "Gatilho de Dor & Comparação Brutal",
      captionText: `O motivo pelo qual o seu conteúdo de alta qualidade não viraliza não é a sua câmera... é o ritmo da sua edição. ⏱️

Quando testamos a Versão A (corte agressivo de 32s) contra a gravação bruta de 52s, a retenção média saltou de 31% para 78%.

Qual versão você prefere? A dinâmica e acelerada ou a mais natural com pausas de respiro?

👇 Deixe nos comentários: A ou B?

#AlgoritmoInstagram #CrescimentoInstagram #VideoMarketing #Engajamento #EstrategiaDigital`,
      ctaType: "Comentário / Debate Ativo",
      hashtags: ["#AlgoritmoInstagram", "#CrescimentoInstagram", "#VideoMarketing", "#Engajamento", "#EstrategiaDigital"],
      angle: "Emocional / Provocação de Comunidade",
    },
    abTestingTip: "Publique a Versão A no Reels principal e a Versão B nos Stories/Canal de Transmissão para medir qual gera maior tempo de retenção nos primeiros 5 segundos.",
  },
};
