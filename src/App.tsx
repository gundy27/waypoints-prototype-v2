import { useState } from 'react'
import Header from './components/Header'
import TabBar from './components/TabBar'
import MenuDrawer from './components/MenuDrawer'
import OnboardingFlow from './components/OnboardingFlow'
import type { TabId } from './components/TabBar'
import { useAppState } from './data/useAppState'
import type { OnboardingData } from './data/useAppState'
import CareerTab from './tabs/CareerTab'
import FitnessTab from './tabs/FitnessTab'
import PocketbookTab from './tabs/PocketbookTab'
import MaradminsTab from './tabs/MaradminsTab'

const tabMeta: Record<TabId, { title: string; subtitle?: string }> = {
  career: { title: 'Waypoints', subtitle: 'LCpl Martinez — 0311' },
  fitness: { title: 'Fitness' },
  pocketbook: { title: 'Pocketbook' },
  maradmins: { title: 'MARADMINS' },
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('career')
  const [menuOpen, setMenuOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const { profile, breakdown, history, compositeHist, bookmarks, logPft, submitOnboarding, resetToMockData, toggleBookmark } = useAppState()

  const careerSubtitle = `${profile.name} — ${profile.mos.split(' ')[0]}`
  const meta: { title: string; subtitle?: string } = {
    ...tabMeta[activeTab],
    ...(activeTab === 'career' ? { subtitle: careerSubtitle } : {}),
  }

  function handleOnboardingComplete(data: OnboardingData) {
    submitOnboarding(data)
    setOnboardingOpen(false)
    setActiveTab('career')
  }

  return (
    <div className="h-full bg-black flex items-start justify-center">

      <div
        className="relative h-full w-full max-w-[428px] flex flex-col overflow-hidden"
        style={{
          boxShadow: '0 0 40px rgba(0,0,0,0.18)',
          backgroundImage: 'url(/tan-contours.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Header title={meta.title} subtitle={meta.subtitle} onMenuOpen={() => setMenuOpen(true)} />

        <main
          className="flex-1 overflow-y-auto relative z-10 px-4 pt-6 bg-transparent"
          style={{ paddingBottom: 32 }}
        >
          {activeTab === 'career' && (
            <CareerTab profile={profile} breakdown={breakdown} compositeHistory={compositeHist} onLogPft={logPft} />
          )}
          {activeTab === 'fitness' && (
            <FitnessTab profile={profile} history={history} onLogPft={logPft} />
          )}
          {activeTab === 'pocketbook' && (
            <PocketbookTab bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />
          )}
          {activeTab === 'maradmins' && <MaradminsTab />}
        </main>

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onStartOnboarding={() => setOnboardingOpen(true)}
        onResetData={resetToMockData}
      />

      {onboardingOpen && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onDismiss={() => setOnboardingOpen(false)}
        />
      )}
    </div>
  )
}
