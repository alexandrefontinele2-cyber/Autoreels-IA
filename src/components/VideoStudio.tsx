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
  ShieldCheck,
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
  const [videoTitle, setVideoTitle] = useState(currentJob.title || "Reels_Gravacao_Bruta.mp4");
  const [silenceThreshold, setSilenceThreshold] = useState(currentJob.silenceThresholdDb || -30.0);
  const [activeCaptionTab, setActiveCaptionTab] = useState<"A" | "B">("A");
  const [copiedCaptionA, setCopiedCaptionA] = useState(false);
  const [copiedCaptionB, setCopiedCaptionB] = useState(false);

  // Video Player references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVersion, setActiveVersion] = useState<"A" | "B">("A");

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

  const currentCutVideoUrl =
    activeVersion === "A"
      ? currentJob.versionA.videoUrl
      : currentJob.versionB.videoUrl;

  const currentDuration =
    activeVersion === "A"
      ? currentJob.versionA.durationSeconds
      : currentJob.versionB.durationSeconds;

  const currentSavings =
    activeVersion === "A"
      ? currentJob.versionA.cutSavingsPercent
      : currentJob.versionB.cutSavingsPercent;

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleCopyCaption = (text: string, tab: "A" | "B") => {
    navigator.clipboard.writeText(text);
    if (tab === "A") {
      setCopiedCaptionA(true);
      setTimeout(() => setCopiedCaptionA(false), 2000);
    } else {
      setCopiedCaptionB(true);
      setTimeout(() => setCopiedCaptionB(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DDE0] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#607D8B] text-xs font-semibold uppercase tracking-wider mb-1">
            <Scissors className="h-4 w-4 text-[#C9A96E]" />
            <span>Motor de Edição Automática & Corte Cirúrgico</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#252A2E]">
            Edite seu vídeo
          </h1>
          <p className="text-sm text-[#607D8B] mt-1 max-w-2xl">
            Faça upload do seu vídeo bruto (.mp4 ou .mov). O microserviço em Python elimina automaticamente hesitações e silêncios abaixo de <strong>-30dB</strong> com margem de 0.1s.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#607D8B]/10 text-[#607D8B] text-xs font-semibold border border-[#607D8B]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
            auto-editor + FFmpeg
          </span>
        </div>
      </div>

      {/* Grid: Upload & Configurações de Corte vs Player do Vídeo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Upload & Parâmetros (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Upload do Vídeo Bruto */}
          <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs space-y-5">
            <h2 className="text-base font-serif font-bold text-[#252A2E] flex items-center space-x-2">
              <Upload className="h-4 w-4 text-[#607D8B]" />
              <span>1. Envie o Vídeo Bruto</span>
            </h2>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                dragActive
                  ? "border-[#C9A96E] bg-[#C9A96E]/5"
                  : selectedFile
                  ? "border-[#607D8B] bg-[#F8F6F1]"
                  : "border-[#D9DDE0] hover:border-[#607D8B] bg-[#F8F6F1]/50"
              }`}
            >
              <input
                id="file-upload"
                type="file"
                accept="video/mp4,video/quicktime,video/mov"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#607D8B]/10 flex items-center justify-center text-[#607D8B]">
                    <FileVideo className="h-6 w-6 text-[#607D8B]" />
                  </div>
                  <h3 className="font-semibold text-xs text-[#252A2E] truncate max-w-xs mx-auto">
                    {selectedFile.name}
                  </h3>
                  <p className="text-[11px] text-[#607D8B]">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Pronto para corte
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="inline-block text-[11px] font-semibold text-[#C9A96E] hover:underline cursor-pointer pt-1"
                  >
                    Trocar arquivo
                  </label>
                </div>
              ) : (
                <label htmlFor="file-upload" className="cursor-pointer block space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#607D8B]/10 flex items-center justify-center text-[#607D8B]">
                    <Upload className="h-6 w-6 text-[#607D8B]" />
                  </div>
                  <div className="text-xs text-[#252A2E] font-medium">
                    <span className="text-[#C9A96E] font-bold">Clique para selecionar</span> ou arraste o arquivo aqui
                  </div>
                  <p className="text-[11px] text-[#607D8B]">
                    Formatos suportados: <strong>.mp4</strong> ou <strong>.mov</strong> (Reels/TikTok 9:16)
                  </p>
                </label>
              )}
            </div>

            {/* Título do Projeto */}
            <div>
              <label className="block text-xs font-semibold text-[#252A2E] mb-1.5">
                Nome do Projeto / Reels
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Ex: Como reter mais nos primeiros 3s"
                className="w-full px-3.5 py-2.5 bg-[#F8F6F1]/50 border border-[#D9DDE0] rounded-xl text-xs text-[#252A2E] focus:outline-none focus:border-[#607D8B]"
              />
            </div>

            {/* Parâmetros de Áudio */}
            <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#D9DDE0] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#252A2E] flex items-center gap-1.5">
                  <VolumeX className="w-3.5 h-3.5 text-[#607D8B]" />
                  Limiar de Silêncio:
                </span>
                <span className="font-bold text-[#C9A96E]">{silenceThreshold} dB</span>
              </div>
              <input
                type="range"
                min="-45"
                max="-20"
                step="1"
                value={silenceThreshold}
                onChange={(e) => setSilenceThreshold(Number(e.target.value))}
                className="w-full accent-[#607D8B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#607D8B]">
                <span>-45 dB (Mais sensível)</span>
                <span className="font-bold text-[#252A2E]">-30 dB (Recomendado)</span>
                <span>-20 dB (Corte agressivo)</span>
              </div>
            </div>

            {/* Botão de Processamento */}
            <button
              id="btn-process-video"
              onClick={handleStartProcessing}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-[#252A2E] hover:bg-[#343b40] text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-[#C9A96E]" />
                  <span>Processando Corte em -30dB...</span>
                </>
              ) : (
                <>
                  <Scissors className="h-4 w-4 text-[#C9A96E]" />
                  <span>Cortar Silêncios & Hesitações</span>
                </>
              )}
            </button>
          </div>

          {/* Resumo da Detecção & Economia de Tempo */}
          <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#252A2E] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#607D8B]" />
              <span>Métricas de Retenção Alcançadas</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F8F6F1] border border-[#D9DDE0]">
                <span className="text-[10px] text-[#607D8B] uppercase font-bold block mb-0.5">
                  Duração Original
                </span>
                <span className="text-lg font-serif font-bold text-[#252A2E]">
                  {currentJob.originalDuration}s
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F6F1] border border-[#C9A96E]/50">
                <span className="text-[10px] text-[#C9A96E] uppercase font-bold block mb-0.5">
                  Tempo Final Cortado
                </span>
                <span className="text-lg font-serif font-bold text-[#252A2E]">
                  {currentDuration}s
                </span>
              </div>
            </div>

            {/* Forma de Onda Simbolizando o Corte de Silêncio */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#607D8B]">Visualização da Faixa de Áudio:</span>
                <span className="text-[#C9A96E] font-semibold">Cinza = Silêncios Removidos</span>
              </div>
              <div className="h-10 w-full bg-[#252A2E] rounded-xl border border-[#D9DDE0] flex items-center px-2 space-x-1 overflow-hidden">
                {Array.from({ length: 32 }).map((_, idx) => {
                  const isSilence = [0, 1, 6, 7, 13, 14, 20, 21, 27, 28].includes(idx);
                  const height = isSilence ? "h-2 bg-[#D9DDE0]/30" : "h-7 bg-[#C9A96E]";
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-full transition-all ${height}`}
                      title={isSilence ? "Trecho < -30dB cortado" : "Fala fluida mantida"}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Player com o Vídeo Cortado & Download (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DDE0] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#607D8B]/10 text-[#607D8B] border border-[#607D8B]/20">
                    Vídeo Pronto
                  </span>
                  <h2 className="text-base font-serif font-bold text-[#252A2E]">
                    Player com Vídeo Cortado
                  </h2>
                </div>
                <p className="text-xs text-[#607D8B] mt-0.5">
                  Assista ao resultado final pronto para publicação no Instagram e TikTok.
                </p>
              </div>

              {/* Seletor de Versões A/B */}
              <div className="flex items-center bg-[#F8F6F1] p-1 rounded-xl border border-[#D9DDE0] shrink-0">
                <button
                  onClick={() => setActiveVersion("A")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeVersion === "A"
                      ? "bg-[#252A2E] text-white shadow-xs"
                      : "text-[#607D8B] hover:text-[#252A2E]"
                  }`}
                >
                  Versão A (Dinâmica)
                </button>
                <button
                  onClick={() => setActiveVersion("B")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeVersion === "B"
                      ? "bg-[#252A2E] text-white shadow-xs"
                      : "text-[#607D8B] hover:text-[#252A2E]"
                  }`}
                >
                  Versão B (Moderada)
                </button>
              </div>
            </div>

            {/* Container do Player 9:16 */}
            <div className="relative aspect-[9/16] max-h-[460px] mx-auto bg-[#252A2E] rounded-2xl overflow-hidden border border-[#D9DDE0] flex items-center justify-center group shadow-md">
              <video
                ref={videoRef}
                src={currentCutVideoUrl}
                playsInline
                loop
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Botão de Play / Pause Central */}
              <button
                onClick={handleTogglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="h-14 w-14 rounded-full bg-[#C9A96E] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                </div>
              </button>

              {/* Badge de Economia de Tempo */}
              <div className="absolute top-3 left-3 bg-[#252A2E]/90 border border-[#C9A96E]/50 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#C9A96E] backdrop-blur-sm">
                -{currentSavings}% de silêncio eliminado
              </div>
            </div>

            {/* BOTÃO DESTACADO PARA DOWNLOAD DO ARQUIVO MP4 EDITADO */}
            <div className="pt-2">
              <a
                id="download-edited-video-btn"
                href={currentCutVideoUrl}
                download={`autoreels_editado_${activeVersion.toLowerCase()}.mp4`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-xl bg-[#C9A96E] hover:bg-[#b8955b] text-white font-bold text-sm shadow-lg shadow-[#C9A96E]/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5 text-white" />
                <span>Baixar Arquivo MP4 Editado ({currentDuration}s)</span>
              </a>
              <p className="text-[11px] text-[#607D8B] text-center mt-2">
                Arquivo exportado em formato vertical 1080x1920 (9:16) pronto para publicação direta.
              </p>
            </div>
          </div>

          {/* Gerador de Legenda e Hashtags para o Vídeo */}
          <div className="bg-white rounded-2xl border border-[#D9DDE0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9DDE0] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A96E]" />
                <h3 className="font-serif font-bold text-sm text-[#252A2E]">
                  Legenda Estratégica & Hashtags para o Vídeo
                </h3>
              </div>
              <button
                onClick={() =>
                  onGenerateCaptions(
                    `Vídeo sobre ${videoTitle}. Roteiro focado em reter o público nos primeiros 3 segundos eliminando hesitações.`
                  )
                }
                disabled={isGeneratingCaptions}
                className="text-xs font-semibold text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingCaptions ? "animate-spin" : ""}`} />
                <span>Gerar Novas Legendas</span>
              </button>
            </div>

            {currentJob.captions ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#D9DDE0] relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#607D8B] uppercase">
                      Legenda Sugerida (Gancho + Conteúdo + CTA):
                    </span>
                    <button
                      onClick={() =>
                        handleCopyCaption(currentJob.captions?.versionA.captionText || "", "A")
                      }
                      className="text-xs text-[#607D8B] hover:text-[#252A2E] flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-[#D9DDE0] cursor-pointer"
                    >
                      {copiedCaptionA ? <Check className="w-3.5 h-3.5 text-[#C9A96E]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCaptionA ? "Copiado!" : "Copiar Legenda"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#252A2E] leading-relaxed whitespace-pre-line">
                    {currentJob.captions.versionA.captionText}
                  </p>
                </div>

                {/* Hashtags */}
                <div>
                  <span className="text-[11px] font-semibold text-[#607D8B] block mb-1.5">
                    Hashtags Recomendadas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentJob.captions.versionA.hashtags.map((ht, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#F8F6F1] border border-[#D9DDE0] text-xs font-medium text-[#252A2E]"
                      >
                        {ht}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-[#607D8B] mb-3">
                  Gere uma legenda persuasiva e hashtags de alto alcance para acompanhar este vídeo.
                </p>
                <button
                  onClick={() =>
                    onGenerateCaptions(
                      `Vídeo sobre ${videoTitle}. Roteiro focado em reter o público nos primeiros 3 segundos eliminando hesitações.`
                    )
                  }
                  disabled={isGeneratingCaptions}
                  className="px-4 py-2 rounded-xl bg-[#607D8B] hover:bg-[#506874] text-white text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span>Gerar Legenda com IA</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
