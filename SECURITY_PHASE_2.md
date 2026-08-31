# Keystone FX security hardening — Phase 2

Phase 2 is prepared for review but is **not applied to Supabase** by this branch.
Keep `FINANCIAL_OPERATIONS_ENABLED=false` throughout review, staging, migration,
and smoke testing.

## What this phase changes

- Replaces permissive legacy RLS policies with a least-privilege policy set.
- Uses column-level grants so authenticated browsers cannot select
  `client_wallets.encrypted_private_key` or modify balances, sweep locks,
  transaction state, reviewer fields, or financial audit data.
- Moves KYC and account-application writes to authenticated server endpoints.
- Moves document deletion to a server endpoint and permits deletion only while
  a document is pending.
- Makes the `client-documents` bucket private, limits files to 10 MB, and allows
  only PDF, JPEG, and PNG uploads under the authenticated client's folder.
- Restricts financial state-changing RPCs to the Supabase service role.
- Enforces one profile, wallet, KYC submission, and account application per
  client; one pending withdrawal per client; and one record per deposit hash.
- Adds forward-enforced checks for positive amounts, nonnegative balances, and
  valid TRON withdrawal-address format.

## Required preparation

1. Confirm every authorized admin has protected Supabase app metadata containing
   `{"role":"admin"}`. Editable user metadata is intentionally ignored.
2. Take a current database backup and confirm point-in-time recovery.
3. Confirm the `client-documents` bucket exists. If other storage buckets exist,
   review their policies separately; the migration stops instead of changing
   unknown bucket access.
4. Review duplicate-data preflight queries below. The migration will abort if
   it finds ambiguous financial or compliance records; it never deletes them.
5. Apply first to a staging Supabase project with production-like schema.

## Migration file

`supabase/migrations/20260831120000_phase_2_rls_hardening.sql`

The migration runs in one transaction. A failed preflight, lock timeout, or SQL
error rolls the migration back. Do not use the blocked legacy
`scripts/enable-rls.sql` file.

## Preflight queries

```sql
select user_id, count(*) from public.client_profiles group by user_id having count(*) > 1;
select client_id, count(*) from public.client_wallets group by client_id having count(*) > 1;
select tron_address, count(*) from public.client_wallets group by tron_address having count(*) > 1;
select client_id, count(*) from public.kyc_submissions group by client_id having count(*) > 1;
select client_id, count(*) from public.account_applications group by client_id having count(*) > 1;
select client_id, count(*) from public.withdrawal_requests where status = 'pending' group by client_id having count(*) > 1;
select tx_hash, count(*) from public.deposit_transactions where tx_hash is not null group by tx_hash having count(*) > 1;
```

Every query must return zero rows. Investigate discrepancies manually; do not
delete or merge financial records merely to make the migration pass.

## Staging smoke tests

- An anonymous session cannot read any application table.
- Client A cannot read Client B's profile, documents, tickets, notifications,
  wallet, deposits, withdrawals, KYC, or application.
- A client wallet query requesting `encrypted_private_key` is denied.
- A client cannot insert a wallet or withdrawal or update a balance/status.
- Client KYC and account applications succeed only through their new APIs.
- A client can upload an accepted document only below their own folder and can
  delete it only while its database status is `pending`.
- Clients can create tickets/replies but cannot spoof admin replies or reply to
  closed tickets.
- A protected admin can use leads, internal notes, admin notifications, and
  signed document links.
- Server routes using the service role continue to operate while the financial
  kill switch remains off.

## After application

Review `pg_policies`, `information_schema.role_table_grants`, and
`information_schema.column_privileges`. Validate the `NOT VALID` financial
constraints only after any historical exceptions have been reviewed. Do not
enable deposits, withdrawals, monitoring, or sweeping until Phase 3 is complete.
