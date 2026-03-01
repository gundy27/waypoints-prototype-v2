import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { OnboardingData } from '../data/useAppState'

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

function formatDateDisplay(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`
}

interface Step1Data {
  firstName: string
  lastName: string
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
    firstName: touched.firstName && !data.firstName.trim() ? 'Required' : '',
    lastName: touched.lastName && !data.lastName.trim() ? 'Required' : '',
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
        <label className={labelClass} style={labelStyle}>First Name</label>
        <input
          type="text"
          value={data.firstName}
          onChange={e => onChange({ ...data, firstName: e.target.value })}
          onBlur={() => blur('firstName')}
          placeholder="e.g. Miguel"
          className={inputClass}
          style={inputStyle}
        />
        {errors.firstName && <p className={errorClass} style={errorStyle}>{errors.firstName}</p>}
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Last Name</label>
        <input
          type="text"
          value={data.lastName}
          onChange={e => onChange({ ...data, lastName: e.target.value })}
          onBlur={() => blur('lastName')}
          placeholder="e.g. Martinez"
          className={inputClass}
          style={inputStyle}
        />
        {errors.lastName && <p className={errorClass} style={errorStyle}>{errors.lastName}</p>}
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
        <div className="relative">
          <input
            type="date"
            value={data.dor}
            onChange={e => onChange({ ...data, dor: e.target.value })}
            onBlur={() => blur('dor')}
            className={inputClass + " cursor-pointer"}
            style={{ ...inputStyle, color: data.dor ? '#1A1A1A' : '#A08060' }}
          />
          {data.dor && (
            <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
              <span className="font-body text-wp-black" style={{ fontSize: 15 }}>
                {formatDateDisplay(data.dor)}
              </span>
            </div>
          )}
        </div>
        {errors.dor && <p className={errorClass} style={errorStyle}>{errors.dor}</p>}
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Active Duty Base Date (ADBD)</label>
        <div className="relative">
          <input
            type="date"
            value={data.adbd}
            onChange={e => onChange({ ...data, adbd: e.target.value })}
            onBlur={() => blur('adbd')}
            className={inputClass + " cursor-pointer"}
            style={{ ...inputStyle, color: data.adbd ? '#1A1A1A' : '#A08060' }}
          />
          {data.adbd && (
            <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
              <span className="font-body text-wp-black" style={{ fontSize: 15 }}>
                {formatDateDisplay(data.adbd)}
              </span>
            </div>
          )}
        </div>
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

function Step3({
  data,
  onChange,
}: {
  data: Step3Data
  onChange: (d: Step3Data) => void
}) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const pftVal = parseInt(data.pftScore, 10)
  const cftVal = parseInt(data.cftScore, 10)

  const errors = {
    pftScore: touched.pftScore && (isNaN(pftVal) || pftVal < 0 || pftVal > 300) ? 'Enter a score between 0 and 300' : '',
    cftScore: touched.cftScore && (isNaN(cftVal) || cftVal < 0 || cftVal > 300) ? 'Enter a score between 0 and 300' : '',
  }

  function blur(field: string) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  function getClass(score: number): string {
    if (isNaN(score)) return ''
    if (score >= 235) return '1st Class'
    if (score >= 200) return '2nd Class'
    if (score >= 150) return '3rd Class'
    return 'Below Standards'
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass} style={{ ...labelStyle, marginBottom: 0 }}>PFT Score</label>
          {data.pftScore && !isNaN(pftVal) && (
            <span className="font-body font-semibold text-wp-accent" style={{ fontSize: 12 }}>
              {getClass(pftVal)}
            </span>
          )}
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={data.pftScore}
          onChange={e => onChange({ ...data, pftScore: e.target.value })}
          onBlur={() => blur('pftScore')}
          placeholder="e.g. 271"
          className={inputClass}
          style={inputStyle}
        />
        {errors.pftScore && <p className={errorClass} style={errorStyle}>{errors.pftScore}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass} style={{ ...labelStyle, marginBottom: 0 }}>CFT Score</label>
          {data.cftScore && !isNaN(cftVal) && (
            <span className="font-body font-semibold text-wp-accent" style={{ fontSize: 12 }}>
              {getClass(cftVal)}
            </span>
          )}
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={data.cftScore}
          onChange={e => onChange({ ...data, cftScore: e.target.value })}
          onBlur={() => blur('cftScore')}
          placeholder="e.g. 285"
          className={inputClass}
          style={inputStyle}
        />
        {errors.cftScore && <p className={errorClass} style={errorStyle}>{errors.cftScore}</p>}
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

  const [step1, setStep1] = useState<Step1Data>({ firstName: '', lastName: '', mosCode: '', dor: '', adbd: '' })
  const [step2, setStep2] = useState<Step2Data>({ avgProMark: '', avgConMark: '' })
  const [step3, setStep3] = useState<Step3Data>({ pftScore: '', cftScore: '' })
  const [step4, setStep4] = useState<Step4Data>({ rifleScore: '', rifleBadge: '' })

  const contentRef = useRef<HTMLDivElement>(null)

  function canAdvance(): boolean {
    if (step === 1) {
      return (
        step1.firstName.trim().length > 0 &&
        step1.lastName.trim().length > 0 &&
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
        onComplete({
          firstName: step1.firstName.trim(),
          lastName: step1.lastName.trim(),
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
    <div className="fixed inset-0 z-[80] flex flex-col bg-wp-bg">
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
              'Calculate My Score'
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
  )
}
