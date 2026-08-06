import { ImageIcon } from "lucide-react"

export function MobileOfferCard({
  brandName,
  logoUrl,
  bannerUrl,
  primaryColor,
  cashbackPercent,
}: {
  brandName: string
  logoUrl: string | null
  bannerUrl: string | null
  primaryColor: string
  cashbackPercent: number
}) {
  return (
    <div className="mx-auto w-[260px] overflow-hidden rounded-[1.75rem] border-[6px] border-neutral-900 bg-white shadow-elevated">
      <div className="relative flex h-28 items-center justify-center bg-muted">
        {bannerUrl ? (
          <img src={bannerUrl} alt="Campaign banner" className="size-full object-cover" />
        ) : (
          <ImageIcon className="size-6 text-muted-foreground/50" />
        )}
        <div
          className="absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-sm"
          style={{ backgroundColor: primaryColor }}
        >
          {cashbackPercent}% Cashback
        </div>
      </div>
      <div className="p-3.5">
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
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-neutral-900">{brandName}</p>
            <p className="truncate text-[11px] text-neutral-500">Offer available now</p>
          </div>
        </div>
        <button
          className="mt-3 w-full rounded-full py-2 text-[12px] font-semibold text-white"
          style={{ backgroundColor: primaryColor }}
        >
          View Offer
        </button>
      </div>
    </div>
  )
}
