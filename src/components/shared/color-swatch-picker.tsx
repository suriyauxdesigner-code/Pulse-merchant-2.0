import { BRAND_COLOR_PRESETS } from "@/lib/data"
import { cn } from "@/lib/utils"

export function ColorSwatchPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {BRAND_COLOR_PRESETS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "size-8 rounded-full border-2 transition-transform",
            value === color ? "scale-110 border-foreground" : "border-transparent hover:scale-105"
          )}
          style={{ backgroundColor: color }}
          aria-label={color}
        />
      ))}
      <label className="relative flex size-8 cursor-pointer items-center justify-center rounded-full border border-dashed border-border text-[10px] text-muted-foreground">
        +
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
      </label>
    </div>
  )
}
