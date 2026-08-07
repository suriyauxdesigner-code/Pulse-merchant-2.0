import type { ReactNode } from "react"
import { ArrowLeft, Calendar, Wallet, Percent, ShieldCheck, Sparkles, Receipt } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/shared/status-badge"
import { LogoTile } from "@/components/shared/logo-tile"
import { MobileOfferDetailPreview } from "@/components/shared/mobile-offer-detail-preview"
import { CAMPAIGN_GOALS, bankById } from "@/lib/data"
import { useAppStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function formatShortDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function CampaignDetailsPage() {
  const { campaignId } = useParams()
  const navigate = useNavigate()
  const { campaigns, brands, advanceCampaignStatus } = useAppStore()
  const campaign = campaigns.find((c) => c.id === campaignId)
  const brand = brands.find((b) => b.id === campaign?.brandId)

  if (!campaign) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-muted-foreground">This campaign could not be found.</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Campaign
        </Button>
      </div>
    )
  }

  const bank = bankById(campaign.bankId)
  const goalLabel = CAMPAIGN_GOALS.find((g) => g.value === campaign.goal)?.label
  const remaining = Math.max(0, campaign.budget - campaign.spent)
  const spentPercent = campaign.budget > 0 ? Math.min(100, Math.round((campaign.spent / campaign.budget) * 100)) : 0
  const isLive = campaign.status === "live"
  const isCompleted = campaign.status === "completed"

  const handleMarkCompleted = () => {
    advanceCampaignStatus(campaign.id)
    toast({ title: "Campaign marked as completed", variant: "success" })
  }

  return (
    <div>
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Campaign
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <LogoTile name={brand?.name || "?"} color={brand?.logoColor || "#111827"} imageUrl={brand?.logoUrl} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{campaign.name}</h1>
            <p className="text-sm text-muted-foreground">{brand?.name} · {goalLabel}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge status={campaign.status} />
          {isLive && (
            <button
              onClick={handleMarkCompleted}
              className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Demo: mark as completed
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          {isLive || isCompleted ? (
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={<Receipt className="size-[18px]" />}
                label="Transactions"
                value={Math.round((campaign.spent / Math.max(1, campaign.cashbackPercent)) * 8).toLocaleString()}
              />
              <MetricCard
                icon={<Wallet className="size-[18px]" />}
                label="Cashback given"
                value={`AED ${campaign.spent.toLocaleString()}`}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center gap-2.5 p-5 text-muted-foreground">
                <Sparkles className="size-4" />
                <p className="text-sm">Performance data will appear here once your campaign goes live.</p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Spent</p>
                    <p className="text-2xl font-bold text-foreground">AED {campaign.spent.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-lg font-semibold text-foreground">AED {remaining.toLocaleString()}</p>
                  </div>
                </div>
                <Progress value={spentPercent} />
                <p className="text-xs text-muted-foreground">{spentPercent}% of AED {campaign.budget.toLocaleString()} total budget used</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cashback Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <TimelineItem icon={<Percent className="size-4" />} label="Cashback" value={`${campaign.cashbackPercent}%`} />
                <TimelineItem icon={<Wallet className="size-4" />} label="Cap per customer" value={campaign.cashbackCap ? `AED ${campaign.cashbackCap}` : "—"} />
                <TimelineItem icon={<ShieldCheck className="size-4" />} label="Hold period" value={`${campaign.holdPeriodDays} days`} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bank Partner</CardTitle>
              </CardHeader>
              <CardContent>
                {bank ? (
                  <div className="flex items-center gap-3">
                    <LogoTile name={bank.shortName} color={bank.color} shape="circle" />
                    <span className="text-sm font-medium text-foreground">{bank.name}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No bank partner assigned yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <TimelineItem icon={<Calendar className="size-4" />} label="Submitted" value={formatDate(campaign.submittedAt)} />
                <TimelineItem icon={<Calendar className="size-4" />} label="Start Date" value={formatDate(campaign.startDate)} />
                <TimelineItem icon={<Calendar className="size-4" />} label="End Date" value={campaign.budgetUtilization === "exhaust" ? "Until exhausted" : formatDate(campaign.endDate)} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">What shoppers see</p>
          <div className="rounded-[var(--radius)] border border-dashed border-border bg-muted/30 p-4">
            <MobileOfferDetailPreview
              campaignName={campaign.name}
              brandName={brand?.name || "Brand"}
              logoUrl={campaign.logoUrl ?? brand?.logoUrl ?? null}
              bannerUrl={campaign.bannerUrl}
              primaryColor={campaign.primaryColor}
              cashbackPercent={campaign.cashbackPercent}
              description={campaign.description}
              cashbackCap={campaign.cashbackCap}
              minSpend={campaign.minSpend}
              holdPeriodDays={campaign.holdPeriodDays}
              validityLabel={
                campaign.budgetUtilization === "exhaust"
                  ? `from ${formatShortDate(campaign.startDate)} while budget lasts`
                  : `${formatShortDate(campaign.startDate)} – ${formatShortDate(campaign.endDate)}`
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode
  label: string
  value: string
  accent?: "success"
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div
          className={cn(
            "mb-3 flex size-9 items-center justify-center rounded-[var(--radius-sm)]",
            accent === "success" ? "bg-success-bg text-success-foreground" : "bg-secondary text-secondary-foreground"
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

function TimelineItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
