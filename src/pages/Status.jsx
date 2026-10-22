import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJob } from '../JobContext'
import { createOrder, getStatus } from '../api/jobs'

const STEPS = [
  { key: 'pending_payment', label: 'Waiting for payment' },
  { key: 'paid', label: 'Payment received' },
  { key: 'printing', label: 'Printing' },
  { key: 'done', label: 'Done. Collect your print!' },
]

export default function Status() {
  const { job } = useJob()
  const navigate = useNavigate()
  const [status, setStatus] = useState('pending_payment')
  const started = useRef(false)

  useEffect(() => {
    if (!job.file) {
      navigate('/')
      return
    }
    // Guard: React StrictMode runs effects twice in dev,
    // and we must never create two orders.
    if (started.current) return
    started.current = true

    let timer
    async function start() {
      const { jobId } = await createOrder(job)
      timer = setInterval(async () => {
        const s = await getStatus(jobId)
        setStatus(s)
        if (s === 'done') clearInterval(timer)
      }, 1000)
    }
    start()
    return () => clearInterval(timer)
  }, [])

  if (!job.file) return null

  const currentIndex = STEPS.findIndex((s) => s.key === status)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your print job</h1>

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        {STEPS.map((step, i) => {
          const done = i < currentIndex || status === 'done'
          const active = i === currentIndex && status !== 'done'
          return (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                  done ? 'bg-green-500' : active ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span className={done || active ? 'font-medium' : 'text-gray-400'}>{step.label}</span>
            </div>
          )
        })}
      </div>

      {status === 'done' && (
        <button
          onClick={() => (window.location.href = '/')}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium"
        >
          Print another file
        </button>
      )}
    </div>
  )
}