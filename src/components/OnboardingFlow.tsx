import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { OnboardingData } from '../data/useAppState'
import { Slider } from './ui/slider'
import { RankInsignia, RANKS, type RankCode } from './RankInsignia'

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
  onDismiss: () => void
}

const TOTAL_STEPS = 6

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
    <div className="flex gap-2">
      <select
        value={month || ''}
        onChange={e => handleMonthChange(e.target.value)}
        onBlur={onBlur}
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
        onBlur={onBlur}
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
        onBlur={onBlur}
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
  rank: RankCode | ''
  dor: string
}

type McmapBeltCode = 'MMA' | 'MMB' | 'MMC' | 'MMD' | 'MME' | 'MMF' | 'MMG+'

interface Step2Data {
  destroys: number
  mcmapBelt: McmapBeltCode | ''
}

type DegreeOption = 'None' | 'Associates' | 'Bachelors'
type MosCqOption = 'None' | 'CDI' | 'CDQAR' | 'QASO'

interface Step3Data {
  marineNetCourses: number
  degree: DegreeOption | ''
  offDutyEducationCourses: number
  mosCqs: MosCqOption[]
  mosQualPoints: number
}

interface Step4Data {
  pftScore: string
  cftScore: string
}

interface Step5Data {
  mosMission: string
  leadership: string
  character: string
}

type SdaOption = 'None' | 'Drill Instructor' | 'Recruiter' | 'Marine Security Guard' | 'Combat Instructor' | 'Security Forces'

interface Step6Data {
  sdaAssignment: SdaOption
  crbReferrals: number
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
    rank: touched.rank && !data.rank ? 'Select your rank' : '',
    dor: touched.dor && !data.dor ? 'Required' : '',
  }

  function blur(field: string) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="onboard_fullName" className={labelClass} style={labelStyle}>Full Name</label>
        <input
          id="onboard_fullName"
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
        <label htmlFor="onboard_mosCode" className={labelClass} style={labelStyle}>MOS Code</label>
        <input
          id="onboard_mosCode"
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
        <p className={labelClass} style={labelStyle}>Rank</p>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {RANKS.map(rank => {
            const selected = data.rank === rank
            return (
              <button
                key={rank}
                type="button"
                onClick={() => { onChange({ ...data, rank }); blur('rank') }}
                className="flex flex-col items-center justify-center rounded-xl border-[1.5px] cursor-pointer transition-all duration-150"
                style={{
                  height: 76,
                  paddingTop: 8,
                  paddingBottom: 6,
                  borderColor: selected ? '#FF5522' : '#D2C4A8',
                  background: selected ? '#FF5522' : '#ebe1d1',
                }}
              >
                <RankInsignia rank={rank} color={selected ? '#FFFFFF' : '#6B5A3E'} size={48} />
                <span
                  className="font-body font-semibold leading-none mt-1"
                  style={{ fontSize: 11, color: selected ? '#FFFFFF' : '#1A1A1A' }}
                >
                  {rank}
                </span>
              </button>
            )
          })}
        </div>
        {errors.rank && <p className={errorClass} style={errorStyle}>{errors.rank}</p>}
      </div>

      <div>
        <p className={labelClass} style={labelStyle}>Date of Rank</p>
        <DateSelectInput
          value={data.dor}
          onChange={dor => onChange({ ...data, dor })}
          onBlur={() => blur('dor')}
        />
        {errors.dor && <p className={errorClass} style={errorStyle}>{errors.dor}</p>}
      </div>
    </div>
  )
}

const MCMAP_OPTIONS: { code: McmapBeltCode; label: string }[] = [
  { code: 'MMA', label: 'UNQUAL' },
  { code: 'MMB', label: 'TAN' },
  { code: 'MMC', label: 'Gray' },
  { code: 'MMD', label: 'Green' },
  { code: 'MME', label: 'Green Instructor' },
  { code: 'MMF', label: 'Brown' },
  { code: 'MMG+', label: 'Brown Instructor' },
]

