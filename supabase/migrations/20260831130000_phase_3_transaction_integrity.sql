-- Keystone FX security hardening, Phase 3
-- Transaction integrity for TRON deposits, wallet sweeps, and withdrawal review.
--
-- This migration is intentionally not applied by the application. Review it,
-- back up the database, and run it in a controlled Supabase maintenance window.

BEGIN;

-- Abort before creating unique indexes if legacy rows require reconciliation.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.financial_events
    WHERE idempotency_key IS NOT NULL
    GROUP BY idempotency_key
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'phase_3_preflight: duplicate financial_events.idempotency_key values';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.withdrawal_attestations
    GROUP BY withdrawal_id, admin_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'phase_3_preflight: duplicate withdrawal attestations';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.deposit_transactions
    WHERE amount <= 0 OR scale(amount) > 6
  ) THEN
    RAISE EXCEPTION 'phase_3_preflight: invalid deposit amount precision or sign';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.client_wallets
    WHERE usdt_balance < 0 OR total_deposited < 0
      OR scale(usdt_balance) > 6 OR scale(total_deposited) > 6
  ) THEN
    RAISE EXCEPTION 'phase_3_preflight: invalid wallet balance precision or sign';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.withdrawal_requests
    WHERE amount <= 0 OR scale(amount) > 6
  ) THEN
    RAISE EXCEPTION 'phase_3_preflight: invalid withdrawal amount precision or sign';
  END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS financial_events_idempotency_key_unique
  ON public.financial_events (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS withdrawal_attestations_reviewer_unique
  ON public.withdrawal_attestations (withdrawal_id, admin_id);

CREATE TABLE IF NOT EXISTS public.wallet_sweep_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.client_wallets(id) ON DELETE RESTRICT,
  client_id uuid NOT NULL REFERENCES public.client_profiles(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'prepared'
    CHECK (status IN ('prepared', 'broadcast', 'confirmed', 'failed', 'manual_review')),
  usdt_amount numeric(38, 6) NOT NULL DEFAULT 0 CHECK (usdt_amount >= 0),
  usdt_tx_hash text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  CONSTRAINT wallet_sweep_operations_tx_hash_format
    CHECK (usdt_tx_hash IS NULL OR usdt_tx_hash ~ '^[0-9a-f]{64}$')
);

CREATE TABLE IF NOT EXISTS public.wallet_sweep_operation_deposits (
  operation_id uuid NOT NULL
    REFERENCES public.wallet_sweep_operations(id) ON DELETE RESTRICT,
  deposit_id uuid NOT NULL
    REFERENCES public.deposit_transactions(id) ON DELETE RESTRICT,
  PRIMARY KEY (operation_id, deposit_id),
  UNIQUE (deposit_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS wallet_sweep_operations_tx_hash_unique
  ON public.wallet_sweep_operations (usdt_tx_hash)
  WHERE usdt_tx_hash IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS wallet_sweep_operations_one_active_wallet
  ON public.wallet_sweep_operations (wallet_id)
  WHERE status IN ('prepared', 'broadcast', 'manual_review');

ALTER TABLE public.wallet_sweep_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_sweep_operations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_sweep_operation_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_sweep_operation_deposits FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.wallet_sweep_operations FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.wallet_sweep_operation_deposits FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.wallet_sweep_operations TO service_role;
GRANT ALL ON TABLE public.wallet_sweep_operation_deposits TO service_role;

-- Remove legacy overloads so PostgREST cannot resolve an outdated financial RPC.
DO $$
DECLARE
  function_record record;
BEGIN
  FOR function_record IN
    SELECT p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY (ARRAY[
        'approve_withdrawal',
        'claim_wallet_sweep',
        'confirm_wallet_sweep',
        'mark_wallet_sweep_failed',
        'mark_wallet_sweep_manual_review',
        'prepare_wallet_sweep',
        'record_deposit_detected',
        'record_deposit_swept',
        'record_withdrawal_attestation',
        'record_wallet_sweep_broadcast',
        'reject_withdrawal',
        'release_wallet_sweep_lock'
      ])
  LOOP
    EXECUTE format('DROP FUNCTION %s', function_record.signature);
  END LOOP;
END;
$$;

CREATE FUNCTION public.record_deposit_detected(
  p_client_id uuid,
  p_wallet_id uuid,
  p_tx_hash text,
  p_amount numeric
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  wallet_record public.client_wallets%ROWTYPE;
  inserted_deposit_id uuid;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 OR scale(p_amount) > 6 THEN
    RAISE EXCEPTION 'invalid_deposit_amount';
  END IF;
  IF p_tx_hash IS NULL OR p_tx_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'invalid_deposit_tx_hash';
  END IF;

  SELECT * INTO wallet_record
  FROM public.client_wallets
  WHERE id = p_wallet_id AND client_id = p_client_id
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'wallet_not_found'; END IF;
  IF wallet_record.sweep_locked THEN RAISE EXCEPTION 'wallet_sweep_in_progress'; END IF;

  INSERT INTO public.deposit_transactions (
    client_id, wallet_id, tx_hash, amount, status
  ) VALUES (
    p_client_id, p_wallet_id, p_tx_hash, p_amount, 'detected'
  )
  ON CONFLICT (tx_hash) WHERE tx_hash IS NOT NULL DO NOTHING
  RETURNING id INTO inserted_deposit_id;

  IF inserted_deposit_id IS NULL THEN RETURN false; END IF;

  UPDATE public.client_wallets
  SET usdt_balance = COALESCE(usdt_balance, 0) + p_amount,
      total_deposited = COALESCE(total_deposited, 0) + p_amount,
      updated_at = now()
  WHERE id = p_wallet_id;

  INSERT INTO public.financial_events (
    event_type, client_id, actor_id, actor_role, entity_type, entity_id,
    amount, currency, metadata, idempotency_key
  ) VALUES (
    'deposit.detected', p_client_id, NULL, 'system', 'deposit_transaction',
    inserted_deposit_id, p_amount, 'USDT',
    jsonb_build_object('tx_hash', p_tx_hash, 'wallet_id', p_wallet_id),
    'deposit:' || p_tx_hash
  )
  ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL DO NOTHING;

  RETURN true;
END;
$$;

CREATE FUNCTION public.claim_wallet_sweep(p_client_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  wallet_record public.client_wallets%ROWTYPE;
  operation_record public.wallet_sweep_operations%ROWTYPE;
BEGIN
  SELECT * INTO wallet_record
  FROM public.client_wallets
  WHERE client_id = p_client_id
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'wallet_not_found'; END IF;
  IF wallet_record.sweep_locked
     AND COALESCE(wallet_record.updated_at, now()) > now() - interval '15 minutes' THEN
    RAISE EXCEPTION 'wallet_sweep_in_progress';
  END IF;

  UPDATE public.client_wallets
  SET sweep_locked = true, updated_at = now()
  WHERE id = wallet_record.id;

  SELECT * INTO operation_record
  FROM public.wallet_sweep_operations
  WHERE wallet_id = wallet_record.id
    AND status IN ('prepared', 'broadcast', 'manual_review')
  ORDER BY created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF FOUND AND operation_record.status = 'prepared' THEN
    UPDATE public.wallet_sweep_operations
    SET status = 'manual_review',
        error_message = 'Interrupted before broadcast status was recorded; do not resend automatically',
        updated_at = now()
    WHERE id = operation_record.id
    RETURNING * INTO operation_record;
  ELSIF NOT FOUND THEN
    INSERT INTO public.wallet_sweep_operations (wallet_id, client_id)
    VALUES (wallet_record.id, p_client_id)
    RETURNING * INTO operation_record;
  END IF;

  RETURN jsonb_build_object(
    'operationId', operation_record.id,
    'walletId', wallet_record.id,
    'tronAddress', wallet_record.tron_address,
    'encryptedPrivateKey', wallet_record.encrypted_private_key,
    'ledgerBalance', COALESCE(wallet_record.usdt_balance, 0)::text,
    'status', operation_record.status,
    'usdtAmount', operation_record.usdt_amount::text,
    'usdtTxHash', operation_record.usdt_tx_hash
  );
END;
$$;

CREATE FUNCTION public.prepare_wallet_sweep(
  p_operation_id uuid,
  p_max_amount numeric
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  operation_record public.wallet_sweep_operations%ROWTYPE;
  prepared_amount numeric(38, 6);
BEGIN
  IF p_max_amount IS NULL OR p_max_amount <= 0 OR scale(p_max_amount) > 6 THEN
    RAISE EXCEPTION 'invalid_sweep_amount';
  END IF;

  SELECT * INTO operation_record
  FROM public.wallet_sweep_operations
  WHERE id = p_operation_id
  FOR UPDATE;

  IF NOT FOUND OR operation_record.status <> 'prepared' THEN
    RAISE EXCEPTION 'sweep_operation_not_preparable';
  END IF;

  PERFORM id
  FROM public.deposit_transactions
  WHERE client_id = operation_record.client_id AND status = 'detected'
  ORDER BY created_at, id
  FOR UPDATE;

  INSERT INTO public.wallet_sweep_operation_deposits (operation_id, deposit_id)
  SELECT p_operation_id, ranked.id
  FROM (
    SELECT id,
      sum(amount) OVER (ORDER BY created_at, id ROWS UNBOUNDED PRECEDING) AS running_total
    FROM public.deposit_transactions
    WHERE client_id = operation_record.client_id AND status = 'detected'
  ) AS ranked
  WHERE ranked.running_total <= p_max_amount
  ON CONFLICT DO NOTHING;

  SELECT COALESCE(sum(deposit.amount), 0)
  INTO prepared_amount
  FROM public.wallet_sweep_operation_deposits link
  JOIN public.deposit_transactions deposit ON deposit.id = link.deposit_id
  WHERE link.operation_id = p_operation_id;

  IF prepared_amount <= 0 THEN RAISE EXCEPTION 'no_recorded_deposits_to_sweep'; END IF;

  UPDATE public.wallet_sweep_operations
  SET usdt_amount = prepared_amount, updated_at = now()
  WHERE id = p_operation_id;

  RETURN prepared_amount::text;
END;
$$;

CREATE FUNCTION public.record_wallet_sweep_broadcast(
  p_operation_id uuid,
  p_tx_hash text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_tx_hash IS NULL OR p_tx_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'invalid_sweep_tx_hash';
  END IF;

  UPDATE public.wallet_sweep_operations
  SET status = 'broadcast', usdt_tx_hash = p_tx_hash, updated_at = now()
  WHERE id = p_operation_id AND status = 'prepared' AND usdt_amount > 0;

  IF NOT FOUND THEN RAISE EXCEPTION 'sweep_operation_not_broadcastable'; END IF;
  RETURN true;
END;
$$;

CREATE FUNCTION public.confirm_wallet_sweep(
  p_operation_id uuid,
  p_tx_hash text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  operation_record public.wallet_sweep_operations%ROWTYPE;
  wallet_record public.client_wallets%ROWTYPE;
  settlement_amount numeric(38, 6);
BEGIN
  SELECT * INTO operation_record
  FROM public.wallet_sweep_operations
  WHERE id = p_operation_id
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'sweep_operation_not_found'; END IF;
  IF operation_record.status = 'confirmed' AND operation_record.usdt_tx_hash = p_tx_hash THEN
    RETURN true;
  END IF;
  IF operation_record.status NOT IN ('broadcast', 'manual_review')
     OR operation_record.usdt_tx_hash <> p_tx_hash THEN
    RAISE EXCEPTION 'sweep_confirmation_mismatch';
  END IF;

  SELECT * INTO wallet_record
  FROM public.client_wallets
  WHERE id = operation_record.wallet_id
  FOR UPDATE;

  SELECT COALESCE(sum(deposit.amount), 0)
  INTO settlement_amount
  FROM public.wallet_sweep_operation_deposits link
  JOIN public.deposit_transactions deposit ON deposit.id = link.deposit_id
  WHERE link.operation_id = p_operation_id AND deposit.status = 'detected';

  IF settlement_amount <= 0 THEN RAISE EXCEPTION 'sweep_has_no_unsettled_deposits'; END IF;
  IF COALESCE(wallet_record.usdt_balance, 0) < settlement_amount THEN
    RAISE EXCEPTION 'wallet_balance_underflow';
  END IF;

  UPDATE public.deposit_transactions AS deposit
  SET status = 'swept', swept_at = now(), sweep_tx_hash = p_tx_hash
  FROM public.wallet_sweep_operation_deposits AS link
  WHERE link.operation_id = p_operation_id
    AND link.deposit_id = deposit.id
    AND deposit.status = 'detected';

  UPDATE public.client_wallets
  SET usdt_balance = COALESCE(usdt_balance, 0) - settlement_amount,
      sweep_locked = false,
      updated_at = now()
  WHERE id = operation_record.wallet_id;

  UPDATE public.wallet_sweep_operations
  SET status = 'confirmed', confirmed_at = now(), updated_at = now(), error_message = NULL
  WHERE id = p_operation_id;

  INSERT INTO public.financial_events (
    event_type, client_id, actor_id, actor_role, entity_type, entity_id,
    amount, currency, metadata, idempotency_key
  ) VALUES (
    'wallet.sweep_confirmed', operation_record.client_id, NULL, 'system',
    'wallet_sweep_operation', p_operation_id, settlement_amount, 'USDT',
    jsonb_build_object('tx_hash', p_tx_hash, 'wallet_id', operation_record.wallet_id),
    'sweep:' || p_tx_hash
  )
  ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL DO NOTHING;

  RETURN true;
END;
$$;

CREATE FUNCTION public.mark_wallet_sweep_manual_review(
  p_operation_id uuid,
  p_error_message text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.wallet_sweep_operations
  SET status = 'manual_review',
      error_message = left(COALESCE(p_error_message, 'Manual review required'), 2000),
      updated_at = now()
  WHERE id = p_operation_id AND status IN ('prepared', 'broadcast', 'manual_review');
  IF NOT FOUND THEN RETURN false; END IF;
  RETURN true;
END;
$$;

CREATE FUNCTION public.mark_wallet_sweep_failed(
  p_operation_id uuid,
  p_error_message text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  affected_wallet_id uuid;
BEGIN
  SELECT wallet_id INTO affected_wallet_id
  FROM public.wallet_sweep_operations
  WHERE id = p_operation_id AND status IN ('prepared', 'broadcast')
  FOR UPDATE;

  IF affected_wallet_id IS NULL THEN RETURN false; END IF;

  DELETE FROM public.wallet_sweep_operation_deposits
  WHERE operation_id = p_operation_id;

  UPDATE public.wallet_sweep_operations
  SET status = 'failed',
      error_message = left(COALESCE(p_error_message, 'Sweep failed'), 2000),
      updated_at = now()
  WHERE id = p_operation_id;

  UPDATE public.client_wallets
  SET sweep_locked = false, updated_at = now()
  WHERE id = affected_wallet_id;
  RETURN true;
END;
$$;

CREATE FUNCTION public.release_wallet_sweep_lock(p_operation_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.client_wallets AS wallet
  SET sweep_locked = false, updated_at = now()
  FROM public.wallet_sweep_operations AS operation
  WHERE operation.id = p_operation_id AND wallet.id = operation.wallet_id;
  RETURN FOUND;
END;
$$;

CREATE FUNCTION public.record_withdrawal_attestation(
  p_withdrawal_id uuid,
  p_admin_id uuid,
  p_attested_balance numeric
)
RETURNS timestamptz
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  withdrawal_record public.withdrawal_requests%ROWTYPE;
  recorded_at timestamptz := now();
BEGIN
  IF p_attested_balance IS NULL OR p_attested_balance < 0
     OR scale(p_attested_balance) > 6 THEN
    RAISE EXCEPTION 'invalid_attested_balance';
  END IF;

  SELECT * INTO withdrawal_record
  FROM public.withdrawal_requests
  WHERE id = p_withdrawal_id
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'withdrawal_not_found'; END IF;
  IF withdrawal_record.status <> 'pending' THEN RAISE EXCEPTION 'withdrawal_not_pending'; END IF;
  IF p_attested_balance < withdrawal_record.amount THEN
    RAISE EXCEPTION 'insufficient_attested_balance';
  END IF;

  INSERT INTO public.withdrawal_attestations (
    withdrawal_id, admin_id, attested_balance, attested_at, used
  ) VALUES (
    p_withdrawal_id, p_admin_id, p_attested_balance, recorded_at, false
  )
  ON CONFLICT (withdrawal_id, admin_id) DO UPDATE
  SET attested_balance = EXCLUDED.attested_balance,
      attested_at = EXCLUDED.attested_at,
      used = false;

  RETURN recorded_at;
END;
$$;

CREATE FUNCTION public.approve_withdrawal(
  p_withdrawal_id uuid,
  p_reviewer_id uuid,
  p_attested_balance numeric,
  p_attested_at timestamptz
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  withdrawal_record public.withdrawal_requests%ROWTYPE;
  attestation_record public.withdrawal_attestations%ROWTYPE;
BEGIN
  SELECT * INTO withdrawal_record
  FROM public.withdrawal_requests
  WHERE id = p_withdrawal_id
  FOR UPDATE;

  IF NOT FOUND OR withdrawal_record.status <> 'pending' THEN
    RAISE EXCEPTION 'withdrawal_not_pending';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.client_wallets
    WHERE client_id = withdrawal_record.client_id
      AND tron_address = withdrawal_record.wallet_address
  ) THEN
    RAISE EXCEPTION 'withdrawal_wallet_mismatch';
  END IF;

  SELECT * INTO attestation_record
  FROM public.withdrawal_attestations
  WHERE withdrawal_id = p_withdrawal_id AND admin_id = p_reviewer_id
  FOR UPDATE;

  IF NOT FOUND OR attestation_record.used THEN RAISE EXCEPTION 'attestation_missing_or_used'; END IF;
  IF attestation_record.attested_at < now() - interval '5 minutes'
     OR attestation_record.attested_at > now() + interval '30 seconds' THEN
    RAISE EXCEPTION 'attestation_expired';
  END IF;
  IF attestation_record.attested_balance <> p_attested_balance
     OR attestation_record.attested_at <> p_attested_at THEN
    RAISE EXCEPTION 'attestation_mismatch';
  END IF;
  IF attestation_record.attested_balance < withdrawal_record.amount THEN
    RAISE EXCEPTION 'insufficient_attested_balance';
  END IF;

  UPDATE public.withdrawal_attestations SET used = true
  WHERE id = attestation_record.id;

  UPDATE public.withdrawal_requests
  SET status = 'approved', reviewed_by = p_reviewer_id,
      reviewed_at = now(), updated_at = now()
  WHERE id = p_withdrawal_id;

  INSERT INTO public.financial_events (
    event_type, client_id, actor_id, actor_role, entity_type, entity_id,
    amount, currency, metadata, idempotency_key
  ) VALUES (
    'withdrawal.approved', withdrawal_record.client_id, p_reviewer_id, 'admin',
    'withdrawal_request', p_withdrawal_id, withdrawal_record.amount, 'USDT',
    jsonb_build_object('attestation_id', attestation_record.id),
    'withdrawal:approved:' || p_withdrawal_id::text
  )
  ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL DO NOTHING;

  RETURN true;
END;
$$;

CREATE FUNCTION public.reject_withdrawal(
  p_withdrawal_id uuid,
  p_reviewer_id uuid,
  p_rejection_reason text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  withdrawal_record public.withdrawal_requests%ROWTYPE;
BEGIN
  IF length(btrim(COALESCE(p_rejection_reason, ''))) = 0
     OR length(p_rejection_reason) > 2000 THEN
    RAISE EXCEPTION 'invalid_rejection_reason';
  END IF;

  SELECT * INTO withdrawal_record
  FROM public.withdrawal_requests
  WHERE id = p_withdrawal_id
  FOR UPDATE;

  IF NOT FOUND OR withdrawal_record.status <> 'pending' THEN
    RAISE EXCEPTION 'withdrawal_not_pending';
  END IF;

  UPDATE public.withdrawal_requests
  SET status = 'rejected', rejection_reason = btrim(p_rejection_reason),
      reviewed_by = p_reviewer_id, reviewed_at = now(), updated_at = now()
  WHERE id = p_withdrawal_id;

  INSERT INTO public.financial_events (
    event_type, client_id, actor_id, actor_role, entity_type, entity_id,
    amount, currency, metadata, idempotency_key
  ) VALUES (
    'withdrawal.rejected', withdrawal_record.client_id, p_reviewer_id, 'admin',
    'withdrawal_request', p_withdrawal_id, withdrawal_record.amount, 'USDT',
    jsonb_build_object('reason', btrim(p_rejection_reason)),
    'withdrawal:rejected:' || p_withdrawal_id::text
  )
  ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL DO NOTHING;

  RETURN true;
END;
$$;

DO $$
DECLARE
  function_signature text;
BEGIN
  FOR function_signature IN
    SELECT format('%I.%I(%s)', n.nspname, p.proname,
      pg_get_function_identity_arguments(p.oid))
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY (ARRAY[
        'approve_withdrawal', 'claim_wallet_sweep', 'confirm_wallet_sweep',
        'mark_wallet_sweep_failed', 'mark_wallet_sweep_manual_review',
        'prepare_wallet_sweep', 'record_deposit_detected',
        'record_wallet_sweep_broadcast', 'record_withdrawal_attestation',
        'reject_withdrawal',
        'release_wallet_sweep_lock'
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

COMMIT;
