import { ExpenseQuery } from './expenses.server'
import { IncomeQuery } from './incomes.server'


export async function getTags(array: ExpenseQuery[] | IncomeQuery[] ){
    const tags = array.map((tag) => tag.type

    )
    return tags
}