import type { ReactNode } from "react"
import { Info, Wallet } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { BudgetSlider } from "@/components/shared/budget-slider"
import { DURATION_OPTIONS } from "@/lib/data"
import type { Brand } from "@/lib/types"
import { computeEndDate, type CampaignDraft } from "./campaign-draft-types"
import { cn } from "@/lib/utils"

const HOLD_PERIOD_OPTIONS = [7, 14, 21, 30]

function FieldHint({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
      <Info className="mt-0.5 size-3 shrink-0" />
      {children}
    </p>
  )
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

export function Step2Budget({
  draft,
  onUpdate,
  brand,
}: {
  draft: CampaignDraft
  onUpdate: (patch: Partial<CampaignDraft>) => void
  brand: Brand | undefined
}) {
  const endDate = computeEndDate(draft.startDate, draft.durationDays)
  const suggestedBudget = brand?.profile.monthlyMarketingBudget

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Campaign Budget</h2>
        <p className="mt-1 text-sm text-muted-foreground">Set a budget, decide how it's spent, and configure the cashback shoppers will earn.</p>
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-muted/40 p-6">
        <p className="mb-1 text-center text-sm font-medium text-muted-foreground">Total Budget</p>
        <p className="mb-6 text-center text-4xl font-bold text-foreground">AED {draft.budget.toLocaleString()}</p>
        <BudgetSlider value={draft.budget} onChange={(v) => onUpdate({ budget: v })} />
        {suggestedBudget && (
          <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Wallet className="mt-0.5 size-3 shrink-0" />
            Based on the AED {suggestedBudget.toLocaleString()} typical monthly marketing budget you told us about for {brand?.name}. Feel free to adjust it.
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="cashback-percent">Cashback Percentage</Label>
          <div className="relative">
            <Input
              id="cashback-percent"
              type="number"
              min={1}
              max={30}
              className="pr-9"
              value={draft.cashbackPercent}
              onChange={(e) => onUpdate({ cashbackPercent: Number(e.target.value) || 0 })}
              placeholder="10"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
          </div>
          <FieldHint>The percentage of each purchase a shopper gets back as cashback. Higher rates attract more attention from bank partners.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cap">Cashback Cap</Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">AED</span>
            <Input
              id="cap"
              type="number"
              className="pl-12"
              value={draft.cashbackCap ?? ""}
              onChange={(e) => onUpdate({ cashbackCap: Number(e.target.value) || null })}
              placeholder="200"
            />
          </div>
          <FieldHint>The maximum cashback amount a single customer can earn per transaction.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-spend">Minimum Spend (optional)</Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">AED</span>
            <Input
              id="min-spend"
              type="number"
              className="pl-12"
              value={draft.minSpend ?? ""}
              onChange={(e) => onUpdate({ minSpend: e.target.value ? Number(e.target.value) : null })}
              placeholder="No minimum"
            />
          </div>
          <FieldHint>Customers must spend at least this amount for a purchase to qualify for cashback.</FieldHint>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>How should the budget be utilized?</Label>
        <RadioGroup
          value={draft.budgetUtilization}
          onValueChange={(v) => onUpdate({ budgetUtilization: v as CampaignDraft["budgetUtilization"], durationDays: v === "duration" ? draft.durationDays ?? 30 : null })}
          className="grid gap-3 sm:grid-cols-2"
        >
          {[
            { value: "exhaust", label: "Run until budget is exhausted", desc: "Campaign stays live until the full budget is used." },
            { value: "duration", label: "Fixed campaign duration", desc: "Campaign runs for a set number of days." },
          ].map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-[var(--radius-sm)] border px-4 py-3.5 text-sm transition-colors",
                draft.budgetUtilization === opt.value ? "border-primary bg-secondary" : "border-border hover:bg-muted/60"
              )}
            >
              <span className="flex items-center gap-2.5 font-semibold text-foreground">
                <RadioGroupItem value={opt.value} />
                {opt.label}
              </span>
              <span className="pl-7 text-xs text-muted-foreground">{opt.desc}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {draft.budgetUtilization === "duration" && (
        <div className="space-y-2.5 animate-fade-in-up">
          <Label>Campaign Duration</Label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate({ durationDays: opt.value })}
                className={cn(
                  "rounded-[var(--radius-sm)] border px-3 py-2.5 text-sm font-medium transition-colors",
                  draft.durationDays === opt.value ? "border-primary bg-secondary text-secondary-foreground" : "border-border hover:bg-muted/60"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="start-date">Start Date</Label>
          <Input id="start-date" type="date" value={draft.startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} />
        </div>
        {draft.budgetUtilization === "duration" ? (
          <div className="space-y-1.5">
            <Label>End Date</Label>
            <div className="flex h-10 items-center rounded-[var(--radius-sm)] border border-dashed border-border bg-muted/40 px-3.5 text-sm text-muted-foreground">
              {formatDate(endDate)}
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label>End Date</Label>
            <div className="flex h-10 items-center rounded-[var(--radius-sm)] border border-dashed border-border bg-muted/40 px-3.5 text-sm text-muted-foreground">
              Until budget is exhausted
            </div>
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="hold">Hold Period</Label>
          <Select value={String(draft.holdPeriodDays)} onValueChange={(v) => onUpdate({ holdPeriodDays: Number(v) })}>
            <SelectTrigger id="hold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOLD_PERIOD_OPTIONS.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <FieldHint>Hold period is the time before cashback is settled — protects against returns, cancellations and fraud.</FieldHint>
    </div>
  )
}

export function step2BudgetIsValid(draft: CampaignDraft) {
  if (draft.budget <= 0 || !draft.startDate) return false
  if (draft.budgetUtilization === "duration" && !draft.durationDays) return false
  return draft.cashbackPercent > 0 && Boolean(draft.cashbackCap) && Boolean(draft.holdPeriodDays)
}
