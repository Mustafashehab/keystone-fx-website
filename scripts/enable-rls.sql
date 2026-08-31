-- DEPRECATED — DO NOT APPLY THIS LEGACY SCRIPT.
--
-- The original version enabled row-level policies but still allowed client
-- browsers to select encrypted wallet keys and write review/financial fields.
-- Use this reviewed migration instead:
--   supabase/migrations/20260831120000_phase_2_rls_hardening.sql

DO $$
BEGIN
  RAISE EXCEPTION
    'This legacy RLS script is blocked. Apply the Phase 2 migration after reviewing SECURITY_PHASE_2.md.';
END;
$$;
