import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CampaignStatus } from "@/lib/types"

const STAGES: { key: CampaignStatus; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "processing", label: "Processing" },
  { key: "bank_approved", label: "Bank Approved" },
  { key: "live", label: "Live" },
]

export function StatusTimeline({ status }: { status: CampaignStatus }) {
  const effectiveIndex = status === "completed" ? STAGES.length - 1 : STAGES.findIndex((s) => s.key === status)

  return (
    <div className="flex items-start">
      {STAGES.map((stage, i) => {
        const isComplete = i < effectiveIndex || status === "completed"
        const isCurrent = i === effectiveIndex && status !== "completed"
        return (
          <div key={stage.key} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "mx-auto flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  isComplete && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground",
                  !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="size-4" /> : isCurrent ? <Loader2 className="size-4 animate-spin" /> : i + 1}
              </div>
              {i !== STAGES.length - 1 && (
                <div className={cn("h-px flex-1", isComplete ? "bg-primary" : "bg-border")} />
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-center text-xs font-medium",
                isCurrent || isComplete ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {stage.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
