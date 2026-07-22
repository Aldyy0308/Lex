-- xp_transactions: append-only XP ledger — the source of truth that
-- profiles.total_xp is a denormalized cache of. No updated_at; a ledger
-- entry is never edited, only ever added (a correction is a new negative
-- entry, not a mutation).
create table public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  puzzle_attempt_id uuid references public.puzzle_attempts (id) on delete set null,
  amount integer not null,
  source text not null,
  created_at timestamptz not null default now(),
  constraint xp_transactions_amount_not_zero check (amount <> 0),
  constraint xp_transactions_source_known check (
    source in (
      'puzzle_attempt',
      'daily_challenge_bonus',
      'streak_bonus',
      'achievement',
      'manual_adjustment'
    )
  )
);

create index xp_transactions_user_id_idx on public.xp_transactions (user_id);
create index xp_transactions_puzzle_attempt_id_idx on public.xp_transactions (puzzle_attempt_id);
create index xp_transactions_user_created_idx on public.xp_transactions (user_id, created_at);

alter table public.xp_transactions enable row level security;

create policy "Users can view their own XP transactions"
  on public.xp_transactions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can record their own XP transactions"
  on public.xp_transactions for insert
  to authenticated
  with check (auth.uid() = user_id);
