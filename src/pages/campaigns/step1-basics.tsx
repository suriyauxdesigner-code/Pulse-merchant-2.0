import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CAMPAIGN_GOALS } from "@/lib/data"
import type { Brand } from "@/lib/types"
import type { CampaignDraft } from "./campaign-draft-types"
import { cn } from "@/lib/utils"

export function Step1Basics({
  draft,
  onUpdate,
  brands,
}: {
  draft: CampaignDraft
  onUpdate: (patch: Partial<CampaignDraft>) => void
  brands: Brand[]
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Campaign Basics</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose the brand and describe what this campaign is about.</p>
      </div>

      <div className="space-y-1.5">
        <Label>Brand</Label>
        <Select value={draft.brandId} onValueChange={(v) => onUpdate({ brandId: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="campaign-name">Campaign Name</Label>
        <Input
          id="campaign-name"
          value={draft.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g. Summer Fashion Fiesta"
        />
      </div>

      <div className="space-y-2.5">
        <Label>Campaign Goal</Label>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {CAMPAIGN_GOALS.map((goal) => {
            const active = draft.goal === goal.value
            return (
              <button
                key={goal.value}
                type="button"
                onClick={() => onUpdate({ goal: goal.value as CampaignDraft["goal"] })}
                className={cn(
                  "rounded-[var(--radius-sm)] border px-4 py-3 text-left transition-colors",
                  active ? "border-primary bg-secondary" : "border-border hover:bg-muted/60"
                )}
              >
                <p className={cn("text-sm font-semibold", active ? "text-secondary-foreground" : "text-foreground")}>
                  {goal.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{goal.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function step1BasicsIsValid(draft: CampaignDraft) {
  return Boolean(draft.brandId && draft.name.trim().length > 1 && draft.goal)
}
