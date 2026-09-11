import React, { useState, useEffect } from "react";
import {
  Terminal,
  Database,
  Cpu,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Server,
  Sparkles,
  Download,
} from "lucide-react";

export const ArchitectureDocsModal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"sql" | "python" | "typescript" | "architecture">("sql");
  const [systemCode, setSystemCode] = useState<{
    sql: string;
    python: string;
    typescript: string;
    requirements: string;
    dockerfile: string;
  }>({
    sql: "",
    python: "",
    typescript: "",
    requirements: "",
    dockerfile: "",
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/system-code")
      .then((res) => res.json())
      .then((data) => {
        setSystemCode(data);
      })
      .catch((err) => console.error("Falha ao carregar códigos:", err));
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Terminal className="h-4 w-4" />
            <span>Documentação Técnica & Código Pronto para Produção</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Arquitetura do Sistema & Código Fonte
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Estrutura completa e modular dividida nas 4 partes solicitadas: Script SQL com RLS,
            Microserviço Python FastAPI com FFmpeg, Módulos @google/genai e Front-end.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab("sql")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "sql"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Parte 1: Supabase SQL
          </button>
          <button
            onClick={() => setActiveSubTab("python")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "python"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Parte 2: Python Microservice
          </button>
          <button
            onClick={() => setActiveSubTab("typescript")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "typescript"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Parte 3: Gemini SDK
          </button>
          <button
            onClick={() => setActiveSubTab("architecture")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "architecture"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Visão Geral / Deploy
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: SQL SCHEMA */}
      {activeSubTab === "sql" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-semibold text-white">
                supabase/schema.sql (PostgreSQL + RLS + Triggers + Storage Buckets)
              </span>
            </div>
            <button
              onClick={() => handleCopy(systemCode.sql, "sql")}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
            >
              {copiedKey === "sql" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar SQL</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
              {systemCode.sql || "Carregando schema.sql..."}
            </pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PYTHON FASTAPI MICROSERVICE */}
      {activeSubTab === "python" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-semibold text-white">
                python_microservice/main.py (FastAPI + FFmpeg + Auto-Editor + Supabase Storage)
              </span>
            </div>
            <button
              onClick={() => handleCopy(systemCode.python, "python")}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
            >
              {copiedKey === "python" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar main.py</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto max-h-[500px]">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
              {systemCode.python || "Carregando main.py..."}
            </pre>
          </div>

          {/* Dockerfile & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400">requirements.txt</span>
                <button
                  onClick={() => handleCopy(systemCode.requirements, "reqs")}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  {copiedKey === "reqs" ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-300 whitespace-pre">
                {systemCode.requirements}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400">Dockerfile</span>
                <button
                  onClick={() => handleCopy(systemCode.dockerfile, "docker")}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  {copiedKey === "docker" ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-300 whitespace-pre">
                {systemCode.dockerfile}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TYPESCRIPT / GEMINI SDK */}
      {activeSubTab === "typescript" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="h-5 w-5 text-rose-400" />
              <span className="text-sm font-semibold text-white">
                src/services/geminiService.ts (@google/genai SDK v2.4.0)
              </span>
            </div>
            <button
              onClick={() => handleCopy(systemCode.typescript, "ts")}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
            >
              {copiedKey === "ts" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar geminiService.ts</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto max-h-[600px]">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
              {systemCode.typescript || "Carregando geminiService.ts..."}
            </pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ARCHITECTURE OVERVIEW & DEPLOY */}
      {activeSubTab === "architecture" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase">
                <Database className="h-4 w-4" />
                <span>Camada de Dados</span>
              </div>
              <h4 className="text-base font-semibold text-white">Supabase / PostgreSQL</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tabelas <code className="text-rose-300">users</code>,{" "}
                <code className="text-rose-300">profiles_config</code>,{" "}
                <code className="text-rose-300">content_plans</code> e{" "}
                <code className="text-rose-300">video_jobs</code> com Row Level Security (RLS)
                isolado por <code className="text-slate-300">auth.uid()</code> e buckets de Storage.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase">
                <Cpu className="h-4 w-4" />
                <span>Microserviço de Vídeo</span>
              </div>
              <h4 className="text-base font-semibold text-white">Python + FFmpeg / Auto-Editor</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detecção de silêncio abaixo de -30dB com geração automática de Versão A (0.05s de
                margem para retenção imediata) e Versão B (0.25s para ritmo natural), com upload para o
                Supabase Storage.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase">
                <Sparkles className="h-4 w-4" />
                <span>Motor de Inteligência</span>
              </div>
              <h4 className="text-base font-semibold text-white">Gemini 3.8 Flash (@google/genai)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Análise profunda de perfil (Bio, Feed e Retenção), gerador de calendário com horários
                otimizados para o Instagram e roteirizador estruturado por regras estritas.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Server className="h-4 w-4 text-emerald-400" />
              <span>Passo a Passo de Implantação em Produção</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <strong className="text-white block font-mono">1. Banco de Dados Supabase:</strong>
                <p className="text-slate-400">
                  Abra o SQL Editor do seu projeto Supabase e execute o conteúdo de{" "}
                  <code className="text-rose-300">supabase/schema.sql</code>. As tabelas, triggers e
                  políticas de RLS serão criadas instantaneamente.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <strong className="text-white block font-mono">2. Microserviço Python no Cloud Run / Docker:</strong>
                <p className="text-slate-400">
                  Faça o deploy do Dockerfile incluído na pasta{" "}
                  <code className="text-amber-300">python_microservice/</code> configurando as
                  variáveis <code className="text-slate-300">SUPABASE_URL</code> e{" "}
                  <code className="text-slate-300">SUPABASE_SERVICE_ROLE_KEY</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <strong className="text-white block font-mono">3. Servidor Full-Stack & Front-end:</strong>
                <p className="text-slate-400">
                  O servidor Express com rotas <code className="text-indigo-300">/api/*</code> conecta
                  diretamente à Gemini API via SDK oficial, garantindo que a chave de API permaneça
                  100% protegida no backend.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
