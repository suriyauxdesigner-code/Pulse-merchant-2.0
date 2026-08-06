import * as React from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/lib/store"

export function LoginPage() {
  const { user, login } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = React.useState("dennis@chalhoub.com")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes("@")) {
      setError("Enter a valid email address")
      return
    }
    if (password.length < 4) {
      setError("Enter your password")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      login(email)
      navigate("/")
    }, 600)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
            L
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to Lune</h1>
          <p className="mt-1.5 text-[15px] text-muted-foreground">Sign in to your merchant portal</p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-border bg-card p-7 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <p className="mt-5 rounded-[var(--radius-sm)] bg-muted/60 px-3.5 py-2.5 text-center text-xs text-muted-foreground">
            Demo prototype — any password works for <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Need access? <span className="font-medium text-primary">Contact your Lune account manager</span>
        </p>
      </div>
    </div>
  )
}
