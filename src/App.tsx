import { useState } from 'react'
import ContourBackground from './components/ContourBackground'
import Header from './components/Header'
import TabBar from './components/TabBar'
import type { TabId } from './components/TabBar'
import { useAppState } from './data/useAppState'
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
  const { profile, breakdown, history, bookmarks, logPft, toggleBookmark } = useAppState()

  const meta = tabMeta[activeTab]

  return (
    <div className="h-full bg-wp-tan-dark flex items-start justify-center">
      <ContourBackground />

      <div className="relative h-full w-full max-w-[428px] flex flex-col bg-wp-bg overflow-hidden"
        style={{ boxShadow: '0 0 40px rgba(0,0,0,0.18)' }}
      >
        <Header title={meta.title} subtitle={meta.subtitle} />

        <main
          className="flex-1 overflow-y-auto relative z-10 px-4 pt-6"
          style={{ paddingBottom: 24 }}
        >
          {activeTab === 'career' && (
            <CareerTab profile={profile} breakdown={breakdown} onLogPft={logPft} />
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
    </div>
  )
}
