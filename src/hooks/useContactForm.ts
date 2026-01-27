'use client'

import { useState } from 'react'

interface FormData {
  name: string
  email: string
  message: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

interface ContactForm {
  formData: FormData
  formStatus: FormStatus
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  handleSubmit: (e: React.FormEvent) => Promise<void>
  resetForm: () => void
}

export function useContactForm(): ContactForm {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' })
    setFormStatus('idle')
  }

  return {
    formData,
    formStatus,
    setFormData,
    handleSubmit,
    resetForm,
  }
}
