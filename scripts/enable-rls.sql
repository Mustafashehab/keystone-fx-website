-- ============================================================================
-- Keystone FX — Enable Row-Level Security on ALL public tables
-- Generated: 2026-04-01
--
-- IMPORTANT: Run this in Supabase SQL Editor.
-- Service role client (createServiceRoleClient) bypasses RLS automatically.
-- This protects against direct anon/authenticated access via PostgREST.
--
-- Helper function: get_my_client_id() resolves auth.uid() → client_profiles.id
-- Used by all tables that reference client_id.
-- ============================================================================

-- ─── Helper function ─────────────────────────────────────────────────────────
-- Returns the client_profiles.id for the currently authenticated user.
-- Returns NULL if no profile exists (prevents access to any client-scoped rows).

CREATE OR REPLACE FUNCTION public.get_my_client_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.client_profiles WHERE user_id = auth.uid() LIMIT 1;
$$;


-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. ENABLE RLS ON ALL TABLES
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.client_profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_wallets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_attestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_submissions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_applications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes         ENABLE ROW LEVEL SECURITY;


-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. CLIENT_PROFILES — keyed on auth.uid() = user_id
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "client_profiles_select_own"
  ON public.client_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "client_profiles_insert_own"
  ON public.client_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "client_profiles_update_own"
  ON public.client_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. CLIENT_WALLETS — keyed on client_id
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "client_wallets_select_own"
  ON public.client_wallets FOR SELECT
  TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY "client_wallets_insert_own"
  ON public.client_wallets FOR INSERT
  TO authenticated
  WITH CHECK (client_id = public.get_my_client_id());


-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. WITHDRAWAL_REQUESTS — keyed on client_id
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "withdrawal_requests_select_own"
  ON public.withdrawal_requests FOR SELECT
  TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY "withdrawal_requests_insert_own"
  ON public.withdrawal_requests FOR INSERT
  TO authenticated
  WITH CHECK (client_id = public.get_my_client_id());


-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. DEPOSIT_TRANSACTIONS — keyed on client_id (read-only for clients)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "deposit_transactions_select_own"
  ON public.deposit_transactions FOR SELECT
  TO authenticated
  USING (client_id = public.get_my_client_id());


-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. KYC_SUBMISSIONS — keyed on client_id
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "kyc_submissions_select_own"
  ON public.kyc_submissions FOR SELECT
  TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY "kyc_submissions_insert_own"
  ON public.kyc_submissions FOR INSERT
  TO authenticated
  WITH CHECK (client_id = public.get_my_client_id());

CREATE POLICY "kyc_submissions_update_own"
  ON public.kyc_submissions FOR UPDATE
  TO authenticated
  USING (client_id = public.get_my_client_id())
  WITH CHECK (client_id = public.get_my_client_id());


-- ═══════════════════════════════════════════════════════════════════════════════
-- 7. DOCUMENTS — keyed on client_id
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "documents_select_own"
  ON public.documents FOR SELECT
  TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY "documents_insert_own"
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (client_id = public.get_my_client_id());


-- ═══════════════════════════════════════════════════════════════════════════════
-- 8. ACCOUNT_APPLICATIONS — keyed on client_id
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "account_applications_select_own"
  ON public.account_applications FOR SELECT
  TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY "account_applications_insert_own"
  ON public.account_applications FOR INSERT
  TO authenticated
  WITH CHECK (client_id = public.get_my_client_id());

CREATE POLICY "account_applications_update_own"
  ON public.account_applications FOR UPDATE
  TO authenticated
  USING (client_id = public.get_my_client_id())
  WITH CHECK (client_id = public.get_my_client_id());


-- ═══════════════════════════════════════════════════════════════════════════════
-- 9. TICKETS — keyed on client_id
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "tickets_select_own"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY "tickets_insert_own"
  ON public.tickets FOR INSERT
  TO authenticated
  WITH CHECK (client_id = public.get_my_client_id());

CREATE POLICY "tickets_update_own"
  ON public.tickets FOR UPDATE
  TO authenticated
  USING (client_id = public.get_my_client_id())
  WITH CHECK (client_id = public.get_my_client_id());


-- ═══════════════════════════════════════════════════════════════════════════════
-- 10. TICKET_MESSAGES — keyed on ticket ownership
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "ticket_messages_select_own"
  ON public.ticket_messages FOR SELECT
  TO authenticated
  USING (
    ticket_id IN (
      SELECT id FROM public.tickets WHERE client_id = public.get_my_client_id()
    )
  );

CREATE POLICY "ticket_messages_insert_own"
  ON public.ticket_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    ticket_id IN (
      SELECT id FROM public.tickets WHERE client_id = public.get_my_client_id()
    )
  );


-- ═══════════════════════════════════════════════════════════════════════════════
-- 11. NOTIFICATIONS — keyed on client_id
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (client_id = public.get_my_client_id())
  WITH CHECK (client_id = public.get_my_client_id());


-- ═══════════════════════════════════════════════════════════════════════════════
-- 12. PLATFORM_SETTINGS — read-only for authenticated, write via service role
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "platform_settings_select_authenticated"
  ON public.platform_settings FOR SELECT
  TO authenticated
  USING (true);

-- No INSERT/UPDATE/DELETE policies for authenticated — service role only.


-- ═══════════════════════════════════════════════════════════════════════════════
-- 13. SERVICE-ROLE-ONLY TABLES — no client access at all
--     financial_events, withdrawal_attestations, leads, internal_notes
-- ═══════════════════════════════════════════════════════════════════════════════

-- With RLS enabled and NO policies for authenticated/anon, these tables are
-- completely locked down. Only the service role (which bypasses RLS) can access.
-- No policies needed — the default is DENY when RLS is enabled.


-- ═══════════════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERY — Run after applying to confirm RLS is enabled everywhere
-- ═══════════════════════════════════════════════════════════════════════════════

-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
