// MOCK backend. Replaced with real API calls in Phase 2 and 3.
let startTime = null

export async function createOrder(job) {
  startTime = Date.now()
  return { jobId: 'demo-123' }
}

export async function getStatus(jobId) {
  const elapsed = (Date.now() - startTime) / 1000
  if (elapsed < 2) return 'pending_payment'
  if (elapsed < 4) return 'paid'
  if (elapsed < 7) return 'printing'
  return 'done'
}