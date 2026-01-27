'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { StatusPill } from '@/components/dashboard'

type RequirementStatus = 'draft' | 'review' | 'approved' | 'implemented'

interface Requirement {
  id: string
  title: string
  phase: string
  status: RequirementStatus
  version: number
  updatedAt: Date
  summary: string
  sections: {
    title: string
    content: string
  }[]
  signedOff: boolean
  signedAt?: Date
}

// Mock requirements data
const mockRequirements: Requirement[] = [
  {
    id: '1',
    title: 'Phase 1: Core Platform Requirements',
    phase: 'Phase 1',
    status: 'review',
    version: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    summary: 'Foundation features including authentication, customer portal, and basic service management.',
    sections: [
      {
        title: 'User Authentication',
        content: '• Magic link email authentication for customers\n• PIN-based quick login for returning users\n• Session management with 30-day remember me\n• Password-less design for simplicity',
      },
      {
        title: 'Customer Portal',
        content: '• Dashboard showing upcoming services\n• Service history and invoices\n• Profile management\n• Payment method storage (Stripe)',
      },
      {
        title: 'Service Scheduling',
        content: '• Weekly recurring service setup\n• One-time service booking\n• Service pause/resume functionality\n• Calendar integration',
      },
    ],
    signedOff: false,
  },
  {
    id: '2',
    title: 'Phase 2: Crew Management Requirements',
    phase: 'Phase 2',
    status: 'draft',
    version: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    summary: 'Crew-facing features for managing routes, tracking completions, and communication.',
    sections: [
      {
        title: 'Crew Portal',
        content: '• Daily route view with optimized order\n• Service completion tracking\n• Photo documentation\n• Customer notes and special instructions',
      },
      {
        title: 'Route Optimization',
        content: '• Google Maps integration\n• Automatic route ordering\n• Traffic-aware scheduling\n• Estimated completion times',
      },
    ],
    signedOff: false,
  },
  {
    id: '3',
    title: 'Brand Identity Guidelines',
    phase: 'Design',
    status: 'approved',
    version: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    summary: 'Complete brand guidelines including logo usage, color palette, typography, and visual style.',
    sections: [
      {
        title: 'Logo Usage',
        content: '• Primary logo on dark backgrounds\n• Alternate logo for light backgrounds\n• Minimum size requirements\n• Clear space guidelines',
      },
      {
        title: 'Color Palette',
        content: '• Primary: Electric Cyan (#00F0FF)\n• Secondary: Hot Magenta (#FF00AA)\n• Accent: Acid Lime (#BFFF00)\n• Background: Void Black (#0A0A0A)',
      },
    ],
    signedOff: true,
    signedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
]

const statusConfig: Record<RequirementStatus, { label: string; color: string; action?: string }> = {
  draft: { label: 'Draft', color: '#888' },
  review: { label: 'Awaiting Approval', color: '#FF00AA', action: 'Review & Sign' },
  approved: { label: 'Approved', color: '#BFFF00' },
  implemented: { label: 'Implemented', color: '#00F0FF' },
}

export default function RequirementsPage() {
  const params = useParams()
  const [selectedDoc, setSelectedDoc] = useState<Requirement | null>(null)
  const [showSignoffModal, setShowSignoffModal] = useState(false)

  const pendingCount = mockRequirements.filter(r => r.status === 'review').length

  const handleSignoff = () => {
    // In real app, this would call API to record signoff
    setShowSignoffModal(false)
    setSelectedDoc(null)
  }

  return (
    <div>
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
            Requirements
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            Review and approve project requirements
          </p>
        </div>

        {pendingCount > 0 && (
          <div
            style={{
              padding: '12px 20px',
              background: 'rgba(255, 0, 170, 0.1)',
              border: '1px solid rgba(255, 0, 170, 0.3)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 20 }}>✍️</span>
            <span style={{ color: '#FF00AA', fontSize: 14, fontWeight: 600 }}>
              {pendingCount} awaiting your signoff
            </span>
          </div>
        )}
      </div>

      {/* Requirements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mockRequirements.map((req) => (
          <div
            key={req.id}
            onClick={() => setSelectedDoc(req)}
            style={{
              padding: 24,
              background: 'rgba(255, 255, 255, 0.03)',
              border: req.status === 'review'
                ? '1px solid rgba(255, 0, 170, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(0, 240, 255, 0.1)',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#00F0FF',
                    }}
                  >
                    {req.phase}
                  </span>
                  <StatusPill status={req.status} size="sm" />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#FAFAFA',
                  }}
                >
                  {req.title}
                </h3>
              </div>

              {req.status === 'review' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedDoc(req)
                    setShowSignoffModal(true)
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#0A0A0A',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Review & Sign →
                </button>
              )}

              {req.signedOff && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#BFFF00', fontWeight: 600 }}>
                    ✓ Signed Off
                  </div>
                  <div style={{ fontSize: 10, color: '#666' }}>
                    {req.signedAt?.toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            <p style={{ margin: 0, fontSize: 14, color: '#888', lineHeight: 1.6 }}>
              {req.summary}
            </p>

            <div
              style={{
                display: 'flex',
                gap: 16,
                marginTop: 16,
                paddingTop: 16,
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: 12,
                color: '#666',
              }}
            >
              <span>v{req.version}</span>
              <span>•</span>
              <span>{req.sections.length} sections</span>
              <span>•</span>
              <span>Updated {req.updatedAt.toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && !showSignoffModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 40,
          }}
          onClick={() => setSelectedDoc(null)}
        >
          <div
            style={{
              background: '#0A0A0A',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              maxWidth: 800,
              maxHeight: '90vh',
              overflow: 'auto',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: 24,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'sticky',
                top: 0,
                background: '#0A0A0A',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(0, 240, 255, 0.1)',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#00F0FF',
                      }}
                    >
                      {selectedDoc.phase}
                    </span>
                    <StatusPill status={selectedDoc.status} size="sm" />
                  </div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#FAFAFA' }}>
                    {selectedDoc.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    fontSize: 24,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: 24 }}>
              <p style={{ color: '#AAA', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
                {selectedDoc.summary}
              </p>

              {selectedDoc.sections.map((section, i) => (
                <div key={i} style={{ marginBottom: 28 }}>
                  <h3
                    style={{
                      margin: '0 0 12px',
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#00F0FF',
                    }}
                  >
                    {section.title}
                  </h3>
                  <div
                    style={{
                      padding: 16,
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 8,
                      fontSize: 14,
                      color: '#CCC',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            {selectedDoc.status === 'review' && (
              <div
                style={{
                  padding: 24,
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'sticky',
                  bottom: 0,
                  background: '#0A0A0A',
                }}
              >
                <p style={{ margin: 0, fontSize: 13, color: '#888' }}>
                  By signing, you approve these requirements for implementation.
                </p>
                <button
                  onClick={() => setShowSignoffModal(true)}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #BFFF00, #00F0FF)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#0A0A0A',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ✓ Sign Off & Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signoff Confirmation Modal */}
      {showSignoffModal && selectedDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
          }}
        >
          <div
            style={{
              background: '#0A0A0A',
              border: '1px solid rgba(191, 255, 0, 0.3)',
              borderRadius: 16,
              padding: 32,
              maxWidth: 480,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(191, 255, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 28,
              }}
            >
              ✍️
            </div>

            <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 600, color: '#FAFAFA' }}>
              Confirm Signoff
            </h2>

            <p style={{ margin: '0 0 8px', fontSize: 14, color: '#888' }}>
              You are approving:
            </p>
            <p style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 600, color: '#00F0FF' }}>
              {selectedDoc.title}
            </p>

            <div
              style={{
                padding: 16,
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 8,
                marginBottom: 24,
                textAlign: 'left',
              }}
            >
              <p style={{ margin: 0, fontSize: 12, color: '#888', lineHeight: 1.6 }}>
                By clicking "Sign & Approve", you confirm that you have reviewed these requirements
                and authorize L7 Shift to proceed with implementation. This action will be recorded
                with a timestamp for your records.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowSignoffModal(false)}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#888',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSignoff}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #BFFF00, #00F0FF)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#0A0A0A',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ✓ Sign & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
