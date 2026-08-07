import type { ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Store, Megaphone, TrendingUp, Wallet, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { LogoTile } from "@/components/shared/logo-tile"
import { CampaignsExplorer } from "@/components/shared/campaigns-explorer"
import { useAppStore, useAuthStore } from "@/lib/store"

export function DashboardPage() {
  const { user } = useAuthStore()
  const { brands, campaigns } = useAppStore()
  const navigate = useNavigate()

  const liveCampaigns = campaigns.filter((c) => c.status === "live")
  const totalCashback = campaigns.reduce((sum, c) => sum + c.spent, 0)

  if (brands.length === 0) {
    return (
      <div>
        <PageHeader title={`Hello ${user?.company || "there"}`} description="Track your live campaigns and offer performance" />
        <EmptyState
          icon={<Store className="size-6" />}
          title="Add a brand to set up your first campaign"
          description="Your dashboard is empty until you onboard a brand — it only takes a few minutes and happens just once per brand."
          action={
            <Button size="lg" onClick={() => navigate("/onboarding")}>
              <Plus className="size-4" />
              Onboard a Brand
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`Hello ${user?.company || "there"}`}
        description="Track your live campaigns and offer performance"
        actions={
          <Button onClick={() => navigate("/campaigns/new")}>
            <Plus className="size-4" />
            Create Campaign
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<Megaphone className="size-[18px]" />} label="Total Campaigns" value={campaigns.length} />
        <StatCard icon={<Sparkles className="size-[18px]" />} label="Live Campaigns" value={liveCampaigns.length} accent="success" />
        <StatCard icon={<Wallet className="size-[18px]" />} label="Cashback Given" value={`AED ${totalCashback.toLocaleString()}`} />
        <StatCard icon={<TrendingUp className="size-[18px]" />} label="Active Brands" value={brands.length} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Your brands</h2>
          <Link to="/brands" className="flex items-center text-sm font-semibold text-primary hover:underline">
            Manage brands
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand) => {
            const brandCampaigns = campaigns.filter((c) => c.brandId === brand.id)
            const live = brandCampaigns.filter((c) => c.status === "live").length
            return (
              <Card
                key={brand.id}
                className="cursor-pointer transition-shadow hover:shadow-elevated"
                onClick={() => navigate(`/brands/${brand.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <LogoTile name={brand.name} color={brand.logoColor} imageUrl={brand.logoUrl} size="lg" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{brand.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {live > 0 ? `${live} live campaign${live > 1 ? "s" : ""}` : `${brandCampaigns.length} total campaigns`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Campaigns</h2>
        <CampaignsExplorer campaigns={campaigns} brands={brands} />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode
  label: string
  value: string | number
  accent?: "success"
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div
          className={
            "mb-3 flex size-9 items-center justify-center rounded-[var(--radius-sm)] " +
            (accent === "success" ? "bg-success-bg text-success-foreground" : "bg-secondary text-secondary-foreground")
          }
        >
          {icon}
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
