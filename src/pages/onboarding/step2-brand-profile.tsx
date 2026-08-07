import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { CheckboxList } from "@/components/shared/checkbox-list"
import { TagSearchInput } from "@/components/shared/tag-search-input"
import { OptionalTagPicker } from "@/components/shared/optional-tag-picker"
import { CATEGORY_OPTIONS, KNOWN_BRANDS, SHOP_CHANNEL_OPTIONS } from "@/lib/data"
import type { Brand, BrandProfile } from "@/lib/types"

export function Step2BrandProfile({
  draft,
  onUpdate,
}: {
  draft: Partial<Brand>
  onUpdate: (patch: Partial<Brand>) => void
}) {
  const profile: BrandProfile = draft.profile || {
    shopChannels: [],
    competitors: [],
    categories: [],
    avgOrderValue: null,
    avgMonthlyOrders: null,
    monthlyMarketingBudget: null,
  }

  const patchProfile = (p: Partial<BrandProfile>) => onUpdate({ profile: { ...profile, ...p } })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Brand Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Help us understand your customers and business so we can match you with the right bank offers.</p>
      </div>

      <div className="space-y-2.5">
        <Label>
          Where do your ideal customers shop? <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <p className="-mt-1.5 text-xs text-muted-foreground">
          A suggestion to help us match you with the right bank offers — skip it if you're not sure.
        </p>
        <CheckboxList
          options={SHOP_CHANNEL_OPTIONS}
          selected={profile.shopChannels}
          onChange={(v) => patchProfile({ shopChannels: v })}
        />
      </div>

      <div className="space-y-2.5">
        <Label>Competitor brands</Label>
        <p className="text-xs text-muted-foreground -mt-1.5">Search for brands you compete with, or add your own.</p>
        <TagSearchInput
          suggestions={KNOWN_BRANDS}
          selected={profile.competitors}
          onChange={(v) => patchProfile({ competitors: v })}
          placeholder="Search competitor brands..."
        />
      </div>

      <OptionalTagPicker
        label="Additional categories"
        description="Optional — turn this on to tag other categories your brand operates in."
        suggestions={CATEGORY_OPTIONS}
        selected={profile.categories}
        onChange={(v) => patchProfile({ categories: v })}
        placeholder="Search categories..."
        suggestionsLabel="Popular categories — click to add"
      />

      <Separator />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="aov">Average Order Value</Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">AED</span>
            <Input
              id="aov"
              type="number"
              className="pl-12"
              value={profile.avgOrderValue ?? ""}
              onChange={(e) => patchProfile({ avgOrderValue: Number(e.target.value) || null })}
              placeholder="250"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="orders">Average Monthly Orders</Label>
          <Input
            id="orders"
            type="number"
            value={profile.avgMonthlyOrders ?? ""}
            onChange={(e) => patchProfile({ avgMonthlyOrders: Number(e.target.value) || null })}
            placeholder="2,000"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="budget">Typical Monthly Marketing Budget</Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">AED</span>
            <Input
              id="budget"
              type="number"
              className="pl-12"
              value={profile.monthlyMarketingBudget ?? ""}
              onChange={(e) => patchProfile({ monthlyMarketingBudget: Number(e.target.value) || null })}
              placeholder="40,000"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function step2IsValid(draft: Partial<Brand>) {
  return Boolean(draft.profile)
}
