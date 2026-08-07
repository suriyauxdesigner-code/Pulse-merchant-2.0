import { Slider } from "@/components/ui/slider"
import { BUDGET_STEPS } from "@/lib/data"
import { cn } from "@/lib/utils"

function formatBudget(value: number) {
  if (value >= 1000) return `${value / 1000}k`
  return `${value}`
}

export function BudgetSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const min = BUDGET_STEPS[0]
  const max = BUDGET_STEPS[BUDGET_STEPS.length - 1]

  return (
    <div>
      <Slider
        min={min}
        max={max}
        step={1000}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="mb-4"
      />
      <div className="flex justify-between">
        {BUDGET_STEPS.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => onChange(step)}
            className={cn(
              "text-xs font-medium transition-colors",
              value === step ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            AED {formatBudget(step)}
          </button>
        ))}
      </div>
    </div>
  )
}
