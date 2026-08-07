import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Brand, BrandProfile, Campaign, MerchantSetup } from "./types"
import { BANKS, buildSeedBrands, buildSeedCampaigns } from "./data"

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`
}

// Older persisted state stored a single { merchantId, terminals } pair instead of
// merchantAccounts, and terminals had no label field. Repair it in place so brands
// saved before this shape existed don't crash the app on load.
function migrateMerchantSetup(raw: any): MerchantSetup {
  if (!raw) return emptyMerchantSetup()
  if (Array.isArray(raw.merchantAccounts)) {
    return {
      knowsMerchantId: raw.knowsMerchantId ?? null,
      needsLuneContact: raw.needsLuneContact ?? false,
      merchantAccounts: raw.merchantAccounts.map((a: any) => ({
        id: a.id || makeId("acc"),
        merchantId: a.merchantId || "",
        terminals: (a.terminals || []).map((t: any) => ({
          id: t.id || makeId("term"),
          terminalId: t.terminalId || "",
          channel: t.channel || "in_store",
          label: t.label || "",
        })),
      })),
    }
  }
  const legacyTerminals = raw.terminals || []
  const hasLegacyAccount = Boolean(raw.merchantId) || legacyTerminals.length > 0
  return {
    knowsMerchantId: raw.knowsMerchantId ?? null,
    needsLuneContact: raw.needsLuneContact ?? false,
    merchantAccounts: hasLegacyAccount
      ? [
          {
            id: makeId("acc"),
            merchantId: raw.merchantId || "",
            terminals: legacyTerminals.map((t: any) => ({
              id: t.id || makeId("term"),
              terminalId: t.terminalId || "",
              channel: t.channel || "in_store",
              label: t.label || "",
            })),
          },
        ]
      : [],
  }
}

function migrateBrand(raw: any): Brand {
  return { ...raw, merchantSetup: migrateMerchantSetup(raw?.merchantSetup) }
}

export const emptyBrandProfile = (): BrandProfile => ({
  shopChannels: [],
  competitors: [],
  categories: [],
  avgOrderValue: null,
  avgMonthlyOrders: null,
  monthlyMarketingBudget: null,
})

export const emptyMerchantSetup = (): MerchantSetup => ({
  knowsMerchantId: null,
  merchantAccounts: [],
  needsLuneContact: false,
})

type AuthState = {
  user: { name: string; email: string; company: string } | null
  login: (email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email) =>
        set({
          user: {
            name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Merchant",
            email,
            company: "Carrefour",
          },
        }),
      logout: () => set({ user: null }),
    }),
    { name: "lune-merchant-auth" }
  )
)

type AppState = {
  brands: Brand[]
  campaigns: Campaign[]
  draftBrand: Partial<Brand> | null

  startNewBrandDraft: () => string
  updateDraftBrand: (patch: Partial<Brand>) => void
  getDraftOrBrand: (id: string) => Brand | Partial<Brand> | undefined
  completeBrandOnboarding: (id: string) => void
  updateBrand: (id: string, patch: Partial<Brand>) => void
  removeBrand: (id: string) => void

  addCampaign: (c: Omit<Campaign, "id" | "submittedAt" | "status" | "spent">) => Campaign
  advanceCampaignStatus: (id: string) => void
  getCampaignsForBrand: (brandId: string) => Campaign[]

  resetDemoData: () => void
  clearAllData: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      brands: [],
      campaigns: [],
      draftBrand: null,

      startNewBrandDraft: () => {
        const id = makeId("brand")
        set({
          draftBrand: {
            id,
            name: "",
            logoUrl: null,
            logoColor: "#0E3B2E",
            website: "",
            socialMedia: "",
            onboardingComplete: false,
            onboardingStep: 1,
            createdAt: new Date().toISOString(),
            profile: emptyBrandProfile(),
            merchantSetup: emptyMerchantSetup(),
          },
        })
        return id
      },

      updateDraftBrand: (patch) => set((s) => ({ draftBrand: { ...s.draftBrand, ...patch } })),

      getDraftOrBrand: (id) => {
        const s = get()
        if (s.draftBrand?.id === id) return s.draftBrand
        return s.brands.find((b) => b.id === id)
      },

      completeBrandOnboarding: (id) => {
        const draft = get().draftBrand
        if (!draft || draft.id !== id) return
        const brand: Brand = {
          id: draft.id!,
          name: draft.name || "Untitled Brand",
          logoUrl: draft.logoUrl ?? null,
          logoColor: draft.logoColor || "#0E3B2E",
          website: draft.website || "",
          socialMedia: draft.socialMedia || "",
          onboardingComplete: true,
          onboardingStep: 3,
          createdAt: draft.createdAt || new Date().toISOString(),
          profile: draft.profile || emptyBrandProfile(),
          merchantSetup: draft.merchantSetup || emptyMerchantSetup(),
        }
        set((s) => {
          const isFirstBrand = s.brands.length === 0
          return {
            brands: isFirstBrand ? [brand, ...buildSeedBrands()] : [brand, ...s.brands],
            campaigns: isFirstBrand ? buildSeedCampaigns() : s.campaigns,
            draftBrand: null,
          }
        })
      },

      updateBrand: (id, patch) =>
        set((s) => ({ brands: s.brands.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),

      removeBrand: (id) =>
        set((s) => ({
          brands: s.brands.filter((b) => b.id !== id),
          campaigns: s.campaigns.filter((c) => c.brandId !== id),
        })),

      addCampaign: (c) => {
        const campaign: Campaign = {
          ...c,
          id: makeId("camp"),
          submittedAt: new Date().toISOString(),
          status: "submitted",
          spent: 0,
        }
        set((s) => ({ campaigns: [campaign, ...s.campaigns] }))
        return campaign
      },

      advanceCampaignStatus: (id) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) => {
            if (c.id !== id) return c
            const order: Campaign["status"][] = ["submitted", "processing", "bank_approved", "live"]
            const idx = order.indexOf(c.status)
            const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : c.status
            const bankId = next === "bank_approved" && !c.bankId ? BANKS[Math.floor(Math.random() * BANKS.length)].id : c.bankId
            return { ...c, status: next, bankId }
          }),
        })),

      getCampaignsForBrand: (brandId) => get().campaigns.filter((c) => c.brandId === brandId),

      resetDemoData: () => set({ brands: buildSeedBrands(), campaigns: buildSeedCampaigns(), draftBrand: null }),
      clearAllData: () => set({ brands: [], campaigns: [], draftBrand: null }),
    }),
    {
      name: "lune-merchant-app",
      version: 1,
      migrate: (persistedState) => {
        const state = (persistedState as Partial<AppState>) || {}
        return {
          ...state,
          brands: (state.brands || []).map(migrateBrand),
          draftBrand: state.draftBrand ? migrateBrand(state.draftBrand as Brand) : null,
        }
      },
    }
  )
)
