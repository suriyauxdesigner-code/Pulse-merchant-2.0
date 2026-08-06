import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function WizardStepper({
  steps,
  currentStep,
}: {
  steps: string[]
  currentStep: number
}) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const stepNum = i + 1
        const isComplete = stepNum < currentStep
        const isCurrent = stepNum === currentStep
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isComplete && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-secondary",
                  !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="size-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:block",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {stepNum !== steps.length && (
              <div className={cn("mx-3 h-px flex-1 min-w-6", isComplete ? "bg-primary" : "bg-border")} />
            )}
          </div>
        )
      })}
    </div>
  )
}
