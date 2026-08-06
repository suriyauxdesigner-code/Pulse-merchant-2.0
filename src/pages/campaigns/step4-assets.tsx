import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/shared/file-upload"
import { MobileOfferCard } from "@/components/shared/mobile-offer-card"
import type { Brand } from "@/lib/types"
import type { CampaignDraft } from "./campaign-draft-types"

export function Step4Assets({
  draft,
  onUpdate,
  brand,
}: {
  draft: CampaignDraft
  onUpdate: (patch: Partial<CampaignDraft>) => void
  brand: Brand | undefined
}) {
  const effectiveLogo = draft.logoUrl ?? brand?.logoUrl ?? null

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Campaign Assets</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add the visuals shoppers will see when this offer appears in the app.</p>
        </div>

        <div className="space-y-2">
          <Label>Campaign Banner</Label>
          <FileUpload value={draft.bannerUrl} onChange={(v) => onUpdate({ bannerUrl: v })} aspect="wide" hint="Recommended 1200×600px, PNG or JPG" />
        </div>

        <div className="space-y-2">
          <Label>Logo</Label>
          <p className="text-xs text-muted-foreground">Defaults to {brand?.name || "the brand"}'s logo from onboarding — upload a different one just for this campaign if needed.</p>
          <FileUpload value={effectiveLogo} onChange={(v) => onUpdate({ logoUrl: v })} hint="PNG, transparent background" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={draft.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe the offer for shoppers, e.g. what qualifies and any exclusions."
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">Mobile Card Preview</p>
        <div className="rounded-[var(--radius)] border border-dashed border-border bg-muted/30 p-5">
          <MobileOfferCard
            brandName={brand?.name || "Your Brand"}
            logoUrl={effectiveLogo}
            bannerUrl={draft.bannerUrl}
            primaryColor={brand?.logoColor || "#0E3B2E"}
            cashbackPercent={draft.cashbackPercent}
          />
        </div>
      </div>
    </div>
  )
}

export function step4AssetsIsValid(draft: CampaignDraft) {
  return draft.description.trim().length > 0
}
