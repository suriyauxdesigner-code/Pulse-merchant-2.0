export type Bank = {
  id: string
  name: string
  shortName: string
  color: string
}

export type TerminalChannel = "in_store" | "online"

export type TerminalEntry = {
  id: string
  terminalId: string
  channel: TerminalChannel
}

export type BrandProfile = {
  shopChannels: string[]
  competitors: string[]
  categories: string[]
  avgOrderValue: number | null
  avgMonthlyOrders: number | null
  monthlyMarketingBudget: number | null
}

export type MerchantSetup = {
  knowsMerchantId: boolean | null
  merchantId: string
  terminals: TerminalEntry[]
  needsLuneContact: boolean
}

export type Brand = {
  id: string
  name: string
  logoUrl: string | null
  logoColor: string
  website: string
  socialMedia: string
  onboardingComplete: boolean
  onboardingStep: number
  createdAt: string
  profile: BrandProfile
  merchantSetup: MerchantSetup
}

export type CampaignGoal = "increase_sales" | "acquire_customers" | "clear_inventory" | "launch_product" | "loyalty"

export type BudgetUtilization = "exhaust" | "duration"

export type CampaignStatus = "submitted" | "processing" | "bank_approved" | "live" | "completed"

export type Campaign = {
  id: string
  brandId: string
  name: string
  goal: CampaignGoal
  bankId: string | null
  budget: number
  budgetUtilization: BudgetUtilization
  durationDays: number | null
  cashbackPercent: number
  cashbackCap: number | null
  holdPeriodDays: number
  minSpend: number | null
  bannerUrl: string | null
  logoUrl: string | null
  primaryColor: string
  description: string
  status: CampaignStatus
  submittedAt: string
  startDate: string | null
  endDate: string | null
  spent: number
}
