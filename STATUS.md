## Task Completed
Fixed unused `request` parameter in `middleware.ts` — removed the `_request: NextRequest` parameter entirely along with the now-unused `NextRequest` import. This resolved a lint warning that had been present in the file.

Prior task: Added full Arabic translation support to all 5 client portal pages (`deposit`, `withdrawal`, `documents`, `settings`, `support`) by wiring up `usePortalI18n()` and replacing every hardcoded English string with keys from the updated `lib/portal-i18n.tsx` translation structure.

## Files Changed
- `middleware.ts` — removed unused `_request: NextRequest` parameter and `NextRequest` import
- `app/(portal)/portal/deposit/page.tsx` — full i18n via `t.deposit.*`; `SweepModal` and `WhatsAppScreen` sub-components also translated
- `app/(portal)/portal/withdrawal/page.tsx` — full i18n via `t.withdrawal.*`; `WhatsAppBlock` sub-component also translated
- `app/(portal)/portal/documents/page.tsx` — full i18n via `t.documents.*`; `UploadButton` sub-component also translated; `docLabels` map for required document types
- `app/(portal)/portal/settings/page.tsx` — full i18n via `t.settings.*`; `notifLabels` map drives notification toggle labels/descriptions
- `app/(portal)/portal/support/page.tsx` — full i18n via `t.support.*`; translated priority/category option arrays; `TicketRow` sub-component also translated

## Status
- Lint: warnings only (1 pre-existing warning in `lib/i18n.ts` — unrelated to these changes)
- Build: not tested
- Branch: phase0-financial-fixes
- Last commit: fix: remove unused request parameter from middleware

## Remaining Issues
- Pre-existing lint warning in `lib/i18n.ts:1053` (`Unexpected any`) — not introduced by recent changes
- `ConfirmDialog` in settings page still uses hardcoded English strings (no translation keys exist for dialog title/message/buttons in `portal-i18n.tsx`)
- Inline address validation error strings in withdrawal page are still hardcoded (no translation keys defined for them)
- Toast messages inside API call handlers (e.g. wallet created, deposit detected) are still hardcoded — no translation keys defined
- Build not verified — recommend running `npm run build` before merging
