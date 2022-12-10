import type { Income } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { IncomeContent } from '~/components/shared/income-content'
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
  if (!user) return redirect('/auth/login')
  const userId = user.id
  const incomes = await getUserCurrentMonthIncomes({ id: user.id })

  const { now, then } = await dateRange()
  const result = await getUserExpensesByMonth(userId, now, then)

  return json({ incomes, result })
}

export default function DashBoardRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <h1 className='text-2xl font-semibold'>Current Month Summary</h1>
      <div className='flex w-full flex-col justify-around p-2'>
        <div>
          <h1 className='text-2xl'>Income</h1>
          {data.incomes.map((income: Income) => (
            <IncomeContent
              key={income.id}
              income={income}
              preview={true}
              showMore
            />
          ))}
        </div>
        <div>
          <h1 className='text-2xl'>Expenses</h1>
          {/* { data.results.result.map((expense: Income) => (
            <IncomeContent key={ expense.id } income={ expense } />
          )) } */}
        </div>
      </div>
    </>
  )
}
