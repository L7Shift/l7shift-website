'use client'

import { useState } from 'react'
import { VelocitySparkline, MetricCard } from '@/components/dashboard'

// Mock metrics data
const overallMetrics = {
  totalShiftHours: 18.5,
  totalTraditionalEstimate: 260,
  tasksShipped: 45,
  activeProjects: 2,
  clientSatisfaction: 98,
  avgDeliverySpeed: 90, // % faster than traditional
}

const projectMetrics = [
  {
    id: '1',
    name: 'Scat Pack CLT',
    shiftHours: 12.5,
    traditionalEstimate: 120,
    tasksShipped: 35,
    tasksTotal: 45,
    velocity: [2, 3, 4, 3, 5, 4, 6, 5, 3, 4, 5, 6, 4, 3],
  },
  {
    id: '2',
    name: 'Pretty Paid Closet',
    shiftHours: 6,
    traditionalEstimate: 80,
    tasksShipped: 10,
    tasksTotal: 28,
    velocity: [1, 2, 1, 3, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3],
  },
  {
    id: '3',
    name: 'Stitchwichs',
    shiftHours: 0,
    traditionalEstimate: 60,
    tasksShipped: 0,
    tasksTotal: 0,
    velocity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
]

const weeklyVelocity = [12, 18, 15, 22, 19, 25, 21, 28, 24, 30, 26, 32, 28, 35]

export default function MetricsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d' | 'all'>('14d')

  const savingsPercentage = Math.round(
    ((overallMetrics.totalTraditionalEstimate - overallMetrics.totalShiftHours) /
      overallMetrics.totalTraditionalEstimate) *
      100
  )

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: '#FAFAFA',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            Metrics
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            The SymbAIotic Method™ performance analytics
          </p>
        </div>

        {/* Time Range Filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['7d', '14d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '8px 16px',
                background: timeRange === range ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                border: timeRange === range ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                color: timeRange === range ? '#00F0FF' : '#888',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {range === 'all' ? 'All Time' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            padding: 24,
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(255, 0, 170, 0.1))',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Shift Hours
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#00F0FF' }}>
            {overallMetrics.totalShiftHours}h
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            vs {overallMetrics.totalTraditionalEstimate}h traditional
          </div>
        </div>

        <div
          style={{
            padding: 24,
            background: 'rgba(191, 255, 0, 0.05)',
            border: '1px solid rgba(191, 255, 0, 0.2)',
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Time Savings
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#BFFF00' }}>
            {savingsPercentage}%
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            faster than traditional
          </div>
        </div>

        <div
          style={{
            padding: 24,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tasks Shipped
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#FAFAFA' }}>
            {overallMetrics.tasksShipped}
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            across {overallMetrics.activeProjects} active projects
          </div>
        </div>

        <div
          style={{
            padding: 24,
            background: 'rgba(255, 0, 170, 0.05)',
            border: '1px solid rgba(255, 0, 170, 0.2)',
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Client Satisfaction
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#FF00AA' }}>
            {overallMetrics.clientSatisfaction}%
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            based on feedback
          </div>
        </div>
      </div>

      {/* Velocity Chart */}
      <div
        style={{
          padding: 24,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          marginBottom: 32,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#FAFAFA' }}>
            Overall Velocity (Tasks Shipped)
          </h2>
          <div style={{ fontSize: 12, color: '#888' }}>
            Last 14 days
          </div>
        </div>

        <div style={{ height: 120 }}>
          <VelocitySparkline data={weeklyVelocity} color="cyan" height={120} />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div>
            <span style={{ fontSize: 12, color: '#666' }}>Avg/Day: </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#00F0FF' }}>3.2 tasks</span>
          </div>
          <div>
            <span style={{ fontSize: 12, color: '#666' }}>Peak: </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#BFFF00' }}>6 tasks</span>
          </div>
          <div>
            <span style={{ fontSize: 12, color: '#666' }}>Trend: </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#BFFF00' }}>↑ 15%</span>
          </div>
        </div>
      </div>

      {/* Project Breakdown */}
      <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 600, color: '#FAFAFA' }}>
        Project Breakdown
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {projectMetrics.map((project) => {
          const savings = project.traditionalEstimate > 0
            ? Math.round(((project.traditionalEstimate - project.shiftHours) / project.traditionalEstimate) * 100)
            : 0
          const completion = project.tasksTotal > 0
            ? Math.round((project.tasksShipped / project.tasksTotal) * 100)
            : 0

          return (
            <div
              key={project.id}
              style={{
                padding: 24,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#FAFAFA' }}>
                    {project.name}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>SHIFT HOURS</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#00F0FF' }}>{project.shiftHours}h</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>TRADITIONAL EST.</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#888' }}>{project.traditionalEstimate}h</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>SAVINGS</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#BFFF00' }}>{savings}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>COMPLETION</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#FAFAFA' }}>{completion}%</div>
                    </div>
                  </div>
                </div>

                <div style={{ width: 200, marginLeft: 32 }}>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>VELOCITY (14d)</div>
                  <VelocitySparkline data={project.velocity} color="cyan" height={50} />
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: '#666' }}>Tasks Progress</span>
                  <span style={{ fontSize: 11, color: '#888' }}>{project.tasksShipped}/{project.tasksTotal}</span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${completion}%`,
                      background: 'linear-gradient(90deg, #00F0FF, #BFFF00)',
                      borderRadius: 3,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* The SymbAIotic Method™ Impact Summary */}
      <div
        style={{
          marginTop: 32,
          padding: 32,
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05), rgba(255, 0, 170, 0.05))',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderRadius: 16,
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          The SymbAIotic Method™ Impact
        </h3>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#FAFAFA', marginBottom: 8 }}>
          {overallMetrics.totalTraditionalEstimate - overallMetrics.totalShiftHours}
          <span style={{ fontSize: 24, color: '#888' }}> hours saved</span>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#888' }}>
          That's <span style={{ color: '#BFFF00', fontWeight: 600 }}>{Math.round((overallMetrics.totalTraditionalEstimate - overallMetrics.totalShiftHours) / 8)} business days</span> of
          development time delivered through human-AI collaboration
        </p>
      </div>
    </div>
  )
}
