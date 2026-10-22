import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PDFDocument } from 'pdf-lib'
import { useJob } from '../JobContext'

export default function Upload() {
  const { job, setJob } = useJob()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setError('')

    if (file.type !== 'application/pdf') {
      setError('Please choose a PDF file.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File is too large (max 20 MB).')
      return
    }

    setLoading(true)
    try {
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      setJob({ ...job, file, pageCount: pdf.getPageCount() })
    } catch {
      setError('Could not read this PDF. Try another file.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">SmartPrint</h1>
      <p className="text-gray-600">Upload your PDF to get started.</p>

      <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white cursor-pointer">
        <span className="text-blue-600 font-medium">Choose file</span>
        <input type="file" accept="application/pdf" onChange={handleFile} className="hidden" />
      </label>

      {loading && <p className="text-gray-500">Reading file...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {job.file && !loading && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="font-medium break-all">{job.file.name}</p>
          <p className="text-gray-500">{job.pageCount} pages</p>
        </div>
      )}

      <button
        disabled={!job.file}
        onClick={() => navigate('/options')}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium disabled:bg-gray-300"
      >
        Continue
      </button>
    </div>
  )
}