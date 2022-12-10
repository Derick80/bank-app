import { Prisma } from '@prisma/client'
import { prisma } from './prisma.server'
import type { Income } from '@prisma/client'
import { dateRange } from './date-functions.server'
export type IncomeQuery = Partial<Income> & {}

export type IncomeCreate = Omit<
  Income,
  'createdAt' | 'updatedAt' | 'frequency' | 'id'
> & {
  userId: string
  frequency: string
}

const pickIncome = {
  id: true,
  description: true,
  amount: true,
  due_date: true,
  type: true,
  frequency: true,
  recurring: true,
  userId: true
}
export const getUserIncomes = async (user: Prisma.UserWhereUniqueInput) => {
  return await prisma.income.findMany({
    where: {
      userId: user.id
    },
    select: pickIncome
  })
}

export const getUserCurrentMonthIncomes = async (
  user: Prisma.UserWhereUniqueInput
) => {
  const { now, then } = dateRange()
  return await prisma.income.findMany({
    where: {
      userId: user.id,
      due_date: {
        gte: now,
        lte: then
      }
    },
    select: pickIncome
  })
}

export const getIncome = async (incomeId: string, userId: string) => {
  return await prisma.income.findFirst({
    where: {
      id: incomeId,
      userId
    }
  })
}

export const createIncome = async (input: IncomeCreate) => {
  return await prisma.income.create({
    data: {
      description: input.description,
      amount: input.amount,
      due_date: input.due_date,
      type: input.type,
      frequency: input.frequency,
      recurring: input.recurring,
      userId: input.userId
    }
  })
}
export const updateIncome = async (
  input: Prisma.IncomeWhereUniqueInput & Prisma.IncomeUpdateInput
) => {
  const { id, ...data } = input
  const updated = await prisma.income.update({
    where: { id },
    data
  })
  return updated
}

export const deleteIncome = async (input: Prisma.IncomeWhereUniqueInput) => {
  const deleted = await prisma.income.delete({
    where: { id: input.id }
  })
  return deleted
}
