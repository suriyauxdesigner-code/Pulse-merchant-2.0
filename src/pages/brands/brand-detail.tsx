import * as React from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft, Pencil, Globe, AtSign, Save, X, Plus, Megaphone, ShieldCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckboxList } from "@/components/shared/checkbox-list"
import { TagSearchInput } from "@/components/shared/tag-search-input"
import { OptionalTagPicker } from "@/components/shared/optional-tag-picker"
import { LogoTile } from "@/components/shared/logo-tile"
import { FileUpload } from "@/components/shared/file-upload"
import { ColorSwatchPicker } from "@/components/shared/color-swatch-picker"
import { MerchantSetupFields } from "@/components/shared/merchant-setup-fields"
import { CampaignsTable } from "@/components/shared/campaigns-table"
import { CATEGORY_OPTIONS, KNOWN_BRANDS, SHOP_CHANNEL_OPTIONS, TERMINAL_CHANNEL_OPTIONS } from "@/lib/data"
import { useAppStore } from "@/lib/store"
import type { Brand } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function BrandDetailPage() {
  const { brandId } = useParams()
  const navigate = useNavigate()
  const { brands, campaigns, updateBrand } = useAppStore()
  const brand = brands.find((b) => b.id === brandId)
  const [editing, setEditing] = React.useState(false)
  const [form, setForm] = React.useState<Brand | null>(brand ?? null)

  React.useEffect(() => {
    setForm(brand ?? null)
  }, [brand])

  if (!brand || !form) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-muted-foreground">This brand could not be found.</p>
        <Button variant="outline" onClick={() => navigate("/brands")}>
          Back to Brands
        </Button>
      </div>
    )
  }

  const brandCampaigns = campaigns.filter((c) => c.brandId === brand.id)

  const handleSave = () => {
    updateBrand(brand.id, form)
    setEditing(false)
    toast({ title: "Brand profile updated", description: `${form.name}'s details have been saved.`, variant: "success" })
  }

  const handleCancel = () => {
    setForm(brand)
    setEditing(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/brands" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Brands
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {editing ? (
            <FileUpload value={form.logoUrl} onChange={(v) => setForm({ ...form, logoUrl: v })} />
          ) : (
            <LogoTile name={brand.name} color={brand.logoColor} imageUrl={brand.logoUrl} size="lg" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{brand.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {brand.website && (
                <a href={brand.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                  <Globe className="size-3.5" />
                  {brand.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {brand.socialMedia && (
                <span className="flex items-center gap-1">
                  <AtSign className="size-3.5" />
                  {brand.socialMedia.replace(/^@/, "")}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="size-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="size-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="size-4" />
                Edit Profile
              </Button>
              <Button onClick={() => navigate("/campaigns/new", { state: { brandId: brand.id } })}>
                <Plus className="size-4" />
                Create Campaign
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Brand Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Official Brand Name" editing={editing}>
              {editing ? (
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              ) : (
                brand.name
              )}
            </Field>
            <Field label="Website" editing={editing}>
              {editing ? (
                <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              ) : (
                brand.website || "—"
              )}
            </Field>
            <Field label="Social Media" editing={editing}>
              {editing ? (
                <Input value={form.socialMedia} onChange={(e) => setForm({ ...form, socialMedia: e.target.value })} />
              ) : (
                brand.socialMedia || "—"
              )}
            </Field>
            <Field label="Brand Color" editing={editing} stacked>
              {editing ? (
                <ColorSwatchPicker value={form.logoColor} onChange={(color) => setForm({ ...form, logoColor: color })} />
              ) : (
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 rounded-full border border-border" style={{ backgroundColor: brand.logoColor }} />
                  {brand.logoColor}
                </span>
              )}
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="Where do your ideal customers shop?" editing={editing} stacked>
              {editing ? (
                <CheckboxList
                  options={SHOP_CHANNEL_OPTIONS}
                  selected={form.profile.shopChannels}
                  onChange={(v) => setForm({ ...form, profile: { ...form.profile, shopChannels: v } })}
                />
              ) : (
                <TagRow items={brand.profile.shopChannels} />
              )}
            </Field>

            <Field label="Competitor brands" editing={editing} stacked>
              {editing ? (
                <TagSearchInput
                  suggestions={KNOWN_BRANDS}
                  selected={form.profile.competitors}
                  onChange={(v) => setForm({ ...form, profile: { ...form.profile, competitors: v } })}
                  placeholder="Search competitor brands..."
                />
              ) : (
                <TagRow items={brand.profile.competitors} />
              )}
            </Field>

            {editing ? (
              <OptionalTagPicker
                label="Additional categories"
                description="Optional — turn this on to tag other categories your brand operates in."
                suggestions={CATEGORY_OPTIONS}
                selected={form.profile.categories}
                onChange={(v) => setForm({ ...form, profile: { ...form.profile, categories: v } })}
                placeholder="Search categories..."
                suggestionsLabel="Popular categories — click to add"
              />
            ) : (
              <Field label="Additional categories" editing={editing} stacked>
                <TagRow items={brand.profile.categories} />
              </Field>
            )}

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Average Order Value (AED)" editing={editing}>
                {editing ? (
                  <Input
                    type="number"
                    value={form.profile.avgOrderValue ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, profile: { ...form.profile, avgOrderValue: Number(e.target.value) || null } })
                    }
                  />
                ) : brand.profile.avgOrderValue ? (
                  `AED ${brand.profile.avgOrderValue.toLocaleString()}`
                ) : (
                  "—"
                )}
              </Field>
              <Field label="Average Monthly Orders" editing={editing}>
                {editing ? (
                  <Input
                    type="number"
                    value={form.profile.avgMonthlyOrders ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, profile: { ...form.profile, avgMonthlyOrders: Number(e.target.value) || null } })
                    }
                  />
                ) : brand.profile.avgMonthlyOrders ? (
                  brand.profile.avgMonthlyOrders.toLocaleString()
                ) : (
                  "—"
                )}
              </Field>
              <Field label="Monthly Marketing Budget (AED)" editing={editing}>
                {editing ? (
                  <Input
                    type="number"
                    value={form.profile.monthlyMarketingBudget ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profile: { ...form.profile, monthlyMarketingBudget: Number(e.target.value) || null },
                      })
                    }
                  />
                ) : brand.profile.monthlyMarketingBudget ? (
                  `AED ${brand.profile.monthlyMarketingBudget.toLocaleString()}`
                ) : (
                  "—"
                )}
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Merchant Setup</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <RadioGroup
                  value={form.merchantSetup.knowsMerchantId === false ? "no" : "yes"}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      merchantSetup:
                        v === "yes"
                          ? {
                              ...form.merchantSetup,
                              knowsMerchantId: true,
                              needsLuneContact: false,
                              terminals:
                                form.merchantSetup.terminals.length > 0
                                  ? form.merchantSetup.terminals
                                  : [{ id: `term-${Math.random().toString(36).slice(2, 9)}`, terminalId: "", channel: "in_store" }],
                            }
                          : { knowsMerchantId: false, merchantId: "", terminals: [], needsLuneContact: true },
                    })
                  }
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { value: "yes", label: "Yes, I know it" },
                    { value: "no", label: "No, I don't know it" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border px-4 py-3 text-sm font-medium transition-colors",
                        (opt.value === "yes" ? form.merchantSetup.knowsMerchantId !== false : form.merchantSetup.knowsMerchantId === false)
                          ? "border-primary bg-secondary text-secondary-foreground"
                          : "border-border hover:bg-muted/60"
                      )}
                    >
                      <RadioGroupItem value={opt.value} />
                      {opt.label}
                    </label>
                  ))}
                </RadioGroup>

                {form.merchantSetup.knowsMerchantId !== false && (
                  <MerchantSetupFields
                    setup={form.merchantSetup}
                    onChange={(patch) => setForm({ ...form, merchantSetup: { ...form.merchantSetup, ...patch } })}
                  />
                )}
              </div>
            ) : (
              <>
                {brand.merchantSetup.needsLuneContact ? (
                  <div className="flex items-start gap-3 rounded-[var(--radius-sm)] bg-warning-bg px-4 py-3.5">
                    <Clock className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
                    <div>
                      <p className="text-sm font-medium text-warning-foreground">Lune will reach out to complete this setup</p>
                      <p className="mt-0.5 text-sm text-warning-foreground/80">
                        We don't have merchant ID details for this brand yet. Our onboarding team will contact you shortly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-3 rounded-[var(--radius-sm)] bg-success-bg px-4 py-3.5 mb-4">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success-foreground" />
                      <p className="text-sm font-medium text-success-foreground">Merchant setup verified</p>
                    </div>
                    <div className="rounded-[var(--radius-sm)] border border-border px-4 py-3">
                      <p className="text-sm font-semibold text-foreground">{brand.merchantSetup.merchantId}</p>
                      <p className="text-xs text-muted-foreground mb-2.5">Merchant ID</p>
                      <div className="flex flex-wrap gap-1.5">
                        {brand.merchantSetup.terminals.map((t) => (
                          <Badge key={t.id} variant="outline">
                            {t.terminalId} · {TERMINAL_CHANNEL_OPTIONS.find((o) => o.value === t.channel)?.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaigns from {brand.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {brandCampaigns.length === 0 ? (
              <div className="p-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Megaphone className="size-5" />
                  <p className="text-sm">No campaigns launched for this brand yet.</p>
                </div>
              </div>
            ) : (
              <div className="px-6 pb-6">
                <CampaignsTable campaigns={brandCampaigns} brands={brands} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
  editing,
  stacked = false,
}: {
  label: string
  children: React.ReactNode
  editing: boolean
  stacked?: boolean
}) {
  return (
    <div className={stacked ? "space-y-2" : "space-y-1.5"}>
      <Label className={editing ? "" : "text-muted-foreground"}>{label}</Label>
      {editing ? children : <div className="text-sm font-medium text-foreground">{children}</div>}
    </div>
  )
}

function TagRow({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-sm text-muted-foreground">—</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} variant="outline">
          {item}
        </Badge>
      ))}
    </div>
  )
}
