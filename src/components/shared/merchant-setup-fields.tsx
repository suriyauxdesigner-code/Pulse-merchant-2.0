import { Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TERMINAL_CHANNEL_OPTIONS } from "@/lib/data"
import type { MerchantSetup, TerminalChannel, TerminalEntry } from "@/lib/types"

function makeTerminalId() {
  return `term-${Math.random().toString(36).slice(2, 9)}`
}

export function MerchantSetupFields({
  setup,
  onChange,
}: {
  setup: MerchantSetup
  onChange: (patch: Partial<MerchantSetup>) => void
}) {
  const updateTerminal = (id: string, patch: Partial<TerminalEntry>) => {
    onChange({ terminals: setup.terminals.map((t) => (t.id === id ? { ...t, ...patch } : t)) })
  }

  const addTerminal = () => {
    onChange({ terminals: [...setup.terminals, { id: makeTerminalId(), terminalId: "", channel: "in_store" as TerminalChannel }] })
  }

  const removeTerminal = (id: string) => {
    onChange({ terminals: setup.terminals.filter((t) => t.id !== id) })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="merchant-id">Merchant ID</Label>
        <Input
          id="merchant-id"
          value={setup.merchantId}
          onChange={(e) => onChange({ merchantId: e.target.value })}
          placeholder="e.g. MID-7743-2210"
        />
      </div>

      <div className="space-y-2.5">
        <Label>Terminal IDs</Label>
        <p className="-mt-1 text-xs text-muted-foreground">
          Add every terminal that accepts payments for this brand, and the channel it's used for.
        </p>

        {setup.terminals.length > 0 && (
          <div className="space-y-2.5">
            {setup.terminals.map((terminal) => (
              <div key={terminal.id} className="flex items-start gap-2.5">
                <Input
                  value={terminal.terminalId}
                  onChange={(e) => updateTerminal(terminal.id, { terminalId: e.target.value })}
                  placeholder="e.g. TID-00921"
                  className="flex-1"
                />
                <Select
                  value={terminal.channel}
                  onValueChange={(v) => updateTerminal(terminal.id, { channel: v as TerminalChannel })}
                >
                  <SelectTrigger className="w-[190px] shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TERMINAL_CHANNEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() => removeTerminal(terminal.id)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button type="button" variant="outline" size="sm" onClick={addTerminal}>
          <Plus className="size-3.5" />
          Add terminal
        </Button>
      </div>
    </div>
  )
}
