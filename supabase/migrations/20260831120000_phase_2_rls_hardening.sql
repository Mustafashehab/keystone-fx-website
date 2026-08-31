-- Keystone FX security hardening — Phase 2
-- REVIEW-ONLY: keep FINANCIAL_OPERATIONS_ENABLED=false while testing/applying.
-- This migration is intentionally fail-closed and idempotent.

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- Fail with a useful error instead of partially securing an unexpected schema.
DO $$
DECLARE
  missing_relations text;
BEGIN
  SELECT string_agg(relation_name, ', ' ORDER BY relation_name)
    INTO missing_relations
  FROM unnest(ARRAY[
    'account_applications',
    'client_profiles',
    'client_wallets',
    'deposit_transactions',
    'documents',
    'financial_events',
    'internal_notes',
    'kyc_submissions',
    'leads',
    'notifications',
    'platform_settings',
    'ticket_messages',
    'tickets',
    'withdrawal_attestations',
    'withdrawal_requests'
  ]) AS required(relation_name)
  WHERE to_regclass(format('public.%I', relation_name)) IS NULL;

  IF missing_relations IS NOT NULL THEN
    RAISE EXCEPTION 'Phase 2 aborted; missing public relations: %', missing_relations;
  END IF;

  IF to_regclass('storage.objects') IS NULL OR to_regclass('storage.buckets') IS NULL THEN
    RAISE EXCEPTION 'Phase 2 aborted; Supabase storage relations are missing';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'client-documents') THEN
    RAISE EXCEPTION 'Phase 2 aborted; storage bucket client-documents is missing';
  END IF;

  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id <> 'client-documents') THEN
    RAISE EXCEPTION
      'Phase 2 aborted; additional storage buckets require a manual policy audit';
  END IF;
END;
$$;

-- Duplicate rows would make the security invariants ambiguous. Do not delete or
-- merge financial/compliance data automatically; stop and require manual review.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.client_profiles GROUP BY user_id HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Phase 2 aborted; duplicate client_profiles.user_id values exist';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.client_wallets GROUP BY client_id HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Phase 2 aborted; more than one client wallet exists for a client';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.client_wallets
    WHERE tron_address IS NOT NULL
    GROUP BY tron_address
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Phase 2 aborted; duplicate client wallet addresses exist';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.kyc_submissions GROUP BY client_id HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Phase 2 aborted; duplicate KYC submissions exist for a client';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.account_applications GROUP BY client_id HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Phase 2 aborted; duplicate account applications exist for a client';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.withdrawal_requests
    WHERE status = 'pending'
    GROUP BY client_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Phase 2 aborted; multiple pending withdrawals exist for a client';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.deposit_transactions
    WHERE tx_hash IS NOT NULL
    GROUP BY tx_hash
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Phase 2 aborted; duplicate deposit transaction hashes exist';
  END IF;
END;
$$;

-- Helpers used by RLS policies. The client-id lookup is SECURITY DEFINER so it
-- can read the profile table without recursive RLS evaluation.
CREATE OR REPLACE FUNCTION public.get_my_client_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT id
  FROM public.client_profiles
  WHERE user_id = (SELECT auth.uid())
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.keystone_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Supabase/PostgreSQL grants EXECUTE on new functions to PUBLIC by default.
-- Make every existing and future public-schema RPC fail closed unless explicitly
-- granted below or by a later reviewed migration.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT EXECUTE ON FUNCTION public.get_my_client_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.keystone_is_admin() TO authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO service_role;

-- Remove every pre-existing policy on the application tables. PostgreSQL
-- policies are permissive by default, so leaving one old broad policy would
-- silently weaken the new rules.
DO $$
DECLARE
  policy_record record;
