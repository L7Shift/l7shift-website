'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMouseTracking } from '@/hooks/useMouseTracking'
import { CustomCursor } from '@/components/desktop/CustomCursor'
import { GradientBar } from '@/components/shared/GradientBar'

type IntakeData = {
  // Pre-filled from initial lead
  name: string
  email: string
  company: string
  // New fields from questionnaire
  role: string
  companySize: string
  industry: string
  industryOther: string
  needs: string[]
  needsOther: string
  visionClarity: string
  timeline: string
  budget: string
  decisionMaker: string
  currentTools: string
  frustration: string
  frustrationOther: string
  pastExperience: string
  successCriteria: string
  source: string
  sourceOther: string
}

const initialData: IntakeData = {
  name: '',
  email: '',
  company: '',
  role: '',
  companySize: '',
  industry: '',
  industryOther: '',
  needs: [],
  needsOther: '',
  visionClarity: '',
  timeline: '',
  budget: '',
  decisionMaker: '',
  currentTools: '',
  frustration: '',
  frustrationOther: '',
  pastExperience: '',
  successCriteria: '',
  source: '',
  sourceOther: '',
}

export default function IntakePage() {
  const params = useParams()
  const token = params.token as string
  const { mousePos, isHovering, handleHoverStart, handleHoverEnd } = useMouseTracking()
  const [formData, setFormData] = useState<IntakeData>(initialData)
  const [status, setStatus] = useState<'loading' | 'ready' | 'submitting' | 'success' | 'error' | 'invalid'>('loading')
  const [currentStep, setCurrentStep] = useState(0)

  const voidBlack = '#0A0A0A'
  const cyan = '#00F0FF'
  const magenta = '#FF00AA'

  // Fetch lead data from token
  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const response = await fetch(`/api/intake/${token}`)
        if (response.ok) {
          const data = await response.json()
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            email: data.email || '',
            company: data.company || '',
          }))
          setStatus('ready')
        } else if (response.status === 404) {
          setStatus('invalid')
        } else {
          setStatus('error')
        }
      } catch {
        // If API doesn't exist yet, still allow form to work
        setStatus('ready')
      }
    }
    fetchLeadData()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          ...formData,
        }),
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleMultiSelect = (field: 'needs', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0',
    color: '#FAFAFA',
    fontSize: '15px',
    fontFamily: 'Inter, -apple-system, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600 as const,
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    color: cyan,
    marginBottom: '12px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  }

  const questionStyle = {
    fontSize: '18px',
    fontWeight: 600 as const,
    color: '#FAFAFA',
    marginBottom: '16px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    lineHeight: 1.4,
  }

  const radioGroupStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  }

  const RadioOption = ({
    name,
    value,
    label,
    checked,
    onChange,
    hasOther = false,
  }: {
    name: string
    value: string
    label: string
    checked: boolean
    onChange: () => void
    hasOther?: boolean
  }) => (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: checked ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${checked ? cyan : 'rgba(255,255,255,0.1)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `2px solid ${checked ? cyan : 'rgba(255,255,255,0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {checked && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: cyan,
            }}
          />
        )}
      </div>
      <span style={{ color: '#FAFAFA', fontSize: '14px' }}>{label}</span>
    </label>
  )

  const CheckboxOption = ({
    value,
    label,
    checked,
    onChange,
  }: {
    value: string
    label: string
    checked: boolean
    onChange: () => void
  }) => (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: checked ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${checked ? cyan : 'rgba(255,255,255,0.1)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <div
        style={{
          width: 18,
          height: 18,
          border: `2px solid ${checked ? cyan : 'rgba(255,255,255,0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {checked && (
          <span style={{ color: cyan, fontSize: '14px', fontWeight: 700 }}>✓</span>
        )}
      </div>
      <span style={{ color: '#FAFAFA', fontSize: '14px' }}>{label}</span>
    </label>
  )

  // Question sections
  const questions = [
    // Section 0: Role & Company (Q4-Q6)
    {
      title: 'About You',
      fields: (
        <>
          <div style={{ marginBottom: 32 }}>
            <p style={questionStyle}>What best describes you?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="role" value="founder" label="Founder / Business Owner" checked={formData.role === 'founder'} onChange={() => setFormData({ ...formData, role: 'founder' })} />
              <RadioOption name="role" value="executive" label="Executive / Decision Maker" checked={formData.role === 'executive'} onChange={() => setFormData({ ...formData, role: 'executive' })} />
              <RadioOption name="role" value="manager" label="Manager / Team Lead" checked={formData.role === 'manager'} onChange={() => setFormData({ ...formData, role: 'manager' })} />
              <RadioOption name="role" value="other" label="Other" checked={formData.role === 'other'} onChange={() => setFormData({ ...formData, role: 'other' })} />
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={questionStyle}>How many people work at your company?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="companySize" value="solo" label="Just me" checked={formData.companySize === 'solo'} onChange={() => setFormData({ ...formData, companySize: 'solo' })} />
              <RadioOption name="companySize" value="2-10" label="2-10" checked={formData.companySize === '2-10'} onChange={() => setFormData({ ...formData, companySize: '2-10' })} />
              <RadioOption name="companySize" value="11-50" label="11-50" checked={formData.companySize === '11-50'} onChange={() => setFormData({ ...formData, companySize: '11-50' })} />
              <RadioOption name="companySize" value="51-200" label="51-200" checked={formData.companySize === '51-200'} onChange={() => setFormData({ ...formData, companySize: '51-200' })} />
              <RadioOption name="companySize" value="200+" label="200+" checked={formData.companySize === '200+'} onChange={() => setFormData({ ...formData, companySize: '200+' })} />
            </div>
          </div>

          <div>
            <p style={questionStyle}>What industry are you in?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="industry" value="service" label="Service Business (lawn care, cleaning, home services, etc.)" checked={formData.industry === 'service'} onChange={() => setFormData({ ...formData, industry: 'service' })} />
              <RadioOption name="industry" value="ecommerce" label="E-commerce / Retail" checked={formData.industry === 'ecommerce'} onChange={() => setFormData({ ...formData, industry: 'ecommerce' })} />
              <RadioOption name="industry" value="saas" label="SaaS / Software" checked={formData.industry === 'saas'} onChange={() => setFormData({ ...formData, industry: 'saas' })} />
              <RadioOption name="industry" value="agency" label="Agency / Consulting" checked={formData.industry === 'agency'} onChange={() => setFormData({ ...formData, industry: 'agency' })} />
              <RadioOption name="industry" value="other" label="Other" checked={formData.industry === 'other'} onChange={() => setFormData({ ...formData, industry: 'other' })} />
            </div>
            {formData.industry === 'other' && (
              <input
                type="text"
                placeholder="Please specify..."
                value={formData.industryOther}
                onChange={(e) => setFormData({ ...formData, industryOther: e.target.value })}
                style={{ ...inputStyle, marginTop: 12 }}
              />
            )}
          </div>
        </>
      ),
    },
    // Section 1: Project Needs (Q7-Q8)
    {
      title: 'Your Project',
      fields: (
        <>
          <div style={{ marginBottom: 32 }}>
            <p style={questionStyle}>What do you need? <span style={{ color: '#888', fontWeight: 400, fontSize: '14px' }}>(pick all that apply)</span></p>
            <div style={radioGroupStyle}>
              <CheckboxOption value="payments" label="A way to accept payments / subscriptions" checked={formData.needs.includes('payments')} onChange={() => handleMultiSelect('needs', 'payments')} />
              <CheckboxOption value="booking" label="Booking or scheduling system" checked={formData.needs.includes('booking')} onChange={() => handleMultiSelect('needs', 'booking')} />
              <CheckboxOption value="portal" label="Customer portal / accounts" checked={formData.needs.includes('portal')} onChange={() => handleMultiSelect('needs', 'portal')} />
              <CheckboxOption value="dashboard" label="Admin dashboard to manage things" checked={formData.needs.includes('dashboard')} onChange={() => handleMultiSelect('needs', 'dashboard')} />
              <CheckboxOption value="replace-spreadsheets" label="Replace spreadsheets with real software" checked={formData.needs.includes('replace-spreadsheets')} onChange={() => handleMultiSelect('needs', 'replace-spreadsheets')} />
              <CheckboxOption value="replace-software" label="Replace software that doesn't fit anymore" checked={formData.needs.includes('replace-software')} onChange={() => handleMultiSelect('needs', 'replace-software')} />
              <CheckboxOption value="mobile-app" label="Mobile app for my team" checked={formData.needs.includes('mobile-app')} onChange={() => handleMultiSelect('needs', 'mobile-app')} />
              <CheckboxOption value="other" label="Something else" checked={formData.needs.includes('other')} onChange={() => handleMultiSelect('needs', 'other')} />
            </div>
            {formData.needs.includes('other') && (
              <input
                type="text"
                placeholder="Please specify..."
                value={formData.needsOther}
                onChange={(e) => setFormData({ ...formData, needsOther: e.target.value })}
                style={{ ...inputStyle, marginTop: 12 }}
              />
            )}
          </div>

          <div>
            <p style={questionStyle}>How clear is your vision?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="vision" value="crystal" label="Crystal clear - I just need someone to build it" checked={formData.visionClarity === 'crystal'} onChange={() => setFormData({ ...formData, visionClarity: 'crystal' })} />
              <RadioOption name="vision" value="pretty-clear" label="Pretty clear - might need some help refining" checked={formData.visionClarity === 'pretty-clear'} onChange={() => setFormData({ ...formData, visionClarity: 'pretty-clear' })} />
              <RadioOption name="vision" value="problem-only" label="I know the problem, not sure about the solution yet" checked={formData.visionClarity === 'problem-only'} onChange={() => setFormData({ ...formData, visionClarity: 'problem-only' })} />
            </div>
          </div>
        </>
      ),
    },
    // Section 2: Timeline & Budget (Q9-Q11)
    {
      title: 'Timeline & Budget',
      fields: (
        <>
          <div style={{ marginBottom: 32 }}>
            <p style={questionStyle}>When do you need this done?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="timeline" value="asap" label="Yesterday (ASAP)" checked={formData.timeline === 'asap'} onChange={() => setFormData({ ...formData, timeline: 'asap' })} />
              <RadioOption name="timeline" value="weeks" label="Next few weeks" checked={formData.timeline === 'weeks'} onChange={() => setFormData({ ...formData, timeline: 'weeks' })} />
              <RadioOption name="timeline" value="months" label="Next few months" checked={formData.timeline === 'months'} onChange={() => setFormData({ ...formData, timeline: 'months' })} />
              <RadioOption name="timeline" value="exploring" label="Just exploring for now" checked={formData.timeline === 'exploring'} onChange={() => setFormData({ ...formData, timeline: 'exploring' })} />
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={questionStyle}>What's your budget range?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="budget" value="under-3k" label="Under $3,000" checked={formData.budget === 'under-3k'} onChange={() => setFormData({ ...formData, budget: 'under-3k' })} />
              <RadioOption name="budget" value="3k-8k" label="$3,000 - $8,000" checked={formData.budget === '3k-8k'} onChange={() => setFormData({ ...formData, budget: '3k-8k' })} />
              <RadioOption name="budget" value="8k-15k" label="$8,000 - $15,000" checked={formData.budget === '8k-15k'} onChange={() => setFormData({ ...formData, budget: '8k-15k' })} />
              <RadioOption name="budget" value="15k-30k" label="$15,000 - $30,000" checked={formData.budget === '15k-30k'} onChange={() => setFormData({ ...formData, budget: '15k-30k' })} />
              <RadioOption name="budget" value="30k+" label="$30,000+" checked={formData.budget === '30k+'} onChange={() => setFormData({ ...formData, budget: '30k+' })} />
              <RadioOption name="budget" value="not-sure" label="Not sure yet" checked={formData.budget === 'not-sure'} onChange={() => setFormData({ ...formData, budget: 'not-sure' })} />
            </div>
          </div>

          <div>
            <p style={questionStyle}>Who makes the call on this?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="decision" value="me" label="Me - I decide" checked={formData.decisionMaker === 'me'} onChange={() => setFormData({ ...formData, decisionMaker: 'me' })} />
              <RadioOption name="decision" value="me-plus-one" label="Me + one other person" checked={formData.decisionMaker === 'me-plus-one'} onChange={() => setFormData({ ...formData, decisionMaker: 'me-plus-one' })} />
              <RadioOption name="decision" value="small-team" label="A few people / small team" checked={formData.decisionMaker === 'small-team'} onChange={() => setFormData({ ...formData, decisionMaker: 'small-team' })} />
              <RadioOption name="decision" value="executive" label="Needs executive or board approval" checked={formData.decisionMaker === 'executive'} onChange={() => setFormData({ ...formData, decisionMaker: 'executive' })} />
            </div>
          </div>
        </>
      ),
    },
    // Section 3: Current Situation (Q12-Q14)
    {
      title: 'Current Situation',
      fields: (
        <>
          <div style={{ marginBottom: 32 }}>
            <p style={questionStyle}>What are you using now?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="current" value="spreadsheets" label="Spreadsheets and manual processes" checked={formData.currentTools === 'spreadsheets'} onChange={() => setFormData({ ...formData, currentTools: 'spreadsheets' })} />
              <RadioOption name="current" value="bad-software" label="Software that kinda works but not really" checked={formData.currentTools === 'bad-software'} onChange={() => setFormData({ ...formData, currentTools: 'bad-software' })} />
              <RadioOption name="current" value="duct-tape" label="A bunch of tools duct-taped together" checked={formData.currentTools === 'duct-tape'} onChange={() => setFormData({ ...formData, currentTools: 'duct-tape' })} />
              <RadioOption name="current" value="nothing" label="Nothing yet - starting fresh" checked={formData.currentTools === 'nothing'} onChange={() => setFormData({ ...formData, currentTools: 'nothing' })} />
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={questionStyle}>What's your biggest frustration right now?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="frustration" value="subscriptions" label="Paying too much for software subscriptions" checked={formData.frustration === 'subscriptions'} onChange={() => setFormData({ ...formData, frustration: 'subscriptions' })} />
              <RadioOption name="frustration" value="manual-work" label="Too much manual work that should be automated" checked={formData.frustration === 'manual-work'} onChange={() => setFormData({ ...formData, frustration: 'manual-work' })} />
              <RadioOption name="frustration" value="slow-devs" label="Developers / agencies are too slow or expensive" checked={formData.frustration === 'slow-devs'} onChange={() => setFormData({ ...formData, frustration: 'slow-devs' })} />
              <RadioOption name="frustration" value="no-fit" label="Can't find software that does what I need" checked={formData.frustration === 'no-fit'} onChange={() => setFormData({ ...formData, frustration: 'no-fit' })} />
              <RadioOption name="frustration" value="other" label="Other" checked={formData.frustration === 'other'} onChange={() => setFormData({ ...formData, frustration: 'other' })} />
            </div>
            {formData.frustration === 'other' && (
              <input
                type="text"
                placeholder="Please specify..."
                value={formData.frustrationOther}
                onChange={(e) => setFormData({ ...formData, frustrationOther: e.target.value })}
                style={{ ...inputStyle, marginTop: 12 }}
              />
            )}
          </div>

          <div>
            <p style={questionStyle}>Have you worked with developers or agencies before?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="experience" value="good" label="Yes - it went well" checked={formData.pastExperience === 'good'} onChange={() => setFormData({ ...formData, pastExperience: 'good' })} />
              <RadioOption name="experience" value="bad" label="Yes - it was painful" checked={formData.pastExperience === 'bad'} onChange={() => setFormData({ ...formData, pastExperience: 'bad' })} />
              <RadioOption name="experience" value="first-time" label="No - first time" checked={formData.pastExperience === 'first-time'} onChange={() => setFormData({ ...formData, pastExperience: 'first-time' })} />
            </div>
          </div>
        </>
      ),
    },
    // Section 4: Final Questions (Q15-Q16)
    {
      title: 'Almost Done',
      fields: (
        <>
          <div style={{ marginBottom: 32 }}>
            <p style={questionStyle}>In one sentence, what does success look like?</p>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: 16, fontStyle: 'italic' }}>
              Example: "My team stops using spreadsheets and customers can book online."
            </p>
            <textarea
              required
              value={formData.successCriteria}
              onChange={(e) => setFormData({ ...formData, successCriteria: e.target.value })}
              placeholder="When this project is done, I'll know it worked because..."
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '80px',
              }}
            />
          </div>

          <div>
            <p style={questionStyle}>How did you find us?</p>
            <div style={radioGroupStyle}>
              <RadioOption name="source" value="referral" label="Someone referred me" checked={formData.source === 'referral'} onChange={() => setFormData({ ...formData, source: 'referral' })} />
              <RadioOption name="source" value="linkedin" label="LinkedIn" checked={formData.source === 'linkedin'} onChange={() => setFormData({ ...formData, source: 'linkedin' })} />
              <RadioOption name="source" value="twitter" label="Twitter / X" checked={formData.source === 'twitter'} onChange={() => setFormData({ ...formData, source: 'twitter' })} />
              <RadioOption name="source" value="google" label="Google search" checked={formData.source === 'google'} onChange={() => setFormData({ ...formData, source: 'google' })} />
              <RadioOption name="source" value="upwork" label="Upwork" checked={formData.source === 'upwork'} onChange={() => setFormData({ ...formData, source: 'upwork' })} />
              <RadioOption name="source" value="other" label="Other" checked={formData.source === 'other'} onChange={() => setFormData({ ...formData, source: 'other' })} />
            </div>
            {(formData.source === 'referral' || formData.source === 'other') && (
              <input
                type="text"
                placeholder={formData.source === 'referral' ? "Who referred you?" : "Please specify..."}
                value={formData.sourceOther}
                onChange={(e) => setFormData({ ...formData, sourceOther: e.target.value })}
                style={{ ...inputStyle, marginTop: 12 }}
              />
            )}
          </div>
        </>
      ),
    },
  ]

  // Progress indicator
  const totalSteps = questions.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: voidBlack,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: '#888', fontSize: '16px' }}>Loading...</div>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div style={{
        minHeight: '100vh',
        background: voidBlack,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <CustomCursor mousePos={mousePos} isHovering={isHovering} />
        <GradientBar />
        <header style={{ padding: '20px 40px' }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              color: '#FAFAFA',
              textDecoration: 'none',
            }}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
          >
            L7 <span style={{ fontWeight: 300 }}>SHIFT</span>
          </Link>
        </header>
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#FAFAFA',
            marginBottom: 16,
          }}>
            Link Expired
          </h1>
          <p style={{ fontSize: '16px', color: '#888', maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
            This intake link is no longer valid. Please contact us to request a new one.
          </p>
          <Link
            href="/start"
            style={{
              padding: '14px 28px',
              background: `linear-gradient(135deg, ${cyan}, ${magenta})`,
              border: 'none',
              borderRadius: 0,
              color: voidBlack,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
          >
            Start New Conversation
          </Link>
        </main>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div style={{
        minHeight: '100vh',
        background: voidBlack,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <CustomCursor mousePos={mousePos} isHovering={isHovering} />
        <GradientBar />
        <header style={{ padding: '20px 40px' }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              color: '#FAFAFA',
              textDecoration: 'none',
            }}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
          >
            L7 <span style={{ fontWeight: 300 }}>SHIFT</span>
          </Link>
        </header>
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${cyan}, ${magenta})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            fontSize: 36,
          }}>
            ✓
          </div>
          <h1 style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#FAFAFA',
            marginBottom: 16,
          }}>
            Thanks!
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#888',
            maxWidth: 480,
            lineHeight: 1.6,
            marginBottom: 16,
          }}>
            We review every submission personally.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#FAFAFA',
            maxWidth: 480,
            lineHeight: 1.6,
            marginBottom: 32,
          }}>
            You'll hear from us within 24 hours.
          </p>
          <Link
            href="/"
            style={{
              padding: '14px 28px',
              border: `1px solid rgba(255,255,255,0.2)`,
              borderRadius: 0,
              color: '#FAFAFA',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
          >
            Back to Home
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: voidBlack,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <CustomCursor mousePos={mousePos} isHovering={isHovering} />
      <GradientBar />

      {/* Header */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link
          href="/"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '18px',
            fontWeight: 700,
            color: '#FAFAFA',
            textDecoration: 'none',
          }}
          onMouseEnter={handleHoverStart}
          onMouseLeave={handleHoverEnd}
        >
          L7 <span style={{ fontWeight: 300 }}>SHIFT</span>
        </Link>
      </header>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: 3,
        background: 'rgba(255,255,255,0.1)',
      }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${cyan}, ${magenta})`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 20px 80px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 560,
        }}>
          {/* Title */}
          <div style={{ marginBottom: 40 }}>
            <p style={{
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#666',
              marginBottom: 8,
            }}>
              Step {currentStep + 1} of {totalSteps}
            </p>
            <h1 style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '32px',
              fontWeight: 700,
              color: '#FAFAFA',
              marginBottom: 8,
            }}>
              {questions[currentStep].title}
            </h1>
            {currentStep === 0 && formData.name && (
              <p style={{ fontSize: '16px', color: '#888' }}>
                Welcome, {formData.name.split(' ')[0]}! Let's learn more about you.
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {questions[currentStep].fields}

            {/* Navigation */}
            <div style={{
              display: 'flex',
              gap: 16,
              marginTop: 40,
            }}>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  style={{
                    padding: '16px 24px',
                    background: 'transparent',
                    border: `1px solid rgba(255,255,255,0.2)`,
                    borderRadius: 0,
                    color: '#FAFAFA',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                  onMouseEnter={handleHoverStart}
                  onMouseLeave={handleHoverEnd}
                >
                  Back
                </button>
              )}

              {currentStep < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  style={{
                    flex: 1,
                    padding: '16px 24px',
                    background: `linear-gradient(135deg, ${cyan}, ${magenta})`,
                    border: 'none',
                    borderRadius: 0,
                    color: voidBlack,
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                  onMouseEnter={handleHoverStart}
                  onMouseLeave={handleHoverEnd}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  style={{
                    flex: 1,
                    padding: '16px 24px',
                    background: `linear-gradient(135deg, ${cyan}, ${magenta})`,
                    border: 'none',
                    borderRadius: 0,
                    color: voidBlack,
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: status === 'submitting' ? 'wait' : 'pointer',
                    opacity: status === 'submitting' ? 0.7 : 1,
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                  onMouseEnter={handleHoverStart}
                  onMouseLeave={handleHoverEnd}
                >
                  {status === 'submitting' ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>

            {status === 'error' && (
              <p style={{ color: '#ff4444', fontSize: '14px', textAlign: 'center', marginTop: 16 }}>
                Something went wrong. Please try again.
              </p>
            )}
          </form>

          {/* Footer */}
          <p style={{
            marginTop: 40,
            fontSize: '13px',
            color: '#444',
            textAlign: 'center',
          }}>
            5 minutes. No fluff. We'll get back to you within 24 hours.
          </p>
        </div>
      </main>
    </div>
  )
}
