import { HelpCircle, MailQuestion } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MerchantSetupFields } from "@/components/shared/merchant-setup-fields"
import type { Brand, MerchantSetup } from "@/lib/types"
import { cn } from "@/lib/utils"

export function Step3MerchantSetup({
  draft,
  onUpdate,
}: {
  draft: Partial<Brand>
  onUpdate: (patch: Partial<Brand>) => void
}) {
  const setup: MerchantSetup = draft.merchantSetup || {
    knowsMerchantId: null,
    merchantId: "",
    terminals: [],
    needsLuneContact: false,
  }

  const patchSetup = (p: Partial<MerchantSetup>) => onUpdate({ merchantSetup: { ...setup, ...p } })

  const setKnows = (knows: boolean) => {
    if (knows) {
      patchSetup({
        knowsMerchantId: true,
        needsLuneContact: false,
        terminals: setup.terminals.length > 0 ? setup.terminals : [{ id: `term-${Math.random().toString(36).slice(2, 9)}`, terminalId: "", channel: "in_store" }],
      })
    } else {
      patchSetup({ knowsMerchantId: false, needsLuneContact: true, merchantId: "", terminals: [] })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Merchant Setup</h2>
        <p className="mt-1 text-sm text-muted-foreground">This links your point-of-sale accounts so cashback can be tracked and settled correctly.</p>
      </div>

      <div className="space-y-3">
        <Label>Do you know your Merchant ID?</Label>
        <RadioGroup
          value={setup.knowsMerchantId === null ? undefined : setup.knowsMerchantId ? "yes" : "no"}
          onValueChange={(v) => setKnows(v === "yes")}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { value: "yes", label: "Yes, I know it" },
            { value: "no", label: "No, I don't know it" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border px-4 py-3.5 text-sm font-medium transition-colors",
                (opt.value === "yes" ? setup.knowsMerchantId === true : setup.knowsMerchantId === false)
                  ? "border-primary bg-secondary text-secondary-foreground"
                  : "border-border hover:bg-muted/60"
              )}
            >
              <RadioGroupItem value={opt.value} />
              {opt.label}
            </label>
          ))}
        </RadioGroup>
      </div>

      {setup.knowsMerchantId === true && (
        <div className="animate-fade-in-up">
          <MerchantSetupFields setup={setup} onChange={patchSetup} />
        </div>
      )}

      {setup.knowsMerchantId === false && (
        <div className="flex items-start gap-3 rounded-[var(--radius)] bg-info-bg px-4 py-4 animate-fade-in-up">
          <MailQuestion className="mt-0.5 size-5 shrink-0 text-info-foreground" />
          <div>
            <p className="text-sm font-semibold text-info-foreground">No problem — Lune will take it from here</p>
            <p className="mt-1 text-sm text-info-foreground/85">
              You can continue without blocking your onboarding. A Lune specialist will contact you to confirm your Merchant ID and Terminal ID details before your first campaign goes live.
            </p>
          </div>
        </div>
      )}

      {setup.knowsMerchantId === null && (
        <div className="flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
          <HelpCircle className="size-4 shrink-0" />
          Select an option above to continue.
        </div>
      )}
    </div>
  )
}

export function step3IsValid(draft: Partial<Brand>) {
  const setup = draft.merchantSetup
  if (!setup) return false
  if (setup.knowsMerchantId === false) return true
  if (setup.knowsMerchantId === true) {
    return setup.merchantId.trim().length > 0 && setup.terminals.some((t) => t.terminalId.trim().length > 0)
  }
  return false
}
