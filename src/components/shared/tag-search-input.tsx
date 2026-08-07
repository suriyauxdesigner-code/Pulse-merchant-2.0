import * as React from "react"
import { Search, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

const SUGGESTION_LIMIT = 8

export function TagSearchInput({
  suggestions,
  selected,
  onChange,
  placeholder = "Search...",
  className,
}: {
  suggestions: string[]
  selected: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  className?: string
}) {
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(query.toLowerCase()) && !selected.includes(s)
  )
  const exactMatch = suggestions.some((s) => s.toLowerCase() === query.trim().toLowerCase())
  const quickPicks = suggestions.filter((s) => !selected.includes(s)).slice(0, SUGGESTION_LIMIT)

  const add = (value: string) => {
    const v = value.trim()
    if (!v || selected.includes(v)) return
    onChange([...selected, v])
    setQuery("")
  }

  const remove = (value: string) => onChange(selected.filter((s) => s !== value))

  return (
    <div ref={containerRef} className={cn("relative space-y-3", className)}>
      <div className="relative">
        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-input bg-card px-3 py-2 shadow-xs focus-within:ring-2 focus-within:ring-[hsl(var(--ring))]">
          <Search className="size-3.5 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                e.preventDefault()
                add(query)
              }
            }}
            placeholder={placeholder}
            className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
          />
        </div>

        {open && query && (
          <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-[var(--radius-sm)] border border-border bg-card shadow-popover animate-scale-in">
            <div className="max-h-48 overflow-y-auto p-1">
              {filtered.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    add(s)
                    setOpen(false)
                  }}
                  className="flex w-full items-center rounded-[var(--radius-sm)] px-2.5 py-2 text-left text-sm hover:bg-muted"
                >
                  {s}
                </button>
              ))}
              {!exactMatch && query.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    add(query)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-left text-sm text-primary font-medium hover:bg-muted"
                >
                  <Plus className="size-3.5" />
                  Add "{query.trim()}"
                </button>
              )}
              {filtered.length === 0 && exactMatch && (
                <p className="px-2.5 py-2 text-sm text-muted-foreground">Already added</p>
              )}
            </div>
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
            >
              {tag}
              <button type="button" onClick={() => remove(tag)} className="hover:text-destructive">
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {quickPicks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Popular brands — click to add</p>
          <div className="flex flex-wrap gap-1.5">
            {quickPicks.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Plus className="size-3" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
