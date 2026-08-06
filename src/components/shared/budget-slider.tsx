import { Slider } from "@/components/ui/slider"
import { BUDGET_STEPS } from "@/lib/data"
import { cn } from "@/lib/utils"

function formatBudget(value: number) {
  if (value >= 1000) return `${value / 1000}k`
  return `${value}`
}

export function BudgetSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const index = Math.max(0, BUDGET_STEPS.indexOf(value))

  return (
    <div>
      <Slider
        min={0}
        max={BUDGET_STEPS.length - 1}
        step={1}
        value={[index]}
        onValueChange={([i]) => onChange(BUDGET_STEPS[i])}
        className="mb-4"
      />
      <div className="flex justify-between">
        {BUDGET_STEPS.map((step, i) => (
          <button
            key={step}
            type="button"
            onClick={() => onChange(step)}
            className={cn(
              "text-xs font-medium transition-colors",
              i === index ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            AED {formatBudget(step)}
          </button>
        ))}
      </div>
    </div>
  )
}
