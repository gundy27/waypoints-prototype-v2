import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { OnboardingData } from '../data/useAppState'
import { Slider } from './ui/slider'

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
  onDismiss: () => void
}

const TOTAL_STEPS = 4

const labelClass = "block font-body font-medium text-wp-tan-dark mb-2"
const labelStyle = { fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }
const inputClass = "w-full bg-wp-bg border-[1.5px] border-wp-contour rounded-lg px-4 font-body text-wp-black focus:border-wp-accent transition-colors duration-150"
const inputStyle = { height: 48, fontSize: 15 }
const errorClass = "mt-1.5 font-body text-wp-danger"
const errorStyle = { fontSize: 12 }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getDaysInMonth(month: number, year: number): number {
  if (!month || !year) return 31
  return new Date(year, month, 0).getDate()
}

const selectClass = "bg-wp-bg border-[1.5px] border-wp-contour rounded-lg px-3 font-body text-wp-black focus:border-wp-accent transition-colors duration-150 cursor-pointer appearance-none"

function DateSelectInput({
  value,
  onChange,
  onBlur,
}: {
  value: string
  onChange: (iso: string) => void
  onBlur: () => void
}) {
  const externalParts = value ? value.split('-') : []
  const [month, setMonth] = useState<number>(externalParts[1] ? parseInt(externalParts[1], 10) : 0)
  const [day, setDay] = useState<number>(externalParts[2] ? parseInt(externalParts[2], 10) : 0)
  const [year, setYear] = useState<string>(externalParts[0] || '')

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)
  const daysInMonth = getDaysInMonth(month, parseInt(year, 10))
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  function emit(m: number, d: number, y: string) {
    if (m && d && y) {
      const mm = String(m).padStart(2, '0')
      const dd = String(d).padStart(2, '0')
      onChange(`${y}-${mm}-${dd}`)
    } else {
      onChange('')
    }
  }

  function handleMonthChange(val: string) {
    const m = parseInt(val, 10) || 0
    setMonth(m)
    emit(m, day, year)
  }

  function handleDayChange(val: string) {
    const d = parseInt(val, 10) || 0
    setDay(d)
    emit(month, d, year)
  }

  function handleYearChange(val: string) {
    setYear(val)
    emit(month, day, val)
  }

  return (
    <div className="flex gap-2" onBlur={onBlur}>
      <select
        value={month || ''}
        onChange={e => handleMonthChange(e.target.value)}
        className={selectClass}
        style={{ height: 48, fontSize: 15, flex: '2 1 0' }}
      >
        <option value="">Month</option>
        {MONTHS.map((name, i) => (
          <option key={name} value={i + 1}>{name}</option>
        ))}
      </select>
      <select
        value={day || ''}
        onChange={e => handleDayChange(e.target.value)}
        className={selectClass}
        style={{ height: 48, fontSize: 15, flex: '1 1 0' }}
      >
        <option value="">Day</option>
        {days.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={e => handleYearChange(e.target.value)}
        className={selectClass}
        style={{ height: 48, fontSize: 15, flex: '2 1 0' }}
      >
        <option value="">Year</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}

interface Step1Data {
  fullName: string
  mosCode: string
  dor: string
  adbd: string
}

interface Step2Data {
  avgProMark: string
  avgConMark: string
}

interface Step3Data {
  pftScore: string
  cftScore: string
}

interface Step4Data {
  rifleScore: string
  rifleBadge: string
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern)
  }
}

function Step1({
  data,
  onChange,
}: {
  data: Step1Data
  onChange: (d: Step1Data) => void
}) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = {
    fullName: touched.fullName && !data.fullName.trim() ? 'Required' : '',
    mosCode: touched.mosCode && !/^\d{4}$/.test(data.mosCode) ? 'Enter a 4-digit MOS code' : '',
    dor: touched.dor && !data.dor ? 'Required' : '',
    adbd: touched.adbd && !data.adbd ? 'Required' : '',
  }

  function blur(field: string) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass} style={labelStyle}>Full Name</label>
        <input
          type="text"
          value={data.fullName}
          onChange={e => onChange({ ...data, fullName: e.target.value })}
          onBlur={() => blur('fullName')}
          placeholder="e.g. Miguel Martinez"
          className={inputClass}
          style={inputStyle}
        />
        {errors.fullName && <p className={errorClass} style={errorStyle}>{errors.fullName}</p>}
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>MOS Code</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={data.mosCode}
          onChange={e => onChange({ ...data, mosCode: e.target.value.replace(/\D/g, '').slice(0, 4) })}
          onBlur={() => blur('mosCode')}
          placeholder="e.g. 0311"
          className={inputClass}
          style={inputStyle}
        />
        {errors.mosCode && <p className={errorClass} style={errorStyle}>{errors.mosCode}</p>}
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Date of Rank</label>
        <DateSelectInput
          value={data.dor}
          onChange={dor => onChange({ ...data, dor })}
          onBlur={() => blur('dor')}
        />
        {errors.dor && <p className={errorClass} style={errorStyle}>{errors.dor}</p>}
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Active Duty Base Date (ADBD)</label>
        <DateSelectInput
          value={data.adbd}
          onChange={adbd => onChange({ ...data, adbd })}
          onBlur={() => blur('adbd')}
        />
        {errors.adbd && <p className={errorClass} style={errorStyle}>{errors.adbd}</p>}
      </div>
    </div>
  )
}

