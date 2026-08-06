import * as React from "react"
import type { ReactNode } from "react"
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CampaignsTable } from "@/components/shared/campaigns-table"
import { bankById } from "@/lib/data"
import type { Brand, Campaign } from "@/lib/types"

const PAGE_SIZE = 8

export function CampaignsExplorer({ campaigns, brands }: { campaigns: Campaign[]; brands: Brand[] }) {
  const [tab, setTab] = React.useState<"all" | "live" | "completed">("all")
  const [search, setSearch] = React.useState("")
  const [brandFilter, setBrandFilter] = React.useState("all")
  const [bankFilter, setBankFilter] = React.useState("all")
  const [page, setPage] = React.useState(1)

  const liveCount = campaigns.filter((c) => c.status === "live").length
  const completedCount = campaigns.filter((c) => c.status === "completed").length

  const filtered = campaigns.filter((c) => {
    if (tab === "live" && c.status !== "live") return false
    if (tab === "completed" && c.status !== "completed") return false
    if (brandFilter !== "all" && c.brandId !== brandFilter) return false
    if (bankFilter !== "all" && c.bankId !== bankFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => setPage(1), [tab, search, brandFilter, bankFilter])

  const usedBankIds = Array.from(new Set(campaigns.map((c) => c.bankId).filter(Boolean))) as string[]

  return (
    <div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-5">
        <TabsList>
          <TabsTrigger value="all">
            All Campaigns
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
              {campaigns.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="live">
            Live Campaigns
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
              {liveCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Campaigns
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
              {completedCount}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Campaign Name</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Campaign Name" className="pl-10" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Brand</label>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Bank</label>
          <Select value={bankFilter} onValueChange={setBankFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Banks</SelectItem>
              {usedBankIds.map((id) => {
                const bank = bankById(id)
                return bank ? (
                  <SelectItem key={id} value={id}>
                    {bank.name}
                  </SelectItem>
                ) : null
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CampaignsTable campaigns={pageItems} brands={brands} emptyMessage="Try adjusting your filters or search." />
      </Card>

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <PagerButton onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft className="size-4" />
            </PagerButton>
            <PagerButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="size-4" />
            </PagerButton>
            <span className="px-2 text-foreground">
              Page {page} of {totalPages}
            </span>
            <PagerButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="size-4" />
            </PagerButton>
            <PagerButton onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              <ChevronsRight className="size-4" />
            </PagerButton>
          </div>
        </div>
      )}
    </div>
  )
}

function PagerButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] border border-border text-foreground disabled:pointer-events-none disabled:opacity-40 hover:bg-muted"
    >
      {children}
    </button>
  )
}
