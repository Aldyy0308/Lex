-- streaks: one row per user tracking consecutive-day activity for the
-- Progression domain. `longest_streak >= current_streak` is enforced at the
-- database level since it's a structural invariant, not a business rule.
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint streaks_current_streak_non_negative check (current_streak >= 0),
  constraint streaks_longest_streak_non_negative check (longest_streak >= 0),
  constraint streaks_longest_gte_current check (longest_streak >= current_streak)
);

create trigger streaks_set_updated_at
  before update on public.streaks
  for each row execute function public.set_updated_at();

alter table public.streaks enable row level security;

create policy "Users can view their own streak"
  on public.streaks for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own streak"
  on public.streaks for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can create their own streak"
  on public.streaks for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Provisions a profiles row and a streaks row the moment a Supabase Auth
-- user is created. Essential for correctness, not business logic: every
-- other table here FKs to profiles.id, so without this every sign-up would
-- need the client to remember a follow-up insert before anything else about
-- that user could be recorded.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.streaks (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
