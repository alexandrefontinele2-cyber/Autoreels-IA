import React, { useState, useRef } from "react";
import { VideoJob, ABCaptionsData, UserProfile } from "../types";
import {
  Upload,
  Video,
  Play,
  Pause,
  Download,
  Scissors,
  CheckCircle,
  Clock,
  Sparkles,
  VolumeX,
  Volume2,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Flame,
  FileVideo,
  Layers,
  ArrowRight,
} from "lucide-react";

interface VideoStudioProps {
  currentJob: VideoJob;
  onProcessVideo: (title: string, duration: number, silenceDb: number, fileName: string) => Promise<void>;
  isProcessing: boolean;
  profile: UserProfile;
  onGenerateCaptions: (transcription: string) => Promise<void>;
  isGeneratingCaptions: boolean;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  currentJob,
  onProcessVideo,
  isProcessing,
  profile,
  onGenerateCaptions,
  isGeneratingCaptions,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState(currentJob.title);
  const [silenceThreshold, setSilenceThreshold] = useState(currentJob.silenceThresholdDb || -30.0);
  const [activeCaptionTab, setActiveCaptionTab] = useState<"A" | "B">("A");
  const [copiedCaptionA, setCopiedCaptionA] = useState(false);
  const [copiedCaptionB, setCopiedCaptionB] = useState(false);

  // Video Players references & state
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const [isPlayingA, setIsPlayingA] = useState(false);
  const [isPlayingB, setIsPlayingB] = useState(false);
  const [isSyncPlaying, setIsSyncPlaying] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleStartProcessing = () => {
    const fileName = selectedFile ? selectedFile.name : "reels_gravacao_bruta.mp4";
    onProcessVideo(videoTitle, 52.4, silenceThreshold, fileName);
  };

  const toggleSyncPlayback = () => {
    if (!videoRefA.current || !videoRefB.current) return;

    if (isSyncPlaying) {
      videoRefA.current.pause();
      videoRefB.current.pause();
      setIsPlayingA(false);
      setIsPlayingB(false);
      setIsSyncPlaying(false);
    } else {
      videoRefA.current.currentTime = 0;
      videoRefB.current.currentTime = 0;
      videoRefA.current.play();
      videoRefB.current.play();
      setIsPlayingA(true);
      setIsPlayingB(true);
      setIsSyncPlaying(true);
    }
  };

