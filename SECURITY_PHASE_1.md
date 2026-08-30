# Keystone FX security hardening — Phase 1

This branch contains application-level containment changes. It is intentionally
safe for review while the portal is not onboarding clients. It must not be
treated as authorization to enable deposits, withdrawals, wallet creation,
deposit monitoring, or fund sweeping.

## Before merging

1. In Supabase Authentication, set the administrator's protected app metadata
   to include `{"role":"admin"}`. Do not store or trust the administrator role
   in user metadata. The repaired application rejects user-metadata roles.
2. Keep the server-only environment variable
   `FINANCIAL_OPERATIONS_ENABLED=false`. Financial operations now require both
   this deployment flag and the database platform setting to be `true`.
3. Rotate the Supabase service-role key, TRON encryption secret, TronGrid API
   key, cron secret, and any wallet credentials that have appeared in a file,
   message, runbook, screenshot, log, or repository history. Do not commit the
   replacement values.
4. Apply and verify the Phase 2 Supabase migration before enabling the
   deployment flag. That migration must:
   - prevent authenticated clients from selecting `encrypted_private_key`;
   - prevent clients from inserting or updating withdrawal status, reviewer,
     balance, sweep-lock, transaction, and audit fields;
   - permit clients to read only their own safe wallet and transaction data;
   - enforce one pending withdrawal per client at the database level;
   - restrict all service-role bypasses to authenticated, validated server code.
5. Complete the Phase 3 TRON review before handling funds. It must address the
   sweep-lock race, confirmation handling, transaction pagination,
   idempotency, exact decimal arithmetic, and TRX seeding policy.

## Phase 1 behavior changes

- Admin access trusts only Supabase `app_metadata.role`.
- The browser-facing wallet private-key recovery page and API are removed.
- Client wallet queries use an explicit safe-field projection.
- Welcome email requests derive the recipient from the authenticated session
  and never receive or send a password.
- Client withdrawal creation is validated and attributed on the server.
- Financial routes fail closed unless both independent switches are enabled.
- Cron authentication fails closed when `CRON_SECRET` is missing.
- Sensitive mutating admin routes validate request bodies with Zod.
- Baseline browser security headers and Supabase session-cookie refresh are
  enabled.

## Verification completed on this branch

- `npm run lint` — zero errors (two pre-existing warnings).
- `npx tsc --noEmit` — passed.
- `npm run build` — passed with non-production placeholder Supabase values and
  financial operations disabled.
- `npm audit --omit=dev` — zero known production vulnerabilities after the
  dependency upgrades in this branch.

Do not add production credentials to local build commands, pull-request text,
issue comments, or test fixtures.
