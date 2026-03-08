import { Crosshair, BookOpen, FileText, User } from 'lucide-react'

const tabs = [
  { id: 'career', label: 'Career', icon: Crosshair },
  { id: 'pocketbook', label: 'Pocketbook', icon: BookOpen },
  { id: 'maradmins', label: 'MARADMINS', icon: FileText },
  { id: 'account', label: 'Account', icon: User },
] as const

export type TabId = (typeof tabs)[number]['id']

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className="shrink-0 bg-white/90 backdrop-blur-sm border-t border-wp-tan-light z-50"
      style={{ height: 64, boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}
    >
      <div className="flex h-full">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center relative transition-colors duration-150 bg-transparent border-none cursor-pointer"
              style={{ minHeight: 44 }}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-wp-accent rounded-b" />
              )}
              <Icon
                size={24}
                strokeWidth={1.75}
                className={isActive ? 'text-wp-accent' : 'text-wp-tan-dark'}
              />
              <span
                className={`mt-1 font-body font-medium uppercase tracking-[0.04em] ${
                  isActive ? 'text-wp-accent' : 'text-wp-tan-dark'
                }`}
                style={{ fontSize: 11, lineHeight: 1 }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
