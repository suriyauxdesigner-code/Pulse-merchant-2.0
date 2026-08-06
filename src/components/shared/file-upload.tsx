import * as React from "react"
import { UploadCloud, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function FileUpload({
  value,
  onChange,
  hint = "PNG or JPG, up to 5MB",
  aspect = "square",
  className,
}: {
  value: string | null
  onChange: (dataUrl: string | null) => void
  hint?: string
  aspect?: "square" | "wide"
  className?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = React.useState(false)

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  if (value) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius)] border border-border bg-muted",
          aspect === "square" ? "size-28" : "h-40 w-full",
          className
        )}
      >
        <img src={value} alt="Uploaded preview" className="size-full object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/75"
        >
          <X className="size-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed transition-colors",
        dragOver ? "border-primary bg-secondary" : "border-border bg-muted/40 hover:bg-muted/70",
        aspect === "square" ? "size-28" : "h-40 w-full",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {aspect === "square" ? (
        <ImageIcon className="size-5 text-muted-foreground" />
      ) : (
        <UploadCloud className="size-6 text-muted-foreground" />
      )}
      <p className="px-3 text-center text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
