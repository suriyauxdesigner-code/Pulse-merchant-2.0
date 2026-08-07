import * as React from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import {
  ArrowLeft,
  Pencil,
  Globe,
  AtSign,
  Save,
  X,
  Plus,
  Megaphone,
  ShieldCheck,
  Clock,
  Sparkles,
  Landmark,
  Store,
  CreditCard,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CheckboxList } from "@/components/shared/checkbox-list"
import { TagSearchInput } from "@/components/shared/tag-search-input"
import { OptionalTagPicker } from "@/components/shared/optional-tag-picker"
import { LogoTile } from "@/components/shared/logo-tile"
import { FileUpload } from "@/components/shared/file-upload"
import { ColorSwatchPicker } from "@/components/shared/color-swatch-picker"
import { MerchantSetupFields, makeEmptyMerchantAccount } from "@/components/shared/merchant-setup-fields"
import { CampaignsTable } from "@/components/shared/campaigns-table"
import { CATEGORY_OPTIONS, KNOWN_BRANDS, SHOP_CHANNEL_OPTIONS, TERMINAL_CHANNEL_OPTIONS } from "@/lib/data"
import { useAppStore } from "@/lib/store"
import type { Brand } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function BrandDetailPage() {
  const { brandId } = useParams()
  const navigate = useNavigate()
  const { brands, campaigns, updateBrand } = useAppStore()
  const brand = brands.find((b) => b.id === brandId)
  const [editing, setEditing] = React.useState(false)
  const [form, setForm] = React.useState<Brand | null>(brand ?? null)
  const [tab, setTab] = React.useState("overview")
  const [merchantExpanded, setMerchantExpanded] = React.useState(false)

  React.useEffect(() => {
    setForm(brand ?? null)
  }, [brand])

  React.useEffect(() => {
    setTab("overview")
    setEditing(false)
    setMerchantExpanded(false)
  }, [brandId])

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
  const liveCount = brandCampaigns.filter((c) => c.status === "live").length
  const completedCount = brandCampaigns.filter((c) => c.status === "completed").length
  const connectedBanksCount = new Set(brandCampaigns.map((c) => c.bankId).filter(Boolean)).size
  const accountsCount = brand.merchantSetup.merchantAccounts.length
  const terminalsCount = brand.merchantSetup.merchantAccounts.reduce((sum, a) => sum + a.terminals.length, 0)
  const merchantStatusLabel = brand.merchantSetup.needsLuneContact ? "Pending" : accountsCount > 0 ? "Verified" : "Not Set"
  const merchantStatusAccent = brand.merchantSetup.needsLuneContact ? "warning" : accountsCount > 0 ? "success" : undefined

  const activityItems = [
    {
      id: `onboarded-${brand.id}`,
      date: brand.createdAt,
      text: `${brand.name} was onboarded to Lune`,
      icon: <Store className="size-4" />,
    },
    ...brandCampaigns.map((c) => ({
      id: c.id,
      date: c.submittedAt,
      text: c.status === "completed" ? `"${c.name}" campaign completed` : `"${c.name}" campaign went live`,
      icon: c.status === "completed" ? <CheckCircle2 className="size-4" /> : <Sparkles className="size-4" />,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
    <div className="mx-auto max-w-6xl">
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

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<ShieldCheck className="size-[18px]" />} label="Merchant Status" value={merchantStatusLabel} accent={merchantStatusAccent} />
        <StatCard icon={<Megaphone className="size-[18px]" />} label="Total Campaigns" value={brandCampaigns.length} />
        <StatCard icon={<Sparkles className="size-[18px]" />} label="Active Campaigns" value={liveCount} accent="success" />
        <StatCard icon={<Landmark className="size-[18px]" />} label="Connected Banks" value={connectedBanksCount} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="merchant">Merchant Setup</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-5 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Brand Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <Field label="Official Brand Name" editing={editing}>
                    {editing ? <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /> : brand.name}
                  </Field>
                  <Field label="Website" editing={editing}>
                    {editing ? (
                      <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                    ) : (
                      brand.website || "—"
                    )}
                  </Field>
                  <Field label="Social Handle" editing={editing}>
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
                  <CardTitle>Customer Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <Field label="Shopping Channels" editing={editing} stacked>
                    {editing ? (
                      <CheckboxList
                        options={SHOP_CHANNEL_OPTIONS}
                        selected={form.profile.shopChannels}
                        onChange={(v) => setForm({ ...form, profile: { ...form.profile, shopChannels: v } })}
                      />
                    ) : (
                      <ChipList items={brand.profile.shopChannels} />
                    )}
                  </Field>

                  {editing ? (
                    <OptionalTagPicker
                      label="Categories"
                      description="Optional — turn this on to tag other categories your brand operates in."
                      suggestions={CATEGORY_OPTIONS}
                      selected={form.profile.categories}
                      onChange={(v) => setForm({ ...form, profile: { ...form.profile, categories: v } })}
                      placeholder="Search categories..."
                      suggestionsLabel="Popular categories — click to add"
                    />
                  ) : (
                    <Field label="Categories" editing={editing} stacked>
                      <ChipList items={brand.profile.categories} emptyLabel="Not set" />
                    </Field>
                  )}

                  <Field label="Competitors" editing={editing} stacked>
                    {editing ? (
                      <TagSearchInput
                        suggestions={KNOWN_BRANDS}
                        selected={form.profile.competitors}
                        onChange={(v) => setForm({ ...form, profile: { ...form.profile, competitors: v } })}
                        placeholder="Search competitor brands..."
                      />
                    ) : (
                      <ChipList items={brand.profile.competitors} />
                    )}
                  </Field>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                  <div className="space-y-1.5">
                    <Label>Average Order Value (AED)</Label>
                    {editing ? (
                      <Input
                        type="number"
                        value={form.profile.avgOrderValue ?? ""}
                        onChange={(e) =>
                          setForm({ ...form, profile: { ...form.profile, avgOrderValue: Number(e.target.value) || null } })
                        }
                      />
                    ) : (
                      <p className="text-2xl font-bold text-foreground">
                        {brand.profile.avgOrderValue ? `AED ${brand.profile.avgOrderValue.toLocaleString()}` : "—"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Average Monthly Orders</Label>
                    {editing ? (
                      <Input
                        type="number"
                        value={form.profile.avgMonthlyOrders ?? ""}
                        onChange={(e) =>
                          setForm({ ...form, profile: { ...form.profile, avgMonthlyOrders: Number(e.target.value) || null } })
                        }
                      />
                    ) : (
                      <p className="text-2xl font-bold text-foreground">
                        {brand.profile.avgMonthlyOrders ? brand.profile.avgMonthlyOrders.toLocaleString() : "—"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Monthly Marketing Budget (AED)</Label>
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
                    ) : (
                      <p className="text-2xl font-bold text-foreground">
                        {brand.profile.monthlyMarketingBudget ? `AED ${brand.profile.monthlyMarketingBudget.toLocaleString()}` : "—"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={<Megaphone className="size-[18px]" />} label="Total Campaigns" value={brandCampaigns.length} />
            <StatCard icon={<Sparkles className="size-[18px]" />} label="Live Campaigns" value={liveCount} accent="success" />
            <StatCard icon={<CheckCircle2 className="size-[18px]" />} label="Completed Campaigns" value={completedCount} />
          </div>
          <Card className="overflow-hidden">
            <CampaignsTable
              campaigns={brandCampaigns}
              brands={brands}
              emptyMessage="This brand hasn't launched any campaigns yet."
            />
          </Card>
        </TabsContent>

        <TabsContent value="merchant" className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={<ShieldCheck className="size-[18px]" />} label="Merchant Status" value={merchantStatusLabel} accent={merchantStatusAccent} />
            <StatCard icon={<Store className="size-[18px]" />} label="Merchant Accounts" value={`${accountsCount} Connected`} />
            <StatCard icon={<CreditCard className="size-[18px]" />} label="POS Devices" value={`${terminalsCount} Connected`} />
          </div>

          {editing ? (
            <Card>
              <CardHeader>
                <CardTitle>Merchant Setup</CardTitle>
              </CardHeader>
              <CardContent>
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
                                merchantAccounts:
                                  form.merchantSetup.merchantAccounts.length > 0
                                    ? form.merchantSetup.merchantAccounts
                                    : [makeEmptyMerchantAccount()],
                              }
                            : { knowsMerchantId: false, merchantAccounts: [], needsLuneContact: true },
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
              </CardContent>
            </Card>
          ) : brand.merchantSetup.needsLuneContact ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 rounded-[var(--radius-sm)] bg-warning-bg px-4 py-3.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
                  <div>
                    <p className="text-sm font-medium text-warning-foreground">Lune will reach out to complete this setup</p>
                    <p className="mt-0.5 text-sm text-warning-foreground/80">
                      We don't have merchant ID details for this brand yet. Our onboarding team will contact you shortly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Button variant="outline" onClick={() => setMerchantExpanded((v) => !v)}>
                {merchantExpanded ? "Hide Merchant Details" : "View Merchant Details"}
                <ChevronRight className={cn("size-4 transition-transform", merchantExpanded && "rotate-90")} />
              </Button>

              {merchantExpanded && (
                <Card>
                  <CardContent className="space-y-3 pt-6">
                    {brand.merchantSetup.merchantAccounts.map((account) => (
                      <div key={account.id} className="rounded-[var(--radius-sm)] border border-border px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{account.merchantId}</p>
                          {account.labels.map((label) => (
                            <Badge key={label} variant="outline">
                              {label}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2.5">Merchant ID</p>
                        <div className="flex flex-wrap gap-1.5">
                          {account.terminals.map((t) => (
                            <Badge key={t.id} variant="outline">
                              {t.terminalId} · {TERMINAL_CHANNEL_OPTIONS.find((o) => o.value === t.channel)?.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activityItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              ) : (
                <div className="space-y-4">
                  {activityItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  accent?: "success" | "warning"
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div
          className={cn(
            "mb-3 flex size-9 items-center justify-center rounded-[var(--radius-sm)]",
            accent === "success" ? "bg-success-bg text-success-foreground" : accent === "warning" ? "bg-warning-bg text-warning-foreground" : "bg-secondary text-secondary-foreground"
          )}
        >
          {icon}
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
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

function ChipList({ items, limit = 3, emptyLabel = "—" }: { items: string[]; limit?: number; emptyLabel?: string }) {
  const [expanded, setExpanded] = React.useState(false)

  if (items.length === 0) return <span className="text-sm text-muted-foreground">{emptyLabel}</span>

  const shown = expanded ? items : items.slice(0, limit)
  const remaining = items.length - limit

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((item) => (
        <Badge key={item} variant="outline">
          {item}
        </Badge>
      ))}
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-semibold text-primary hover:underline"
        >
          {expanded ? "Show less" : `+${remaining} More`}
        </button>
      )}
    </div>
  )
}
