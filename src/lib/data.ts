import type { Bank, Brand, Campaign, TerminalChannel } from "./types"

export const BANKS: Bank[] = [
  { id: "dib", name: "Dubai Islamic Bank", shortName: "DIB", color: "#0B5D3B" },
  { id: "adcb", name: "ADCB", shortName: "ADCB", color: "#DA1E28" },
  { id: "mashreq", name: "Mashreq", shortName: "Mashreq", color: "#F5A623" },
  { id: "adib", name: "ADIB", shortName: "ADIB", color: "#1B75BB" },
  { id: "enbd", name: "Emirates NBD", shortName: "ENBD", color: "#1E2A5E" },
  { id: "rakbank", name: "RAKBANK", shortName: "RAK", color: "#E4002B" },
  { id: "fab", name: "First Abu Dhabi Bank", shortName: "FAB", color: "#8A1538" },
  { id: "cbd", name: "Commercial Bank of Dubai", shortName: "CBD", color: "#00539B" },
]

export const bankById = (id: string | null | undefined) => BANKS.find((b) => b.id === id)

// A neutral placeholder logo (colored square + abstract mark) for brands that haven't
// uploaded their own — every brand should render an actual logo image, not just initials.
export function defaultLogo(color: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' rx='10' fill='${color}'/><circle cx='20' cy='20' r='9' fill='white' fill-opacity='0.95'/></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const SHOP_CHANNEL_OPTIONS = [
  "Malls & shopping centers",
  "High street / standalone stores",
  "Online marketplace",
  "Brand's own e-commerce site",
  "Social commerce (Instagram/TikTok)",
  "Airport retail",
  "Supermarkets & hypermarkets",
]

export const CATEGORY_OPTIONS = [
  "Fashion & Apparel",
  "Beauty & Personal Care",
  "Footwear",
  "Home & Living",
  "Electronics",
  "Groceries & Supermarket",
  "Jewellery & Accessories",
  "Sports & Outdoors",
  "Kids & Baby",
  "Health & Wellness",
  "Restaurants & F&B",
  "Travel & Leisure",
]

export const KNOWN_BRANDS = [
  "Faces", "Tryano", "Tanagra", "LEVEL Shoes", "Debenhams", "Sun & Sand Sports",
  "Aldo", "Steve Madden", "Charles & Keith", "Vero Moda", "Jack & Jones",
  "Bath & Body Works", "The Body Shop", "Sephora", "MAC Cosmetics", "Nike",
  "Adidas", "H&M", "Zara", "Centrepoint", "Home Centre", "Carrefour",
  "Lulu Hypermarket", "Namshi", "Ounass", "Virgin Megastore", "Jashanmal",
]

export const CAMPAIGN_GOALS: { value: string; label: string; description: string }[] = [
  { value: "increase_sales", label: "Increase Sales", description: "Drive overall transaction volume and revenue" },
  { value: "acquire_customers", label: "Acquire New Customers", description: "Attract first-time shoppers to your brand" },
  { value: "clear_inventory", label: "Clear Inventory", description: "Move seasonal or excess stock quickly" },
  { value: "launch_product", label: "Launch a Product", description: "Create buzz around a new collection or product" },
  { value: "loyalty", label: "Reward Loyal Customers", description: "Increase repeat purchases and retention" },
]

export const BUDGET_STEPS = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000]

export function nearestBudgetStep(value: number) {
  return BUDGET_STEPS.reduce((closest, step) => (Math.abs(step - value) < Math.abs(closest - value) ? step : closest), BUDGET_STEPS[0])
}

export const DURATION_OPTIONS = [
  { value: 14, label: "2 weeks" },
  { value: 30, label: "1 month" },
  { value: 60, label: "2 months" },
  { value: 90, label: "3 months" },
]

export const BRAND_COLOR_PRESETS = [
  "#0E3B2E", "#8A1538", "#1E2A5E", "#DA1E28", "#F5A623",
  "#1B75BB", "#6B21A8", "#0F766E", "#B45309", "#111827",
]

export const TERMINAL_CHANNEL_OPTIONS: { value: TerminalChannel; label: string }[] = [
  { value: "in_store", label: "In-Store (POS)" },
  { value: "online", label: "Online / E-commerce" },
]

const now = "2026-06-01T09:00:00.000Z"

