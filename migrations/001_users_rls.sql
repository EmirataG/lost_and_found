-- Enable RLS on users table and add policies
-- Run this in Supabase SQL editor (do NOT run locally unless connected to your DB)

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SELECT user rows (app layer enforces privacy)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'allow_select_all') THEN
    CREATE POLICY allow_select_all ON public.users FOR SELECT USING (true);
  END IF;
END$$;

-- Allow authenticated users to INSERT their own user row
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'allow_insert_own') THEN
    CREATE POLICY allow_insert_own ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END$$;

-- Allow authenticated users to UPDATE their own row
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'allow_update_own') THEN
    CREATE POLICY allow_update_own ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
END$$;

-- Note: If you have sensitive columns (email/phone), enforce application-level privacy or
-- add separate policies to restrict SELECT of those columns. The app already restricts what it returns.