BEGIN
  FOR policy_record IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = ANY (ARRAY[
        'account_applications',
        'audit_logs',
        'client_profiles',
        'client_wallets',
        'deposit_transactions',
        'documents',
        'financial_events',
        'internal_notes',
        'kyc_submissions',
        'leads',
        'mt5_accounts',
        'notifications',
        'platform_settings',
        'ticket_messages',
        'tickets',
        'withdrawal_attestations',
        'withdrawal_requests'
      ])
  LOOP
    EXECUTE format(
      'DROP POLICY %I ON %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  END LOOP;
END;
$$;

ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.client_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_wallets FORCE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests FORCE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_attestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_attestations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_transactions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications FORCE ROW LEVEL SECURITY;
ALTER TABLE public.financial_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_events FORCE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings FORCE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets FORCE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages FORCE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_submissions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents FORCE ROW LEVEL SECURITY;
ALTER TABLE public.account_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_applications FORCE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes FORCE ROW LEVEL SECURITY;

DO $$
DECLARE
  relation_name text;
BEGIN
  FOREACH relation_name IN ARRAY ARRAY['audit_logs', 'mt5_accounts']
  LOOP
    IF to_regclass(format('public.%I', relation_name)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', relation_name);
      EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', relation_name);
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', relation_name);
      EXECUTE format('GRANT ALL ON TABLE public.%I TO service_role', relation_name);
    END IF;
  END LOOP;
END;
$$;

-- Reset PostgREST privileges, then add only the operations and columns the
-- browser application legitimately needs. RLS controls rows; these grants also
-- prevent encrypted_private_key and other server fields from being selected.
REVOKE ALL ON TABLE public.client_profiles FROM anon, authenticated;
REVOKE ALL ON TABLE public.client_wallets FROM anon, authenticated;
REVOKE ALL ON TABLE public.withdrawal_requests FROM anon, authenticated;
REVOKE ALL ON TABLE public.withdrawal_attestations FROM anon, authenticated;
REVOKE ALL ON TABLE public.deposit_transactions FROM anon, authenticated;
REVOKE ALL ON TABLE public.notifications FROM anon, authenticated;
REVOKE ALL ON TABLE public.financial_events FROM anon, authenticated;
REVOKE ALL ON TABLE public.platform_settings FROM anon, authenticated;
REVOKE ALL ON TABLE public.tickets FROM anon, authenticated;
REVOKE ALL ON TABLE public.ticket_messages FROM anon, authenticated;
REVOKE ALL ON TABLE public.kyc_submissions FROM anon, authenticated;
REVOKE ALL ON TABLE public.documents FROM anon, authenticated;
REVOKE ALL ON TABLE public.account_applications FROM anon, authenticated;
REVOKE ALL ON TABLE public.leads FROM anon, authenticated;
REVOKE ALL ON TABLE public.internal_notes FROM anon, authenticated;

GRANT ALL ON TABLE public.client_profiles TO service_role;
GRANT ALL ON TABLE public.client_wallets TO service_role;
GRANT ALL ON TABLE public.withdrawal_requests TO service_role;
GRANT ALL ON TABLE public.withdrawal_attestations TO service_role;
GRANT ALL ON TABLE public.deposit_transactions TO service_role;
GRANT ALL ON TABLE public.notifications TO service_role;
GRANT ALL ON TABLE public.financial_events TO service_role;
GRANT ALL ON TABLE public.platform_settings TO service_role;
GRANT ALL ON TABLE public.tickets TO service_role;
GRANT ALL ON TABLE public.ticket_messages TO service_role;
GRANT ALL ON TABLE public.kyc_submissions TO service_role;
GRANT ALL ON TABLE public.documents TO service_role;
GRANT ALL ON TABLE public.account_applications TO service_role;
GRANT ALL ON TABLE public.leads TO service_role;
GRANT ALL ON TABLE public.internal_notes TO service_role;

GRANT SELECT ON TABLE public.client_profiles TO authenticated;
GRANT UPDATE (onboarding_step, updated_at) ON TABLE public.client_profiles TO authenticated;

GRANT SELECT (
  id, client_id, tron_address, usdt_balance, total_deposited,
  last_checked_at, created_at, updated_at
) ON TABLE public.client_wallets TO authenticated;

GRANT SELECT (
  id, client_id, amount, wallet_address, mt5_account, status,
  rejection_reason, reviewed_at, created_at, updated_at
) ON TABLE public.withdrawal_requests TO authenticated;

GRANT SELECT (
  id, client_id, wallet_id, tx_hash, amount, status,
  swept_at, sweep_tx_hash, created_at
) ON TABLE public.deposit_transactions TO authenticated;

GRANT SELECT ON TABLE public.kyc_submissions TO authenticated;
GRANT SELECT ON TABLE public.account_applications TO authenticated;

GRANT SELECT ON TABLE public.documents TO authenticated;
GRANT INSERT (
  client_id, type, file_name, file_path, file_size, mime_type, status
) ON TABLE public.documents TO authenticated;

GRANT SELECT ON TABLE public.tickets TO authenticated;
GRANT INSERT (
  client_id, subject, description, status, priority, category
) ON TABLE public.tickets TO authenticated;

GRANT SELECT ON TABLE public.ticket_messages TO authenticated;
GRANT INSERT (
  ticket_id, sender_id, sender_role, content
) ON TABLE public.ticket_messages TO authenticated;

GRANT SELECT ON TABLE public.notifications TO authenticated;
GRANT UPDATE (read) ON TABLE public.notifications TO authenticated;

-- These two admin client components still use the browser Supabase client.
-- Their policies trust only protected app_metadata, never editable user metadata.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.leads TO authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE public.internal_notes TO authenticated;

-- Client-owned rows.
CREATE POLICY client_profiles_select_own
  ON public.client_profiles FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY client_profiles_update_own_onboarding
  ON public.client_profiles FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND onboarding_step BETWEEN 0 AND 4
  );

CREATE POLICY client_wallets_select_safe_own
  ON public.client_wallets FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY withdrawal_requests_select_own
  ON public.withdrawal_requests FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY deposit_transactions_select_own
  ON public.deposit_transactions FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY kyc_submissions_select_own
  ON public.kyc_submissions FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY account_applications_select_own
  ON public.account_applications FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY documents_select_own
  ON public.documents FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY documents_insert_pending_own
  ON public.documents FOR INSERT TO authenticated
  WITH CHECK (
    client_id = public.get_my_client_id()
    AND status = 'pending'
    AND reviewed_at IS NULL
    AND reviewed_by IS NULL
    AND rejection_reason IS NULL
    AND split_part(file_path, '/', 1) = client_id::text
    AND file_size BETWEEN 1 AND 10485760
    AND mime_type IN ('application/pdf', 'image/jpeg', 'image/png')
  );

CREATE POLICY tickets_select_own
  ON public.tickets FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY tickets_insert_open_own
  ON public.tickets FOR INSERT TO authenticated
  WITH CHECK (
    client_id = public.get_my_client_id()
    AND status = 'open'
    AND assigned_to IS NULL
    AND resolved_at IS NULL
  );

CREATE POLICY ticket_messages_select_own
  ON public.ticket_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tickets
      WHERE tickets.id = ticket_messages.ticket_id
        AND tickets.client_id = public.get_my_client_id()
    )
  );

