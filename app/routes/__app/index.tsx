import type { Expense, Income } from '@prisma/client'
import { LoaderArgs, LoaderFunction, SerializeFrom } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import chroma from 'chroma-js'
import { BandChart, BandContainer } from '~/components/shared/band-chart'
import { Content } from '~/components/shared/content'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { dateRange } from '~/utils/date-functions.server'
import type { ExpenseQuery } from '~/utils/expenses.server'
import { getUserExpensesByMonth } from '~/utils/expenses.server'
import { getUserCurrentMonthExpenses } from '~/utils/expenses.server'
import type { IncomeQuery } from '~/utils/incomes.server'
import { getUserCurrentMonthIncomes } from '~/utils/incomes.server'

type LoaderData = SerializeFrom<typeof loader>

export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  if (!user) return redirect('/auth/login')
  const userId = user.id
  const incomes = await getUserCurrentMonthIncomes({ id: user.id })
  const { expenses, expenseMonthlyTotal, totalsByExpenseType } =
    await getUserCurrentMonthExpenses({ id: user.id })
  const { now, then } = await dateRange()

  return json({ incomes, expenses, expenseMonthlyTotal, totalsByExpenseType })
}

export default function DashBoardRoute() {
  const data = useLoaderData<typeof loader>()
  const incomes: LoaderData['incomes'] = data.incomes

  const incomeSubTOtal = data.incomes.reduce(
    (acc: number, income: { amount: number }) => acc + income.amount,
    0
  )

  console.log('iSub', incomeSubTOtal)

  const expenseScale = chroma.scale(['yellow', 'red', 'black'])

  const subTotal = data.totalsByExpenseType.map(
    (expense: { type: string; amount: number; lengths: number }) => {
      const percentage = Number(expense.amount / data.expenseMonthlyTotal)
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
          {data.incomes.map((income) => (
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
              ${data.expenseMonthlyTotal}
            </p>
          </div>
          {data.expenses.map((expense) => (
            <Content
              key={expense.id}
              data={expense}
              type='expenses'
              preview={true}
              showMore
            />
          ))}
        </div>
      </div>
    </>
  )
}