export function buildSeedBrands(): Brand[] {
  return [
    {
      id: "brand-faces",
      name: "Faces",
      logoUrl: defaultLogo("#0E3B2E"),
      logoColor: "#0E3B2E",
      website: "https://faces.com",
      socialMedia: "@facesbeauty",
      onboardingComplete: true,
      onboardingStep: 3,
      createdAt: now,
      profile: {
        shopChannels: ["Malls & shopping centers", "Brand's own e-commerce site"],
        competitors: ["Sephora", "MAC Cosmetics"],
        categories: ["Beauty & Personal Care"],
        avgOrderValue: 220,
        avgMonthlyOrders: 4200,
        monthlyMarketingBudget: 45000,
      },
      merchantSetup: {
        knowsMerchantId: true,
        merchantAccounts: [
          {
            id: "acc-faces-1",
            merchantId: "MID-7743-2210",
            labels: ["Mall of the Emirates", "Dubai"],
            terminals: [{ id: "t-faces-1", terminalId: "TID-00921", channel: "in_store" }],
          },
          {
            id: "acc-faces-2",
            merchantId: "MID-7743-2211",
            labels: ["Dubai Mall", "Dubai"],
            terminals: [
              { id: "t-faces-2", terminalId: "TID-00922", channel: "in_store" },
              { id: "t-faces-3", terminalId: "TID-ONLINE-14", channel: "online" },
            ],
          },
        ],
        needsLuneContact: false,
      },
    },
    {
      id: "brand-tryano",
      name: "Tryano",
      logoUrl: defaultLogo("#8A1538"),
      logoColor: "#8A1538",
      website: "https://tryano.com",
      socialMedia: "@tryano",
      onboardingComplete: true,
      onboardingStep: 3,
      createdAt: now,
      profile: {
        shopChannels: ["Malls & shopping centers"],
        competitors: ["Debenhams", "Centrepoint"],
        categories: ["Fashion & Apparel"],
        avgOrderValue: 540,
        avgMonthlyOrders: 1800,
        monthlyMarketingBudget: 60000,
      },
      merchantSetup: {
        knowsMerchantId: true,
        merchantAccounts: [
          {
            id: "acc-tryano-1",
            merchantId: "MID-7743-3381",
            labels: ["Dubai Mall"],
            terminals: [{ id: "t-tryano-1", terminalId: "TID-00921", channel: "in_store" }],
          },
        ],
        needsLuneContact: false,
      },
    },
    {
      id: "brand-tanagra",
      name: "Tanagra",
      logoUrl: defaultLogo("#1E2A5E"),
      logoColor: "#1E2A5E",
      website: "https://tanagra.com",
      socialMedia: "@tanagra.uae",
      onboardingComplete: true,
      onboardingStep: 3,
      createdAt: now,
      profile: {
        shopChannels: ["Malls & shopping centers", "Online marketplace"],
        competitors: ["Home Centre"],
        categories: ["Home & Living"],
        avgOrderValue: 310,
        avgMonthlyOrders: 2600,
        monthlyMarketingBudget: 38000,
      },
      merchantSetup: {
        knowsMerchantId: false,
        merchantAccounts: [],
        needsLuneContact: true,
      },
    },
    {
      id: "brand-level",
      name: "LEVEL Shoes",
      logoUrl: defaultLogo("#111827"),
      logoColor: "#111827",
      website: "https://levelshoes.com",
      socialMedia: "@levelshoes",
      onboardingComplete: true,
      onboardingStep: 3,
      createdAt: now,
      profile: {
        shopChannels: ["Malls & shopping centers", "Brand's own e-commerce site"],
        competitors: ["Aldo", "Steve Madden"],
        categories: ["Footwear"],
        avgOrderValue: 780,
        avgMonthlyOrders: 1200,
        monthlyMarketingBudget: 52000,
      },
      merchantSetup: {
        knowsMerchantId: true,
        merchantAccounts: [
          {
            id: "acc-level-1",
            merchantId: "MID-7743-5502",
            labels: ["Mall of the Emirates", "Dubai"],
            terminals: [
              { id: "t-level-1", terminalId: "TID-04471", channel: "in_store" },
              { id: "t-level-2", terminalId: "TID-ONLINE-08", channel: "online" },
            ],
          },
        ],
        needsLuneContact: false,
      },
    },
  ]
}

