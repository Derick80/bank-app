import { dateRange } from './date-functions.server'
import { prisma } from './prisma.server'

const getDashBoardExpense = {
  id: true,
  description: true,
  accountNameId: true,
  amount: true,
  due_date: true,
  type: true
}
export const getDashBoardExpenses = async (userId: string) => {
  const { now, then } = dateRange()
  console.log('now', now)
  console.log('then', then)

  return await prisma.expense.findMany({
    where: {
      userId: userId,
      due_date: {
        gte: now,
        lte: then
      }
    },
    select: getDashBoardExpense
  })
}
