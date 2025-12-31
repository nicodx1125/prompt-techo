-- Drop the strict select policy
drop policy if exists "Users can view their own prompts" on public.prompts;

-- Create public read policy
create policy "Everyone can view prompts"
  on public.prompts
  for select
  using (true);
