import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { UserProfile } from '../data/mockData'
import { calculatePftScore, getPftClass } from '../data/useAppState'

interface FitnessTabProps {
  profile: UserProfile
  history: { month: string; score: number }[]
  onLogPft: (pullUps: number, crunches: number, runMin: number, runSec: number) => void
}

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }

function SummaryCards({ profile }: { profile: UserProfile }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-wp-surface rounded-xl p-4" style={cardShadow}>
        <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.02em' }}>
          Last PFT
        </p>
        <div className="mt-2 font-mono font-bold text-wp-black" style={{ fontSize: 28, lineHeight: 1 }}>
          {profile.pft}
        </div>
        <p className="mt-2 font-body text-wp-tan-dark" style={{ fontSize: 12 }}>
          Jan 15, 2025
        </p>
        <span
          className="inline-block mt-2 px-2 py-0.5 rounded font-body font-semibold uppercase"
          style={{ fontSize: 11, backgroundColor: '#2D8A4E20', color: '#2D8A4E' }}
        >
          {profile.pftClass}
        </span>
      </div>
      <div className="bg-wp-surface rounded-xl p-4" style={cardShadow}>
        <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.02em' }}>
          Last CFT
        </p>
        <div className="mt-2 font-mono font-bold text-wp-black" style={{ fontSize: 28, lineHeight: 1 }}>
          {profile.cft}
        </div>
        <p className="mt-2 font-body text-wp-tan-dark" style={{ fontSize: 12 }}>
          Oct 8, 2024
        </p>
        <span
          className="inline-block mt-2 px-2 py-0.5 rounded font-body font-semibold uppercase"
          style={{ fontSize: 11, backgroundColor: '#2D8A4E20', color: '#2D8A4E' }}
        >
          {profile.cftClass}
        </span>
      </div>
    </div>
  )
}

