import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, CheckCircle2, PartyPopper, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WizardStepper } from "@/components/shared/wizard-stepper"
import { Step1BrandInfo, step1IsValid } from "./step1-brand-info"
import { Step2BrandProfile, step2IsValid } from "./step2-brand-profile"
import { Step3MerchantSetup, step3IsValid } from "./step3-merchant-setup"
import { useAppStore } from "@/lib/store"

const STEP_LABELS = ["Brand Information", "Brand Profile", "Merchant Setup"]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { draftBrand, startNewBrandDraft, updateDraftBrand, completeBrandOnboarding, brands } = useAppStore()
  const [step, setStep] = React.useState(1)
  const [done, setDone] = React.useState(false)
  const initializedRef = React.useRef(false)

  React.useEffect(() => {
    if (!draftBrand && !initializedRef.current) {
      initializedRef.current = true
      startNewBrandDraft()
    }
  }, [draftBrand, startNewBrandDraft])

  if (done) {
    const brand = brands[0]
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center animate-fade-in-up">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-success-bg text-success-foreground">
          <PartyPopper className="size-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{brand?.name || "Your brand"} is onboarded!</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          {brand?.merchantSetup.needsLuneContact
            ? "We'll be in touch shortly to confirm your merchant setup. In the meantime, feel free to explore your dashboard."
            : "Your brand now appears in Brand Management. You're ready to launch your first campaign."}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate("/")}>
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate("/campaigns/new", { state: { brandId: brand?.id } })}>
            <Plus className="size-4" />
            Create a Campaign
          </Button>
        </div>
      </div>
    )
  }

  if (!draftBrand) {
    return <div className="py-16 text-center text-muted-foreground">Preparing onboarding...</div>
  }

  const validators = [step1IsValid, step2IsValid, step3IsValid]
  const isCurrentValid = validators[step - 1](draftBrand)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      completeBrandOnboarding(draftBrand.id!)
      setDone(true)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Onboard a Brand</h1>
        <button
          onClick={() => navigate("/brands")}
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
          {step === 1 && <Step1BrandInfo draft={draftBrand} onUpdate={updateDraftBrand} />}
          {step === 2 && <Step2BrandProfile draft={draftBrand} onUpdate={updateDraftBrand} />}
          {step === 3 && <Step3MerchantSetup draft={draftBrand} onUpdate={updateDraftBrand} />}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => (step === 1 ? navigate("/brands") : setStep(step - 1))}>
          <ArrowLeft className="size-4" />
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        <Button onClick={handleNext} disabled={!isCurrentValid} size="lg">
          {step === 3 ? (
            <>
              <CheckCircle2 className="size-4" />
              Complete Onboarding
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
