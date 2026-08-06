import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/status-badge"
import { LogoTile } from "@/components/shared/logo-tile"
import { EmptyState } from "@/components/shared/empty-state"
import { bankById } from "@/lib/data"
import type { Brand, Campaign } from "@/lib/types"
import { Megaphone } from "lucide-react"

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function CampaignsTable({
  campaigns,
  brands,
  emptyMessage = "No campaigns match these filters.",
}: {
  campaigns: Campaign[]
  brands: Brand[]
  emptyMessage?: string
}) {
  const brandById = (id: string) => brands.find((b) => b.id === id)

  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={<Megaphone className="size-6" />}
        title="No campaigns yet"
        description={emptyMessage}
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Brand & Campaign</TableHead>
          <TableHead>Bank</TableHead>
          <TableHead>Cashback</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((c) => {
          const brand = brandById(c.brandId)
          const bank = bankById(c.bankId)
          return (
            <TableRow key={c.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <LogoTile name={brand?.name || "?"} color={brand?.logoColor || "#111827"} imageUrl={brand?.logoUrl} />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground leading-tight">{brand?.name || "Unknown brand"}</p>
                    <p className="truncate text-sm text-muted-foreground leading-tight">{c.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {bank ? (
                  <div className="flex items-center gap-2.5">
                    <LogoTile name={bank.shortName} color={bank.color} shape="circle" size="sm" />
                    <span className="text-sm text-foreground">{bank.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Matching...</span>
                )}
              </TableCell>
              <TableCell className="font-semibold text-foreground">{c.cashbackPercent}%</TableCell>
              <TableCell>
                <StatusBadge status={c.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(c.startDate)} – {formatDate(c.endDate)}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  to={`/campaigns/${c.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  View Details
                  <ChevronRight className="size-3.5" />
                </Link>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
