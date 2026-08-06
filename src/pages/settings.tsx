import * as React from "react"
import { RotateCcw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/shared/page-header"
import { useAppStore, useAuthStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

export function SettingsPage() {
  const { user } = useAuthStore()
  const { resetDemoData, clearAllData } = useAppStore()
  const [notifyStatus, setNotifyStatus] = React.useState(true)
  const [notifyBilling, setNotifyBilling] = React.useState(true)
  const [clearOpen, setClearOpen] = React.useState(false)

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Manage your company profile and portal preferences" />

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Company</CardTitle>
            <CardDescription>Your merchant account information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Company Name</Label>
              <Input value={user?.company || ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Account Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what you'd like to be notified about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Campaign status updates</p>
                <p className="text-sm text-muted-foreground">Get notified when a campaign changes status</p>
              </div>
              <Switch checked={notifyStatus} onCheckedChange={setNotifyStatus} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Billing & invoices</p>
                <p className="text-sm text-muted-foreground">Receive a copy of invoices by email</p>
              </div>
              <Switch checked={notifyBilling} onCheckedChange={setNotifyBilling} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/25">
          <CardHeader>
            <CardTitle>Demo Data</CardTitle>
            <CardDescription>This prototype stores data in your browser's local storage.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                resetDemoData()
                toast({ title: "Demo data restored", description: "Sample brands and campaigns have been reloaded." })
              }}
            >
              <RotateCcw className="size-4" />
              Reset to sample data
            </Button>
            <Button variant="destructive" onClick={() => setClearOpen(true)}>
              <Trash2 className="size-4" />
              Clear all brands & campaigns
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all data?</DialogTitle>
            <DialogDescription>
              This removes every brand and campaign from this prototype so you can see the empty-state experience. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                clearAllData()
                setClearOpen(false)
                toast({ title: "All data cleared", variant: "destructive" })
              }}
            >
              Clear everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