function Step2({
  data,
  onChange,
}: {
  data: Step2Data
  onChange: (d: Step2Data) => void
}) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  function parseVal(s: string) { return parseFloat(s) }
  const proVal = parseVal(data.avgProMark)
  const conVal = parseVal(data.avgConMark)

  const errors = {
    avgProMark: touched.avgProMark && (isNaN(proVal) || proVal < 0 || proVal > 5) ? 'Enter a value between 0.0 and 5.0' : '',
    avgConMark: touched.avgConMark && (isNaN(conVal) || conVal < 0 || conVal > 5) ? 'Enter a value between 0.0 and 5.0' : '',
  }

  function blur(field: string) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  return (
    <div className="space-y-5">
      <div className="bg-wp-bg rounded-xl p-4 border border-wp-contour/50">
        <p className="font-body text-wp-tan-dark" style={{ fontSize: 13, lineHeight: 1.55 }}>
          Pro and Con marks are scored 0.0 to 5.0 and are recorded on your FITREP/Counseling sheet. They directly contribute to your composite score.
        </p>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Average Pro Mark</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={data.avgProMark}
          onChange={e => onChange({ ...data, avgProMark: e.target.value })}
          onBlur={() => blur('avgProMark')}
          placeholder="e.g. 4.4"
          className={inputClass}
          style={inputStyle}
        />
        {errors.avgProMark && <p className={errorClass} style={errorStyle}>{errors.avgProMark}</p>}
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Average Con Mark</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={data.avgConMark}
          onChange={e => onChange({ ...data, avgConMark: e.target.value })}
          onBlur={() => blur('avgConMark')}
          placeholder="e.g. 4.4"
          className={inputClass}
          style={inputStyle}
        />
        {errors.avgConMark && <p className={errorClass} style={errorStyle}>{errors.avgConMark}</p>}
      </div>
    </div>
  )
}

function getScoreClass(score: number): { label: string; color: string } {
  if (score >= 235) return { label: '1st Class', color: '#2D8A4E' }
  if (score >= 200) return { label: '2nd Class', color: '#D4940A' }
  if (score >= 150) return { label: '3rd Class', color: '#D4940A' }
  return { label: 'Below Std', color: '#CC3333' }
}

const SCORE_TICKS = [300, 225, 150, 75, 0]

function FitnessSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  const scoreClass = getScoreClass(value)

  return (
    <div className="flex flex-col items-center flex-1">
      <span
        className="font-body font-semibold mb-3 tracking-widest uppercase"
        style={{ fontSize: 11, color: '#A08060', letterSpacing: '0.08em' }}
      >
        {label}
      </span>

      <div className="flex items-stretch gap-3" style={{ height: 240 }}>
        <div
          className="flex flex-col justify-between"
          style={{ paddingTop: 2, paddingBottom: 2 }}
        >
          {SCORE_TICKS.map(tick => (
            <span
              key={tick}
              className="font-mono text-right leading-none"
              style={{ fontSize: 10, color: '#A08060', minWidth: 24 }}
            >
              {tick}
            </span>
          ))}
        </div>

        <Slider
          orientation="vertical"
          min={0}
          max={300}
          step={1}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          style={{ height: '100%' }}
          className="h-full"
        />
      </div>

      <div className="flex flex-col items-center mt-4 gap-1">
        <span
          className="font-heading font-bold leading-none"
          style={{ fontSize: 32, color: '#1A1A1A' }}
        >
          {value}
        </span>
        <span
          className="font-body font-semibold leading-none"
          style={{ fontSize: 11, color: scoreClass.color, letterSpacing: '0.04em' }}
        >
          {scoreClass.label}
        </span>
      </div>
    </div>
  )
}

