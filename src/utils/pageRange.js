// Turns "1-3, 5" into [1,2,3,5]. Returns null if invalid.
export function parsePageRange(text, total) {
  const pages = new Set()
  const parts = text.split(',').map(p => p.trim()).filter(Boolean)
  if (parts.length === 0) return null

  for (const part of parts) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/)
    if (!m) return null
    const start = Number(m[1])
    const end = m[2] ? Number(m[2]) : start
    if (start < 1 || end < start || end > total) return null
    for (let i = start; i <= end; i++) pages.add(i)
  }
  return [...pages].sort((a, b) => a - b)
}