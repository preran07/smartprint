import { Routes, Route } from 'react-router-dom'
import { JobProvider } from './JobContext'
import Upload from './pages/Upload'
import Options from './pages/Options'
import Summary from './pages/Summary'
import Status from './pages/Status'

export default function App() {
  return (
    <JobProvider>
      <div className="min-h-screen bg-gray-50 flex justify-center">
        <div className="w-full max-w-md p-4">
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/options" element={<Options />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/status" element={<Status />} />
          </Routes>
        </div>
      </div>
    </JobProvider>
  )
}