import { RATES } from '../config'

export function calculatePrice({ pagesToPrint, copies, color }) {
  const rate = color ? RATES.color : RATES.bw
  const totalPages = pagesToPrint * copies
  return { rate, totalPages, total: totalPages * rate }
}