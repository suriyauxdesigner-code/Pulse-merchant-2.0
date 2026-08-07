import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/shared/file-upload"
import type { CampaignDraft } from "./campaign-draft-types"

export function Step4Assets({
  draft,
  onUpdate,
}: {
  draft: CampaignDraft
  onUpdate: (patch: Partial<CampaignDraft>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Campaign Assets</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add the visuals shoppers will see when this offer appears in the app — all optional, you can launch without them.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Logo</Label>
          <p className="text-xs text-muted-foreground">Upload a different logo just for this campaign, if needed.</p>
          <FileUpload value={draft.logoUrl} onChange={(v) => onUpdate({ logoUrl: v })} hint="PNG, transparent background" />
        </div>

        <div className="space-y-2">
          <Label>Campaign Banner</Label>
          <FileUpload value={draft.bannerUrl} onChange={(v) => onUpdate({ bannerUrl: v })} aspect="wide" hint="Recommended 1200×600px, PNG or JPG" />
        </div>
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
  )
}

export function step4AssetsIsValid() {
  return true
}