const DEGREE_OPTIONS: DegreeOption[] = ['None', 'Associates', 'Bachelors']
const MOS_CQ_OPTIONS: MosCqOption[] = ['None', 'CDI', 'CDQAR', 'QASO']

function SelectTile({
  top,
  bottom,
  selected,
  onClick,
}: {
  top: string
  bottom?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border-[1.5px] cursor-pointer transition-all duration-150 text-left"
      style={{
        minHeight: 64,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: selected ? '#FF5522' : '#D2C4A8',
        background: selected ? '#FF5522' : '#ebe1d1',
        color: selected ? '#FFFFFF' : '#1A1A1A',
      }}
    >
      <div className="flex flex-col">
        <span className="font-body font-semibold leading-none" style={{ fontSize: 13 }}>
          {top}
        </span>
        {bottom && (
          <span className="font-body leading-snug mt-1" style={{ fontSize: 11, opacity: selected ? 0.9 : 0.75 }}>
            {bottom}
          </span>
        )}
      </div>
    </button>
  )
}

function HorizontalSliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <div className="bg-wp-bg rounded-xl border border-wp-contour/50 p-4">
      <div className="flex items-end justify-between gap-3">
        <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 12, letterSpacing: '0.04em' }}>
          {label}
        </p>
        <span className="font-mono font-bold text-wp-black" style={{ fontSize: 22, lineHeight: 1 }}>
          {value}
        </span>
      </div>
      <div className="mt-4">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
        />
      </div>
    </div>
  )
}

function WarfightingStep({
  data,
  onChange,
}: {
  data: Step2Data
  onChange: (d: Step2Data) => void
}) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const errors = {
    mcmapBelt: touched.mcmapBelt && !data.mcmapBelt ? 'Select a belt' : '',
  }

  function blur(field: string) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  return (
    <div className="space-y-5">
      <HorizontalSliderField
        label="Number of destroys achieved"
        value={data.destroys}
        min={1}
        max={50}
        step={1}
        onChange={v => onChange({ ...data, destroys: v })}
      />

      <div>
        <p className={labelClass} style={labelStyle}>MCMAP Belt</p>
        <div className="grid grid-cols-2 gap-2">
          {MCMAP_OPTIONS.map(opt => (
            <SelectTile
              key={opt.code}
              top={opt.code}
              bottom={opt.label}
              selected={data.mcmapBelt === opt.code}
              onClick={() => {
                onChange({ ...data, mcmapBelt: opt.code })
                blur('mcmapBelt')
              }}
            />
          ))}
        </div>
        {errors.mcmapBelt && <p className={errorClass} style={errorStyle}>{errors.mcmapBelt}</p>}
      </div>
    </div>
  )
}

