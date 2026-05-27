import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowLeft, Flag, Apple, Mail, ChevronRight, Bell, Sparkles, Clock } from 'lucide-react'
import { BRANCH_LIST, BRANCHES, getNextRank } from '../data/branches'
import type { BranchId } from '../data/branches'
import { nextFitnessTestDate } from '../data/objectives'
import type { Intent } from '../data/objectives'
import type { OnboardingV2Data } from '../data/useAppState'
import { CURRENT_DATE } from '../data/promotionTimeline'

type Step =
  | 'welcome' | 'account' | 'component' | 'waitlist' | 'branch' | 'rankclass'
  | 'officerWaitlist' | 'rank' | 'dep' | 'intent' | 'career' | 'fitness' | 'aha' | 'push'

const DAY_MS = 1000 * 60 * 60 * 24
const ACCENT = '#FF5522'

interface OnboardingFlowProps {
  onComplete: (data: OnboardingV2Data) => void
  onClose: () => void
}

const inputStyle: CSSProperties = {
  background: '#FFFFFF', border: '1.5px solid #D2C4A8', borderRadius: 8,
  padding: '11px 14px', fontSize: 14, height: 44, width: '100%', color: '#1A1A1A',
}

function daysUntil(d: Date): number {
  return Math.max(0, Math.ceil((d.getTime() - CURRENT_DATE.getTime()) / DAY_MS))
}

function nextQuarterEnd(): Date {
  const y = CURRENT_DATE.getFullYear()
  const m = CURRENT_DATE.getMonth()
  const ends = [new Date(y, 2, 31), new Date(y, 5, 30), new Date(y, 8, 30), new Date(y, 11, 31), new Date(y + 1, 2, 31)]
  return ends.find(e => e.getTime() > CURRENT_DATE.getTime()) ?? new Date(y, m + 4, 1)
}

