-- Shared plumbing: keeps `updated_at` accurate on every UPDATE without
-- relying on every future caller (app code, SQL editor, etc.) to remember to
-- set it by hand. No domain meaning — attached to mutable tables below.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
