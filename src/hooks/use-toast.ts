import { create } from "zustand"

export type ToastItem = {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "destructive"
}

type ToastState = {
  toasts: ToastItem[]
  push: (t: Omit<ToastItem, "id">) => void
  dismiss: (id: string) => void
}

let counter = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    counter += 1
    const id = `toast-${counter}`
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }))
    }, 4000)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))

export function toast(t: Omit<ToastItem, "id">) {
  useToastStore.getState().push(t)
}
