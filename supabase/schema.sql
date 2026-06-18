-- Lumia — Esquema de base de datos
-- Pega todo este contenido en el SQL Editor de tu proyecto Supabase y ejecútalo.

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS public.tasks (
  id           TEXT         PRIMARY KEY,
  user_id      UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT         NOT NULL,
  description  TEXT,
  date         TEXT         NOT NULL,
  start_time   TEXT         NOT NULL DEFAULT '',
  end_time     TEXT         NOT NULL DEFAULT '',
  urgency      TEXT         NOT NULL DEFAULT 'media',
  status       TEXT         NOT NULL DEFAULT 'pendiente',
  has_reminder BOOLEAN      NOT NULL DEFAULT false,
  is_routine   BOOLEAN      NOT NULL DEFAULT false,
  notification JSONB,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Tabla de rutinas
CREATE TABLE IF NOT EXISTS public.routines (
  id           TEXT         PRIMARY KEY,
  user_id      UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT         NOT NULL,
  start_time   TEXT         NOT NULL DEFAULT '',
  end_time     TEXT         NOT NULL DEFAULT '',
  days_of_week TEXT[]       NOT NULL DEFAULT '{}',
  color        TEXT         NOT NULL DEFAULT 'var(--rosa)',
  active       BOOLEAN      NOT NULL DEFAULT true,
  icon         TEXT,
  kind         TEXT         NOT NULL DEFAULT 'fixed',
  frequency    JSONB,
  duration     INTEGER,
  label        TEXT,
  description  TEXT,
  notification JSONB,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Seguridad a nivel de fila (cada usuario solo ve sus propios datos)
ALTER TABLE public.tasks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_owner"    ON public.tasks    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "routines_owner" ON public.routines FOR ALL USING (auth.uid() = user_id);
