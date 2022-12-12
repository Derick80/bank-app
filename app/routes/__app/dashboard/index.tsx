import type { Expense, Income } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import chroma from 'chroma-js'
import LandingPage from '~/components/landing-page'
import { BandChart, BandContainer } from '~/components/shared/band-chart'
import { Content } from '~/components/shared/content'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { dateRange } from '~/utils/date-functions.server'
import type { ExpenseQuery } from '~/utils/expenses.server'
import { getUserExpensesByMonth } from '~/utils/expenses.server'
import { getUserCurrentMonthExpenses } from '~/utils/expenses.server'
import type { IncomeQuery } from '~/utils/incomes.server'
import { getUserCurrentMonthIncomes } from '~/utils/incomes.server'

type LoaderData = {
  incomes: IncomeQuery[]
  expenses: ExpenseQuery[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request)
  if (!user) return redirect('/login')
  const userId = user.id
  const incomes = await getUserCurrentMonthIncomes({ id: user.id })

  const { now, then } = await dateRange()
  const results = await getUserExpensesByMonth(userId, now, then)
  const totalsByType = results.reduce(
    (acc: { [key: string]: number }, expense) => {
      if (acc[expense.type]) {
        acc[expense.type] += expense.amount
      } else {
        acc[expense.type] = expense.amount
      }
      return acc
    },
    {}
  )
  console.log('totalsByType', totalsByType)

  return json({ incomes, results, totalsByType })
}

export default function DashBoardRoute() {
  const data = useLoaderData<typeof loader>()
  const incomeSubTOtal = data.incomes.reduce(
    (acc: number, income: { amount: number }) => acc + income.amount,
    0
  )
  const expenseSubTotal = data.results.reduce(
    (acc: number, expense: { amount: number }) => acc + expense.amount,
    0
  )
  const expenseScale = chroma.scale(['yellow', 'red', 'black'])

  const subTotal = data.results.map(
    (expense: { type: string; amount: number; lengths: number }) => {
      const percentage = Number(expense.amount / expenseSubTotal)
      return {
        id: expense.type,
        percent: Number((percentage * 100).toFixed(0)),
        fills: expenseScale(percentage).css()
      }
    }
  )
  console.log('subTotal', subTotal)

  return (
    <>
      <h1 className='text-2xl font-semibold'>Current Month Summary</h1>
      <BandContainer>
        {subTotal.map(
          (expense: { id: string; percent: number; fills: string }) => (
            <BandChart
              key={expense.id}
              id={expense.id}
              itemWidth={expense.percent}
              percentage={expense.percent}
              bgFill={expense.fills}
            />
          )
        )}
      </BandContainer>
      <div className='flex-r flex w-full justify-around p-2'>band stuff</div>
      <div className='flex-r flex w-full justify-around p-2'>
        <div>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-semibold uppercase'>Income</h1>
            <Link to='/incomes/new' className='block p-4 text-sm text-blue-500'>
              + New Income
            </Link>
          </div>
          <div>
            <p className='font-Eczar text-3xl font-normal underline decoration-red-700 underline-offset-8 md:text-5xl'>
              ${incomeSubTOtal}
            </p>
          </div>
          {data.incomes.map((income: Income) => (
            <>
              <Content
                key={income.id}
                data={income}
                type='incomes'
                preview={true}
                showMore
              />
            </>
          ))}
        </div>
        <div>
          <div>
            <div className='flex items-center justify-between'>
              <h1 className='text-2xl font-semibold uppercase'>Expenses</h1>
              <Link
                to='/expenses/new'
                className='block p-4 text-sm text-blue-500'
              >
                + New Expense
              </Link>
            </div>
          </div>
          <div>
            <p className='font-Eczar text-3xl font-normal underline decoration-red-700 underline-offset-8 md:text-5xl'>
              ${expenseSubTotal}
            </p>
          </div>
          {data.results.map((expense: Expense) => (
            <Content
              key={expense.id}
              data={expense}
              type='expenses'
              preview={true}
              showEdit
              showMore
            />
          ))}
        </div>
      </div>
    </>
  )
}
