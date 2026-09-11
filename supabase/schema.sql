-- ============================================================================
-- PARTE 1: ESTRUTURA DO BANCO DE DADOS (Supabase / PostgreSQL)
-- SaaS de Automação de Vídeos e Criação de Conteúdo para Instagram
-- ============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela `users`
-- Espelha auth.users do Supabase para controle interno e integridade referencial
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela `profiles_config`
-- Guarda a configuração e diretrizes do perfil do Instagram do usuário
CREATE TABLE IF NOT EXISTS public.profiles_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    instagram_handle TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    tone_of_voice TEXT NOT NULL DEFAULT 'Enérgico, Direto e Educativo',
    custom_script_rules TEXT NOT NULL,
    bio_text TEXT,
    niche TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- 4. Tabela `content_plans`
-- Armazena o calendário editorial e os roteiros estruturados
CREATE TABLE IF NOT EXISTS public.content_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('reels', 'carousel', 'story', 'post')),
    script_body TEXT NOT NULL,
    hook_text TEXT,
    cta_text TEXT,
    posting_time TIMESTAMP WITH TIME ZONE NOT NULL,
    suggested_day TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'recording', 'edited', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Tabela `video_jobs`
-- Gerencia os jobs de edição de vídeo bruto, corte de silêncio e teste A/B
CREATE TABLE IF NOT EXISTS public.video_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content_plan_id UUID REFERENCES public.content_plans(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'Novo Vídeo Reels',
    raw_video_url TEXT NOT NULL,
    raw_duration_sec NUMERIC(10, 2),
    edited_video_v1_url TEXT, -- Versão A: Corte agressivo de silêncios
    edited_video_v2_url TEXT, -- Versão B: Corte moderado de silêncios
    v1_duration_sec NUMERIC(10, 2),
    v2_duration_sec NUMERIC(10, 2),
    silence_threshold_db NUMERIC(5, 2) DEFAULT -30.00,
    captions_ab JSONB DEFAULT '{}'::jsonb,
    best_posting_time TEXT,
    error_message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5b. Tabela `subscriptions`
-- Gerencia status de assinaturas ativas, planos, integração Stripe/Asaas
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'canceled', 'unpaid', 'past_due')),
    plan_name TEXT NOT NULL DEFAULT 'Pro Mensal',
    price_cents INTEGER NOT NULL DEFAULT 9700,
    currency TEXT NOT NULL DEFAULT 'BRL',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW() + INTERVAL '30 days') NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- 5c. Tabela `script_generations`
-- Armazena o histórico da Matriz dos 6 Chapéus gerada e suas versões em Reels e Carrossel
CREATE TABLE IF NOT EXISTS public.script_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    topic_title TEXT NOT NULL,
    hat_id TEXT NOT NULL, -- 'hat_white_facts', 'hat_red_emotions', etc.
    hat_title TEXT NOT NULL,
    connection_formula_snippet TEXT NOT NULL,
    reels_script JSONB NOT NULL, -- Hook, body, cta, teleprompter
    carousel_version JSONB NOT NULL, -- Headline, slides, finalCta
    technical_specs JSONB NOT NULL, -- Direction, duration, cover, hashtags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Índices para Otimização de Consultas
CREATE INDEX IF NOT EXISTS idx_profiles_config_user_id ON public.profiles_config(user_id);
CREATE INDEX IF NOT EXISTS idx_content_plans_user_id_posting_time ON public.content_plans(user_id, posting_time);
CREATE INDEX IF NOT EXISTS idx_content_plans_status ON public.content_plans(status);
CREATE INDEX IF NOT EXISTS idx_video_jobs_user_id ON public.video_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_video_jobs_status ON public.video_jobs(status);

-- 7. Função e Triggers para atualização automática de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER trg_profiles_config_updated_at BEFORE UPDATE ON public.profiles_config FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER trg_content_plans_updated_at BEFORE UPDATE ON public.content_plans FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER trg_video_jobs_updated_at BEFORE UPDATE ON public.video_jobs FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 8. Trigger para sincronizar novo usuário criado em auth.users com public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- 9. HABILITAÇÃO DO ROW LEVEL SECURITY (RLS)
-- Garante isolamento estrito de dados por usuário autenticado
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.script_generations ENABLE ROW LEVEL SECURITY;

-- Políticas para `users`
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Políticas para `profiles_config`
CREATE POLICY "Users can view own profile config"
    ON public.profiles_config FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile config"
    ON public.profiles_config FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile config"
    ON public.profiles_config FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile config"
    ON public.profiles_config FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para `content_plans`
CREATE POLICY "Users can view own content plans"
    ON public.content_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content plans"
    ON public.content_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content plans"
    ON public.content_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own content plans"
    ON public.content_plans FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para `video_jobs`
CREATE POLICY "Users can view own video jobs"
    ON public.video_jobs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video jobs"
    ON public.video_jobs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video jobs"
    ON public.video_jobs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own video jobs"
    ON public.video_jobs FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para `subscriptions`
CREATE POLICY "Users can view own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- Políticas para `script_generations`
CREATE POLICY "Users can view own script generations"
    ON public.script_generations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own script generations"
    ON public.script_generations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own script generations"
    ON public.script_generations FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- 10. SUPABASE STORAGE BUCKETS & POLICIES
-- Buckets: 'raw-videos' e 'edited-videos'
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('raw-videos', 'raw-videos', false),
    ('edited-videos', 'edited-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para upload de vídeos brutos
CREATE POLICY "Allow authenticated user to upload raw videos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'raw-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow user to read own raw videos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'raw-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas de Storage para vídeos editados (públicos para streaming e download)
CREATE POLICY "Public access to edited videos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'edited-videos');

CREATE POLICY "Service role and user can upload edited videos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'edited-videos');
