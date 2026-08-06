import { ChevronLeft, ImageIcon } from "lucide-react"

export function MobileOfferDetailPreview({
  campaignName,
  brandName,
  logoUrl,
  bannerUrl,
  primaryColor,
  cashbackPercent,
  description,
  cashbackCap,
  minSpend,
  holdPeriodDays,
  validityLabel,
}: {
  campaignName: string
  brandName: string
  logoUrl: string | null
  bannerUrl: string | null
  primaryColor: string
  cashbackPercent: number
  description: string
  cashbackCap: number | null
  minSpend: number | null
  holdPeriodDays: number
  validityLabel: string
}) {
  const terms = [
    `Get ${cashbackPercent}% cashback, capped at ${cashbackCap ? `AED ${cashbackCap.toLocaleString()}` : "no limit"} per customer.`,
    minSpend ? `Minimum spend of AED ${minSpend.toLocaleString()} per transaction.` : "No minimum spend required.",
    `Cashback is credited within ${holdPeriodDays} days of purchase.`,
    `Valid ${validityLabel}.`,
    `Offer applies at participating ${brandName} stores and online.`,
  ]

  return (
    <div className="mx-auto w-[300px] overflow-hidden rounded-[1.75rem] border-[6px] border-neutral-900 bg-white shadow-elevated">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <ChevronLeft className="size-4 text-neutral-500" />
        <span className="text-[12px] font-semibold text-neutral-500">Offer Details</span>
      </div>
      <div className="h-[460px] overflow-y-auto">
        <div className="relative flex h-36 items-center justify-center bg-muted">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Campaign banner" className="size-full object-cover" />
          ) : (
            <ImageIcon className="size-7 text-muted-foreground/50" />
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white">
              {logoUrl ? (
                <img src={logoUrl} alt={brandName} className="size-full object-cover" />
              ) : (
                <span className="text-[11px] font-bold" style={{ color: primaryColor }}>
                  {brandName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-[13px] font-semibold text-neutral-900">{brandName}</p>
            <span
              className="ml-auto rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {cashbackPercent}% back
            </span>
          </div>

          <h3 className="mt-3 text-[15px] font-bold leading-snug text-neutral-900">{campaignName || "Untitled Campaign"}</h3>
          <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-600">
            {description || "Your campaign description will appear here for shoppers."}
          </p>

          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">How it works</p>
            <ol className="mt-2 space-y-2">
              {[
                `Shop at ${brandName} during the offer period.`,
                `${cashbackPercent}% cashback is automatically calculated on your purchase.`,
                `Cashback lands back on your card within ${holdPeriodDays} days.`,
              ].map((step, i) => (
                <li key={i} className="flex gap-2 text-[12px] text-neutral-700">
                  <span
                    className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">Terms &amp; Conditions</p>
            <ul className="mt-2 space-y-1.5">
              {terms.map((term, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-relaxed text-neutral-600">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-neutral-400" />
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-100 p-3">
        <button className="w-full rounded-full py-2.5 text-[13px] font-semibold text-white" style={{ backgroundColor: primaryColor }}>
          Shop Now
        </button>
      </div>
    </div>
  )
}
