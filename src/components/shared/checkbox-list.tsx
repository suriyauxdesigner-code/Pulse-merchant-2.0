import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export function CheckboxList({
  options,
  selected,
  onChange,
  columns = 2,
}: {
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  columns?: 1 | 2
}) {
  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  return (
    <div className={cn("grid gap-2.5", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
      {options.map((option) => {
        const checked = selected.includes(option)
        return (
          <label
            key={option}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] border px-3.5 py-2.5 text-sm transition-colors",
              checked ? "border-primary bg-secondary text-secondary-foreground" : "border-border hover:bg-muted/60"
            )}
          >
            <Checkbox checked={checked} onCheckedChange={() => toggle(option)} />
            {option}
          </label>
        )
      })}
    </div>
  )
}
