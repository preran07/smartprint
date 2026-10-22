import { createContext, useContext, useState } from 'react'

const JobContext = createContext()

export function JobProvider({ children }) {
  const [job, setJob] = useState({
    file: null,
    pageCount: 0,
    copies: 1,
    color: false,
    rangeMode: 'all',   // 'all' or 'custom'
    rangeText: '',      // e.g. "1-3, 5"
    pagesToPrint: 0,    // pages in ONE copy
  })
  return (
    <JobContext.Provider value={{ job, setJob }}>
      {children}
    </JobContext.Provider>
  )
}

export const useJob = () => useContext(JobContext)