import { Expense, Income, Prisma } from '@prisma/client'
import { SerializeFrom, SerializeFrom, SerializeFrom } from '@remix-run/node'
import { dateRange } from './date-functions.server'
import { prisma } from './prisma.server'
import { Frequency } from '@prisma/client'
import { type } from 'os'
export type frequencyType = {
  WEEKLY: 'WEEKLY'
  MONTHLY: 'MONTHLY'
  YEARLY: 'YEARLY'
  BIANNUALLY: 'BIANNUALLY'
}

export type EQuery = SerializeFrom<Expense>
export type ExpenseQuery = Omit<Expense, 'createdAt' | 'updatedAt'> &
  SerializeFrom<Expense>

export type ExpenseCreate = Omit<
  Expense,
  'createdAt' | 'updatedAt' | 'id' | 'frequency'
> & {
  userId: string
  frequency: frequencyType
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
  paid: true,
  userId: true
}

export const getAllUserExpenses = async (userId: string) => {
  return await prisma.expense.findMany({
    where: {
      userId: userId
    },
    select: pickExpense
  })
}
export const getUserCurrentMonthExpenses = async (
  user: Prisma.UserWhereUniqueInput
) => {
  const { now, then } = dateRange()

  const expenses: Partial<EQuery>[] = await prisma.expense.findMany({
    where: {
      userId: user.id,
      due_date: {
        gte: now,
        lte: then
      }
    },
    select: pickExpense
  })
  const expenseMonthlyTotal = expenses.reduce((acc, cur) => acc + cur.amount, 0)
  const totalsByExpenseType: {
    [key: string]: number | string | boolean | undefined
  } = expenses.reduce((acc, cur) => {
    acc[cur.type] = acc[cur.type] ? acc[cur.type] + cur.amount : cur.amount
    return acc
  }, {})

  return { expenses, expenseMonthlyTotal, totalsByExpenseType }
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

export const getExpense = async (expenseId: string) => {
  return await prisma.expense.findUnique({
    where: {
      id: expenseId
    }
  })
}

export const deleteExpense = async (input: Prisma.ExpenseWhereUniqueInput) => {
  const deleted = await prisma.expense.delete({
    where: { id: input.id }
  })
  return deleted
}
export const deletedExpense = async (input: Prisma.IncomeWhereUniqueInput) => {
  const deleted: Expense = await prisma.expense
    .findUnique({
      where: { id: input.id }
    })
    .then(() =>
      prisma.deletedExpense
        .create({
          data: {
            ...deleted,
            deletedAt: new Date().toISOString()
          }
        })
        .then(() =>
          prisma.expense.delete({
            where: { id: input.id }
          })
        )
    )
}

export const updateExpense = async (input: ExpenseCreate) => {
  const updated = await prisma.expense.update({
    where: { id: input.expenseId },
    data: {
      description: input.description,
      accountNameId: input.accountNameId,
      amount: input.amount,
      due_date: input.due_date,
      type: input.type,
      frequency: input.frequency,
      recurring: input.recurring,
      paid: input.paid,
      userId: input.userId
    }
  })
  return updated
}

// const toBeTrashed = await prisma.expense.findUnique({
//     where: {id: input.id},
//   })
//  if(!toBeTrashed) throw new Error('Expense not found')
//  if(toBeTrashed){
//   const deleted = await prisma.deletedExpense.create({
//     data: {
//       ...toBeTrashed,
//       deletedAt: new Date().toISOString()
//     }
//   }).then(() => prisma.expense.delete({
//     where: {id: input.id}
//   }))

//   return deleted
