'use client'

import React, { useState, useMemo } from 'react'

// Brand colors
const colors = {
  voidBlack: '#0A0A0A',
  carbonGray: '#1A1A1A',
  electricCyan: '#00F0FF',
  hotMagenta: '#FF00AA',
  acidLime: '#BFFF00',
  softGray: '#888888',
  cleanWhite: '#FFFFFF',
}

interface ProjectInputs {
  projectType: 'saas' | 'website' | 'ecommerce' | 'dashboard' | 'custom'
  userRoles: number
  integrations: number
  complexity: 'simple' | 'moderate' | 'complex'
  dataMigration: boolean
  compliance: boolean
}

const projectTypeMultipliers = {
  saas: { traditional: 8, symbiotic: 0.43 }, // weeks vs weeks
  website: { traditional: 3, symbiotic: 0.07 },
  ecommerce: { traditional: 6, symbiotic: 1.5 },
  dashboard: { traditional: 4, symbiotic: 0.14 },
  custom: { traditional: 6, symbiotic: 0.29 },
}

const complexityMultipliers = {
  simple: 0.7,
  moderate: 1.0,
  complex: 1.5,
}

export function ShiftCalculator() {
  const [inputs, setInputs] = useState<ProjectInputs>({
    projectType: 'saas',
    userRoles: 2,
    integrations: 2,
    complexity: 'moderate',
    dataMigration: false,
    compliance: false,
  })

  const [showResults, setShowResults] = useState(false)

  const calculations = useMemo(() => {
    const baseMultiplier = projectTypeMultipliers[inputs.projectType]
    const complexityMult = complexityMultipliers[inputs.complexity]

    // Calculate complexity score
    const complexityScore =
      inputs.userRoles +
      inputs.integrations +
      (inputs.complexity === 'simple' ? 1 : inputs.complexity === 'moderate' ? 2 : 3) +
      (inputs.dataMigration ? 2 : 0) +
      (inputs.compliance ? 2 : 0)

    // Traditional calculations
    const traditionalWeeks = Math.round(baseMultiplier.traditional * complexityMult * (1 + complexityScore * 0.1))
    const traditionalCost = traditionalWeeks * 10000 // $10k per week average
    const traditionalTeamSize = inputs.projectType === 'saas' ? '2-4 developers' : '1-2 developers'

    // Symbiotic calculations
    const symbioticWeeks = baseMultiplier.symbiotic * complexityMult * (1 + complexityScore * 0.05)
    const symbioticDays = Math.max(1, Math.round(symbioticWeeks * 7))
    const symbioticHours = symbioticDays * 8
    const symbioticCost = Math.round(symbioticHours * 300) // $300/hr SymbAIote rate

    // Savings calculations
    const costSavings = traditionalCost - symbioticCost
    const costSavingsPercent = Math.round((costSavings / traditionalCost) * 100)
    const timeSavingsPercent = Math.round(((traditionalWeeks - symbioticWeeks) / traditionalWeeks) * 100)
    const shiftMultiplier = Math.round(traditionalWeeks / symbioticWeeks)

    // Time-to-value (assuming $5k/week value)
    const weeklyValue = 5000
    const timeValueSaved = Math.round((traditionalWeeks - symbioticWeeks) * weeklyValue)

    // ROI
    const roi = Math.round(((traditionalCost - symbioticCost) / symbioticCost) * 100)

    return {
      traditional: {
        weeks: traditionalWeeks,
        cost: traditionalCost,
        teamSize: traditionalTeamSize,
      },
      symbiotic: {
        days: symbioticDays,
        hours: symbioticHours,
        cost: symbioticCost,
        teamSize: '1 SymbAIote™',
      },
      savings: {
        cost: costSavings,
        costPercent: costSavingsPercent,
        timePercent: timeSavingsPercent,
        timeValue: timeValueSaved,
        multiplier: shiftMultiplier,
        roi: roi,
      },
      complexityScore,
    }
  }, [inputs])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div
      style={{
        background: colors.voidBlack,
        padding: '60px',
        borderRadius: '0',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <span
          style={{
            color: colors.acidLime,
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          SHIFT CALCULATOR™
        </span>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 700,
            color: colors.cleanWhite,
            marginBottom: '12px',
          }}
        >
          Calculate Your Shift
        </h2>
        <p style={{ color: colors.softGray, fontSize: '16px' }}>
          See the difference between traditional development and The SymbAIotic Shift™
        </p>
      </div>

      {/* Inputs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {/* Project Type */}
        <div>
          <label
            style={{
              display: 'block',
              color: colors.cleanWhite,
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Project Type
          </label>
          <select
            value={inputs.projectType}
            onChange={(e) => setInputs({ ...inputs, projectType: e.target.value as ProjectInputs['projectType'] })}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: colors.carbonGray,
              border: `1px solid ${colors.softGray}33`,
              color: colors.cleanWhite,
              fontSize: '16px',
              borderRadius: '0',
              cursor: 'pointer',
            }}
          >
            <option value="saas">Full-Stack SaaS Platform</option>
            <option value="website">Marketing Website</option>
            <option value="ecommerce">E-commerce / Shopify</option>
            <option value="dashboard">Internal Dashboard</option>
            <option value="custom">Custom Application</option>
          </select>
        </div>

        {/* Complexity */}
        <div>
          <label
            style={{
              display: 'block',
              color: colors.cleanWhite,
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Complexity Level
          </label>
          <select
            value={inputs.complexity}
            onChange={(e) => setInputs({ ...inputs, complexity: e.target.value as ProjectInputs['complexity'] })}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: colors.carbonGray,
              border: `1px solid ${colors.softGray}33`,
              color: colors.cleanWhite,
              fontSize: '16px',
              borderRadius: '0',
              cursor: 'pointer',
            }}
          >
            <option value="simple">Simple</option>
            <option value="moderate">Moderate</option>
            <option value="complex">Complex</option>
          </select>
        </div>

        {/* User Roles */}
        <div>
          <label
            style={{
              display: 'block',
              color: colors.cleanWhite,
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            User Roles: {inputs.userRoles}
          </label>
          <input
            type="range"
            min="1"
            max="6"
            value={inputs.userRoles}
            onChange={(e) => setInputs({ ...inputs, userRoles: parseInt(e.target.value) })}
            style={{
              width: '100%',
              accentColor: colors.electricCyan,
            }}
          />
        </div>

        {/* Integrations */}
        <div>
          <label
            style={{
              display: 'block',
              color: colors.cleanWhite,
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Third-Party Integrations: {inputs.integrations}
          </label>
          <input
            type="range"
            min="0"
            max="8"
            value={inputs.integrations}
            onChange={(e) => setInputs({ ...inputs, integrations: parseInt(e.target.value) })}
            style={{
              width: '100%',
              accentColor: colors.hotMagenta,
            }}
          />
        </div>

        {/* Checkboxes */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: colors.cleanWhite,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={inputs.dataMigration}
              onChange={(e) => setInputs({ ...inputs, dataMigration: e.target.checked })}
              style={{ accentColor: colors.acidLime }}
            />
            Data Migration
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: colors.cleanWhite,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={inputs.compliance}
              onChange={(e) => setInputs({ ...inputs, compliance: e.target.checked })}
              style={{ accentColor: colors.acidLime }}
            />
            Compliance Requirements
          </label>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={() => setShowResults(true)}
        style={{
          width: '100%',
          padding: '16px 32px',
          background: `linear-gradient(90deg, ${colors.electricCyan}, ${colors.hotMagenta})`,
          border: 'none',
          color: colors.voidBlack,
          fontSize: '16px',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '40px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        Calculate The Shift
      </button>

      {/* Results */}
      {showResults && (
        <div>
          {/* Shift Multiplier Hero */}
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              background: colors.carbonGray,
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                fontSize: '80px',
                fontWeight: 700,
                background: `linear-gradient(90deg, ${colors.electricCyan}, ${colors.hotMagenta})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}
            >
              {calculations.savings.multiplier}x
            </div>
            <div
              style={{
                fontSize: '14px',
                color: colors.softGray,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginTop: '8px',
              }}
            >
              Shift Multiplier
            </div>
          </div>

          {/* Comparison Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            {/* Traditional */}
            <div
              style={{
                background: colors.carbonGray,
                padding: '32px',
                borderTop: `4px solid ${colors.softGray}`,
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  color: colors.softGray,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  marginBottom: '24px',
                }}
              >
                Traditional Agency
              </h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: colors.softGray, fontSize: '12px', marginBottom: '4px' }}>
                  Timeline
                </div>
                <div style={{ color: colors.cleanWhite, fontSize: '28px', fontWeight: 700 }}>
                  {calculations.traditional.weeks} weeks
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: colors.softGray, fontSize: '12px', marginBottom: '4px' }}>
                  Estimated Cost
                </div>
                <div style={{ color: colors.cleanWhite, fontSize: '28px', fontWeight: 700 }}>
                  {formatCurrency(calculations.traditional.cost)}
                </div>
              </div>
              <div>
                <div style={{ color: colors.softGray, fontSize: '12px', marginBottom: '4px' }}>
                  Team Size
                </div>
                <div style={{ color: colors.cleanWhite, fontSize: '16px' }}>
                  {calculations.traditional.teamSize}
                </div>
              </div>
            </div>

            {/* Symbiotic */}
            <div
              style={{
                background: colors.carbonGray,
                padding: '32px',
                borderTop: `4px solid ${colors.acidLime}`,
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  color: colors.acidLime,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  marginBottom: '24px',
                }}
              >
                SymbAIotic Shift™
              </h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: colors.softGray, fontSize: '12px', marginBottom: '4px' }}>
                  Timeline
                </div>
                <div style={{ color: colors.cleanWhite, fontSize: '28px', fontWeight: 700 }}>
                  {calculations.symbiotic.days} days
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: colors.softGray, fontSize: '12px', marginBottom: '4px' }}>
                  Estimated Cost
                </div>
                <div style={{ color: colors.acidLime, fontSize: '28px', fontWeight: 700 }}>
                  {formatCurrency(calculations.symbiotic.cost)}
                </div>
              </div>
              <div>
                <div style={{ color: colors.softGray, fontSize: '12px', marginBottom: '4px' }}>
                  Team Size
                </div>
                <div style={{ color: colors.cleanWhite, fontSize: '16px' }}>
                  {calculations.symbiotic.teamSize}
                </div>
              </div>
            </div>
          </div>

          {/* Savings Summary */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: colors.carbonGray,
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: colors.electricCyan, fontSize: '32px', fontWeight: 700 }}>
                {formatCurrency(calculations.savings.cost)}
              </div>
              <div style={{ color: colors.softGray, fontSize: '12px', marginTop: '4px' }}>
                Cost Savings
              </div>
            </div>
            <div
              style={{
                background: colors.carbonGray,
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: colors.hotMagenta, fontSize: '32px', fontWeight: 700 }}>
                {calculations.savings.timePercent}%
              </div>
              <div style={{ color: colors.softGray, fontSize: '12px', marginTop: '4px' }}>
                Time Saved
              </div>
            </div>
            <div
              style={{
                background: colors.carbonGray,
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: colors.acidLime, fontSize: '32px', fontWeight: 700 }}>
                {formatCurrency(calculations.savings.timeValue)}
              </div>
              <div style={{ color: colors.softGray, fontSize: '12px', marginTop: '4px' }}>
                Time-to-Value
              </div>
            </div>
            <div
              style={{
                background: colors.carbonGray,
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: colors.cleanWhite, fontSize: '32px', fontWeight: 700 }}>
                {calculations.savings.roi}%
              </div>
              <div style={{ color: colors.softGray, fontSize: '12px', marginTop: '4px' }}>
                ROI
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: '40px',
              textAlign: 'center',
              padding: '32px',
              background: `linear-gradient(90deg, ${colors.electricCyan}11, ${colors.hotMagenta}11)`,
              border: `1px solid ${colors.electricCyan}33`,
            }}
          >
            <p style={{ color: colors.cleanWhite, fontSize: '18px', marginBottom: '16px' }}>
              Ready to experience The SymbAIotic Shift™?
            </p>
            <a
              href="#contact"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: colors.acidLime,
                color: colors.voidBlack,
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShiftCalculator
