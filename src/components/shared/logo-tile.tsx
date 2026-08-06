import { cn } from "@/lib/utils"

export function LogoTile({
  name,
  color,
  imageUrl,
  shape = "square",
  size = "md",
}: {
  name: string
  color: string
  imageUrl?: string | null
  shape?: "square" | "circle"
  size?: "sm" | "md" | "lg"
}) {
  const sizeClass = size === "sm" ? "size-8 text-[10px]" : size === "lg" ? "size-12 text-sm" : "size-10 text-xs"
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn(
          "shrink-0 border border-border object-cover",
          shape === "circle" ? "rounded-full" : "rounded-[var(--radius-sm)]",
          sizeClass
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border font-bold",
        shape === "circle" ? "rounded-full" : "rounded-[var(--radius-sm)]",
        sizeClass
      )}
      style={{ backgroundColor: `${color}14`, borderColor: `${color}33`, color }}
    >
      {initials}
    </div>
  )
}
