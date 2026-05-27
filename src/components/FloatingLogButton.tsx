import { Plus } from 'lucide-react'

interface FloatingLogButtonProps {
  onClick: () => void
}

/** Global "+" capture button. Absolutely positioned inside the mobile column. */
export default function FloatingLogButton({ onClick }: FloatingLogButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Log an activity"
      className="absolute z-40 flex items-center justify-center rounded-full bg-wp-accent text-white active:bg-wp-accent-dark transition-colors"
      style={{
        right: 16,
        bottom: 80,
        width: 56,
        height: 56,
        boxShadow: '0 6px 16px rgba(0,0,0,0.22)',
      }}
    >
      <Plus size={28} strokeWidth={2.25} />
    </button>
  )
}