export default function OnboardingFlow({ onComplete, onClose }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('welcome')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [branchId, setBranchId] = useState<BranchId | null>(null)
  const [payGrade, setPayGrade] = useState('')
  const [intent, setIntent] = useState<Intent | null>(null)
  const [job, setJob] = useState('')
  const [tis, setTis] = useState('')
  const [tig, setTig] = useState('')
  const [sex, setSex] = useState('')
  const [age, setAge] = useState('')
  const [lastScore, setLastScore] = useState('')
  const [showComponents, setShowComponents] = useState(false)
  const [skipScore, setSkipScore] = useState(false)
  const [shipDate, setShipDate] = useState('')

  const branch = branchId ? BRANCHES[branchId] : null
  const accent = branch?.color ?? ACCENT
  const accentDark = branch?.colorDark ?? '#CC4400'

  function finish() {
    if (!branchId) return
    const isPre = payGrade === 'PRE'
    onComplete({
      firstName: firstName || 'Recruit',
      lastName: lastName || 'Service Member',
      branchId,
      payGrade: isPre ? 'E-1' : payGrade,
      intent: intent ?? 'career',
      job: job || undefined,
      lastScore: skipScore || !lastScore ? undefined : Number(lastScore),
      targetDate: isPre ? shipDate : undefined,
      isPreBootcamp: isPre,
    })
    onClose()
  }

  const nextRank = branchId ? getNextRank(branchId, payGrade) : null
  const ahaLabel = payGrade === 'PRE'
    ? 'Prepare for Boot Camp'
    : intent === 'fitness'
      ? `Improve ${branch?.fitnessTest ?? 'Fitness'} Score`
      : intent === 'finance'
        ? 'Build Emergency Savings'
        : `Make ${nextRank?.name ?? 'Next Rank'}`
  const ahaTarget = payGrade === 'PRE'
    ? (shipDate ? new Date(shipDate) : new Date(CURRENT_DATE.getTime() + 120 * DAY_MS))
    : intent === 'fitness'
      ? nextFitnessTestDate(branch?.fitnessTest ?? 'PFT')
      : nextQuarterEnd()
  const ahaDays = daysUntil(ahaTarget)
  const ahaCountdownLabel = payGrade === 'PRE' ? 'Ship date' : intent === 'fitness' ? `${branch?.fitnessTest} window` : 'Next promotion cycle'

  const style: CSSProperties & Record<string, string> = {
    '--color-wp-accent': accent,
    '--color-wp-accent-dark': accentDark,
  }

  return (
    <div className="absolute inset-0 z-[110] bg-black">
      <div className="relative h-full w-full flex flex-col overflow-hidden bg-wp-bg" style={style}>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'url(/tan-contours.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.22 }} />
        <div className="relative z-10 flex flex-col h-full">
          {step !== 'welcome' && (
            <div className="shrink-0 px-4 pt-4 flex items-center gap-3">
              <button type="button" onClick={onClose} className="text-wp-tan-dark font-body" style={{ fontSize: 14 }}>Skip</button>
              <div className="flex-1 h-1 rounded-full bg-wp-tan-light overflow-hidden">
                <div className="h-full bg-wp-accent rounded-full" style={{ width: `${stepProgress(step)}%`, transition: 'width 200ms ease-out' }} />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-5 pt-6 pb-8">
            {step === 'welcome' && (
              <Centered>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-wp-accent mb-5"><Flag size={30} className="text-white" /></div>
                <h1 className="font-heading font-bold text-wp-black" style={{ fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.02em' }}>Waypoints</h1>
                <p className="mt-3 font-body text-wp-tan-dark" style={{ fontSize: 15, lineHeight: 1.5, maxWidth: 300 }}>
                  Know where you stand, what's next, and when to do it. Let's set your first objective.
                </p>
                <Primary onClick={() => setStep('account')} className="mt-8">Get started</Primary>
              </Centered>
            )}

            {step === 'account' && (
              <Frame title="Create your account" subtitle="Your record is private to you.">
                <div className="space-y-4">
                  <Field label="First name"><input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Alex" style={inputStyle} /></Field>
                  <Field label="Last name"><input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Rivera" style={inputStyle} /></Field>
                  <div className="pt-1 space-y-2">
                    <SsoButton icon={<Apple size={18} />} label="Continue with Apple" onClick={() => setStep('component')} />
                    <SsoButton icon={<span className="font-bold" style={{ fontSize: 15 }}>G</span>} label="Continue with Google" onClick={() => setStep('component')} />
                    <SsoButton icon={<Mail size={18} />} label="Continue with email" onClick={() => setStep('component')} />
                  </div>
                </div>
              </Frame>
            )}

            {step === 'component' && (
              <Frame title="Which best describes you?" onBack={() => setStep('account')}>
                <div className="space-y-2">
                  <Option label="Active Duty" onClick={() => setStep('branch')} />
                  <Option label="National Guard" onClick={() => setStep('waitlist')} />
                  <Option label="Reserve" onClick={() => setStep('waitlist')} />
                </div>
              </Frame>
            )}

            {step === 'waitlist' && (
              <Frame title="You're on the list" subtitle="We're starting with Active Duty and adding Guard & Reserve next. We'll let you know.">
                <div className="space-y-2 pt-2">
                  <Primary onClick={onClose}>Done</Primary>
                  <Ghost onClick={() => setStep('branch')}>Wait — I'm Active Duty</Ghost>
                </div>
              </Frame>
            )}

            {step === 'branch' && (
              <Frame title="Pick your branch" subtitle="We'll tailor ranks, scoring, and fitness to your service." onBack={() => setStep('component')}>
                <div className="grid grid-cols-2 gap-3">
                  {BRANCH_LIST.map(b => (
                    <button key={b.id} type="button" onClick={() => { setBranchId(b.id); setStep('rankclass') }}
                      className="rounded-xl p-4 text-left border bg-white" style={{ borderColor: branchId === b.id ? b.color : '#E8D5B7' }}>
                      <span className="block w-6 h-6 rounded-full mb-2" style={{ background: b.color }} />
                      <span className="font-heading font-bold text-wp-black block" style={{ fontSize: 15 }}>{b.shortName}</span>
                    </button>
                  ))}
                </div>
              </Frame>
            )}

            {step === 'rankclass' && (
              <Frame title="What's your rank class?" onBack={() => setStep('branch')}>
                <div className="space-y-2">
                  <Option label="Enlisted" onClick={() => setStep('rank')} />
                  <Option label="Officer" onClick={() => setStep('officerWaitlist')} />
                  <Option label="Warrant Officer" onClick={() => setStep('officerWaitlist')} />
                  <Option label="Pre-bootcamp (DEP)" onClick={() => { setPayGrade('PRE'); setStep('dep') }} />
                </div>
              </Frame>
            )}

            {step === 'officerWaitlist' && (
              <Frame title="Enlisted first" subtitle="Officer and warrant tracks are coming soon. We're building the enlisted experience first.">
                <div className="space-y-2 pt-2">
                  <Primary onClick={onClose}>Join the waitlist</Primary>
                  <Ghost onClick={() => setStep('rank')}>I'm enlisted</Ghost>
                </div>
              </Frame>
            )}

            {step === 'rank' && branch && (
              <Frame title="What's your rank?" subtitle={`${branch.shortName} enlisted`} onBack={() => setStep('rankclass')}>
                <div className="space-y-2">
                  {branch.enlistedRanks.map(r => (
                    <button key={r.payGrade} type="button" onClick={() => { setPayGrade(r.payGrade); setStep('intent') }}
                      className="w-full text-left rounded-xl p-3 flex items-center justify-between border bg-white"
                      style={{ borderColor: payGrade === r.payGrade ? accent : '#E8D5B7' }}>
                      <span className="font-body text-wp-black" style={{ fontSize: 14 }}><b>{r.payGrade}</b> · {r.name} <span className="text-wp-tan-dark">({r.abbr})</span></span>
                      <ChevronRight size={16} className="text-wp-tan-dark" />
                    </button>
                  ))}
                </div>
              </Frame>
            )}

            {step === 'dep' && (
              <Frame title="When do you ship?" subtitle="We'll count down to your ship date and build a readiness plan." onBack={() => setStep('rankclass')}>
                <Field label="Ship date"><input type="date" value={shipDate} onChange={e => setShipDate(e.target.value)} style={inputStyle} /></Field>
                <Primary className="mt-5" onClick={() => setStep('aha')}>See my plan</Primary>
              </Frame>
            )}

            {step === 'intent' && (
              <Frame title="What brought you here?" subtitle="Pick one. You can change it anytime." onBack={() => setStep('rank')}>
                <div className="space-y-2">
                  <Option label="Get promoted" sub="Close the gap to your next rank" onClick={() => { setIntent('career'); setStep('career') }} />
                  <Option label="Improve my fitness" sub={`Raise your ${branch?.fitnessTest ?? 'fitness'} score`} onClick={() => { setIntent('fitness'); setStep('fitness') }} />
                  <Option label="Get my finances right" sub="Build savings and use your benefits" onClick={() => { setIntent('finance'); setStep('push') }} />
                </div>
              </Frame>
            )}

            {step === 'career' && branch && (
              <Frame title="Tell us where you stand" onBack={() => setStep('intent')}>
                <div className="space-y-4">
                  <Field label="Time in service"><input value={tis} onChange={e => setTis(e.target.value)} placeholder="4 years" style={inputStyle} /></Field>
                  <Field label="Time in grade"><input value={tig} onChange={e => setTig(e.target.value)} placeholder="14 months" style={inputStyle} /></Field>
                  <Field label={branch.jobLabel}><input value={job} onChange={e => setJob(e.target.value)} placeholder={branch.jobPlaceholder} style={inputStyle} /></Field>
                  <Primary onClick={() => setStep('aha')}>See my trajectory</Primary>
                </div>
              </Frame>
            )}

            {step === 'fitness' && branch && (
              <Frame title={`Your last ${branch.fitnessTest}`} onBack={() => setStep('intent')}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Age"><input value={age} onChange={e => setAge(e.target.value)} placeholder="22" style={inputStyle} /></Field>
                    <Field label="Sex">
                      <select value={sex} onChange={e => setSex(e.target.value)} style={inputStyle}>
                        <option value="">—</option><option value="M">Male</option><option value="F">Female</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Total score"><input value={lastScore} onChange={e => setLastScore(e.target.value)} placeholder="285" style={inputStyle} /></Field>
                  {!showComponents ? (
                    <button type="button" onClick={() => setShowComponents(true)} className="font-body font-medium text-wp-accent" style={{ fontSize: 13 }}>+ Add component scores</button>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <Field label="Run"><input placeholder="18:30" style={inputStyle} /></Field>
                      <Field label="Push-ups"><input placeholder="60" style={inputStyle} /></Field>
                      <Field label="Plank"><input placeholder="3:45" style={inputStyle} /></Field>
                    </div>
                  )}
                  <Primary onClick={() => { setSkipScore(false); setStep('aha') }}>See my gap</Primary>
                  <Ghost onClick={() => { setSkipScore(true); setStep('aha') }}>I don't know my last score</Ghost>
                </div>
              </Frame>
            )}

            {step === 'aha' && (
              <Centered>
                <span className="font-body font-medium uppercase tracking-[0.04em] text-wp-tan-dark" style={{ fontSize: 11 }}>Your objective</span>
                <h1 className="mt-2 font-heading font-bold text-wp-black text-center" style={{ fontSize: 28, lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: 320 }}>{ahaLabel}</h1>
                <div className="mt-6 flex items-center gap-3 bg-wp-surface rounded-2xl px-6 py-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <Clock size={22} className="text-wp-accent" />
                  <div>
                    <div className="font-mono font-bold text-wp-black" style={{ fontSize: 28, lineHeight: 1 }}>{ahaDays}<span className="text-wp-tan-dark" style={{ fontSize: 14 }}> days</span></div>
                    <div className="font-body text-wp-tan-dark" style={{ fontSize: 12 }}>{ahaCountdownLabel}</div>
                  </div>
                </div>
                {skipScore && <p className="mt-4 font-body text-wp-tan-dark text-center" style={{ fontSize: 13, maxWidth: 300 }}>Log your next score and we'll sharpen this gap.</p>}
                <Primary className="mt-8" onClick={() => setStep('push')}>Continue</Primary>
              </Centered>
            )}

            {step === 'push' && (
              <Centered>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-wp-accent mb-5"><Bell size={28} className="text-white" /></div>
                <h1 className="font-heading font-bold text-wp-black text-center" style={{ fontSize: 24, lineHeight: 1.15 }}>Stay on track</h1>
                <p className="mt-3 font-body text-wp-tan-dark text-center" style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 300 }}>
                  We'll nudge you before tests, deadlines, and policy changes that affect your objective.
                </p>
                <Primary className="mt-8" onClick={finish}><span className="flex items-center justify-center gap-2"><Sparkles size={16} /> Turn on notifications</span></Primary>
                <Ghost onClick={finish}>Not now</Ghost>
              </Centered>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function stepProgress(step: Step): number {
  const order: Step[] = ['account', 'component', 'branch', 'rankclass', 'rank', 'intent', 'career', 'aha', 'push']
  const idx = order.indexOf(step)
  if (idx < 0) return step === 'welcome' ? 0 : 50
  return Math.round(((idx + 1) / order.length) * 100)
}

function Centered({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center justify-center text-center min-h-full pt-6">{children}</div>
}

function Frame({ title, subtitle, onBack, children }: { title: string; subtitle?: string; onBack?: () => void; children: ReactNode }) {
  return (
    <div>
      {onBack && (
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 mb-4 text-wp-accent">
          <ArrowLeft size={18} /><span className="font-body font-medium" style={{ fontSize: 14 }}>Back</span>
        </button>
      )}
      <h1 className="font-heading font-bold text-wp-black" style={{ fontSize: 24, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{title}</h1>
      {subtitle && <p className="mt-2 font-body text-wp-tan-dark" style={{ fontSize: 14, lineHeight: 1.5 }}>{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block mb-2 font-body font-medium text-wp-black" style={{ fontSize: 13 }}>{label}</label>
      {children}
    </div>
  )
}

function Option({ label, sub, onClick }: { label: string; sub?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded-xl p-4 flex items-center justify-between border border-wp-tan-light bg-white">
      <span>
        <span className="font-heading font-bold text-wp-black block" style={{ fontSize: 16 }}>{label}</span>
        {sub && <span className="font-body text-wp-tan-dark block mt-0.5" style={{ fontSize: 13 }}>{sub}</span>}
      </span>
      <ChevronRight size={18} className="text-wp-tan-dark shrink-0" />
    </button>
  )
}

function SsoButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center justify-center gap-2 rounded-lg border-[1.5px] border-wp-tan text-wp-black font-body font-medium" style={{ background: '#EBE1D1', minHeight: 48, fontSize: 14 }}>
      {icon}{label}
    </button>
  )
}

function Primary({ children, onClick, className }: { children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={`w-full bg-wp-accent text-white font-body font-semibold rounded-lg active:bg-wp-accent-dark ${className ?? ''}`} style={{ minHeight: 48, fontSize: 15 }}>
      {children}
    </button>
  )
}

function Ghost({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full text-wp-accent font-body font-medium" style={{ minHeight: 44, fontSize: 14 }}>
      {children}
    </button>
  )
}