function Step3({
  data,
  onChange,
}: {
  data: Step3Data
  onChange: (d: Step3Data) => void
}) {
  const pftVal = parseInt(data.pftScore, 10) || 0
  const cftVal = parseInt(data.cftScore, 10) || 0

  return (
    <div className="flex flex-col">
      <p
        className="font-body text-center mb-6"
        style={{ fontSize: 13, color: '#A08060' }}
      >
        Drag sliders up to set your scores
      </p>
      <div className="flex justify-around gap-4 px-2">
        <FitnessSlider
          label="PFT"
          value={pftVal}
          onChange={v => onChange({ ...data, pftScore: String(v) })}
        />
        <div
          className="w-px self-stretch"
          style={{ background: '#D2C4A8', marginTop: 28, marginBottom: 0 }}
        />
        <FitnessSlider
          label="CFT"
          value={cftVal}
          onChange={v => onChange({ ...data, cftScore: String(v) })}
        />
      </div>
    </div>
  )
}

const BADGE_OPTIONS = ['Expert', 'Sharpshooter', 'Marksman']

function Step4({
  data,
  onChange,
}: {
  data: Step4Data
  onChange: (d: Step4Data) => void
}) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const rifleVal = parseInt(data.rifleScore, 10)

  const errors = {
    rifleScore: touched.rifleScore && (isNaN(rifleVal) || rifleVal < 190 || rifleVal > 250) ? 'Enter a score between 190 and 250' : '',
    rifleBadge: touched.rifleBadge && !data.rifleBadge ? 'Select a qualification level' : '',
  }

  function blur(field: string) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass} style={labelStyle}>Rifle Score</label>
        <input
          type="number"
          inputMode="numeric"
          value={data.rifleScore}
          onChange={e => onChange({ ...data, rifleScore: e.target.value })}
          onBlur={() => blur('rifleScore')}
          placeholder="e.g. 335"
          className={inputClass}
          style={inputStyle}
        />
        {errors.rifleScore && <p className={errorClass} style={errorStyle}>{errors.rifleScore}</p>}
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Qualification Badge</label>
        <div className="flex gap-2" onBlur={() => blur('rifleBadge')}>
          {BADGE_OPTIONS.map(badge => (
            <button
              key={badge}
              type="button"
              onClick={() => onChange({ ...data, rifleBadge: badge })}
              className="flex-1 rounded-lg border-[1.5px] font-body font-semibold cursor-pointer transition-all duration-150"
              style={{
                height: 44,
                fontSize: 13,
                borderColor: data.rifleBadge === badge ? '#FF5522' : '#D2C4A8',
                background: data.rifleBadge === badge ? '#FF5522' : 'transparent',
                color: data.rifleBadge === badge ? '#FFFFFF' : '#1A1A1A',
              }}
            >
              {badge}
            </button>
          ))}
        </div>
        {errors.rifleBadge && <p className={errorClass} style={errorStyle}>{errors.rifleBadge}</p>}
      </div>
    </div>
  )
}

