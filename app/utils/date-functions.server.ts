export function dateRange() {
   let currentMonth = new Date().getMonth()
   const year: number = new Date().getFullYear()
   const start = new Date(year, currentMonth)
   const startEdit =start.setUTCHours(0,0,0,0)
   const now = new Date(startEdit)

   const until = new Date(year, currentMonth + 1,0)
   const untilEdit = until.setUTCHours(23,59,59,999)
    const then = new Date(untilEdit)



  return { now, then }
}
