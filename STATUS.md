## Project: Keystone FX
## Date: 2026-04-02
## Branch: VER1
## Last Commit: 42d1ebc — feat: VER1 complete - institutional hero, MT5 integration, Arabic i18n, RLS security

### Stack
Next.js 16.1.6, TypeScript, Tailwind CSS, Supabase, TRON/TRC-20, Resend, Vercel

### What's Working (VER1 branch)

#### Public Website
- Homepage with institutional hero section (canvas execution flow animation)
- MT5 download section on homepage (Windows, Mac, iOS, Android, Web Terminal)
- Platforms page with futuristic data animations (Bloomberg-style canvas, candlestick charts, price lines)
- Accounts page with all CTA buttons linked to /portal/login
- Products, About, Contact, Execution pages
- ProMarkets Ltd partnership sections (homepage + about)
- Animated infrastructure flow visual on about page
- Multi-language support (EN/AR/ZH) on public pages
- Root redirect: `/` → `/en`

#### Client Portal
- Registration flow: sign up → auto sign-in → welcome email → redirect to dashboard (no email confirmation)
- Welcome email via Resend (info@keystone-fx.com) with credentials
- Dashboard with full Arabic i18n (server component + client DashboardContent wrapper)
- KYC optional — deposit, withdrawal, account application all accessible without KYC approval
- Deposit page: TRON/USDT wallet creation, QR code, balance, transaction history
- Withdrawal page: TRC-20 address validation, MT5 account, WhatsApp notification
- Documents, KYC, Support tickets, Settings — all with EN/AR translations
- MT5 Terminal link in portal sidebar (opens trade.mql5.com in new tab)
- WhatsApp floating button with RTL support
- Financial services maintenance toggle with WhatsApp fallback
- Notification bell with real-time updates
- Password reveal toggle on login pages
- Mobile responsive sidebars

#### Admin Panel
- Dashboard, client management, withdrawals management
- KYC approval/rejection notifications
- Ticket thread system
- Wallet recovery tools
- Platform settings management

#### Infrastructure
- TRON wallet system: creation, deposit detection, USDT/TRX sweep, TRX auto-seed
- Deposit monitor cron job
- RLS security script ready (scripts/enable-rls.sql) — 15 tables covered

### Build & Lint Status
```
Build: PASS — 45/45 pages compiled (9.2s Turbopack)
Lint:  0 errors, 2 warnings
  - components/HeroSection.tsx:265 — padY unused (in provided code, not modified)
  - lib/i18n.ts:1053 — Unexpected any (pre-existing)
```

### What's Pending

1. **Welcome email not sending in production** — `RESEND_API_KEY` must be added to Vercel environment variables. It's set in `.env.local` for local dev but Vercel needs it separately.

2. **RLS not yet applied** — `scripts/enable-rls.sql` is generated and committed but needs to be run manually in Supabase SQL Editor. This enables Row-Level Security on all 15 public tables.

3. **First login onboarding form** — VER1 planned feature #4 (collect name, last name, DOB on first login) not yet implemented.

4. **Supabase email confirmation disabled** — For the auto-sign-in registration flow to work, email confirmation must be disabled in Supabase Auth settings (Authentication → Email → Confirm email = OFF).

### Known Issues

- VS Code TypeScript IntelliSense may show errors in some files — these are NOT real build errors. `npm run build` passes clean with 0 TypeScript errors.
- Toast messages in KYC API call handlers are hardcoded English (no translation keys)
- ConfirmDialog in settings page has hardcoded title/message/buttons (no translation keys)
- `middleware.ts` uses deprecated convention — Next.js 16 recommends migrating to `proxy`
- `ExecutionMetrics.tsx` component exists but is no longer imported (orphaned file)

### Environment Variables Needed
- `RESEND_API_KEY` — for sending welcome emails via Resend (**MUST be added to Vercel**)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (already set)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key (already set)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (already set)
- `TRON_MASTER_ADDRESS` / `TRON_MASTER_PRIVATE_KEY` — TRON wallet (already set)
- `TRON_GRID_API_KEY` — TronGrid API access (already set)
- `TRON_ENCRYPTION_SECRET` — Wallet encryption (already set)
- `CRON_SECRET` — Cron job authentication (already set)

### Next Steps
1. Add `RESEND_API_KEY` to Vercel environment variables
2. Disable email confirmation in Supabase Auth settings
3. Run `scripts/enable-rls.sql` in Supabase SQL Editor
4. Test full registration → welcome email → dashboard flow on production
5. Implement first-login onboarding form (VER1 feature #4)
6. Merge VER1 → main when ready
