import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, PartyPopper, Send, Store, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WizardStepper } from "@/components/shared/wizard-stepper"
import { EmptyState } from "@/components/shared/empty-state"
import { Step1Basics, step1BasicsIsValid } from "./step1-basics"
import { Step2Budget, step2BudgetIsValid } from "./step2-budget"
import { Step4Assets, step4AssetsIsValid } from "./step4-assets"
import { Review } from "./review"
import { computeEndDate, emptyCampaignDraft } from "./campaign-draft-types"
import { nearestBudgetStep } from "@/lib/data"
import { useAppStore } from "@/lib/store"
import type { Brand } from "@/lib/types"

const STEP_LABELS = ["Basics", "Budget", "Assets", "Review"]
const TOTAL_STEPS = STEP_LABELS.length

function budgetForBrand(brand: Brand | undefined) {
  return brand?.profile.monthlyMarketingBudget ? nearestBudgetStep(brand.profile.monthlyMarketingBudget) : undefined
}

export function CampaignWizardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { brands, addCampaign } = useAppStore()
  const onboardedBrands = brands.filter((b) => b.onboardingComplete)
  const preselectedBrandId = (location.state as { brandId?: string } | null)?.brandId

  const [step, setStep] = React.useState(1)
  const [draft, setDraft] = React.useState(() => {
    const initialBrandId = preselectedBrandId || onboardedBrands[0]?.id || ""
    const base = emptyCampaignDraft(initialBrandId)
    const suggested = budgetForBrand(onboardedBrands.find((b) => b.id === initialBrandId))
    if (suggested) base.budget = suggested
    return base
  })
  const [submittedId, setSubmittedId] = React.useState<string | null>(null)

  const brand = onboardedBrands.find((b) => b.id === draft.brandId)

  const update = (patch: Partial<typeof draft>) =>
    setDraft((d) => {
      const next = { ...d, ...patch }
      if (patch.brandId && patch.brandId !== d.brandId) {
        const suggested = budgetForBrand(onboardedBrands.find((b) => b.id === patch.brandId))
        if (suggested) next.budget = suggested
      }
      return next
    })

  if (onboardedBrands.length === 0) {
    return (
      <div className="mx-auto max-w-lg">
        <EmptyState
          icon={<Store className="size-6" />}
          title="Onboard a brand first"
          description="You need at least one onboarded brand before you can create a campaign."
          action={<Button onClick={() => navigate("/onboarding")}>Onboard a Brand</Button>}
        />
      </div>
    )
  }

  if (submittedId) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center animate-fade-in-up">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-success-bg text-success-foreground">
          <PartyPopper className="size-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Your campaign is live!</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          "{draft.name}" is now live and appears on your Campaign page.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate("/")}>
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate(`/campaigns/${submittedId}`)}>View Campaign</Button>
        </div>
      </div>
    )
  }

  const validators = [step1BasicsIsValid, step2BudgetIsValid, step4AssetsIsValid, () => true]
  const isCurrentValid = validators[step - 1](draft)

  const handleSubmit = () => {
    const endDate = computeEndDate(draft.startDate, draft.durationDays)
    const campaign = addCampaign({
      brandId: draft.brandId,
      name: draft.name,
      goal: draft.goal || "increase_sales",
      budget: draft.budget,
      budgetUtilization: draft.budgetUtilization,
      durationDays: draft.durationDays,
      cashbackPercent: draft.cashbackPercent,
      cashbackCap: draft.cashbackCap,
      holdPeriodDays: draft.holdPeriodDays,
      minSpend: draft.minSpend,
      bannerUrl: draft.bannerUrl,
      logoUrl: draft.logoUrl ?? brand?.logoUrl ?? null,
      primaryColor: brand?.logoColor || "#0E3B2E",
      description: draft.description,
      startDate: draft.startDate,
      endDate,
    })
    setSubmittedId(campaign.id)
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1)
    else handleSubmit()
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Create Campaign</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mb-8">
        <WizardStepper steps={STEP_LABELS} currentStep={step} />
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          {step === 1 && <Step1Basics draft={draft} onUpdate={update} brands={onboardedBrands} />}
          {step === 2 && <Step2Budget draft={draft} onUpdate={update} brand={brand} />}
          {step === 3 && <Step4Assets draft={draft} onUpdate={update} brand={brand} />}
          {step === 4 && <Review draft={draft} brand={brand} />}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}>
          <ArrowLeft className="size-4" />
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        <Button onClick={handleNext} disabled={!isCurrentValid} size="lg">
          {step === TOTAL_STEPS ? (
            <>
              <Send className="size-4" />
              Submit Campaign
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
