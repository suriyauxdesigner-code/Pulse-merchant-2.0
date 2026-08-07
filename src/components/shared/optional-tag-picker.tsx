import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TagSearchInput } from "@/components/shared/tag-search-input"

export function OptionalTagPicker({
  label,
  description,
  suggestions,
  selected,
  onChange,
  placeholder,
  suggestionsLabel,
}: {
  label: string
  description?: string
  suggestions: string[]
  selected: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  suggestionsLabel?: string
}) {
  const [enabled, setEnabled] = React.useState(selected.length > 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label>{label}</Label>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(checked) => {
            setEnabled(checked)
            if (!checked) onChange([])
          }}
        />
      </div>
      {enabled && (
        <TagSearchInput
          suggestions={suggestions}
          selected={selected}
          onChange={onChange}
          placeholder={placeholder}
          suggestionsLabel={suggestionsLabel}
        />
      )}
    </div>
  )
}
