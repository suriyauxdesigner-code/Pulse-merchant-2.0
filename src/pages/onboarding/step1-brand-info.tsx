import * as React from "react"
import { Search, Plus, PenLine, CheckCircle2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/shared/file-upload"
import { ColorSwatchPicker } from "@/components/shared/color-swatch-picker"
import { KNOWN_BRANDS } from "@/lib/data"
import type { Brand } from "@/lib/types"

export function Step1BrandInfo({
  draft,
  onUpdate,
}: {
  draft: Partial<Brand>
  onUpdate: (patch: Partial<Brand>) => void
}) {
  const [mode, setMode] = React.useState<"search" | "manual">(draft.name ? "manual" : "search")
  const [query, setQuery] = React.useState("")

  const results = query
    ? KNOWN_BRANDS.filter((b) => b.toLowerCase().includes(query.toLowerCase()))
    : []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Brand Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">Tell us which brand you're onboarding to Lune.</p>
      </div>

      {mode === "search" ? (
        <div className="space-y-3">
          <Label>Find your brand</Label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your brand portfolio..."
              className="pl-10"
              autoFocus
            />
          </div>

          {results.length > 0 && (
            <div className="overflow-hidden rounded-[var(--radius-sm)] border border-border">
              {results.slice(0, 6).map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    onUpdate({ name })
                    setMode("manual")
                  }}
                  className="flex w-full items-center justify-between border-b border-border px-4 py-3 text-left text-sm last:border-b-0 hover:bg-muted"
                >
                  {name}
                  {draft.name === name && <CheckCircle2 className="size-4 text-primary" />}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setMode("manual")}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus className="size-4" />
            Add New Brand
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => setMode("search")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Search className="size-3.5" />
            Search a different brand
          </button>

          <div className="space-y-1.5">
            <Label htmlFor="brand-name">Official Brand Name</Label>
            <div className="relative">
              <Input
                id="brand-name"
                value={draft.name || ""}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="e.g. Faces"
                className="pr-9"
              />
              <PenLine className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="space-y-1.5">
              <Label>Logo (optional)</Label>
              <FileUpload value={draft.logoUrl ?? null} onChange={(v) => onUpdate({ logoUrl: v })} hint="PNG, up to 5MB" />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label>Brand Color</Label>
              <p className="text-xs text-muted-foreground">Used consistently across this brand's campaign cards.</p>
              <div className="pt-1">
                <ColorSwatchPicker value={draft.logoColor || "#0E3B2E"} onChange={(color) => onUpdate({ logoColor: color })} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={draft.website || ""}
                onChange={(e) => onUpdate({ website: e.target.value })}
                placeholder="https://yourbrand.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="social">Social Media</Label>
              <Input
                id="social"
                value={draft.socialMedia || ""}
                onChange={(e) => onUpdate({ socialMedia: e.target.value })}
                placeholder="@yourbrand"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function step1IsValid(draft: Partial<Brand>) {
  return Boolean(draft.name && draft.name.trim().length > 1)
}
