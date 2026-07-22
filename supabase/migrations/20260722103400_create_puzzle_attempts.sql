-- puzzle_attempts: append-only record of one user's attempt at one puzzle
-- (the engine lifecycle's "record attempt" step). No updated_at — an
-- attempt is a fact about what happened, never edited after the fact.
-- `daily_challenge_id` is nullable because most attempts happen in Practice
-- Mode, not the Daily Challenge.
create table public.puzzle_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  puzzle_id uuid not null references public.puzzles (id) on delete cascade,
  daily_challenge_id uuid references public.daily_challenges (id) on delete set null,
  attempt_number smallint not null default 1,
  user_answer jsonb not null,
  is_correct boolean not null,
  time_taken_seconds integer,
  xp_earned integer not null default 0,
  created_at timestamptz not null default now(),
  constraint puzzle_attempts_attempt_number_positive check (attempt_number > 0),
  constraint puzzle_attempts_time_taken_non_negative check (
    time_taken_seconds is null or time_taken_seconds >= 0
  ),
  constraint puzzle_attempts_xp_earned_non_negative check (xp_earned >= 0),
  constraint puzzle_attempts_unique_attempt unique (user_id, puzzle_id, attempt_number)
);

create index puzzle_attempts_user_id_idx on public.puzzle_attempts (user_id);
create index puzzle_attempts_puzzle_id_idx on public.puzzle_attempts (puzzle_id);
create index puzzle_attempts_daily_challenge_id_idx on public.puzzle_attempts (daily_challenge_id);
create index puzzle_attempts_user_puzzle_idx on public.puzzle_attempts (user_id, puzzle_id);

alter table public.puzzle_attempts enable row level security;

create policy "Users can view their own puzzle attempts"
  on public.puzzle_attempts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can record their own puzzle attempts"
  on public.puzzle_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);
