-- puzzles: catalog of puzzle instances across all puzzle types (Common Link
-- first; 23+ more on the roadmap per src/puzzles/README.md). `puzzle_type`
-- is free text rather than an enum, and `content`/`solution` are jsonb,
-- because each puzzle type owns its own content shape (the engine/puzzles
-- plugin split in docs/Architecture/project-structure.md) — adding puzzle
-- type #25 must never require a schema migration.
create table public.puzzles (
  id uuid primary key default gen_random_uuid(),
  puzzle_type text not null,
  difficulty smallint not null,
  title text not null,
  content jsonb not null,
  solution jsonb not null,
  explanation text,
  xp_reward integer not null default 10,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint puzzles_difficulty_range check (difficulty between 1 and 5),
  constraint puzzles_xp_reward_positive check (xp_reward > 0)
);

create index puzzles_puzzle_type_idx on public.puzzles (puzzle_type);
create index puzzles_difficulty_idx on public.puzzles (difficulty);
create index puzzles_is_active_idx on public.puzzles (is_active) where is_active;

create trigger puzzles_set_updated_at
  before update on public.puzzles
  for each row execute function public.set_updated_at();

alter table public.puzzles enable row level security;

create policy "Active puzzles are viewable by authenticated users"
  on public.puzzles for select
  to authenticated
  using (is_active = true);
