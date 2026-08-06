# Lune Merchant Portal — Redesign Prototype

Interactive prototype for the redesigned merchant portal: brand onboarding
(one-time) fully separated from campaign creation (repeatable), built as a
real React app rather than static mockups.

## Stack

- **React 19 + TypeScript + Vite**
- **React Router** (client-side routing, `BrowserRouter`)
- **Tailwind CSS v4** with CSS-variable design tokens in `src/index.css`
- **Radix UI primitives**, hand-styled to match the existing Lune visual
  language (not the default shadcn theme) — see `src/components/ui/`
- **Zustand**, persisted to `localStorage`, as the data layer (`src/lib/store.ts`)
- **Plus Jakarta Sans** via `@fontsource`

There is no backend. All data (brands, campaigns, banks) is seeded in
`src/lib/data.ts` and mutated through the Zustand store, so the whole flow —
onboarding, campaign creation, status progression — works end-to-end in the
browser and survives a refresh.

## Run it

```bash
npm install
npm run dev
```

`npm run build` produces a production build; `npx tsc -b --noEmit` type-checks.

## Structure

```
src/
  components/
    ui/        Radix-based primitives (button, card, dialog, select, ...)
    shared/     Cross-feature building blocks (status badge, empty state,
                file upload, budget slider, mobile card preview, ...)
    layout/     Sidebar + app shell
  lib/
    types.ts    Domain model (Brand, Campaign, Bank, ...)
    data.ts     Seed data + static option lists
    store.ts    Zustand stores (auth + app data)
  pages/
    login.tsx
    dashboard.tsx       Overview: stats, brand list, and the full campaigns
                        table (tabs/filters/pagination) — there's no separate
                        "campaign requests" page, everything lives here
    brands/             Brand Management (list, detail/edit)
    onboarding/         3-step Brand Onboarding wizard
    campaigns/          4-step Campaign wizard (Basics, Budget & Settings,
                        Assets, Review) + campaign details/status page
    invoices.tsx, settings.tsx
```

## Notes for engineering

- **Onboarding vs. campaign creation are separate flows**, per the product
  decision: `/onboarding` runs once per brand; `/campaigns/new` runs every
  time a merchant launches an offer.
- **No separate "campaign requests" screen.** Every campaign a merchant has
  ever submitted — regardless of status — shows up directly on the Overview
  page (`src/components/shared/campaigns-explorer.tsx`, embedded in
  `dashboard.tsx`), with the same tabs/filters/pagination a dedicated page
  would have had.
- **Merchant Setup is a free-text Merchant ID plus a dynamic list of
  Terminal IDs**, each tagged with a channel (in-store vs. online) — see
  `src/components/shared/merchant-setup-fields.tsx`, shared between brand
  onboarding (step 3) and Brand Management's edit mode. There is no
  picklist of pre-existing merchant accounts; the merchant types their own
  IDs in.
- **Campaign budget is prefilled from the brand's stated monthly marketing
  budget** (collected during onboarding), snapped to the nearest slider
  step (`nearestBudgetStep` in `src/lib/data.ts`). It's always editable —
  the hint text under the slider explains where the default came from.
- **Budget, utilization, dates, and cashback settings are one step**
  (`step2-budget.tsx`) — they were split across two screens originally but
  are grouped together since they're all budget-adjacent decisions. Start
  Date is always collected; End Date is either computed from Start Date +
  duration, or shown as "until budget is exhausted".
- **No bank is chosen during campaign creation.** A campaign is submitted
  with `bankId: null`; a bank partner is assigned when the (simulated)
  status advances to "Bank Approved". This mirrors the decision to hide
  bank-matching/recommendation logic from the merchant.
- **Primary brand color lives on the Brand, not the Campaign.** It's picked
  once during onboarding (or edited later in Brand Management) and every
  campaign for that brand inherits it automatically — there's no per-campaign
  color picker in the Assets step.
- **Two mobile preview components**: `mobile-offer-card.tsx` is the small
  card used while uploading assets (quick visual check), and
  `mobile-offer-detail-preview.tsx` is the full "what a shopper actually
  sees" screen — banner, description, How it Works, Terms & Conditions —
  used on the Review step and on the campaign's detail/status page.
- **Campaign status** is intentionally a flat progression — Submitted →
  Processing → Bank Approved → Live (→ Completed) — with no review loop.
  The "Advance to next stage" control on a campaign's detail page is a
  demo-only affordance to preview every stage; it has no backend equivalent.
- **Settings → Demo Data** lets you clear all brands/campaigns to see the
  empty-dashboard state, or restore the seeded sample data.
- Colors, radii, shadows and spacing are defined once as CSS variables in
  `src/index.css` and consumed as Tailwind tokens (`bg-primary`,
  `rounded-[var(--radius)]`, `shadow-card`, etc.) — change them there to
  retheme the whole app.
