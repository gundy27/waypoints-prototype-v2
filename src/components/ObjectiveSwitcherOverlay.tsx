import { X, Check } from 'lucide-react'
import { OBJECTIVE_TEMPLATES, objectiveLabelFor } from '../data/objectives'
import type { BranchId } from '../data/branches'

interface ObjectiveSwitcherOverlayProps {
  branchId: BranchId
  payGrade: string
  currentTemplateId: string
  onSelect: (templateId: string) => void
  onClose: () => void
}

export default function ObjectiveSwitcherOverlay({
  branchId, payGrade, currentTemplateId, onSelect, onClose,
}: ObjectiveSwitcherOverlayProps) {
  const templates = OBJECTIVE_TEMPLATES.filter(t => t.selectable)

  return (
    <div className="absolute inset-0 z-[100] flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-wp-surface rounded-t-2xl flex flex-col" style={{ maxHeight: '82%', boxShadow: '0 -6px 24px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>Choose an objective</h3>
          <button type="button" onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full text-wp-tan-dark">
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        <p className="px-5 pb-3 font-body text-wp-tan-dark" style={{ fontSize: 12 }}>One active objective at a time. Switching is explicit.</p>

        <div className="overflow-y-auto px-4 pb-5 space-y-2">
          {templates.map(t => {
            const isCurrent = t.id === currentTemplateId
            const label = objectiveLabelFor(t, branchId, payGrade)
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { if (!isCurrent) onSelect(t.id); onClose() }}
                className="w-full text-left rounded-xl p-4 border transition-colors"
                style={{
                  background: isCurrent ? 'color-mix(in srgb, var(--color-wp-accent) 8%, white)' : '#FFFFFF',
                  borderColor: isCurrent ? 'var(--color-wp-accent)' : '#E8D5B7',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-bold text-wp-black" style={{ fontSize: 16 }}>{label}</span>
                  {isCurrent && <Check size={16} className="text-wp-accent shrink-0" />}
                </div>
                <p className="mt-1 font-body text-wp-tan-dark" style={{ fontSize: 13, lineHeight: 1.45 }}>{t.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