  const copyToClipboard = (text: string, isA: boolean) => {
    navigator.clipboard.writeText(text);
    if (isA) {
      setCopiedCaptionA(true);
      setTimeout(() => setCopiedCaptionA(false), 2500);
    } else {
      setCopiedCaptionB(true);
      setTimeout(() => setCopiedCaptionB(false), 2500);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Scissors className="h-4 w-4" />
            <span>Processamento de Áudio & Geração de Teste A/B</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Estúdio de Edição de Vídeo
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Corte automático de silêncios e hesitações (limiar de {silenceThreshold}dB) e geração
            instantânea da Versão A (Hiperdinâmica) e Versão B (Cadência Natural) para o Instagram.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Limiar Silêncio:</span>
            <span className="text-rose-400 font-bold font-mono">{silenceThreshold} dB</span>
          </div>

          <button
            id="btn-trigger-captions"
            onClick={() =>
              onGenerateCaptions(
                `Vídeo sobre como automatizar o corte de hesitações e silêncios abaixo de -30dB em vídeos curtos para Instagram Reels, gerando versão agressiva de 32s e versão moderada de 42s.`
              )
            }
            disabled={isGeneratingCaptions}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-medium transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            <span>{isGeneratingCaptions ? "Gerando Legendas..." : "Recalcular Legendas A/B"}</span>
          </button>
        </div>
      </div>

      {/* Upload Zone & Pre-flight Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Card (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Upload className="h-4 w-4 text-rose-400" />
              <span>Upload do Vídeo Bruto (.mp4 ou .mov)</span>
            </h3>
            <span className="text-[11px] text-slate-500">Max: 500MB | 1080x1920 (9:16)</span>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              dragActive
                ? "border-rose-500 bg-rose-500/10"
                : "border-slate-800 hover:border-slate-700 bg-slate-950/60"
            }`}
          >
            <input
              type="file"
              id="video-upload-input"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="video-upload-input"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <FileVideo className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-200">
                  {selectedFile ? selectedFile.name : "Clique para selecionar ou arraste o arquivo aqui"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB pronto para processar`
                    : "Recomendado: gravação de 30s a 90s gravada direto do celular"}
                </p>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Título do Vídeo / Conteúdo
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Ex: Como cortar silêncios no Reels"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Sensibilidade de Corte de Silêncio
                </label>
                <span className="text-xs font-mono font-bold text-rose-400">{silenceThreshold} dB</span>
              </div>
              <input
                type="range"
                min="-45"
                max="-20"
                step="1"
                value={silenceThreshold}
                onChange={(e) => setSilenceThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>-45 dB (Muito silencioso)</span>
                <span>-30 dB (Padrão ouro)</span>
                <span>-20 dB (Agressivo)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              id="start-process-btn"
              onClick={handleStartProcessing}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processando FFmpeg & Auto-Editor...</span>
                </>
              ) : (
                <>
                  <Scissors className="h-4 w-4" />
                  <span>Iniciar Corte Automático & Teste A/B</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Processing Status & Waveform Insights (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-amber-400" />
            <span>Métricas de Eliminação de Silêncio</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Duração Original Bruta</span>
              <span className="text-sm font-bold font-mono text-slate-200">
                {currentJob.originalDuration.toFixed(1)}s
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 block">Tempo Total de Silêncio Cortado</span>
                <span className="text-[10px] text-slate-500">Trechos abaixo de {currentJob.silenceThresholdDb}dB</span>
              </div>
              <span className="text-sm font-bold font-mono text-rose-400">
                -{currentJob.totalSilenceDuration.toFixed(1)}s
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 flex items-center justify-between">
              <span className="text-xs text-slate-300">Trechos de Silêncio Detectados</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {currentJob.silenceSegments.length} cortes
              </span>
            </div>
          </div>

          {/* Mini Waveform Visualizer */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Forma de Onda (Linha do Tempo):</span>
              <span className="text-rose-400 font-semibold">Vermelho = Silêncio Eliminado</span>
            </div>
            <div className="h-10 w-full bg-slate-950 rounded-xl border border-slate-800 flex items-center px-2 space-x-1 overflow-hidden">
              {Array.from({ length: 36 }).map((_, idx) => {
                const isSilence = [0, 1, 6, 7, 13, 14, 20, 21, 28, 29, 34, 35].includes(idx);
                const height = isSilence ? "h-2 bg-rose-500/70" : "h-7 bg-emerald-400/80";
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-all ${height}`}
                    title={isSilence ? "Trecho de silêncio < -30dB cortado" : "Fala ativa detectada"}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SIDE-BY-SIDE VIDEO PLAYER (VERSION A vs VERSION B) */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Vídeos Prontos
              </span>
              <h2 className="text-lg font-bold text-white">
                Player Lado a Lado: Teste A/B Instagram
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare visualmente a diferença de retenção entre o corte agressivo (Reels dinâmico)
              e o corte moderado (natural).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-sync-play"
              onClick={toggleSyncPlayback}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSyncPlaying
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
            >
              {isSyncPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pausar Ambos</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 text-rose-400" />
                  <span>Reproduzir Sincronizado</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* VERSION A: AGGRESSIVE */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-4 shadow-lg shadow-rose-950/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">Versão A</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Corte Agressivo
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Margem: 0.05s antes/depois da fala</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-rose-400">
                  {currentJob.versionA.durationSeconds}s
                </span>
                <span className="block text-[10px] text-emerald-400 font-semibold">
                  -{currentJob.versionA.cutSavingsPercent}% mais curto
                </span>
              </div>
            </div>

            {/* Video A Canvas/Container */}
            <div className="relative aspect-[9/16] max-h-[420px] mx-auto bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group">
              <video
                ref={videoRefA}
                src={currentJob.versionA.videoUrl}
                playsInline
                loop
                className="w-full h-full object-cover"
                onPlay={() => setIsPlayingA(true)}
                onPause={() => setIsPlayingA(false)}
              />

              {/* Overlay Play Button */}
              <button
                onClick={() => {
                  if (videoRefA.current) {
                    if (isPlayingA) videoRefA.current.pause();
                    else videoRefA.current.play();
                  }
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="h-12 w-12 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-lg">
                  {isPlayingA ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </div>
              </button>

              {/* Dynamic Retention Badge */}
              <div className="absolute top-3 left-3 bg-slate-950/90 border border-rose-500/40 px-2.5 py-1 rounded-lg text-[10px] font-bold text-rose-300 backdrop-blur-sm">
                ⚡ Ritmo Rápido ({currentJob.versionA.cutsCount} cortes)
              </div>
            </div>

            {/* Version A Specs & Download */}
            <div className="space-y-3 pt-1 text-xs">
              <p className="text-slate-300">
                <strong>Melhor para:</strong> {currentJob.versionA.bestFor}
              </p>
              <a
                href={currentJob.versionA.videoUrl}
                download="versao_a_corte_agressivo.mp4"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <Download className="h-4 w-4 text-rose-400" />
                <span>Baixar Versão A (.mp4)</span>
              </a>
            </div>
          </div>

          {/* VERSION B: MODERATE */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/40 space-y-4 shadow-lg shadow-blue-950/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">Versão B</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Corte Moderado
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Margem: 0.25s (respiros naturais)</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-blue-400">
                  {currentJob.versionB.durationSeconds}s
                </span>
                <span className="block text-[10px] text-emerald-400 font-semibold">
                  -{currentJob.versionB.cutSavingsPercent}% mais curto
                </span>
              </div>
            </div>

            {/* Video B Canvas/Container */}
            <div className="relative aspect-[9/16] max-h-[420px] mx-auto bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group">
              <video
                ref={videoRefB}
                src={currentJob.versionB.videoUrl}
                playsInline
                loop
                className="w-full h-full object-cover"
                onPlay={() => setIsPlayingB(true)}
                onPause={() => setIsPlayingB(false)}
              />

              {/* Overlay Play Button */}
              <button
                onClick={() => {
                  if (videoRefB.current) {
                    if (isPlayingB) videoRefB.current.pause();
                    else videoRefB.current.play();
                  }
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="h-12 w-12 rounded-full bg-blue-500/90 text-white flex items-center justify-center shadow-lg">
                  {isPlayingB ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </div>
              </button>

              {/* Human Cadence Badge */}
              <div className="absolute top-3 left-3 bg-slate-950/90 border border-blue-500/40 px-2.5 py-1 rounded-lg text-[10px] font-bold text-blue-300 backdrop-blur-sm">
                🎙️ Ritmo Conversacional
              </div>
            </div>

            {/* Version B Specs & Download */}
            <div className="space-y-3 pt-1 text-xs">
              <p className="text-slate-300">
                <strong>Melhor para:</strong> {currentJob.versionB.bestFor}
              </p>
              <a
                href={currentJob.versionB.videoUrl}
                download="versao_b_corte_moderado.mp4"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <Download className="h-4 w-4 text-blue-400" />
                <span>Baixar Versão B (.mp4)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCO: SUGESTÃO DE MELHOR HORÁRIO & LEGENDA A/B PARA O INSTAGRAM */}
      {currentJob.captions && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Aba "Testar" do Instagram
              </span>
              <h3 className="text-lg font-bold text-white">
                Variações de Legenda & Horário Ideal de Postagem
              </h3>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Clock className="h-4 w-4 text-amber-400" />
              <div className="text-xs">
                <span className="text-slate-400">Melhor Horário: </span>
                <strong className="text-amber-300">
                  {currentJob.captions.recommendedPostingWindow.bestHour}
                </strong>
                <span className="text-slate-500 ml-1">
                  (Secundário: {currentJob.captions.recommendedPostingWindow.secondaryHour})
                </span>
              </div>
            </div>
          </div>

          {/* Reasoning pill */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
            <Sparkles className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <p>
              <strong>Por que esse horário?</strong>{" "}
              {currentJob.captions.recommendedPostingWindow.reasoning}
            </p>
          </div>

          {/* A/B Tabs */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <button
                id="tab-caption-a"
                onClick={() => setActiveCaptionTab("A")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCaptionTab === "A"
                    ? "bg-rose-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Opção A: {currentJob.captions.versionA.angle}
              </button>
              <button
                id="tab-caption-b"
                onClick={() => setActiveCaptionTab("B")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCaptionTab === "B"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Opção B: {currentJob.captions.versionB.angle}
              </button>
            </div>

            {/* Active Caption Content */}
            {activeCaptionTab === "A" ? (
              <div className="space-y-3 p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-rose-400">
                    Gancho: {currentJob.captions.versionA.hookConcept}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(currentJob.captions!.versionA.captionText, true)
                    }
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
                  >
                    {copiedCaptionA ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar Legenda A</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="whitespace-pre-line text-slate-200 bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-sans leading-relaxed">
                  {currentJob.captions.versionA.captionText}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentJob.captions.versionA.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-400">
                    Gancho: {currentJob.captions.versionB.hookConcept}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(currentJob.captions!.versionB.captionText, false)
                    }
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
                  >
                    {copiedCaptionB ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar Legenda B</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="whitespace-pre-line text-slate-200 bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-sans leading-relaxed">
                  {currentJob.captions.versionB.captionText}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentJob.captions.versionB.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* A/B Test Strategy Tip */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/20 text-[11px] text-amber-300 flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Estratégia Recomendada para o Teste A/B:</strong>{" "}
                {currentJob.captions.abTestingTip}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
