import { Badge } from "@/components/ui/badge"
import type { CampaignStatus } from "@/lib/types"

const STATUS_MAP: Record<CampaignStatus, { label: string; variant: "neutral" | "success" | "warning" | "info" }> = {
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
