import type { BudgetUtilization, CampaignGoal } from "@/lib/types"

export type CampaignDraft = {
  brandId: string
  name: string
  goal: CampaignGoal | ""
  budget: number
  budgetUtilization: BudgetUtilization
  startDate: string
  durationDays: number | null
  cashbackPercent: number
  cashbackCap: number | null
  holdPeriodDays: number
  minSpend: number | null
  bannerUrl: string | null
  logoUrl: string | null
  description: string
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function emptyCampaignDraft(brandId = ""): CampaignDraft {
  return {
    brandId,
    name: "",
    goal: "",
    budget: 10000,
    budgetUtilization: "duration",
    startDate: today(),
    durationDays: 30,
    cashbackPercent: 10,
    cashbackCap: 200,
    holdPeriodDays: 14,
    minSpend: null,
    bannerUrl: null,
    logoUrl: null,
    description: "",
  }
}

export function computeEndDate(startDate: string, durationDays: number | null) {
  if (!durationDays) return null
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000)
  return end.toISOString().slice(0, 10)
}
