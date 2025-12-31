-- Create the prompts table
create table public.prompts (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  title text not null,
  content text not null,
  tags text[] null,
  source_url text null,
  source_title text null,
  constraint prompts_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.prompts enable row level security;

-- Create a policy that allows all operations for anonymous users (for development/MVP without Auth)
-- WARNING: This allows anyone with your Anon Key to Read/Write/Delete data.
-- Once Authentication is implemented, these policies should be updated to restrict access to the owner.

create policy "Allow generic access"
  on public.prompts
  as permissive
  for all
  to anon
  using (true)
  with check (true);
