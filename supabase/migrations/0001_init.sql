-- =====================================================================
-- Mi Huerto · Esquema inicial
-- Tablas: cultivos, riegos
-- Seguridad: Row Level Security (RLS) por usuario autenticado.
-- =====================================================================

-- Extensión para uuid_generate_v4 / gen_random_uuid ya disponible en Supabase.

-- --------------------------------------------------------------------
-- Tabla: cultivos
-- --------------------------------------------------------------------
create table if not exists public.cultivos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 80),
  variedad text check (char_length(variedad) <= 80),
  estado text not null default 'sembrado'
    check (estado in ('sembrado','germinando','creciendo','cosechando','finalizado')),
  fecha_siembra date not null,
  frecuencia_riego_dias int not null default 3 check (frecuencia_riego_dias between 1 and 60),
  ubicacion text check (char_length(ubicacion) <= 120),
  notas text check (char_length(notas) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cultivos_user_id_idx on public.cultivos (user_id);

-- --------------------------------------------------------------------
-- Tabla: riegos
-- --------------------------------------------------------------------
create table if not exists public.riegos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cultivo_id uuid not null references public.cultivos (id) on delete cascade,
  fecha timestamptz not null default now(),
  cantidad_litros numeric(6,2) check (cantidad_litros >= 0 and cantidad_litros <= 1000),
  metodo text not null default 'manual'
    check (metodo in ('manual','goteo','aspersion','lluvia')),
  notas text check (char_length(notas) <= 300),
  created_at timestamptz not null default now()
);

create index if not exists riegos_user_id_idx on public.riegos (user_id);
create index if not exists riegos_cultivo_id_fecha_idx on public.riegos (cultivo_id, fecha desc);

-- --------------------------------------------------------------------
-- updated_at automático en cultivos
-- --------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cultivos_set_updated_at on public.cultivos;
create trigger cultivos_set_updated_at
  before update on public.cultivos
  for each row execute function public.set_updated_at();

-- --------------------------------------------------------------------
-- Row Level Security
-- Cada usuario solo accede a sus propias filas.
-- --------------------------------------------------------------------
alter table public.cultivos enable row level security;
alter table public.riegos enable row level security;

-- Cultivos
create policy "cultivos_select_own" on public.cultivos
  for select using (auth.uid() = user_id);
create policy "cultivos_insert_own" on public.cultivos
  for insert with check (auth.uid() = user_id);
create policy "cultivos_update_own" on public.cultivos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cultivos_delete_own" on public.cultivos
  for delete using (auth.uid() = user_id);

-- Riegos
create policy "riegos_select_own" on public.riegos
  for select using (auth.uid() = user_id);
create policy "riegos_insert_own" on public.riegos
  for insert with check (auth.uid() = user_id);
create policy "riegos_update_own" on public.riegos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "riegos_delete_own" on public.riegos
  for delete using (auth.uid() = user_id);
