# Security Phase 3: Transaction Integrity

Status: code review only. This phase is on a draft pull request. The database
migration has not been applied and financial operations remain disabled.

## What changed

### Deposit detection

- TronGrid queries request confirmed inbound USDT transfers in pages of 200.
- Pagination follows `meta.fingerprint`, with a 2,000-transfer safety ceiling.
- The scan overlaps its saved checkpoint by 10 minutes, so delayed index results
  are seen again and deduplicated by transaction hash.
- Blockchain integers are parsed as `bigint`. Database monetary values cross the
  API boundary as exact six-decimal strings.
- `record_deposit_detected` locks the wallet, inserts the transaction once, and
  increments both wallet balances in one database transaction.
- A failed or incomplete scan does not advance the checkpoint.

### Wallet sweeps

- An atomic database RPC acquires the wallet lock and creates or resumes one
  active sweep operation.
- The operation reserves specific detected deposits before sending funds.
- The transfer amount is the lesser of the confirmed on-chain balance and the
  recorded ledger balance. It is sent as an atomic-unit string.
- A broadcast is not treated as success. The application waits for a solidified
  execution receipt and a matching confirmed USDT `Transfer` event containing
  the expected token contract, sender, destination, and amount.
- A timeout or uncertain send moves the operation to `manual_review`. A later
  attempt checks the original transaction ID; it does not create a replacement.
- Ledger balances and deposit statuses change only after confirmed settlement.
- Automatic TRX seeding and automatic TRX draining were removed. Resource
  provisioning must be a separately reviewed operational process.

### Withdrawal review

- Approval, attestation consumption, and audit-event creation now occur inside
  one row-locked database transaction.
- The RPC checks that the withdrawal is pending, its destination is the client's
  registered wallet, the attestation is current and unused, and attested free
  margin covers the exact withdrawal amount.
- Approval and rejection audit events have unique idempotency keys.

## Migration contents

`supabase/migrations/20260831130000_phase_3_transaction_integrity.sql` adds:

- unique idempotency and attestation indexes;
- `wallet_sweep_operations` and its reserved-deposit join table;
- service-role-only, security-definer transaction RPCs;
- row locking, exact arithmetic, state-transition checks, and financial events;
- RLS and forced RLS on the new operational tables.

The migration deliberately removes legacy overloads for the replaced RPC names
so PostgREST cannot accidentally resolve an old financial function.

## Required rollout order

1. Keep `FINANCIAL_OPERATIONS_ENABLED=false` and the database financial-services
   setting disabled.
2. Take and verify a restorable Supabase backup.
3. Reconcile any duplicate financial idempotency keys or withdrawal attestations.
4. Apply the Phase 2 migration in staging, then the Phase 3 migration.
5. Run deposit, duplicate-deposit, concurrent-monitor, concurrent-sweep,
   confirmation-timeout, failed-receipt, event-mismatch, and attestation tests.
6. Deploy the matching application commit to staging.
7. Reconcile staging ledger values against solidified on-chain balances.
8. Obtain an independent security review before enabling either financial switch.

Do not deploy this application code without its Phase 3 migration: the code
expects the new RPC signatures and sweep-operation tables.

## Remaining launch blockers

- Private keys are still decrypted in application memory. Before client funds
  are accepted, signing should move to an HSM, managed custody provider, or an
  isolated signer with audited authorization and withdrawal limits.
- The current withdrawal flow approves a request but does not implement a
  complete on-chain payout state machine. `approved` must not be represented as
  `paid` until a separately idempotent payout transaction is solidified and
  reconciled.
- Production custody monitoring should add independent reconciliation from
  solidified blocks or a second provider, alerting, and a manual recovery queue.
- TRX Energy/Bandwidth provisioning needs a reviewed policy with per-wallet and
  daily limits. This phase intentionally sends no automatic master-wallet funds.
- Database constraints created as `NOT VALID` in Phase 2 still require legacy-row
  cleanup and explicit validation.

## Safe rollback

Keep financial operations disabled. Roll back the application first. Preserve
the sweep-operation tables and financial events for incident evidence; do not
drop or rewrite them during an active or unresolved broadcast. Database rollback
should be performed from the verified backup or a separately reviewed migration.