function MentalAgilityStep({
  data,
  onChange,
}: {
  data: Step3Data
  onChange: (d: Step3Data) => void
}) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const errors = {
    degree: touched.degree && !data.degree ? 'Select a degree' : '',
  }

  function blur(field: string) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  const cqSelected = new Set(data.mosCqs)

  return (
    <div className="space-y-5">
      <HorizontalSliderField
        label="MOS qual points (max 100)"
        value={data.mosQualPoints}
        min={0}
        max={100}
        step={5}
        onChange={v => onChange({ ...data, mosQualPoints: v })}
      />

      <HorizontalSliderField
        label="MarineNet CEUs / MCIs (max 40)"
        value={data.marineNetCourses}
        min={0}
        max={40}
        step={1}
        onChange={v => onChange({ ...data, marineNetCourses: v })}
      />

      <div>
        <p className={labelClass} style={labelStyle}>Degree</p>
        <div className="grid grid-cols-3 gap-2">
          {DEGREE_OPTIONS.map(opt => (
            <SelectTile
              key={opt}
              top={opt}
              selected={data.degree === opt}
              onClick={() => {
                onChange({ ...data, degree: opt })
                blur('degree')
              }}
            />
          ))}
        </div>
        {errors.degree && <p className={errorClass} style={errorStyle}>{errors.degree}</p>}
      </div>

      <HorizontalSliderField
        label="Off-duty college courses (in-grade, max 4)"
        value={data.offDutyEducationCourses}
        min={0}
        max={4}
        step={1}
        onChange={v => onChange({ ...data, offDutyEducationCourses: v })}
      />

      <div>
        <p className={labelClass} style={labelStyle}>MOS CQs</p>
        <div className="grid grid-cols-2 gap-2">
          {MOS_CQ_OPTIONS.map(opt => {
            const selected = cqSelected.has(opt)
            return (
              <SelectTile
                key={opt}
                top={opt}
                selected={selected}
                onClick={() => {
                  if (opt === 'None') {
                    onChange({ ...data, mosCqs: ['None'] })
                    return
                  }
                  const next = new Set(cqSelected)
                  next.delete('None')
                  if (next.has(opt)) next.delete(opt)
                  else next.add(opt)
                  onChange({ ...data, mosCqs: next.size ? Array.from(next) : ['None'] })
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CommandInputStep({
  data,
  onChange,
}: {
  data: Step5Data
  onChange: (d: Step5Data) => void
}) {
  const mosMissionVal = parseFloat(data.mosMission) || 1
  const leadershipVal = parseFloat(data.leadership) || 1
  const characterVal = parseFloat(data.character) || 1

  return (
    <div className="flex flex-col">
      <p
        className="font-body text-center mb-6"
        style={{ fontSize: 13, color: '#A08060' }}
      >
        Command Input is scored 1.0 to 5.0. Drag sliders up to set your values.
      </p>
      <div className="flex justify-around gap-4 px-2">
        <VerticalSlider
          label="MOS / Mission"
          value={mosMissionVal}
          min={1}
          max={5}
          step={0.1}
          ticks={COMMAND_TICKS}
          getClassification={getProConClass}
          displayDecimals={1}
          onChange={v => onChange({ ...data, mosMission: v.toFixed(1) })}
        />
        <div
          className="w-px self-stretch"
          style={{ background: '#D2C4A8', marginTop: 28, marginBottom: 0 }}
        />
        <VerticalSlider
          label="Leadership"
          value={leadershipVal}
          min={1}
          max={5}
          step={0.1}
          ticks={COMMAND_TICKS}
          getClassification={getProConClass}
          displayDecimals={1}
          onChange={v => onChange({ ...data, leadership: v.toFixed(1) })}
        />
        <div
          className="w-px self-stretch"
          style={{ background: '#D2C4A8', marginTop: 28, marginBottom: 0 }}
        />
        <VerticalSlider
          label="Character"
          value={characterVal}
          min={1}
          max={5}
          step={0.1}
          ticks={COMMAND_TICKS}
          getClassification={getProConClass}
          displayDecimals={1}
          onChange={v => onChange({ ...data, character: v.toFixed(1) })}
        />
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

function getProConClass(score: number): { label: string; color: string } {
  if (score >= 4.8) return { label: 'Outstanding', color: '#2D8A4E' }
  if (score >= 4.0) return { label: 'Above Avg', color: '#D4940A' }
  if (score >= 3.0) return { label: 'Average', color: '#A08060' }
  return { label: 'Below Avg', color: '#CC3333' }
}

const SCORE_TICKS = [300, 225, 150, 75, 0]
const COMMAND_TICKS = [5.0, 4.0, 3.0, 2.0, 1.0]

function VerticalSlider({
  label,
  value,
  min,
  max,
  step,
  ticks,
  getClassification,
  displayDecimals = 0,
  onChange,
  flex = true,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  ticks: number[]
  getClassification: (v: number) => { label: string; color: string }
  displayDecimals?: number
  onChange: (v: number) => void
  flex?: boolean
}) {
  const [inputVal, setInputVal] = useState(value.toFixed(displayDecimals))
  const classification = getClassification(value)

  useEffect(() => {
    setInputVal(value.toFixed(displayDecimals))
  }, [value, displayDecimals])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputVal(e.target.value)
  }

  function handleInputBlur() {
    const parsed = parseFloat(inputVal)
    if (!Number.isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed))
      const rounded = Math.round(clamped / step) * step
      onChange(rounded)
      setInputVal(rounded.toFixed(displayDecimals))
    } else {
      setInputVal(value.toFixed(displayDecimals))
    }
  }

  function handleSliderChange(v: number) {
    onChange(v)
    setInputVal(v.toFixed(displayDecimals))
  }

  return (
    <div className={`flex flex-col items-center ${flex ? 'flex-1' : ''}`}>
      <input
        type="number"
        value={inputVal}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        step={step}
        min={min}
        max={max}
        className="font-heading font-bold leading-none text-center bg-transparent border-none outline-none w-full"
        style={{ fontSize: 32, color: '#1A1A1A', WebkitAppearance: 'none', MozAppearance: 'textfield' }}
      />
      <span
        className="font-body font-semibold leading-none mb-1"
        style={{ fontSize: 11, color: classification.color, letterSpacing: '0.04em' }}
      >
        {classification.label}
      </span>
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
          {ticks.map(tick => (
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
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([v]) => handleSliderChange(v)}
          style={{ height: '100%' }}
          className="h-full"
        />
      </div>
    </div>
  )
}

function FitnessSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <VerticalSlider
      label={label}
      value={value}
      min={0}
      max={300}
      step={1}
      ticks={SCORE_TICKS}
      getClassification={getScoreClass}
      displayDecimals={0}
      onChange={onChange}
    />
  )
}

function FitnessStep({
  data,
  onChange,
}: {
  data: Step4Data
  onChange: (d: Step4Data) => void
}) {
  const pftVal = parseInt(data.pftScore, 10) || 0
  const cftVal = parseInt(data.cftScore, 10) || 0

  return (
    <div className="flex flex-col">
      <p
        className="font-body text-center mb-6"
        style={{ fontSize: 13, color: '#A08060' }}
      >
        Add your latest fitness scores. Drag sliders up to set your scores.
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

const SDA_OPTIONS: { code: SdaOption; label: string }[] = [
  { code: 'None', label: 'No SDA' },
  { code: 'Drill Instructor', label: 'DI School' },
  { code: 'Recruiter', label: 'RSS' },
  { code: 'Marine Security Guard', label: 'MSG' },
  { code: 'Combat Instructor', label: 'CI' },
  { code: 'Security Forces', label: 'SecFor' },
]

function BonusStep({
  data,
  onChange,
}: {
  data: Step6Data
  onChange: (d: Step6Data) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className={labelClass} style={labelStyle}>Special Duty Assignment (SDA)</p>
        <p className="font-body text-wp-tan-dark mb-3" style={{ fontSize: 12, lineHeight: 1.5 }}>
          DI, Recruiter, MSG, Combat Instructor, and Security Forces earn 50 bonus points.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SDA_OPTIONS.map(opt => (
            <SelectTile
              key={opt.code}
              top={opt.code}
              bottom={opt.label}
              selected={data.sdaAssignment === opt.code}
              onClick={() => onChange({ ...data, sdaAssignment: opt.code })}
            />
          ))}
        </div>
      </div>

      <HorizontalSliderField
        label="CRB referrals (20 pts each, max 5)"
        value={data.crbReferrals}
        min={0}
        max={5}
        step={1}
        onChange={v => onChange({ ...data, crbReferrals: v })}
      />

      <div
        className="rounded-xl p-4 border border-wp-contour/50"
        style={{ background: '#F5F1EB' }}
      >
        <p className="font-body font-semibold text-wp-black" style={{ fontSize: 13 }}>
          Bonus Points Preview
        </p>
        <p className="font-body text-wp-tan-dark mt-1" style={{ fontSize: 12, lineHeight: 1.5 }}>
          SDA: {data.sdaAssignment !== 'None' ? '50 pts' : '0 pts'} &nbsp;+&nbsp; CRB: {data.crbReferrals * 20} pts = <span className="font-semibold text-wp-black">{Math.min((data.sdaAssignment !== 'None' ? 50 : 0) + data.crbReferrals * 20, 100)} / 100 pts</span>
        </p>
      </div>
    </div>
  )
}

export default function OnboardingFlow({ onComplete, onDismiss }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)
  const [showCheck, setShowCheck] = useState(false)

  const [step1, setStep1] = useState<Step1Data>({
    fullName: '',
    mosCode: '',
    rank: '',
    dor: '',
  })
  const [step2, setStep2] = useState<Step2Data>({ destroys: 1, mcmapBelt: '' })
  const [step3, setStep3] = useState<Step3Data>({
    marineNetCourses: 0,
    degree: '',
    offDutyEducationCourses: 0,
    mosCqs: ['None'],
    mosQualPoints: 0,
  })
  const [step4, setStep4] = useState<Step4Data>({ pftScore: '0', cftScore: '0' })
  const [step5, setStep5] = useState<Step5Data>({ mosMission: '3.0', leadership: '3.0', character: '3.0' })
  const [step6, setStep6] = useState<Step6Data>({ sdaAssignment: 'None', crbReferrals: 0 })

  const contentRef = useRef<HTMLDivElement>(null)

  function canAdvance(): boolean {
    if (step === 0) return true
    if (step === 1) {
      return (
        step1.fullName.trim().length > 0 &&
        /^\d{4}$/.test(step1.mosCode) &&
        !!step1.rank &&
        !!step1.dor
      )
    }
    if (step === 2) {
      return step2.destroys >= 1 && step2.destroys <= 50 && !!step2.mcmapBelt
    }
    if (step === 3) {
      return !!step3.degree && step3.mosCqs.length > 0
    }
    if (step === 4) {
      const pft = parseInt(step4.pftScore, 10)
      const cft = parseInt(step4.cftScore, 10)
      return !Number.isNaN(pft) && pft >= 0 && pft <= 300 && !Number.isNaN(cft) && cft >= 0 && cft <= 300
    }
    if (step === 5) {
      const mosMission = parseFloat(step5.mosMission)
      const leadership = parseFloat(step5.leadership)
      const character = parseFloat(step5.character)
      return (
        !Number.isNaN(mosMission) && mosMission >= 1 && mosMission <= 5 &&
        !Number.isNaN(leadership) && leadership >= 1 && leadership <= 5 &&
        !Number.isNaN(character) && character >= 1 && character <= 5
      )
    }
    if (step === 6) {
      return true
    }
    return false
  }

  function begin() {
    if (animating) return
    vibrate(20)
    setDirection('forward')
    setAnimating(true)
    setStep(1)
    setTimeout(() => setAnimating(false), 250)
  }

  function goNext() {
    if (!canAdvance() || animating) return
    if (step === 0) {
      begin()
      return
    }

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
        const mosMission = parseFloat(step5.mosMission)
        const leadership = parseFloat(step5.leadership)
        const character = parseFloat(step5.character)
        const safeMosMission = !Number.isNaN(mosMission) ? mosMission : 3.0
        const safeLeadership = !Number.isNaN(leadership) ? leadership : 3.0
        const safeCharacter = !Number.isNaN(character) ? character : 3.0
        onComplete({
          firstName,
          lastName,
          mosCode: step1.mosCode,
          rank: step1.rank as RankCode,
          dor: step1.dor,
          destroysAchieved: step2.destroys,
          mcmapBelt: step2.mcmapBelt,
          marineNetCourses: step3.marineNetCourses,
          degree: step3.degree,
          offDutyEducationCourses: step3.offDutyEducationCourses,
          mosCqs: step3.mosCqs,
          mosQualPoints: step3.mosQualPoints,
          commandInputMosMission: safeMosMission,
          commandInputLeadership: safeLeadership,
          commandInputCharacter: safeCharacter,
          pftScore: parseInt(step4.pftScore, 10),
          cftScore: parseInt(step4.cftScore, 10),
          rifleScore: 335,
          rifleBadge: 'Expert',
          sdaAssignment: step6.sdaAssignment,
          crbReferrals: step6.crbReferrals,
        })
      }, 600)
    }
  }

  function goBack() {
    if (step === 0 || animating) return
    vibrate(20)
    setDirection('back')
    setAnimating(true)
    setStep(s => s - 1)
    setTimeout(() => setAnimating(false), 250)
  }

  const stepTitles = [
    'Your Info',
    'Warfighting',
    'Mental Agility',
    'Physical Toughness',
    'Command Input',
    'Bonus Points',
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
    <div className="absolute inset-0 z-[80] bg-black">
      <div
        className="relative w-full h-full flex flex-col bg-wp-bg"
      >
        {step === 0 ? (
          <div className="relative w-full h-full">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: 'url(/welcome.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.80) 100%)',
              }}
            />

            <div className="relative z-10 h-full flex flex-col px-5 pt-6">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={onDismiss}
                  className="font-body font-semibold text-white cursor-pointer border-[1.5px] rounded-lg"
                  style={{
                    fontSize: 14,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 7,
                    paddingBottom: 7,
                    borderColor: 'rgba(255,255,255,0.35)',
                    background: 'rgba(0,0,0,0.22)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  Cancel
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h1
                  className="font-heading font-bold text-white"
                  style={{ fontSize: 34, lineHeight: 1.05, letterSpacing: '-0.03em' }}
                >
                  Welcome to Waypoints
                </h1>
                <p
                  className="mt-2 font-heading font-semibold text-white/90"
                  style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.02em' }}
                >
                  Your career navigator
                </p>

                <p
                  className="mt-5 font-body text-white/80"
                  style={{ fontSize: 13, lineHeight: 1.45, maxWidth: 320 }}
                >
                  Please go to MCTFS to assist with onboarding
                </p>
              </div>

              <div
                className="pb-10"
                style={{ paddingBottom: 'max(40px, env(safe-area-inset-bottom))' }}
              >
                <button
                  type="button"
                  onClick={begin}
                  className="w-full flex items-center justify-center bg-wp-accent text-white font-body font-semibold rounded-xl border-none cursor-pointer transition-all duration-150 active:opacity-95"
                  style={{ height: 58, fontSize: 16 }}
                >
                  Let&apos;s Begin
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundImage: 'url(/tan-contours.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.25,
              }}
            />

            <div className="sticky top-0 z-10 bg-wp-bg/90 backdrop-blur-sm px-5 pt-5 pb-4 border-b border-wp-tan-light/50">
              <div className="flex items-center justify-between mb-3">
                <span className="font-body font-semibold text-wp-tan-dark" style={{ fontSize: 13 }}>
                  Step {step} of {TOTAL_STEPS}
                </span>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="font-body font-semibold text-wp-black cursor-pointer border-[1.5px] border-wp-contour rounded-lg"
                  style={{
                    fontSize: 14,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 7,
                    paddingBottom: 7,
                    background: '#ebe1d1',
                  }}
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
                {step === 2 && <WarfightingStep data={step2} onChange={setStep2} />}
                {step === 3 && <MentalAgilityStep data={step3} onChange={setStep3} />}
                {step === 4 && <FitnessStep data={step4} onChange={setStep4} />}
                {step === 5 && <CommandInputStep data={step5} onChange={setStep5} />}
                {step === 6 && <BonusStep data={step6} onChange={setStep6} />}
              </div>
            </div>

            <div className="px-5 pb-10 pt-4 border-t border-wp-tan-light/50 bg-wp-bg">
              <div className="flex items-center gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1.5 border-[1.5px] border-wp-contour text-wp-black font-body font-semibold rounded-xl cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light shrink-0"
                    style={{ height: 52, paddingLeft: 16, paddingRight: 20, fontSize: 14, background: '#ebe1d1' }}
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance()}
                  className="flex-1 flex items-center justify-center gap-2 bg-wp-accent text-white font-body font-semibold rounded-xl border-none cursor-pointer transition-all duration-150 disabled:opacity-100 disabled:bg-wp-tan-light disabled:text-wp-tan-dark disabled:cursor-not-allowed"
                  style={{ height: 52, fontSize: 15 }}
                >
                  {showCheck ? (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false">
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
          </>
        )}
      </div>
    </div>
  )
}