CREATE POLICY ticket_messages_insert_client_own
  ON public.ticket_messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = (SELECT auth.uid())
    AND sender_role = 'client'
    AND EXISTS (
      SELECT 1
      FROM public.tickets
      WHERE tickets.id = ticket_messages.ticket_id
        AND tickets.client_id = public.get_my_client_id()
        AND tickets.status NOT IN ('resolved', 'closed')
    )
  );

CREATE POLICY notifications_select_client_own
  ON public.notifications FOR SELECT TO authenticated
  USING (
    recipient = 'client'
    AND client_id = public.get_my_client_id()
  );

CREATE POLICY notifications_update_client_read
  ON public.notifications FOR UPDATE TO authenticated
  USING (
    recipient = 'client'
    AND client_id = public.get_my_client_id()
  )
  WITH CHECK (
    recipient = 'client'
    AND client_id = public.get_my_client_id()
  );

-- Protected-admin browser policies.
CREATE POLICY notifications_select_admin
  ON public.notifications FOR SELECT TO authenticated
  USING (recipient = 'admin' AND public.keystone_is_admin());

CREATE POLICY notifications_update_admin_read
  ON public.notifications FOR UPDATE TO authenticated
  USING (recipient = 'admin' AND public.keystone_is_admin())
  WITH CHECK (recipient = 'admin' AND public.keystone_is_admin());

