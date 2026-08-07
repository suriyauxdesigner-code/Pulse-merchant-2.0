import * as React from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Pencil,
  Globe,
  AtSign,
  Save,
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
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { WizardStepper } from "@/components/shared/wizard-stepper"
import { LogoTile } from "@/components/shared/logo-tile"
import { CampaignsTable } from "@/components/shared/campaigns-table"
import { Step1BrandInfo, step1IsValid } from "@/pages/onboarding/step1-brand-info"
import { Step2BrandProfile, step2IsValid } from "@/pages/onboarding/step2-brand-profile"
import { Step3MerchantSetup, step3IsValid } from "@/pages/onboarding/step3-merchant-setup"
import { TERMINAL_CHANNEL_OPTIONS } from "@/lib/data"
import { useAppStore } from "@/lib/store"
import type { Brand } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const EDIT_STEP_LABELS = ["Brand Information", "Brand Profile", "Merchant Setup"]

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function BrandDetailPage() {
  const { brandId } = useParams()
  const navigate = useNavigate()
  const { brands, campaigns, updateBrand } = useAppStore()
  const brand = brands.find((b) => b.id === brandId)
  const [tab, setTab] = React.useState("overview")
  const [merchantExpanded, setMerchantExpanded] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)

  React.useEffect(() => {
    setTab("overview")
    setMerchantExpanded(false)
    setEditOpen(false)
  }, [brandId])

  if (!brand) {
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

  const handleEditSave = (patch: Brand) => {
    updateBrand(brand.id, patch)
    toast({ title: "Brand profile updated", description: `${patch.name}'s details have been saved.`, variant: "success" })
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/brands" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Brands
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <LogoTile name={brand.name} color={brand.logoColor} imageUrl={brand.logoUrl} size="lg" />
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
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Edit Profile
          </Button>
          <Button onClick={() => navigate("/campaigns/new", { state: { brandId: brand.id } })}>
            <Plus className="size-4" />
            Create Campaign
          </Button>
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
                <Field label="Official Brand Name">{brand.name}</Field>
                <Field label="Website">{brand.website || "—"}</Field>
                <Field label="Social Handle">{brand.socialMedia || "—"}</Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <Field label="Shopping Channels" stacked>
                  <ChipList items={brand.profile.shopChannels} />
                </Field>
                <Field label="Categories" stacked>
                  <ChipList items={brand.profile.categories} emptyLabel="Not set" />
                </Field>
                <Field label="Competitors" stacked>
                  <ChipList items={brand.profile.competitors} />
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
                  <p className="text-2xl font-bold text-foreground">
                    {brand.profile.avgOrderValue ? `AED ${brand.profile.avgOrderValue.toLocaleString()}` : "—"}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label>Average Monthly Orders</Label>
                  <p className="text-2xl font-bold text-foreground">
                    {brand.profile.avgMonthlyOrders ? brand.profile.avgMonthlyOrders.toLocaleString() : "—"}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label>Monthly Marketing Budget (AED)</Label>
                  <p className="text-2xl font-bold text-foreground">
                    {brand.profile.monthlyMarketingBudget ? `AED ${brand.profile.monthlyMarketingBudget.toLocaleString()}` : "—"}
                  </p>
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

          {brand.merchantSetup.needsLuneContact ? (
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

      <EditBrandDialog brand={brand} open={editOpen} onOpenChange={setEditOpen} onSave={handleEditSave} />
    </div>
  )
}

function EditBrandDialog({
  brand,
  open,
  onOpenChange,
  onSave,
}: {
  brand: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (patch: Brand) => void
}) {
  const [step, setStep] = React.useState(1)
  const [draft, setDraft] = React.useState<Brand>(brand)

  React.useEffect(() => {
    if (open) {
      setDraft(brand)
      setStep(1)
    }
  }, [open, brand])

  const update = (patch: Partial<Brand>) => setDraft((d) => ({ ...d, ...patch }))

  const validators = [step1IsValid, step2IsValid, step3IsValid]
  const isCurrentValid = validators[step - 1](draft)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      onSave(draft)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {brand.name}</DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <WizardStepper steps={EDIT_STEP_LABELS} currentStep={step} />
        </div>

        {step === 1 && <Step1BrandInfo draft={draft} onUpdate={update} />}
        {step === 2 && <Step2BrandProfile draft={draft} onUpdate={update} />}
        {step === 3 && <Step3MerchantSetup draft={draft} onUpdate={update} />}

        <DialogFooter>
          <Button variant="ghost" onClick={() => (step === 1 ? onOpenChange(false) : setStep(step - 1))}>
            <ArrowLeft className="size-4" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={handleNext} disabled={!isCurrentValid}>
            {step === 3 ? (
              <>
                <Save className="size-4" />
                Save Changes
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

function Field({ label, children, stacked = false }: { label: string; children: React.ReactNode; stacked?: boolean }) {
  return (
    <div className={stacked ? "space-y-2" : "space-y-1.5"}>
      <Label className="text-muted-foreground">{label}</Label>
      <div className="text-sm font-medium text-foreground">{children}</div>
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
