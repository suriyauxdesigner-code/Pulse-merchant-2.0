import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { useToastStore } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToastStore()

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 w-[22rem]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-start gap-3 rounded-[var(--radius)] border bg-card p-4 shadow-popover animate-fade-in-up",
            t.variant === "success" && "border-success/20",
            t.variant === "destructive" && "border-destructive/20",
            (!t.variant || t.variant === "default") && "border-border"
          )}
        >
          {t.variant === "success" && <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />}
          {t.variant === "destructive" && <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />}
          {(!t.variant || t.variant === "default") && <Info className="size-5 text-primary shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{t.title}</p>
            {t.description && <p className="text-sm text-muted-foreground mt-0.5">{t.description}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
