-- Supabase schema for Impactful
-- Run this in your Supabase SQL editor or via psql.
-- Adjust types, constraints, and policies to match your security requirements.

-- 1) profiles table: one row per authenticated user
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  name text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- index for lookups by email
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);

-- 2) learning_modules table: store module payload in a JSONB "data" column
CREATE TABLE IF NOT EXISTS public.learning_modules (
  id text PRIMARY KEY,
  slug text UNIQUE,
  title text,
  status text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  data jsonb NOT NULL
);

CREATE INDEX IF NOT EXISTS learning_modules_slug_idx ON public.learning_modules (slug);

-- 3) admin_invites table: optional server-side invite management
CREATE TABLE IF NOT EXISTS public.admin_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  invited_at timestamptz DEFAULT now(),
  claimed_at timestamptz
);

CREATE INDEX IF NOT EXISTS admin_invites_email_idx ON public.admin_invites (email);

-- Enable Row Level Security on tables that should be protected
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;

-- Example RLS policies
-- NOTE: These are templates. Review and adapt them to your exact access rules.

-- Profiles policies
-- Allow users to insert their own profile row (matching their auth.uid())
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT USING (auth.uid() = id);
-- Allow users to update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Allow users to select their own profile. Admins may need a separate policy to read all profiles.
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Learning modules policies
-- By default, disallow public access. Allow authenticated users to read published modules.
CREATE POLICY "learning_modules_select_published" ON public.learning_modules FOR SELECT USING (
  auth.role() = 'authenticated' AND (data->>'status') = 'published'
);
-- Allow owners/admins to select/update/delete modules — this assumes you store owner id inside data->>'ownerId' or manage ownership another way.
-- Example for allowing update when auth.uid() equals ownerId inside data JSON:
CREATE POLICY "learning_modules_modify_owner" ON public.learning_modules FOR UPDATE USING (
  (data->>'ownerId') IS NOT NULL AND auth.uid() = (data->>'ownerId')
) WITH CHECK (auth.uid() = (data->>'ownerId'));

-- Admins may need a policy to bypass checks. One approach is to mark a user as admin in profiles.role
-- Example: allow select for admins (reads all modules)
CREATE POLICY "learning_modules_select_admins" ON public.learning_modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Insert/update policies for learning_modules (example: allow owners or admins to upsert)
CREATE POLICY "learning_modules_upsert_owner_or_admin" ON public.learning_modules FOR INSERT USING (
  true
) WITH CHECK (
  -- allow insert if ownerId matches auth.uid() OR if the user is an admin in profiles
  COALESCE((data->>'ownerId'), '') = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Admin invites policies: restrict selects/inserts to authenticated admins in your tooling (or manage invites server-side)
CREATE POLICY "admin_invites_manage_admins" ON public.admin_invites FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Helpful: update triggers to keep updated_at in sync
CREATE OR REPLACE FUNCTION public.ts_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_learning_modules_updated_at ON public.learning_modules;
CREATE TRIGGER trg_learning_modules_updated_at
BEFORE UPDATE ON public.learning_modules
FOR EACH ROW EXECUTE FUNCTION public.ts_update_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.ts_update_updated_at();

-- End of schema file

-- Notes:
-- * Review the policies carefully. For example, the example policies check `data->>'ownerId'` — ensure your application sets ownerId in module data if you want owner-based access.
-- * When testing policies, use the Supabase Auth role tester and your RLS policy diagnostics to confirm behavior.
