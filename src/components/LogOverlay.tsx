import { useState } from 'react'
import { X, ArrowLeft, ChevronRight } from 'lucide-react'
import { LOG_TYPES } from '../data/logs'
import type { LogTypeDef, LogTypeId } from '../data/logs'
import { CURRENT_DATE } from '../data/promotionTimeline'
import { WAYPOINT_ICONS } from './waypointIcons'

interface LogOverlayProps {
  onSubmit: (typeId: LogTypeId, data: Record<string, string | number>) => void
  onClose: () => void
}

const TODAY = CURRENT_DATE.toISOString().slice(0, 10)

const inputStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1.5px solid #D2C4A8',
  borderRadius: 8,
  padding: '11px 14px',
  fontSize: 14,
  height: 44,
  width: '100%',
  color: '#1A1A1A',
}

export default function LogOverlay({ onSubmit, onClose }: LogOverlayProps) {
  const [selected, setSelected] = useState<LogTypeDef | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})

  function startType(def: LogTypeDef) {
    const init: Record<string, string> = {}
    for (const f of def.fields) {
      if (f.kind === 'date') init[f.key] = TODAY
      else if (f.kind === 'select' && f.options?.length) init[f.key] = f.options[0]
    }
    setValues(init)
    setSelected(def)
  }

  function handleSave() {
    if (!selected) return
    const data: Record<string, string | number> = {}
    for (const f of selected.fields) {
      const raw = values[f.key] ?? ''
      data[f.key] = f.kind === 'number' ? Number(raw) || 0 : raw
    }
    onSubmit(selected.id, data)
    onClose()
  }

  const primary = LOG_TYPES.filter(t => t.primary)
  const secondary = LOG_TYPES.filter(t => !t.primary)

  return (
    <div className="absolute inset-0 z-[100] flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-wp-surface rounded-t-2xl flex flex-col" style={{ maxHeight: '85%', boxShadow: '0 -6px 24px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            {selected && (
              <button type="button" onClick={() => setSelected(null)} className="flex items-center justify-center w-7 h-7 rounded-full text-wp-accent -ml-1">
                <ArrowLeft size={18} strokeWidth={2} />
              </button>
            )}
            <h3 className="font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>{selected ? selected.label : 'Log an activity'}</h3>
          </div>
          <button type="button" onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full text-wp-tan-dark">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {!selected ? (
          <div className="overflow-y-auto px-4 pb-5 space-y-2">
            {primary.map(t => {
              const Icon = WAYPOINT_ICONS[t.icon]
              return (
                <button key={t.id} type="button" onClick={() => startType(t)} className="w-full text-left rounded-xl p-3 flex items-center gap-3 border border-wp-tan-light bg-white">
                  <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full" style={{ background: 'color-mix(in srgb, var(--color-wp-accent) 12%, white)' }}>
                    <Icon size={18} className="text-wp-accent" strokeWidth={1.9} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-body font-semibold text-wp-black block" style={{ fontSize: 14 }}>{t.label}</span>
                    <span className="font-body text-wp-tan-dark block truncate" style={{ fontSize: 12 }}>{t.description}</span>
                  </div>
                  <ChevronRight size={18} className="text-wp-tan-dark shrink-0" />
                </button>
              )
            })}
            <p className="px-1 pt-2 font-body font-medium uppercase tracking-[0.04em] text-wp-tan-dark" style={{ fontSize: 11 }}>More</p>
            {secondary.map(t => {
              const Icon = WAYPOINT_ICONS[t.icon]
              return (
                <button key={t.id} type="button" onClick={() => startType(t)} className="w-full text-left rounded-xl p-3 flex items-center gap-3 border border-wp-tan-light bg-white">
                  <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-wp-tan-light">
                    <Icon size={18} className="text-wp-tan-dark" strokeWidth={1.9} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-body font-semibold text-wp-black block" style={{ fontSize: 14 }}>{t.label}</span>
                    <span className="font-body text-wp-tan-dark block truncate" style={{ fontSize: 12 }}>{t.description}</span>
                  </div>
                  <ChevronRight size={18} className="text-wp-tan-dark shrink-0" />
                </button>
              )
            })}
          </div>
        ) : (
          <div className="overflow-y-auto px-5 pb-5">
            <div className="space-y-4">
              {selected.fields.map(f => (
                <div key={f.key}>
                  <label className="block mb-2 font-body font-medium text-wp-black" style={{ fontSize: 13 }}>{f.label}</label>
                  {f.kind === 'select' ? (
                    <select value={values[f.key] ?? ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} style={inputStyle}>
                      {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.kind === 'number' ? 'number' : f.kind === 'date' ? 'date' : 'text'}
                      value={values[f.key] ?? ''}
                      placeholder={f.placeholder}
                      onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
              <button type="button" onClick={handleSave} className="w-full flex items-center justify-center bg-wp-accent text-white font-body font-semibold rounded-lg border-none cursor-pointer active:bg-wp-accent-dark" style={{ height: 48, fontSize: 15, marginTop: 4 }}>
                Save log
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
