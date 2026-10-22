import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJob } from '../JobContext'
import { parsePageRange } from '../utils/pageRange'

export default function Options() {
  const { job, setJob } = useJob()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  // If page was refreshed, state is lost -> go back to start
  useEffect(() => {
    if (!job.file) navigate('/')
  }, [job.file, navigate])

  if (!job.file) return null

  function update(changes) {
    setJob({ ...job, ...changes })
    setError('')
  }

  function handleContinue() {
    let pagesToPrint = job.pageCount
    if (job.rangeMode === 'custom') {
      const pages = parsePageRange(job.rangeText, job.pageCount)
      if (!pages) {
        setError(`Enter a valid range like 1-3, 5 (document has ${job.pageCount} pages).`)
        return
      }
      pagesToPrint = pages.length
    }
    setJob({ ...job, pagesToPrint })
    navigate('/summary')
  }

  const btn = (active) =>
    `flex-1 py-3 rounded-xl font-medium border ${
      active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
    }`

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Print options</h1>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="font-medium break-all">{job.file.name}</p>
        <p className="text-gray-500">{job.pageCount} pages</p>
      </div>

      {/* Copies */}
      <div>
        <p className="font-medium mb-2">Copies</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => update({ copies: Math.max(1, job.copies - 1) })}
            className="w-12 h-12 rounded-xl bg-white border border-gray-300 text-xl"
          >−</button>
          <span className="text-xl font-semibold w-8 text-center">{job.copies}</span>
          <button
            onClick={() => update({ copies: Math.min(50, job.copies + 1) })}
            className="w-12 h-12 rounded-xl bg-white border border-gray-300 text-xl"
          >+</button>
        </div>
      </div>

      {/* Colour */}
      <div>
        <p className="font-medium mb-2">Colour</p>
        <div className="flex gap-3">
          <button onClick={() => update({ color: false })} className={btn(!job.color)}>Black & White</button>
          <button onClick={() => update({ color: true })} className={btn(job.color)}>Colour</button>
        </div>
      </div>

      {/* Page range */}
      <div>
        <p className="font-medium mb-2">Pages</p>
        <div className="flex gap-3 mb-2">
          <button onClick={() => update({ rangeMode: 'all' })} className={btn(job.rangeMode === 'all')}>All</button>
          <button onClick={() => update({ rangeMode: 'custom' })} className={btn(job.rangeMode === 'custom')}>Custom</button>
        </div>
        {job.rangeMode === 'custom' && (
          <input
            type="text"
            value={job.rangeText}
            onChange={(e) => update({ rangeText: e.target.value })}
            placeholder="e.g. 1-3, 5"
            className="w-full p-3 rounded-xl border border-gray-300 bg-white"
          />
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button onClick={() => navigate('/')} className="flex-1 py-3 rounded-xl bg-white border border-gray-300">Back</button>
        <button onClick={handleContinue} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium">Continue</button>
      </div>
    </div>
  )
}