import { Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagSearchInput } from "@/components/shared/tag-search-input"
import { TERMINAL_CHANNEL_OPTIONS } from "@/lib/data"
import type { MerchantAccount, MerchantSetup, TerminalChannel, TerminalEntry } from "@/lib/types"

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function makeEmptyTerminal(): TerminalEntry {
  return { id: makeId("term"), terminalId: "", channel: "in_store" }
}

export function makeEmptyMerchantAccount(): MerchantAccount {
  return { id: makeId("acc"), merchantId: "", labels: [], terminals: [makeEmptyTerminal()] }
}

export function MerchantSetupFields({
  setup,
  onChange,
}: {
  setup: MerchantSetup
  onChange: (patch: Partial<MerchantSetup>) => void
}) {
  const updateAccount = (accountId: string, patch: Partial<MerchantAccount>) => {
    onChange({
      merchantAccounts: setup.merchantAccounts.map((a) => (a.id === accountId ? { ...a, ...patch } : a)),
    })
  }

  const addAccount = () => {
    onChange({ merchantAccounts: [...setup.merchantAccounts, makeEmptyMerchantAccount()] })
  }

  const removeAccount = (accountId: string) => {
    onChange({ merchantAccounts: setup.merchantAccounts.filter((a) => a.id !== accountId) })
  }

  const updateTerminal = (accountId: string, terminalId: string, patch: Partial<TerminalEntry>) => {
    const account = setup.merchantAccounts.find((a) => a.id === accountId)
    if (!account) return
    updateAccount(accountId, { terminals: account.terminals.map((t) => (t.id === terminalId ? { ...t, ...patch } : t)) })
  }

  const addTerminal = (accountId: string) => {
    const account = setup.merchantAccounts.find((a) => a.id === accountId)
    if (!account) return
    updateAccount(accountId, { terminals: [...account.terminals, makeEmptyTerminal()] })
  }

  const removeTerminal = (accountId: string, terminalId: string) => {
    const account = setup.merchantAccounts.find((a) => a.id === accountId)
    if (!account) return
    updateAccount(accountId, { terminals: account.terminals.filter((t) => t.id !== terminalId) })
  }

  return (
    <div className="space-y-4">
      {setup.merchantAccounts.map((account, index) => (
        <div key={account.id} className="space-y-4 rounded-[var(--radius)] border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`merchant-id-${account.id}`}>
              Merchant ID{setup.merchantAccounts.length > 1 ? ` #${index + 1}` : ""}
            </Label>
            {setup.merchantAccounts.length > 1 && (
              <button
                type="button"
                onClick={() => removeAccount(account.id)}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive"
              >
                <X className="size-3.5" />
                Remove
              </button>
            )}
          </div>
          <Input
            id={`merchant-id-${account.id}`}
            value={account.merchantId}
            onChange={(e) => updateAccount(account.id, { merchantId: e.target.value })}
            placeholder="e.g. MID-7743-2210"
          />

          <div className="space-y-2">
            <Label>Labels</Label>
            <p className="-mt-1 text-xs text-muted-foreground">
              Tag this Merchant ID so you can find it later — city, branch name, anything memorable. Add as many as you like.
            </p>
            <TagSearchInput
              suggestions={[]}
              selected={account.labels}
              onChange={(v) => updateAccount(account.id, { labels: v })}
              placeholder="Type a label and press Enter — e.g. Bangalore, Koramangala"
            />
          </div>

          <div className="space-y-2.5">
            <Label>Terminal IDs</Label>
            <p className="-mt-1 text-xs text-muted-foreground">
              Add every terminal under this Merchant ID and the channel it's used for.
            </p>

            {account.terminals.length > 0 && (
              <div className="space-y-2.5">
                {account.terminals.map((terminal) => (
                  <div key={terminal.id} className="flex items-start gap-2.5">
                    <Input
                      value={terminal.terminalId}
                      onChange={(e) => updateTerminal(account.id, terminal.id, { terminalId: e.target.value })}
                      placeholder="e.g. TID-00921"
                      className="flex-1"
                    />
                    <Select
                      value={terminal.channel}
                      onValueChange={(v) => updateTerminal(account.id, terminal.id, { channel: v as TerminalChannel })}
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
                      onClick={() => removeTerminal(account.id, terminal.id)}
                      className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button type="button" variant="outline" size="sm" onClick={() => addTerminal(account.id)}>
              <Plus className="size-3.5" />
              Add terminal
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addAccount}>
        <Plus className="size-4" />
        Add another Merchant ID
      </Button>
    </div>
  )
}
