import { useState, useRef } from 'react'
import Header from './components/Header'
import TabBar from './components/TabBar'
import OnboardingFlow from './components/OnboardingFlow'
import ScoreDetailOverlay from './components/ScoreDetailOverlay'
import NotificationPrompt from './components/NotificationPrompt'
import NotificationBell from './components/NotificationBell'
import type { AppNotification } from './components/NotificationBell'
import PostOnboardingPlaceholder from './components/PostOnboardingPlaceholder'
import PftModal from './components/PftModal'
import NotificationPreferencesOverlay from './components/NotificationPreferencesOverlay'
import type { TabId } from './components/TabBar'
import { useAppState } from './data/useAppState'
import type { OnboardingData } from './data/useAppState'
import CareerTab from './tabs/CareerTab'
import PocketbookTab from './tabs/PocketbookTab'
import MaradminsTab from './tabs/MaradminsTab'
import AccountTab from './tabs/AccountTab'

const tabMeta: Record<TabId, { title: string; subtitle?: string }> = {
  career: { title: 'Waypoints', subtitle: 'LCpl Martinez — 0311' },
  pocketbook: { title: 'Pocketbook' },
  maradmins: { title: 'MARADMINS' },
  account: { title: 'Account' },
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'maradmin-045-25',
    title: 'Cutting Score Dropped',
    description: 'MARADMIN 045/25: Cutting score for 0311 dropped 20 points this quarter to 780.',
    reason: '0311 cutting score changed: 800 → 780',
    read: false,
    targetTab: 'maradmins',
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('career')
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [showPostOnboarding, setShowPostOnboarding] = useState(false)
  const [showScoreDetail, setShowScoreDetail] = useState(false)
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)
  const [showPftModal, setShowPftModal] = useState(false)
  const [showNotifPrefs, setShowNotifPrefs] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS)
  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const postOnboardingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const {
    profile, breakdown, compositeHist, bookmarks, notificationPromptShown,
    promotionWindow, cutScoreProjection, rankedOpportunities,
    logPft, submitOnboarding, resetToMockData, toggleBookmark, markNotificationShown,
  } = useAppState()

  function handleScoreDetailClose() {
    setShowScoreDetail(false)
    if (!notificationPromptShown) {
      notifTimerRef.current = setTimeout(() => {
        setShowNotificationPrompt(true)
      }, 2000)
    }
  }

  function handleNotificationDismiss() {
    if (notifTimerRef.current) {
      clearTimeout(notifTimerRef.current)
    }
    markNotificationShown()
    setShowNotificationPrompt(false)
  }

  function handleBellNotificationClick(notification: AppNotification) {
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    setBellOpen(false)
    if (notification.targetTab) {
      setActiveTab(notification.targetTab)
    }
  }

  const careerSubtitle = `${profile.name} — ${profile.mos.split(' ')[0]}`
  const meta: { title: string; subtitle?: string } = {
    ...tabMeta[activeTab],
    ...(activeTab === 'career' ? { subtitle: careerSubtitle } : {}),
  }

  function handleOnboardingComplete(data: OnboardingData) {
    submitOnboarding(data)
    setOnboardingOpen(false)
    setActiveTab('career')
    setShowPostOnboarding(true)

    if (postOnboardingTimerRef.current) {
      clearTimeout(postOnboardingTimerRef.current)
    }
    postOnboardingTimerRef.current = setTimeout(() => {
      setShowPostOnboarding(false)
    }, 4000)
  }

  return (
    <div className="h-full bg-black flex items-start justify-center">

      <div
        className="relative h-full w-full max-w-[428px] flex flex-col overflow-hidden bg-wp-bg"
        style={{
          boxShadow: '0 0 40px rgba(0,0,0,0.18)',
        }}
      >
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/tan-contours.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.25,
          }}
        />

        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          rightSlot={
            <NotificationBell
              notifications={notifications}
              isOpen={bellOpen}
              onToggle={() => setBellOpen(prev => !prev)}
              onClose={() => setBellOpen(false)}
              onNotificationClick={handleBellNotificationClick}
            />
          }
        />

        <main
          className="flex-1 overflow-y-auto relative z-10 px-4 pt-6 bg-transparent"
          style={{ paddingBottom: 32 }}
        >
          {activeTab === 'career' && (
            <CareerTab
              profile={profile}
              breakdown={breakdown}
              compositeHistory={compositeHist}
              promotionWindow={promotionWindow}
              cutScoreProjection={cutScoreProjection}
              rankedOpportunities={rankedOpportunities}
              onOpenScoreDetail={() => setShowScoreDetail(true)}
            />
          )}
          {activeTab === 'pocketbook' && (
            <PocketbookTab bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />
          )}
          {activeTab === 'maradmins' && <MaradminsTab />}
          {activeTab === 'account' && (
            <AccountTab
              profile={profile}
              onStartOnboarding={() => setOnboardingOpen(true)}
              onResetData={resetToMockData}
              onOpenNotifications={() => setShowNotifPrefs(true)}
            />
          )}
        </main>

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {showNotificationPrompt && (
          <NotificationPrompt
            mosCode={profile.mos.split(' ')[0]}
            onDismiss={handleNotificationDismiss}
          />
        )}

        {onboardingOpen && (
          <OnboardingFlow
            onComplete={handleOnboardingComplete}
            onDismiss={() => setOnboardingOpen(false)}
          />
        )}

        {showPostOnboarding && (
          <PostOnboardingPlaceholder profile={profile} />
        )}

        {showScoreDetail && (
          <ScoreDetailOverlay
            profile={profile}
            breakdown={breakdown}
            compositeHistory={compositeHist}
            cutScoreProjection={cutScoreProjection}
            onClose={handleScoreDetailClose}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        {showPftModal && (
          <PftModal
            onClose={() => setShowPftModal(false)}
            onSubmit={logPft}
          />
        )}

        {showNotifPrefs && (
          <NotificationPreferencesOverlay
            mosCode={profile.mos.split(' ')[0]}
            onClose={() => setShowNotifPrefs(false)}
          />
        )}
      </div>

    </div>
  )
}
