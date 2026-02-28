import { useState } from 'react'
import { X } from 'lucide-react'
import { calculatePftScore, getPftClass } from '../data/useAppState'

interface PftModalProps {
  onClose: () => void
  onSubmit: (pullUps: number, crunches: number, runMin: number, runSec: number) => void
}

export default function PftModal({ onClose, onSubmit }: PftModalProps) {
  const [pullUps, setPullUps] = useState('')
  const [crunches, setCrunches] = useState('')
  const [runMin, setRunMin] = useState('')
  const [runSec, setRunSec] = useState('')

  const canSubmit = pullUps && crunches && runMin

  const preview = canSubmit
    ? calculatePftScore(Number(pullUps), Number(crunches), Number(runMin), Number(runSec || 0))
    : null

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit(Number(pullUps), Number(crunches), Number(runMin), Number(runSec || 0))
    onClose()
  }

  const inputClass = "w-full bg-wp-surface border-[1.5px] border-wp-contour rounded-lg px-4 font-body text-wp-black"
  const inputStyle = { height: 44, fontSize: 14 }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-[428px] bg-wp-surface rounded-t-2xl px-5 pt-5 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>
            Log PFT Score
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 bg-transparent border-none cursor-pointer">
            <X size={20} className="text-wp-tan-dark" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-body font-medium text-wp-tan-dark mb-2" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Pull-ups
            </label>
            <input
              type="number"
              value={pullUps}
              onChange={e => setPullUps(e.target.value)}
              placeholder="e.g. 20"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block font-body font-medium text-wp-tan-dark mb-2" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Crunches
            </label>
            <input
              type="number"
              value={crunches}
              onChange={e => setCrunches(e.target.value)}
              placeholder="e.g. 100"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block font-body font-medium text-wp-tan-dark mb-2" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              3-Mile Run (mm:ss)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={runMin}
                onChange={e => setRunMin(e.target.value)}
                placeholder="21"
                className="flex-1 bg-wp-surface border-[1.5px] border-wp-contour rounded-lg px-4 font-body text-wp-black"
                style={inputStyle}
              />
              <span className="text-wp-tan-dark font-mono font-semibold" style={{ fontSize: 20 }}>:</span>
              <input
                type="number"
                value={runSec}
                onChange={e => setRunSec(e.target.value)}
                placeholder="00"
                className="flex-1 bg-wp-surface border-[1.5px] border-wp-contour rounded-lg px-4 font-body text-wp-black"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {preview !== null && (
          <div className="mt-5 p-4 bg-wp-bg rounded-lg flex items-center justify-between">
            <span className="font-body text-wp-tan-dark" style={{ fontSize: 14, fontWeight: 500 }}>
              Estimated Score
            </span>
            <div className="text-right">
              <span className="font-mono font-bold text-wp-black" style={{ fontSize: 20 }}>
                {preview}
              </span>
              <span className="ml-2 font-body text-wp-tan-dark" style={{ fontSize: 12 }}>
                {getPftClass(preview)}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full mt-5 bg-wp-accent text-white font-body font-semibold rounded-lg border-none cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ height: 44, fontSize: 14 }}
        >
          Save PFT Score
        </button>
      </div>
    </div>
  )
}
