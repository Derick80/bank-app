import { Expense, Prisma } from '@prisma/client'
import { dateRange } from './date-functions.server'
import { prisma } from './prisma.server'

export type ExpenseQuery = Partial<Expense> & {}

export type ExpenseCreate = Omit<Expense, 'createdAt' | 'updatedAt' | 'id'> & {
  userId: string
  frequency: string
  expenseId?: string
}
const pickExpense = {
  id: true,
  description: true,
  accountNameId: true,
  amount: true,
  due_date: true,
  type: true,
  frequency: true,
  recurring: true,
  userId: true
}
export const getUserCurrentMonthExpenses = async (
  user: Prisma.UserWhereUniqueInput
) => {
  const { now, then } = dateRange()

  const data = await prisma.expense.findMany({
    where: {
      userId: user.id,
      due_date: {
        gte: now,
        lte: then
      }
    },
    select: pickExpense
  })
  const subTotal = data.reduce((acc, cur) => acc + cur.amount, 0)
  const subTotalByType = data.reduce((acc, cur) => {
    acc[cur.type] = acc[cur.type] ? acc[cur.type] + cur.amount : cur.amount
    return acc
  }, {})
  return { data, subTotal, subTotalByType }
}

export const getUserExpensesByMonth = async (
  userId: string,
  from: string,
  to: string
) => {
  return await prisma.expense.findMany({
    where: {
      userId,
      due_date: {
        gte: from,
        lte: to
      }
    },
    select: pickExpense
  })
}

export const getExpense = async (expenseId: string, userId: string) => {
  return await prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId
    }
  })
}