function ScoreHistory({ history }: { history: { month: string; score: number }[] }) {
  return (
    <div className="mt-8">
      <h2 className="font-heading font-bold text-wp-black mb-4" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
        PFT Score History
      </h2>
      <div className="bg-wp-surface rounded-xl p-4 pt-5" style={cardShadow}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={history} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B7" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#A08060', fontFamily: 'Inter' }}
              axisLine={{ stroke: '#E8D5B7' }}
              tickLine={false}
            />
            <YAxis
              domain={[200, 300]}
              tick={{ fontSize: 11, fill: '#A08060', fontFamily: 'Inter' }}
              axisLine={{ stroke: '#E8D5B7' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#FFFFFF',
                border: '1px solid #E8D5B7',
                borderRadius: 8,
                fontSize: 13,
                fontFamily: 'JetBrains Mono',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#FF5522"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#FF5522', stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#FF5522', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-body font-medium text-wp-tan-dark mb-2" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
      {children}
    </label>
  )
}

function LogPftForm({ onLogPft }: { onLogPft: FitnessTabProps['onLogPft'] }) {
  const [pullUps, setPullUps] = useState('')
  const [crunches, setCrunches] = useState('')
  const [runMin, setRunMin] = useState('')
  const [runSec, setRunSec] = useState('')
  const [calculated, setCalculated] = useState<number | null>(null)

  function handleCalculate() {
    if (!pullUps || !crunches || !runMin) return
    const score = calculatePftScore(Number(pullUps), Number(crunches), Number(runMin), Number(runSec || 0))
    setCalculated(score)
  }

  function handleSave() {
    if (!pullUps || !crunches || !runMin) return
    onLogPft(Number(pullUps), Number(crunches), Number(runMin), Number(runSec || 0))
    setPullUps('')
    setCrunches('')
    setRunMin('')
    setRunSec('')
    setCalculated(null)
  }

  const inputClass = "w-full bg-wp-surface border-[1.5px] border-wp-contour rounded-lg px-3 font-body text-wp-black"
  const inputStyle = { height: 44, fontSize: 14 }

  return (
    <div className="mt-8">
      <h2 className="font-heading font-bold text-wp-black mb-4" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
        Log New PFT
      </h2>
      <div className="bg-wp-surface rounded-xl p-4" style={cardShadow}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Pull-ups</FieldLabel>
              <input type="number" value={pullUps} onChange={e => setPullUps(e.target.value)} placeholder="20" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <FieldLabel>Crunches</FieldLabel>
              <input type="number" value={crunches} onChange={e => setCrunches(e.target.value)} placeholder="100" className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <FieldLabel>3-Mile Run (mm:ss)</FieldLabel>
            <div className="flex gap-2 items-center">
              <input type="number" value={runMin} onChange={e => setRunMin(e.target.value)} placeholder="21" className="flex-1 bg-wp-surface border-[1.5px] border-wp-contour rounded-lg px-3 font-body text-wp-black" style={inputStyle} />
              <span className="text-wp-tan-dark font-mono font-semibold" style={{ fontSize: 20 }}>:</span>
              <input type="number" value={runSec} onChange={e => setRunSec(e.target.value)} placeholder="00" className="flex-1 bg-wp-surface border-[1.5px] border-wp-contour rounded-lg px-3 font-body text-wp-black" style={inputStyle} />
            </div>
          </div>

          {calculated !== null && (
            <div className="p-3 bg-wp-bg rounded-lg flex items-center justify-between">
              <span className="font-body text-wp-tan-dark" style={{ fontSize: 14, fontWeight: 500 }}>
                Calculated Score
              </span>
              <div className="text-right">
                <span className="font-mono font-bold text-wp-black" style={{ fontSize: 20 }}>
                  {calculated}
                </span>
                <span className="ml-2 font-body text-wp-tan-dark" style={{ fontSize: 12 }}>
                  {getPftClass(calculated)}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-transparent border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light"
              style={{ height: 44, fontSize: 14 }}
            >
              Calculate
            </button>
            <button
              onClick={handleSave}
              disabled={calculated === null}
              className="flex-1 bg-wp-accent text-white font-body font-semibold rounded-lg border-none cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ height: 44, fontSize: 14 }}
            >
              Save Score
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoalSetter() {
  const [target, setTarget] = useState('')
  const targetNum = Number(target)
  const isValid = targetNum >= 150 && targetNum <= 300

  const pullUpsNeeded = isValid ? Math.min(20, Math.ceil(targetNum / 15)) : 0
  const crunchesNeeded = isValid ? Math.min(115, Math.ceil(targetNum / 3)) : 0
  const runTimeNeeded = isValid
    ? `${Math.max(18, Math.ceil(30 - targetNum / 25))}:00`
    : '--:--'

  return (
    <div className="mt-8">
      <h2 className="font-heading font-bold text-wp-black mb-4" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
        Goal Setter
      </h2>
      <div className="bg-wp-surface rounded-xl p-4" style={cardShadow}>
        <div className="flex items-center gap-3 mb-5">
          <span className="font-body text-wp-black" style={{ fontSize: 14, fontWeight: 500 }}>
            I want to score
          </span>
          <input
            type="number"
            value={target}
            onChange={e => setTarget(e.target.value)}
            placeholder="285"
            className="w-20 bg-wp-surface border-[1.5px] border-wp-contour rounded-lg px-3 font-mono font-semibold text-wp-black text-center"
            style={{ height: 40, fontSize: 16 }}
          />
        </div>

        {isValid && (
          <div>
            <div className="flex items-center justify-between py-3 border-b border-wp-tan-light">
              <span className="font-body text-wp-tan-dark" style={{ fontSize: 14 }}>Pull-ups</span>
              <span className="font-mono font-semibold text-wp-black" style={{ fontSize: 16 }}>{pullUpsNeeded}+</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-wp-tan-light">
              <span className="font-body text-wp-tan-dark" style={{ fontSize: 14 }}>Crunches</span>
              <span className="font-mono font-semibold text-wp-black" style={{ fontSize: 16 }}>{crunchesNeeded}+</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-body text-wp-tan-dark" style={{ fontSize: 14 }}>3-Mile Run</span>
              <span className="font-mono font-semibold text-wp-black" style={{ fontSize: 16 }}>{runTimeNeeded}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FitnessTab({ profile, history, onLogPft }: FitnessTabProps) {
  return (
    <div>
      <SummaryCards profile={profile} />
      <ScoreHistory history={history} />
      <LogPftForm onLogPft={onLogPft} />
      <GoalSetter />
    </div>
  )
}
