-- Add user_id column to prompts table
alter table public.prompts
add column user_id uuid references auth.users(id) on delete cascade;

-- Update RLS Policies for strict user-based access

-- 1. Drop the generic policy
drop policy if exists "Allow generic access" on public.prompts;

-- 2. Create policy for SELECT (Read own data)
create policy "Users can view their own prompts"
  on public.prompts
  for select
  using (auth.uid() = user_id);

-- 3. Create policy for INSERT (Create own data)
create policy "Users can insert their own prompts"
  on public.prompts
  for insert
  with check (auth.uid() = user_id);

-- 4. Create policy for UPDATE (Update own data)
create policy "Users can update their own prompts"
  on public.prompts
  for update
  using (auth.uid() = user_id);

-- 5. Create policy for DELETE (Delete own data)
create policy "Users can delete their own prompts"
  on public.prompts
  for delete
  using (auth.uid() = user_id);
