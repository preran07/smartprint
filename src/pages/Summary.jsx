import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJob } from '../JobContext'
import { calculatePrice } from '../utils/price'
import {  useState } from 'react'

export default function Summary() {
  const { job } = useJob()
  const navigate = useNavigate()
  const [going, setGoing] = useState(false)

  useEffect(() => {
    if (!job.file || !job.pagesToPrint) navigate('/')
  }, [job.file, job.pagesToPrint, navigate])

  if (!job.file || !job.pagesToPrint) return null

  const { rate, totalPages, total } = calculatePrice(job)

  const Row = ({ label, value }) => (
    <div className="flex justify-between py-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right break-all">{value}</span>
    </div>
  )

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Order summary</h1>

      <div className="bg-white rounded-xl p-4 shadow-sm divide-y">
        <Row label="File" value={job.file.name} />
        <Row
          label="Pages"
          value={job.rangeMode === 'all' ? `All (${job.pageCount})` : `${job.rangeText} (${job.pagesToPrint})`}
        />
        <Row label="Copies" value={job.copies} />
        <Row label="Type" value={job.color ? 'Colour' : 'Black & White'} />
        <Row label="Rate" value={`₹${rate} / page`} />
        <Row label="Total pages" value={`${job.pagesToPrint} × ${job.copies} = ${totalPages}`} />
      </div>

      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm">
        <span className="text-lg font-medium">Total to pay</span>
        <span className="text-2xl font-bold text-blue-600">₹{total}</span>
      </div>

      <div className="flex gap-3">
        <button onClick={() => navigate('/options')} className="flex-1 py-3 rounded-xl bg-white border border-gray-300">
          Back
        </button>
        <button
  disabled={going}
  onClick={() => { setGoing(true); navigate('/status') }}
  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium disabled:bg-gray-300"
>
  {going ? 'Please wait...' : 'Proceed to pay'}
</button>
      </div>
    </div>
  )
}