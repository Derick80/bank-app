import { Prisma } from '@prisma/client'
import { prisma } from './prisma.server'
import type { Income } from '@prisma/client'
import { dateRange } from './date-functions.server'
import { SerializeFrom } from '@remix-run/node'
export type IncomeQuery = Omit<Income, 'createdAt' | 'updatedAt'> &
  SerializeFrom<Income>

export type IncomeCreate = Omit<
  Income,
  'createdAt' | 'updatedAt' | 'frequency' | 'id'
> & {
  userId: string
  frequency: string
  incomeId?: string
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
export const getUserIncomes = async (userId: string) => {
  return await prisma.income.findMany({
    where: {
      userId: userId
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

export const getIncome = async (incomeId: string) => {
  return await prisma.income.findFirst({
    where: {
      id: incomeId
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
export const updateIncome = async (input: IncomeCreate) => {
  const updated = await prisma.income.update({
    where: { id: input.incomeId },
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
  return updated
}

export const deleteIncome = async (input: Prisma.IncomeWhereUniqueInput) => {
  const deleted = await prisma.income.delete({
    where: { id: input.id }
  })
  return deleted
}
