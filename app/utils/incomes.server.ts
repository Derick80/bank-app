import type { Prisma } from '@prisma/client'
import { prisma } from './prisma.server'
import type { Income } from '@prisma/client'
import { dateRange } from './date-functions.server'
import { format, parseISO } from 'date-fns'
export type IncomeQuery = Omit<Income, 'createdAt' | 'updatedAt'>

export type IncomeGetOrEdit = Omit<Income, 'createdAt' | 'updatedAt' >
export type IncomeCreate = Omit<Income, 'createdAt' | 'updatedAt' | 'id'> & {
  userId: string
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
  include: true,
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

export async function parseStringDate(dateString:Date): Promise<Date> {
    const isoDate= new Date(dateString).toISOString()
    return parseISO(isoDate)
}
export const getUserCurrentMonthIncomes = async (
  user: Prisma.UserWhereUniqueInput
) => {
  const { now, then  } = dateRange()
console.log(now, then);

  const result= await prisma.income.findMany({
    where: {
      userId: user.id,
      due_date: {
        gte: now.toISOString(),
        lte: then.toISOString()
      }
    },
    select: pickIncome
  })
  const results = result.map((income) => {
    const firstDate = new Date(income.due_date).toISOString()

    return {
      ...income,
      due_date: income.due_date ? parseISO(firstDate) : null
    }
  })
  return results
}


export async function getIncome(input:string):
Promise<IncomeQuery>
 {
  const income = await prisma.income.findUnique({
    where: {
      id: input
    },
    select: pickIncome
  })

  if(!income) throw new Error('Income not found')
  return income


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
      due_date: (input.due_date).toISOString(),
      type: input.type,
      frequency: input.frequency,
      recurring: input.recurring,
      include: input.include,
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
