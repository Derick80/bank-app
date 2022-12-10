export function dateRange() {
  let currentMonth = new Date().getMonth()
  const year: number = new Date().getFullYear()
  const now = new Date(year, currentMonth, 0).toISOString()
  const then = new Date(year, currentMonth + 1, 0).toISOString()
  return { now, then }
}
