-- daily_challenges: pins one puzzle to one calendar date for the Daily
-- Challenge domain. `on delete restrict` on puzzle_id is deliberate — a
-- puzzle that's been featured as a daily challenge shouldn't be silently
-- deletable out from under its history.
create table public.daily_challenges (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references public.puzzles (id) on delete restrict,
  challenge_date date not null,
  xp_bonus integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_challenges_challenge_date_key unique (challenge_date),
  constraint daily_challenges_xp_bonus_non_negative check (xp_bonus >= 0)
);

create index daily_challenges_puzzle_id_idx on public.daily_challenges (puzzle_id);

create trigger daily_challenges_set_updated_at
  before update on public.daily_challenges
  for each row execute function public.set_updated_at();

alter table public.daily_challenges enable row level security;

create policy "Daily challenges are viewable by authenticated users"
  on public.daily_challenges for select
  to authenticated
  using (true);