export default function OnboardingFlow({ onComplete, onDismiss }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)
  const [showCheck, setShowCheck] = useState(false)

  const [step1, setStep1] = useState<Step1Data>({ fullName: '', mosCode: '', dor: '', adbd: '' })
  const [step2, setStep2] = useState<Step2Data>({ avgProMark: '', avgConMark: '' })
  const [step3, setStep3] = useState<Step3Data>({ pftScore: '0', cftScore: '0' })
  const [step4, setStep4] = useState<Step4Data>({ rifleScore: '', rifleBadge: '' })

  const contentRef = useRef<HTMLDivElement>(null)

  function canAdvance(): boolean {
    if (step === 1) {
      return (
        step1.fullName.trim().length > 0 &&
        /^\d{4}$/.test(step1.mosCode) &&
        !!step1.dor &&
        !!step1.adbd
      )
    }
    if (step === 2) {
      const pro = parseFloat(step2.avgProMark)
      const con = parseFloat(step2.avgConMark)
      return !isNaN(pro) && pro >= 0 && pro <= 5 && !isNaN(con) && con >= 0 && con <= 5
    }
    if (step === 3) {
      const pft = parseInt(step3.pftScore, 10)
      const cft = parseInt(step3.cftScore, 10)
      return !isNaN(pft) && pft >= 0 && pft <= 300 && !isNaN(cft) && cft >= 0 && cft <= 300
    }
    if (step === 4) {
      const rifle = parseInt(step4.rifleScore, 10)
      return !isNaN(rifle) && rifle >= 190 && rifle <= 250 && !!step4.rifleBadge
    }
    return false
  }

  function goNext() {
    if (!canAdvance() || animating) return
    vibrate(30)

    if (step < TOTAL_STEPS) {
      setShowCheck(true)
      setDirection('forward')
      setTimeout(() => {
        setShowCheck(false)
        setAnimating(true)
        setStep(s => s + 1)
        setTimeout(() => setAnimating(false), 250)
      }, 420)
    } else {
      setShowCheck(true)
      vibrate([30, 50, 30])
      setTimeout(() => {
        setShowCheck(false)
        const nameParts = step1.fullName.trim().split(/\s+/)
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0]
        const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : ''
        onComplete({
          firstName,
          lastName,
          mosCode: step1.mosCode,
          dor: step1.dor,
          adbd: step1.adbd,
          avgProMark: parseFloat(step2.avgProMark),
          avgConMark: parseFloat(step2.avgConMark),
          pftScore: parseInt(step3.pftScore, 10),
          cftScore: parseInt(step3.cftScore, 10),
          rifleScore: parseInt(step4.rifleScore, 10),
          rifleBadge: step4.rifleBadge,
        })
      }, 600)
    }
  }

  function goBack() {
    if (step === 1 || animating) return
    vibrate(20)
    setDirection('back')
    setAnimating(true)
    setStep(s => s - 1)
    setTimeout(() => setAnimating(false), 250)
  }

  const stepTitles = [
    'Your Info',
    'Pro/Con Marks',
    'Fitness Scores',
    'Rifle Qual',
  ]

  const slideStyle: React.CSSProperties = animating
    ? {
        transform: direction === 'forward' ? 'translateX(20px)' : 'translateX(-20px)',
        opacity: 0,
        transition: 'transform 0.22s ease-in-out, opacity 0.22s ease-in-out',
      }
    : {
        transform: 'translateX(0)',
        opacity: 1,
        transition: 'transform 0.22s ease-in-out, opacity 0.22s ease-in-out',
      }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-wp-tan-dark/60">
      <div className="relative w-full max-w-[428px] h-full flex flex-col bg-wp-bg">
      <div className="sticky top-0 z-10 bg-wp-bg/95 backdrop-blur-sm px-5 pt-5 pb-4 border-b border-wp-tan-light/50">
        <div className="flex items-center justify-between mb-3">
          <span className="font-body font-semibold text-wp-tan-dark" style={{ fontSize: 13 }}>
            Step {step} of {TOTAL_STEPS}
          </span>
          <button
            onClick={onDismiss}
            className="font-body text-wp-tan-dark bg-transparent border-none cursor-pointer px-0"
            style={{ fontSize: 14 }}
          >
            Cancel
          </button>
        </div>

        <div className="w-full h-1.5 bg-wp-tan-light rounded-full overflow-hidden">
          <div
            className="h-full bg-wp-accent rounded-full transition-all duration-400"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <h2 className="mt-3 font-heading font-bold text-wp-black" style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {stepTitles[step - 1]}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-8">
        <div ref={contentRef} style={slideStyle}>
          {step === 1 && <Step1 data={step1} onChange={setStep1} />}
          {step === 2 && <Step2 data={step2} onChange={setStep2} />}
          {step === 3 && <Step3 data={step3} onChange={setStep3} />}
          {step === 4 && <Step4 data={step4} onChange={setStep4} />}
        </div>
      </div>

      <div className="px-5 pb-10 pt-4 border-t border-wp-tan-light/50 bg-wp-bg/95">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 bg-transparent border-[1.5px] border-wp-contour text-wp-black font-body font-semibold rounded-xl cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light shrink-0"
              style={{ height: 52, paddingLeft: 16, paddingRight: 20, fontSize: 14 }}
            >
              <ChevronLeft size={18} />
              Back
            </button>
          )}

          <button
            onClick={goNext}
            disabled={!canAdvance()}
            className="flex-1 flex items-center justify-center gap-2 bg-wp-accent text-white font-body font-semibold rounded-xl border-none cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ height: 52, fontSize: 15 }}
          >
            {showCheck ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="10" stroke="white" strokeWidth="1.5" />
                <path
                  d="M6.5 11L9.5 14L15.5 8"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 12,
                    strokeDashoffset: 0,
                    animation: 'drawCheck 0.3s ease-out forwards',
                  }}
                />
              </svg>
            ) : step < TOTAL_STEPS ? (
              <>Next <ChevronRight size={18} /></>
            ) : (
              "Let's Go"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes drawCheck {
          from { stroke-dashoffset: 12; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      </div>
    </div>
  )
}
