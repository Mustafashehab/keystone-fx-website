## Project: Keystone FX
## Date: 2026-04-01
## Branch: phase0-financial-fixes

### Stack
Next.js 16.1.6, TypeScript, Tailwind CSS, Supabase, TRON/TRC-20, Vercel

### What's Live (main branch)
- Public website with multi-language support (EN/AR) — homepage, about, products, accounts, contact
- Client portal — login, registration, dashboard, KYC, documents, deposit (TRON/USDT), withdrawal, support tickets, settings
- Admin panel — dashboard, client management, withdrawals management, ticket thread
- TRON wallet system — wallet creation, deposit detection, USDT/TRX sweep, TRX auto-seed on first deposit
- Deposit monitor cron job
- Notification bell with real-time updates (client + admin)
- KYC approval/rejection and new client registration notifications
- Withdrawal submission with WhatsApp notification
- Financial services maintenance toggle with WhatsApp fallback
- Password reveal toggle on login pages
- Mobile responsive layouts and sidebars
- WhatsApp floating button
- ProMarkets Ltd strategic collaboration sections (homepage + about)
- Animated infrastructure flow visual on about page

### What's on phase0-financial-fixes (not yet merged)
- **Arabic i18n for all portal pages** — deposit, withdrawal, documents, settings, support, KYC pages all use `usePortalI18n()` with full EN/AR translations
- **Expanded portal-i18n** — `lib/portal-i18n.tsx` updated with complete translation keys for all portal sections
- **KYC required field indicators** — red stars on personal info fields
- **Arabic/English language toggle** in client portal with RTL support
- **Middleware cleanup** — removed unused `request` parameter
- **ESLint cleanup** — resolved all errors, down to 1 pre-existing warning
- **Portal-i18n fixes** — useState initializer, useCallback, module-level particles
- **Infrastructure alliance section** — animated flow visual on about page
- **ProMarkets Ltd sections** — strategic collaboration on homepage and about
- **Root redirect** — `/` redirects to `/en` instead of `/portal/login`
- **Type cleanup** — removed incorrect type casts, unused imports, Footer lang prop

### Files Recently Modified
```
git diff --name-only main..phase0-financial-fixes
```
- STATUS.md
- app/(admin)/admin/dashboard/page.tsx
- app/(admin)/admin/withdrawals/page.tsx
- app/(auth)/portal/register/page.tsx
- app/(portal)/layout.tsx
- app/(portal)/portal/deposit/page.tsx
- app/(portal)/portal/documents/page.tsx
- app/(portal)/portal/kyc/page.tsx
- app/(portal)/portal/settings/page.tsx
- app/(portal)/portal/support/[id]/page.tsx
- app/(portal)/portal/support/page.tsx
- app/(portal)/portal/withdrawal/page.tsx
- app/[lang]/about/page.tsx
- app/[lang]/accounts/page.tsx
- app/[lang]/contact/page.tsx
- app/[lang]/layout.tsx
- app/[lang]/page.tsx
- app/[lang]/products/page.tsx
- app/api/cron/deposit-monitor/route.ts
- app/api/tron/check-deposits/route.ts
- app/api/tron/create-wallet/route.ts
- app/page.tsx
- components/ExecutionMetrics.tsx
- components/Footer.tsx
- components/WhatsAppButton.tsx
- components/admin/AdminTicketThread.tsx
- components/layout/AdminHeader.tsx
- components/layout/PortalHeader.tsx
- components/layout/PortalSidebar.tsx
- components/layout/PortalWhatsAppButton.tsx
- components/partnership/AboutAllianceBlock.tsx
- components/partnership/InfrastructureAllianceSection.tsx
- components/partnership/PartnershipHeroStrip.tsx
- components/ui/FormFields.tsx
- components/ui/NotificationBell.tsx
- components/visuals/InfrastructureFlow.tsx
- eslint.config.mjs
- lib/dal/documents.ts
- lib/portal-i18n.tsx
- lib/tron/sweep.ts
- lib/tron/wallet.ts
- middleware.ts
- next.config.ts

### Current Lint Status
```
> keystone-fx@0.1.0 lint
> eslint

C:\Users\user\Desktop\KEYSTONE-FX WEB\keystone-fx-website\lib\i18n.ts
  1053:12  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

✖ 1 problem (0 errors, 1 warning)
```

### Known Issues
- Pre-existing lint warning in `lib/i18n.ts:1053` (`Unexpected any`) — not introduced by recent changes
- Toast messages inside KYC API call handlers (e.g. "KYC submitted", "Submission failed") are still hardcoded English — no translation keys defined
- ConfirmDialog in settings page has hardcoded title/message/buttons — no translation keys
- Build not verified on this branch — recommend running `npm run build` before merging

### Pending Tasks
- VER1 planned features (to be implemented):
  1. Remove email confirmation on registration
  2. Welcome email with credentials sent from info@keystone-fx.com
  3. KYC optional (not blocking deposit/withdrawal)
  4. First login onboarding form (collect name, last name, DOB)

### Environment Variables Needed
- `RESEND_API_KEY` — for sending welcome emails via Resend (required for VER1 feature #2)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (already set)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key (already set)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key for server-side operations (already set)
- `TRON_MASTER_ADDRESS` — Master TRON wallet address for sweep operations (already set)
- `TRON_MASTER_PRIVATE_KEY` — Master TRON wallet private key (already set)
- `CRON_SECRET` — Secret for authenticating cron job requests (already set)
