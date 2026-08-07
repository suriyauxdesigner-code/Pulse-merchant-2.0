import * as React from "react"
import type { ReactNode } from "react"
import { Pencil, Save, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PageHeader } from "@/components/shared/page-header"
import { buildTeamMembers } from "@/lib/data"
import { useAuthStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

const TEAM_MEMBERS = buildTeamMembers()
const PAGE_SIZE_OPTIONS = [8, 10, 20, 50]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function ReadonlyField({ label, value, icon, hint }: { label: string; value: string; icon?: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex h-10 items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-muted/40 px-3.5 text-sm text-foreground">
        {icon}
        {value}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function PagerButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] border border-border text-foreground disabled:pointer-events-none disabled:opacity-40 hover:bg-muted"
    >
      {children}
    </button>
  )
}

export function SettingsPage() {
  const { user, updateProfile } = useAuthStore()
  const [editOpen, setEditOpen] = React.useState(false)
  const [form, setForm] = React.useState({ company: user?.company || "", website: user?.website || "" })
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(8)

  const totalPages = Math.max(1, Math.ceil(TEAM_MEMBERS.length / pageSize))
  const pageItems = TEAM_MEMBERS.slice((page - 1) * pageSize, page * pageSize)
  const rangeStart = (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, TEAM_MEMBERS.length)

  const openEdit = () => {
    setForm({ company: user?.company || "", website: user?.website || "" })
    setEditOpen(true)
  }

  const handleSave = () => {
    updateProfile(form)
    setEditOpen(false)
    toast({ title: "Merchant profile updated", variant: "success" })
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Settings" description="Manage your merchant profile, team, and account security." />

      <Tabs defaultValue="profile">
        <TabsList className="mb-5">
          <TabsTrigger value="profile">Merchant Profile</TabsTrigger>
          <TabsTrigger value="team">Team directory</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle>Merchant details</CardTitle>
                <CardDescription>Your public-facing merchant information.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={openEdit}>
                <Pencil className="size-4" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <ReadonlyField label="Display name" value={user?.company || "—"} />
                <ReadonlyField label="Website" value={user?.website || "—"} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ReadonlyField
                  label="Region"
                  icon={<span>🇦🇪</span>}
                  value="United Arab Emirates"
                  hint="Managed by Lune and cannot be changed"
                />
                <ReadonlyField
                  label="Currency"
                  icon={<span>🇦🇪</span>}
                  value="AED"
                  hint="Derived automatically from your region"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Badge variant="success" dot>
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Team directory</CardTitle>
              <CardDescription>
                Showing {rangeStart}–{rangeEnd} of {TEAM_MEMBERS.length} members
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created at</TableHead>
                    <TableHead>Updated at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{member.email[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">{member.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="primary">{member.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(member.createdAt)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(member.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Rows per page
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v))
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="mr-1.5 text-sm text-foreground">
                  Page {page} of {totalPages}
                </span>
                <PagerButton onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="size-4" />
                </PagerButton>
                <PagerButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="size-4" />
                </PagerButton>
                <PagerButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="size-4" />
                </PagerButton>
                <PagerButton onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                  <ChevronsRight className="size-4" />
                </PagerButton>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit merchant details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="display-name">Display name</Label>
              <Input id="display-name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              <X className="size-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="size-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
