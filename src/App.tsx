import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppShell } from "@/components/layout/app-shell"
import { LoginPage } from "@/pages/login"
import { DashboardPage } from "@/pages/dashboard"
import { BrandsPage } from "@/pages/brands/brands-list"
import { BrandDetailPage } from "@/pages/brands/brand-detail"
import { OnboardingPage } from "@/pages/onboarding/onboarding-wizard"
import { CampaignWizardPage } from "@/pages/campaigns/campaign-wizard"
import { CampaignDetailsPage } from "@/pages/campaigns/campaign-details"
import { InvoicesPage } from "@/pages/invoices"
import { SettingsPage } from "@/pages/settings"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/:brandId" element={<BrandDetailPage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="campaigns/new" element={<CampaignWizardPage />} />
          <Route path="campaigns/:campaignId" element={<CampaignDetailsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
