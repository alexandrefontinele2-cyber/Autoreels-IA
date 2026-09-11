-- ============================================================================
-- AUTOREELS AI - ESTRUTURA DO BANCO DE DADOS (Supabase / PostgreSQL)
-- Script SQL Completo com Políticas de Segurança RLS (Row Level Security)
-- ============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela `users`
-- Espelho dos usuários cadastrados no Supabase Auth
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela `user_profiles` (Vínculo de Perfis do Instagram)
-- Regra de Negócio: Limite de no máximo 2 perfis do Instagram por usuário
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    instagram_handle TEXT NOT NULL,
    niche TEXT NOT NULL DEFAULT 'Criador de Conteúdo',
    target_audience TEXT NOT NULL DEFAULT 'Público geral interessado no nicho',
    tone_of_voice TEXT NOT NULL DEFAULT 'Enérgico, Direto e Educativo',
    bio_text TEXT,
    followers_count INTEGER DEFAULT 0,
    average_views INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_instagram_handle UNIQUE (user_id, instagram_handle)
);

-- 4. Função e Trigger para Impor o Limite Rígido de No Máximo 2 Perfis por Conta
CREATE OR REPLACE FUNCTION public.check_max_user_profiles()
RETURNS TRIGGER AS $$
DECLARE
    profile_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count
    FROM public.user_profiles
    WHERE user_id = NEW.user_id;

    IF profile_count >= 2 AND (TG_OP = 'INSERT' OR NEW.user_id <> OLD.user_id) THEN
        RAISE EXCEPTION 'Limite de no máximo 2 perfis do Instagram por conta atingido. Remova um perfil antes de cadastrar outro.'
            USING ERRCODE = '23514';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_max_user_profiles ON public.user_profiles;
CREATE TRIGGER trg_check_max_user_profiles
    BEFORE INSERT ON public.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE public.check_max_user_profiles();

-- 5. Tabela `scripts_history`
-- Armazena o histórico dos roteiros gerados (6 Chapéus, Fatos, Emoção, etc.)
CREATE TABLE IF NOT EXISTS public.scripts_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    topic TEXT NOT NULL,
    hat_id TEXT NOT NULL, -- 'hat_white_facts', 'hat_red_emotions', 'hat_black_cautious', 'hat_yellow_benefits', 'hat_green_creative', 'hat_blue_process'
    hat_title TEXT NOT NULL,
    connection_formula TEXT NOT NULL, -- Conector de impacto 'E... MAS... POR ISSO'
    reels_script JSONB NOT NULL, -- { hook: {...}, body: [...], cta: {...}, teleprompterReadyText: "..." }
    carousel_version JSONB NOT NULL, -- { headline: "...", slides: [...], finalCta: "..." }
    technical_specs JSONB NOT NULL, -- { recordingDirection: "...", durationSeconds: 45, coverSuggestion: {...}, captionText: "...", hashtags: [...] }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Tabela `processed_videos`
-- Histórico dos vídeos processados pelo microserviço com corte de silêncio
CREATE TABLE IF NOT EXISTS public.processed_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    script_id UUID REFERENCES public.scripts_history(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'Reels sem hesitações',
    raw_video_url TEXT NOT NULL,
    raw_duration_sec NUMERIC(10, 2) NOT NULL,
    cut_video_url TEXT NOT NULL,
    cut_duration_sec NUMERIC(10, 2) NOT NULL,
    silence_threshold_db NUMERIC(5, 2) DEFAULT -30.00,
    margin_seconds NUMERIC(5, 2) DEFAULT 0.10,
    time_saved_percent NUMERIC(5, 2),
    silence_removed_count INTEGER DEFAULT 0,
    captions_ab JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Tabela `content_calendar` (Calendário Semanal de Postagem)
CREATE TABLE IF NOT EXISTS public.content_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    day_of_week TEXT NOT NULL, -- 'Segunda', 'Terça', etc.
    content_title TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('reels', 'carousel', 'story', 'post')),
    hook_preview TEXT,
    suggested_posting_time TEXT NOT NULL,
    format_details TEXT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'recorded', 'edited', 'posted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Tabela `subscriptions`
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'canceled', 'past_due')),
    plan_name TEXT NOT NULL DEFAULT 'Pro Mensal',
    price_cents INTEGER NOT NULL DEFAULT 3990, -- R$ 39,90 ou 2490 para anual
    currency TEXT NOT NULL DEFAULT 'BRL',
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW() + INTERVAL '30 days') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- ---------------------------------------------------------------------------
-- 9. Índices para Alto Desempenho
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_history_user_id ON public.scripts_history(user_id);
CREATE INDEX IF NOT EXISTS idx_processed_videos_user_id ON public.processed_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON public.content_calendar(user_id);

-- ---------------------------------------------------------------------------
-- 10. Atualização Automática de Timestamps
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER trg_processed_videos_updated_at BEFORE UPDATE ON public.processed_videos FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- 11. Políticas de Segurança RLS (Row Level Security)
-- ---------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- users: O usuário só pode visualizar e atualizar seu próprio registro
CREATE POLICY "Users can view and update their own data"
    ON public.users
    FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- user_profiles: O usuário gerencia apenas seus até 2 perfis
CREATE POLICY "Users manage their own profiles"
    ON public.user_profiles
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- scripts_history: Acesso isolado aos roteiros gerados
CREATE POLICY "Users access own scripts"
    ON public.scripts_history
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- processed_videos: Acesso isolado aos vídeos processados
CREATE POLICY "Users access own videos"
    ON public.processed_videos
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- content_calendar: Acesso isolado ao calendário editorial
CREATE POLICY "Users access own calendar"
    ON public.content_calendar
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- subscriptions: Usuário pode consultar status da sua assinatura
CREATE POLICY "Users can read own subscription"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);
