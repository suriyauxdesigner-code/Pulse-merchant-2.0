import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { useAppStore } from "@/lib/store"

const INVOICES = [
  { id: "INV-2026-0042", brand: "brand-tryano", period: "Jul 2026", amount: 18400, status: "paid" as const },
  { id: "INV-2026-0041", brand: "brand-tanagra", period: "Jun 2026", amount: 41200, status: "paid" as const },
  { id: "INV-2026-0038", brand: "brand-level", period: "Jun 2026", amount: 27300, status: "pending" as const },
  { id: "INV-2026-0031", brand: "brand-faces", period: "May 2026", amount: 30000, status: "paid" as const },
]

export function InvoicesPage() {
  const { brands } = useAppStore()

  return (
    <div>
      <PageHeader title="Invoices" description="Download billing statements for your cashback campaigns" />

      {INVOICES.length === 0 ? (
        <EmptyState icon={<FileText className="size-6" />} title="No invoices yet" description="Invoices are generated once your campaigns start spending budget." />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((inv) => {
                const brand = brands.find((b) => b.id === inv.brand)
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium text-foreground">{inv.id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{brand?.name || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inv.period}</TableCell>
                    <TableCell className="font-medium text-foreground">AED {inv.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === "paid" ? "success" : "warning"} dot>
                        {inv.status === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="size-3.5" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
