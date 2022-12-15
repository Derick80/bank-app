import { Expense, Income } from '@prisma/client'
import { ExpenseQuery } from './expenses.server'
import { IncomeQuery } from './incomes.server'

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  userName: string
}


export type IncomeExpense = IncomeQuery& ExpenseQuery