CREATE POLICY leads_admin_all
  ON public.leads FOR ALL TO authenticated
  USING (public.keystone_is_admin())
  WITH CHECK (public.keystone_is_admin());

CREATE POLICY internal_notes_admin_all
  ON public.internal_notes FOR ALL TO authenticated
  USING (public.keystone_is_admin())
  WITH CHECK (
    public.keystone_is_admin()
    AND author_id = (SELECT auth.uid())
  );

-- Financial integrity constraints. NOT VALID preserves existing records while
-- enforcing the rule on every new or changed row. Existing exceptions must be
-- reviewed and corrected before manually validating these constraints.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.withdrawal_requests'::regclass
      AND conname = 'withdrawal_requests_amount_positive'
  ) THEN
    ALTER TABLE public.withdrawal_requests
      ADD CONSTRAINT withdrawal_requests_amount_positive
      CHECK (amount > 0) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.withdrawal_requests'::regclass
      AND conname = 'withdrawal_requests_tron_address_valid'
  ) THEN
    ALTER TABLE public.withdrawal_requests
      ADD CONSTRAINT withdrawal_requests_tron_address_valid
      CHECK (wallet_address ~ '^T[1-9A-HJ-NP-Za-km-z]{33}$') NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.client_wallets'::regclass
      AND conname = 'client_wallets_balances_nonnegative'
  ) THEN
    ALTER TABLE public.client_wallets
      ADD CONSTRAINT client_wallets_balances_nonnegative
      CHECK (usdt_balance >= 0 AND total_deposited >= 0) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.deposit_transactions'::regclass
      AND conname = 'deposit_transactions_amount_positive'
  ) THEN
    ALTER TABLE public.deposit_transactions
      ADD CONSTRAINT deposit_transactions_amount_positive
      CHECK (amount > 0) NOT VALID;
  END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS client_profiles_user_id_unique
  ON public.client_profiles (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS client_wallets_client_id_unique
  ON public.client_wallets (client_id);
CREATE UNIQUE INDEX IF NOT EXISTS client_wallets_tron_address_unique
  ON public.client_wallets (tron_address);
CREATE UNIQUE INDEX IF NOT EXISTS kyc_submissions_client_id_unique
  ON public.kyc_submissions (client_id);
CREATE UNIQUE INDEX IF NOT EXISTS account_applications_client_id_unique
  ON public.account_applications (client_id);
CREATE UNIQUE INDEX IF NOT EXISTS withdrawal_requests_one_pending_per_client
  ON public.withdrawal_requests (client_id)
  WHERE status = 'pending';
CREATE UNIQUE INDEX IF NOT EXISTS deposit_transactions_tx_hash_unique
  ON public.deposit_transactions (tx_hash)
  WHERE tx_hash IS NOT NULL;

-- Financial state-changing RPCs are never callable with an anon or ordinary
-- authenticated JWT, even if a future policy or table grant is loosened.
DO $$
DECLARE
  function_signature text;
BEGIN
  FOR function_signature IN
    SELECT format(
      '%I.%I(%s)',
      n.nspname,
      p.proname,
      pg_get_function_identity_arguments(p.oid)
    )
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY (ARRAY[
        'approve_withdrawal',
        'record_deposit_detected',
        'record_deposit_swept',
        'reject_withdrawal'
      ])
  LOOP
    EXECUTE format(
      'REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated',
      function_signature
    );
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', function_signature);
  END LOOP;
END;
$$;

-- Private compliance-document storage with per-client paths and protected-admin
-- read access. The browser cannot delete objects; deletion is a validated API.
UPDATE storage.buckets
SET public = false,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[]
WHERE id = 'client-documents';

DO $$
DECLARE
  policy_record record;
BEGIN
  FOR policy_record IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', policy_record.policyname);
  END LOOP;
END;
$$;

CREATE POLICY client_documents_select_own_or_admin
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'client-documents'
    AND (
      (storage.foldername(name))[1] = public.get_my_client_id()::text
      OR public.keystone_is_admin()
    )
  );

CREATE POLICY client_documents_insert_own
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'client-documents'
    AND (storage.foldername(name))[1] = public.get_my_client_id()::text
  );

COMMIT;
