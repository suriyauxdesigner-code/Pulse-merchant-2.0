import { LogoTile } from "@/components/shared/logo-tile"
import { MobileOfferDetailPreview } from "@/components/shared/mobile-offer-detail-preview"
import { CAMPAIGN_GOALS, DURATION_OPTIONS } from "@/lib/data"
import type { Brand } from "@/lib/types"
import { computeEndDate, type CampaignDraft } from "./campaign-draft-types"

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function Review({ draft, brand }: { draft: CampaignDraft; brand: Brand | undefined }) {
  const goalLabel = CAMPAIGN_GOALS.find((g) => g.value === draft.goal)?.label || "—"
  const endDate = computeEndDate(draft.startDate, draft.durationDays)
  const durationLabel =
    draft.budgetUtilization === "exhaust"
      ? "Until budget is exhausted"
      : DURATION_OPTIONS.find((d) => d.value === draft.durationDays)?.label || "—"
  const validityLabel =
    draft.budgetUtilization === "exhaust"
      ? `from ${formatDate(draft.startDate)} while budget lasts`
      : `${formatDate(draft.startDate)} – ${formatDate(endDate)}`

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Review Campaign</h2>
          <p className="mt-1 text-sm text-muted-foreground">Check the details below before submitting. Your campaign will be reviewed and matched with a bank partner.</p>
        </div>

        <div className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border p-4">
          <LogoTile name={brand?.name || "?"} color={brand?.logoColor || "#111827"} imageUrl={brand?.logoUrl} size="lg" />
          <div>
            <p className="font-semibold text-foreground">{draft.name}</p>
            <p className="text-sm text-muted-foreground">{brand?.name}</p>
          </div>
        </div>

        <div className="divide-y divide-border rounded-[var(--radius-sm)] border border-border px-4">
          <Row label="Campaign Goal" value={goalLabel} />
          <Row label="Total Budget" value={`AED ${draft.budget.toLocaleString()}`} />
          <Row label="Budget Utilization" value={durationLabel} />
          <Row label="Start Date" value={formatDate(draft.startDate)} />
          <Row label="End Date" value={draft.budgetUtilization === "exhaust" ? "Until budget is exhausted" : formatDate(endDate)} />
        </div>

        <div className="divide-y divide-border rounded-[var(--radius-sm)] border border-border px-4">
          <Row label="Cashback Percentage" value={`${draft.cashbackPercent}%`} />
          <Row label="Cashback Cap" value={draft.cashbackCap ? `AED ${draft.cashbackCap.toLocaleString()}` : "—"} />
          <Row label="Hold Period" value={`${draft.holdPeriodDays} days`} />
          <Row label="Minimum Spend" value={draft.minSpend ? `AED ${draft.minSpend.toLocaleString()}` : "No minimum"} />
        </div>

        {draft.description && (
          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">Description</p>
            <p className="text-sm text-muted-foreground">{draft.description}</p>
          </div>
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">What shoppers will see</p>
        <div className="rounded-[var(--radius)] border border-dashed border-border bg-muted/30 p-5">
          <MobileOfferDetailPreview
            campaignName={draft.name}
            brandName={brand?.name || "Your Brand"}
            logoUrl={draft.logoUrl ?? brand?.logoUrl ?? null}
            bannerUrl={draft.bannerUrl}
            primaryColor={brand?.logoColor || "#0E3B2E"}
            cashbackPercent={draft.cashbackPercent}
            description={draft.description}
            cashbackCap={draft.cashbackCap}
            minSpend={draft.minSpend}
            holdPeriodDays={draft.holdPeriodDays}
            validityLabel={validityLabel}
          />
        </div>
      </div>
    </div>
  )
}
