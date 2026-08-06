import { Badge } from "@/components/ui/badge"
import type { CampaignStatus } from "@/lib/types"

const STATUS_MAP: Record<CampaignStatus, { label: string; variant: "neutral" | "success" | "warning" | "info" }> = {
  submitted: { label: "Submitted", variant: "neutral" },
  processing: { label: "Processing", variant: "warning" },
  bank_approved: { label: "Bank Approved", variant: "info" },
  live: { label: "Live", variant: "success" },
  completed: { label: "Completed", variant: "neutral" },
}

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const cfg = STATUS_MAP[status]
  return (
    <Badge variant={cfg.variant} dot>
      {cfg.label}
    </Badge>
  )
}

export const CAMPAIGN_STATUS_ORDER: CampaignStatus[] = ["submitted", "processing", "bank_approved", "live"]
