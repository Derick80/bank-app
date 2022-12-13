import type { ExpenseQuery } from './expenses.server'
import type { IncomeQuery } from './incomes.server'

export async function getTags(array: ExpenseQuery[] | IncomeQuery[]) {
  const tags = array.map((tag) => tag.type)
  return tags
}

export async function sumByType(
  array: {
    [key: string]: number | string
  }[]
) {
  const typeArray = array.map((item) => {
    return {
      type: item.type,
      amount: item.amount,
      label: item.type
    }
  })
  const result = typeArray.reduce((acc: any, { type, amount, label }) => {
    const index = acc.findIndex((item: any) => item.type === type)
    if (index === -1) {
      return [...acc, { type, amount, label }]
    } else {
      acc[index].amount += amount
      return acc
    }
  }, [])
  return result as { type: string; amount: number; label: string }[]
}