export function buildSeedCampaigns(): Campaign[] {
  return [
    {
      id: "camp-1", brandId: "brand-faces", name: "Beauty Treats", goal: "increase_sales",
      bankId: "dib", budget: 30000, budgetUtilization: "duration", durationDays: 60,
      cashbackPercent: 6, cashbackCap: 150, holdPeriodDays: 14, minSpend: 100,
      bannerUrl: null, logoUrl: null, primaryColor: "#0E3B2E",
      description: "Get 6% cashback on all beauty and skincare purchases at Faces.",
      status: "completed", submittedAt: "2026-04-20T10:00:00.000Z",
      startDate: "2026-05-01", endDate: "2026-06-30", spent: 30000,
    },
    {
      id: "camp-2", brandId: "brand-tryano", name: "Summer Fashion Fiesta", goal: "clear_inventory",
      bankId: "adcb", budget: 50000, budgetUtilization: "duration", durationDays: 60,
      cashbackPercent: 10, cashbackCap: 300, holdPeriodDays: 21, minSpend: 200,
      bannerUrl: null, logoUrl: null, primaryColor: "#8A1538",
      description: "10% cashback storewide on summer collections at Tryano.",
      status: "live", submittedAt: "2026-06-15T10:00:00.000Z",
      startDate: "2026-07-01", endDate: "2026-08-31", spent: 18400,
    },
    {
      id: "camp-3", brandId: "brand-faces", name: "Fall Harvest Collection", goal: "launch_product",
      bankId: "mashreq", budget: 20000, budgetUtilization: "duration", durationDays: 60,
      cashbackPercent: 12, cashbackCap: 200, holdPeriodDays: 14, minSpend: null,
      bannerUrl: null, logoUrl: null, primaryColor: "#0E3B2E",
      description: "12% cashback on the new Fall Harvest makeup collection.",
      status: "completed", submittedAt: "2026-08-10T10:00:00.000Z",
      startDate: "2026-09-01", endDate: "2026-10-31", spent: 19800,
    },
    {
      id: "camp-4", brandId: "brand-tanagra", name: "Ramadan Rewards", goal: "loyalty",
      bankId: "adib", budget: 75000, budgetUtilization: "duration", durationDays: 60,
      cashbackPercent: 15, cashbackCap: 400, holdPeriodDays: 30, minSpend: 250,
      bannerUrl: null, logoUrl: null, primaryColor: "#1E2A5E",
      description: "15% cashback for loyal Tanagra customers this Ramadan.",
      status: "live", submittedAt: "2026-10-05T10:00:00.000Z",
      startDate: "2026-11-01", endDate: "2026-12-31", spent: 41200,
    },
    {
      id: "camp-5", brandId: "brand-level", name: "Eid Shopping Bonanza", goal: "increase_sales",
      bankId: "enbd", budget: 100000, budgetUtilization: "exhaust", durationDays: null,
      cashbackPercent: 17, cashbackCap: 500, holdPeriodDays: 21, minSpend: 300,
      bannerUrl: null, logoUrl: null, primaryColor: "#111827",
      description: "17% cashback on all footwear for Eid at LEVEL Shoes.",
      status: "completed", submittedAt: "2025-12-10T10:00:00.000Z",
      startDate: "2026-01-01", endDate: "2026-02-28", spent: 100000,
    },
    {
      id: "camp-6", brandId: "brand-tanagra", name: "Back to School", goal: "acquire_customers",
      bankId: "rakbank", budget: 10000, budgetUtilization: "duration", durationDays: 60,
      cashbackPercent: 3, cashbackCap: 60, holdPeriodDays: 14, minSpend: null,
      bannerUrl: null, logoUrl: null, primaryColor: "#1E2A5E",
      description: "3% cashback on home & living essentials for the new school year.",
      status: "live", submittedAt: "2026-02-15T10:00:00.000Z",
      startDate: "2026-03-01", endDate: "2026-04-30", spent: 3100,
    },
    {
      id: "camp-7", brandId: "brand-level", name: "Halloween Spooktacular", goal: "clear_inventory",
      bankId: "adcb", budget: 20000, budgetUtilization: "duration", durationDays: 60,
      cashbackPercent: 8, cashbackCap: 180, holdPeriodDays: 14, minSpend: null,
      bannerUrl: null, logoUrl: null, primaryColor: "#111827",
      description: "8% cashback on seasonal footwear styles.",
      status: "completed", submittedAt: "2026-04-01T10:00:00.000Z",
      startDate: "2026-05-01", endDate: "2026-06-30", spent: 15600,
    },
    {
      id: "camp-8", brandId: "brand-tryano", name: "Thanksgiving Feast Special", goal: "increase_sales",
      bankId: "enbd", budget: 50000, budgetUtilization: "duration", durationDays: 60,
      cashbackPercent: 20, cashbackCap: 350, holdPeriodDays: 21, minSpend: 200,
      bannerUrl: null, logoUrl: null, primaryColor: "#8A1538",
      description: "20% cashback storewide for a limited time.",
      status: "live", submittedAt: "2026-06-20T10:00:00.000Z",
      startDate: "2026-07-01", endDate: "2026-08-31", spent: 27300,
    },
  ]
}
