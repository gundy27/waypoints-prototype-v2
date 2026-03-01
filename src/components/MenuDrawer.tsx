import { X, UserCircle, RotateCcw } from 'lucide-react'

interface MenuDrawerProps {
  open: boolean
  onClose: () => void
  onStartOnboarding: () => void
  onResetData: () => void
}

export default function MenuDrawer({ open, onClose, onStartOnboarding, onResetData }: MenuDrawerProps) {
  function handleStartOnboarding() {
    onClose()
    setTimeout(() => onStartOnboarding(), 200)
  }

  function handleResetData() {
    onResetData()
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-200"
        style={{
          background: 'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      <div
        className="fixed top-0 right-0 bottom-0 z-[70] flex flex-col bg-wp-surface"
        style={{
          width: 280,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          maxWidth: 'calc(100vw - 48px)',
        }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-wp-tan-light/60">
          <span className="font-heading font-bold text-wp-black" style={{ fontSize: 17 }}>
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 bg-transparent border-none cursor-pointer"
          >
            <X size={20} className="text-wp-tan-dark" />
          </button>
        </div>

        <nav className="flex-1 px-3 pt-3">
          <button
            onClick={handleStartOnboarding}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-wp-bg"
          >
            <div className="w-8 h-8 rounded-lg bg-wp-accent/10 flex items-center justify-center shrink-0">
              <UserCircle size={18} className="text-wp-accent" />
            </div>
            <div>
              <div className="font-body font-semibold text-wp-black" style={{ fontSize: 14 }}>
                Set Up Profile
              </div>
              <div className="font-body text-wp-tan-dark" style={{ fontSize: 12, marginTop: 1 }}>
                Enter your scores and details
              </div>
            </div>
          </button>

          <div className="my-3 border-t border-wp-tan-light/60" />

          <button
            onClick={handleResetData}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-wp-bg"
          >
            <div className="w-8 h-8 rounded-lg bg-wp-tan-light flex items-center justify-center shrink-0">
              <RotateCcw size={18} className="text-wp-tan-dark" />
            </div>
            <div>
              <div className="font-body font-semibold text-wp-black" style={{ fontSize: 14 }}>
                Reset Demo Data
              </div>
              <div className="font-body text-wp-tan-dark" style={{ fontSize: 12, marginTop: 1 }}>
                Restore the original mock profile
              </div>
            </div>
          </button>
        </nav>

        <div className="px-5 pb-8">
          <p className="font-body text-wp-tan-dark text-center" style={{ fontSize: 11 }}>
            Waypoints — Beta
          </p>
        </div>
      </div>
    </>
  )
}
