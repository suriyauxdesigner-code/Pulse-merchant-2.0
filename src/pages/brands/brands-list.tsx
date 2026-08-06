import { useNavigate } from "react-router-dom"
import { Plus, Store, Globe, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { LogoTile } from "@/components/shared/logo-tile"
import { useAppStore } from "@/lib/store"

export function BrandsPage() {
  const { brands, campaigns } = useAppStore()
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Brands"
        description="Manage brand profiles and onboarding details"
        actions={
          <Button onClick={() => navigate("/onboarding")}>
            <Plus className="size-4" />
            Onboard New Brand
          </Button>
        }
      />

      {brands.length === 0 ? (
        <EmptyState
          icon={<Store className="size-6" />}
          title="No brands onboarded yet"
          description="Onboard your first brand to unlock campaign creation. It only takes a few minutes."
          action={
            <Button size="lg" onClick={() => navigate("/onboarding")}>
              <Plus className="size-4" />
              Onboard your first brand
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => {
            const brandCampaigns = campaigns.filter((c) => c.brandId === brand.id)
            const live = brandCampaigns.filter((c) => c.status === "live").length
            return (
              <Card key={brand.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start gap-3">
                    <LogoTile name={brand.name} color={brand.logoColor} imageUrl={brand.logoUrl} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground truncate">{brand.name}</p>
                      {brand.website && (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                        >
                          <Globe className="size-3" />
                          <span className="truncate">{brand.website.replace(/^https?:\/\//, "")}</span>
                        </a>
                      )}
                    </div>
                    {!brand.onboardingComplete && <Badge variant="warning">Draft</Badge>}
                  </div>

                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {brand.profile.categories.slice(0, 3).map((cat) => (
                      <Badge key={cat} variant="outline">
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      <span className="font-semibold text-foreground">{brandCampaigns.length}</span> campaigns
                    </span>
                    <span>
                      <span className="font-semibold text-foreground">{live}</span> live
                    </span>
                  </div>

                  {brand.merchantSetup.needsLuneContact && (
                    <p className="mt-3 rounded-[var(--radius-sm)] bg-warning-bg px-2.5 py-2 text-xs text-warning-foreground">
                      Awaiting Lune to confirm merchant setup
                    </p>
                  )}

                  <div className="mt-auto pt-4">
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/brands/${brand.id}`)}>
                      View Details
                      <ExternalLink className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
