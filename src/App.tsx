import { useState } from 'react'
import type { CSSProperties } from 'react'
import { User, Bell } from 'lucide-react'
import { Analytics } from '@vercel/analytics/react'
import Header from './components/Header'
import TabBar from './components/TabBar'
import type { TabId } from './components/TabBar'
import NotificationCenter from './components/NotificationCenter'
import type { AppNotification } from './components/NotificationBell'
import FloatingLogButton from './components/FloatingLogButton'
import LogOverlay from './components/LogOverlay'
import ProfileOverlay from './components/ProfileOverlay'
import WaypointDetailOverlay from './components/WaypointDetailOverlay'
import ObjectiveSwitcherOverlay from './components/ObjectiveSwitcherOverlay'
import GapDetailOverlay from './components/GapDetailOverlay'
import OnboardingFlow from './components/OnboardingFlow'
import ObjectiveTab from './tabs/ObjectiveTab'
import JourneyTab from './tabs/JourneyTab'
import GuideTab from './tabs/GuideTab'
import { useAppState } from './data/useAppState'
import type { Waypoint } from './data/waypoints'
import type { ChatMessage, ChatContext } from './data/chat'

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'maradmin-045-25',
    title: 'Cutting Score Dropped',
    description: 'MARADMIN 045/25: Cutting score for 0311 dropped 20 points this quarter to 780.',
    read: false,
    targetTab: 'guide',
    kind: 'policy',
  },
  {
    id: 'countdown-pft',
    title: 'PFT window opens soon',
    description: 'Your next fitness test window is approaching — log a score to move your gap.',
    read: false,
    kind: 'countdown',
  },
  {
    id: 'ai-weekly',
    title: 'Your week in review',
    description: "Ask the Guide what changed for you this week.",
    read: true,
    targetTab: 'guide',
    kind: 'ai',
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('objective')
  const [logOpen, setLogOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [gapDetailOpen, setGapDetailOpen] = useState(false)
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null)
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [aiSeed, setAiSeed] = useState<string | undefined>(undefined)

  const {
    profile, branch, branchId, objective, objectiveCountdown, currentGap, wpProgress,
    completedWaypointBonus, waypoints, recentActivity, logs, cutScoreProjection,
    setObjective, completeWaypointById, submitLog, completeOnboarding, resetToMockData,
    serviceHistory, journeyStats,
  } = useAppState()

  const hasUnread = notifications.some(n => !n.read)

  const chatContext: ChatContext = {
    branch: branch.name,
    rank: profile.rank,
    mos: profile.mos,
    objective: objective.label,
    gap: currentGap ? `${currentGap.current}/${currentGap.target} ${currentGap.unitLabel} (${currentGap.gap} to go)` : undefined,
    countdown: objectiveCountdown ? `${objectiveCountdown.daysRemaining} days to ${objectiveCountdown.label}` : undefined,
    recentLogs: recentActivity.map(l => l.title),
  }
  const smartPrompts = [
    `How does my ${branch.jobLabel} affect my ${branch.scoringLabel}?`,
    `What should I focus on next for "${objective.label}"?`,
    `Explain how ${branch.scoringLabel} works`,
  ]

  const payGrade = profile.rank.split(' ')[0]

  function handleBellNotificationClick(notification: AppNotification) {
    setNotifications(prev => prev.map(n => (n.id === notification.id ? { ...n, read: true } : n)))
    setBellOpen(false)
    if (notification.targetTab) setActiveTab(notification.targetTab)
  }

  const projectionNote =
    objective.type === 'promotion' && cutScoreProjection
      ? `Cutting score for ${cutScoreProjection.mosCode} is ${cutScoreProjection.trend} (${cutScoreProjection.quarterlyChange >= 0 ? '+' : ''}${cutScoreProjection.quarterlyChange}/qtr). Projected ~${cutScoreProjection.projectedMid} for ${cutScoreProjection.targetQuarter}.`
      : undefined

  const meta: { title: string; subtitle?: string } =
    activeTab === 'objective'
      ? { title: 'Waypoints', subtitle: `${profile.name} — ${branch.shortName}` }
      : activeTab === 'journey'
        ? { title: 'My Journey' }
        : { title: 'Guide' }

  const columnStyle: CSSProperties & Record<string, string> = {
    boxShadow: '0 0 40px rgba(0,0,0,0.18)',
    '--color-wp-accent': branch.color,
    '--color-wp-accent-dark': branch.colorDark,
  }

  return (
    <div className="h-full bg-black flex items-start justify-center">
      <div className="relative h-full w-full max-w-[428px] flex flex-col overflow-hidden bg-wp-bg" style={columnStyle}>
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ backgroundImage: 'url(/tan-contours.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.25 }}
        />

        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          rightSlot={
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setBellOpen(true)} aria-label="Notifications" className="relative flex items-center justify-center w-9 h-9 rounded-full text-wp-black">
                <Bell size={20} strokeWidth={1.75} />
                {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#CC3333' }} />}
              </button>
              <button type="button" onClick={() => setProfileOpen(true)} aria-label="Open profile" className="flex items-center justify-center w-9 h-9 rounded-full text-wp-black">
                <User size={20} strokeWidth={1.75} />
              </button>
            </div>
          }
        />

        <main className="flex-1 overflow-y-auto relative z-10 px-4 pt-6 bg-transparent" style={{ paddingBottom: 32 }}>
          {activeTab === 'objective' && (
            <ObjectiveTab
              objective={objective}
              countdown={objectiveCountdown}
              gap={currentGap}
              wpProgress={wpProgress}
              completedWaypointBonus={completedWaypointBonus}
              branchName={branch.name}
              waypoints={waypoints}
              recentActivity={recentActivity}
              onSwitchObjective={() => setSwitcherOpen(true)}
              onOpenWaypoint={w => setSelectedWaypoint(w)}
              onOpenGapDetail={() => setGapDetailOpen(true)}
              onAskAI={() => { setAiSeed(`What should I focus on next for "${objective.label}"?`); setActiveTab('guide') }}
            />
          )}
          {activeTab === 'journey' && (
            <JourneyTab profile={profile} branchName={branch.name} history={serviceHistory} logs={logs} stats={journeyStats} />
          )}
          {activeTab === 'guide' && (
            <GuideTab
              context={chatContext}
              messages={chatMessages}
              onMessagesChange={setChatMessages}
              smartPrompts={smartPrompts}
              seedPrompt={aiSeed}
              onSeedConsumed={() => setAiSeed(undefined)}
            />
          )}
        </main>

        <FloatingLogButton onClick={() => setLogOpen(true)} />

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {bellOpen && (
          <NotificationCenter
            notifications={notifications}
            onNotificationClick={handleBellNotificationClick}
            onClose={() => setBellOpen(false)}
          />
        )}

        {logOpen && <LogOverlay onSubmit={submitLog} onClose={() => setLogOpen(false)} />}

        {switcherOpen && (
          <ObjectiveSwitcherOverlay
            branchId={branchId}
            payGrade={payGrade}
            currentTemplateId={objective.templateId}
            onSelect={templateId => setObjective(templateId)}
            onClose={() => setSwitcherOpen(false)}
          />
        )}

        {selectedWaypoint && (
          <WaypointDetailOverlay
            waypoint={selectedWaypoint}
            onComplete={completeWaypointById}
            onClose={() => setSelectedWaypoint(null)}
          />
        )}

        {gapDetailOpen && currentGap && (
          <GapDetailOverlay
            gap={currentGap}
            objectiveLabel={objective.label}
            projectionNote={projectionNote}
            onClose={() => setGapDetailOpen(false)}
          />
        )}

        {profileOpen && (
          <ProfileOverlay
            profile={profile}
            branchName={branch.name}
            onReset={resetToMockData}
            onStartOnboarding={() => { setProfileOpen(false); setOnboardingOpen(true) }}
            onClose={() => setProfileOpen(false)}
          />
        )}

        {onboardingOpen && (
          <OnboardingFlow
            onComplete={data => { completeOnboarding(data); setActiveTab('objective') }}
            onClose={() => setOnboardingOpen(false)}
          />
        )}

        <Analytics />
      </div>
    </div>
  )
}
