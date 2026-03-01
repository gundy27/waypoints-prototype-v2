import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'

interface NotificationPromptProps {
  mosCode: string
  onDismiss: () => void
}

export default function NotificationPrompt({ mosCode, onDismiss }: NotificationPromptProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  function handleDismiss() {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }

  return (
    <div
      className="absolute inset-0 z-[100] flex flex-col justify-end"
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleDismiss}
      />

      <div
        className="relative z-10 bg-wp-surface rounded-t-2xl px-6 pt-6 pb-10 transition-transform duration-300 ease-out"
        style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-wp-accent/10 flex items-center justify-center">
            <Bell className="w-6 h-6 text-wp-accent" />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-wp-text text-lg font-semibold leading-snug">
              Stay ahead of the cutting score
            </h2>
            <p className="text-wp-text-muted text-sm leading-relaxed">
              Want to know the moment the {mosCode} cutting score changes?
            </p>
          </div>

          <div className="w-full flex flex-col gap-3 mt-2">
            <button
              onClick={handleDismiss}
              className="w-full py-3 rounded-xl bg-wp-accent text-white font-semibold text-sm transition-opacity active:opacity-80"
            >
              Enable Notifications
            </button>
            <button
              onClick={handleDismiss}
              className="w-full py-3 rounded-xl text-wp-text-muted text-sm font-medium transition-opacity active:opacity-60"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
