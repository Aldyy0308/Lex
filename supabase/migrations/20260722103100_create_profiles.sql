-- profiles: one row per auth.users row (1:1), holding the public-facing
-- identity and the denormalized XP/level cache used for fast reads
-- (profile screen, future leaderboards). `xp_transactions` is the ledger of
-- record; keeping `total_xp` in sync with it is Progression-domain business
-- logic, deferred out of this migration.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  total_xp integer not null default 0,
  current_level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (
    username is null or char_length(username) between 3 and 30
  ),
  constraint profiles_total_xp_non_negative check (total_xp >= 0),
  constraint profiles_current_level_positive check (current_level >= 1)
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
