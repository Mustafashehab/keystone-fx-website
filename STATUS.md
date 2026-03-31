## Task Completed
Added full Arabic translation support to `kyc/page.tsx`. The page was not using `usePortalI18n()` at all — all strings were hardcoded English. Updated to:
- Import and call `usePortalI18n()`
- Replace all hardcoded UI strings with `t.kyc.*` keys (title, subtitle, section tabs, all field labels, placeholders, button text, alert messages)
- Move all translatable option arrays (employment, income, funds, experience, investment objectives) inside the component so they render from `t.kyc.employment.*`, `t.kyc.income.*`, etc.
- Keep `COUNTRIES` at module level (country names are not translated)
- Section navigation now uses `t.kyc.sections` array instead of the hardcoded `SECTIONS` constant

## Files Changed
- `app/(portal)/portal/kyc/page.tsx` — full i18n via `t.kyc.*`; all translated option arrays defined inside component

## Status
- Lint: warnings only (1 pre-existing warning in `lib/i18n.ts` — unrelated)
- Build: not tested
- Branch: phase0-financial-fixes
- Last commit: feat: add Arabic translation support to KYC page

## Remaining Issues
- Pre-existing lint warning in `lib/i18n.ts:1053` (`Unexpected any`) — not introduced by these changes
- Toast messages inside API call handlers in KYC page (e.g. "KYC submitted", "Submission failed") are still hardcoded — no translation keys defined for them
- Build not verified — recommend running `npm run build` before merging
