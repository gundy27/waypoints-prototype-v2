import { useEffect, useRef } from 'react'
import { Bell, FileText, X } from 'lucide-react'
import type { TabId } from './TabBar'

export interface AppNotification {
  id: string
  title: string
  description: string
  reason?: string
  read: boolean
  targetTab?: TabId
}

interface NotificationBellProps {
  notifications: AppNotification[]
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onNotificationClick: (notification: AppNotification) => void
}

export default function NotificationBell({
  notifications,
  isOpen,
  onToggle,
  onClose,
  onNotificationClick,
}: NotificationBellProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hasUnread = notifications.some(n => !n.read)

  useEffect(() => {
    if (!isOpen) return
    function handlePointerDown(e: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen, onClose])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        className="relative flex items-center justify-center w-9 h-9 rounded-full transition-colors"
        style={{ color: '#1A1A1A' }}
      >
        <Bell size={20} strokeWidth={1.75} />
        {hasUnread && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#CC3333' }}
          />
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-1 w-72 rounded-xl overflow-hidden"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 20px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)',
            border: '1px solid #E8D5B7',
            zIndex: 200,
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid #E8D5B7' }}
          >
            <span className="font-body font-semibold" style={{ fontSize: 13, color: '#1A1A1A' }}>
              Notifications
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center w-6 h-6 rounded-full transition-colors"
              style={{ color: '#A08060' }}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>

          <div>
            {notifications.length === 0 ? (
              <div className="px-4 py-5 text-center font-body" style={{ fontSize: 13, color: '#A08060' }}>
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => onNotificationClick(notification)}
                  className="w-full text-left px-4 py-3 transition-colors flex items-start gap-3"
                  style={{
                    backgroundColor: notification.read ? '#FFFFFF' : '#FFF8F5',
                    borderBottom: '1px solid #F5F1EB',
                  }}
                >
                  <div
                    className="mt-0.5 shrink-0 flex items-center justify-center w-7 h-7 rounded-full"
                    style={{ backgroundColor: '#FFE8E0' }}
                  >
                    <FileText size={14} strokeWidth={1.75} style={{ color: '#FF5522' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-body font-semibold" style={{ fontSize: 12, color: '#1A1A1A' }}>
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span
                          className="shrink-0 w-1.5 h-1.5 rounded-full mt-1"
                          style={{ backgroundColor: '#CC3333' }}
                        />
                      )}
                    </div>
                    <p className="mt-0.5 font-body" style={{ fontSize: 12, color: '#A08060', lineHeight: 1.45 }}>
                      {notification.description}
                    </p>
                    {notification.reason && (
                      <p className="mt-1 font-body font-medium px-2 py-0.5 rounded-md inline-block" style={{ fontSize: 11, color: '#FF5522', backgroundColor: 'rgba(255,85,34,0.08)', lineHeight: 1.4 }}>
                        {notification.reason}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
