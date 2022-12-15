import type { Expense, Prisma } from '@prisma/client'
import { prisma } from './prisma.server'

export type ExpenseQuery = Omit<Expense, 'createdAt' | 'updatedAt'>

export type ExpenseCreate = Omit<Expense, 'createdAt' | 'updatedAt' | 'id'> & {
  userId: string
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
  include: true,
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
      include: input.include,
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
