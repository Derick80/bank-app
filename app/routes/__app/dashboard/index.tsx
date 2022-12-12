import type { Expense, Income } from '@prisma/client'
import type { LoaderArgs, LoaderFunction } from '@remix-run/node'
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

export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  if (!user) return redirect('/login')
  const userId = user.id
  const incomes = await getUserCurrentMonthIncomes({ id: user.id })
  const incomesByTypeTotal = await totalAndGroupByType(incomes)
  const { now, then } = await dateRange()
  const bills = await getUserExpensesByMonth(userId, now, then)

  const expensesByTypeTotal = await totalAndGroupByType(bills)

  const expenseScale = chroma.scale(['yellow', 'red', 'black'])

  const incTotal = incomesByTypeTotal.reduce((accumulator, obj) => {
    return accumulator + obj.amount
  }, 0)

  const exTotal = expensesByTypeTotal.reduce((accumulator, obj) => {
    return accumulator + obj.amount
  }, 0)

  const exMapped = expensesByTypeTotal.map((item) => {
    return {
      id: item.type,
      amount: item.amount,
      percentage: Number((item.amount / exTotal) * 100).toFixed(2),
      itemWidth: (item.amount / exTotal) * 100,
      bgFill: expenseScale((item.amount / exTotal) * 100).css()
    }
  })
  return json({
    exTotal,
    incomes,
    exMapped,
    incTotal,
    incomesByTypeTotal,
    bills,
    expensesByTypeTotal
  })
}

export default function DashBoardRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <h1 className='text-2xl font-semibold'>Current Month Summary</h1>
      <BandContainer>
        {data.exMapped.map((item) => (
          <BandChart
            key={item.id}
            id={item.id}
            itemWidth={item.itemWidth}
            percentage={item.percentage}
            bgFill={item.bgFill}
          />
        ))}
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
              ${data.incTotal}
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
              ${data.exTotal}
            </p>
          </div>
          {data.bills.map((expense) => (
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

function sumByType(
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
  return result
}

export type GroupsByType = {
  type: string
  amount: number
  label: string
}[]

function totalAndGroupByType(
  array: {
    type: string
    amount: number
  }[]
): GroupsByType {
  const data: GroupsByType = array
    .map((item) => {
      return {
        type: item.type,
        amount: item.amount,
        label: item.type
      }
    })
    .reduce(
      (
        acc: any,
        singleton: { type: string; amount: number; label: string }
      ) => {
        const index = acc.findIndex((item: any) => item.type === singleton.type)
        if (index === -1) {
          return [...acc, singleton]
        } else {
          acc[index].amount += singleton.amount
          return acc
        }
      },
      []
    )
  return data as GroupsByType
}

// .reduce((accumulator: [
//   {
//     type: string,
//     amount: number,
//     label: string

//   },
//   { total: number }

// ], currentValue: { type: string, amount: number, label: string }) => {

//   const total = Number(accumulator['total'] += currentValue.amount)
//   const percent = Number(((currentValue.amount / total)).toFixed(2))

//   accumulator[currentValue.type] = {
//     type: currentValue.type,
//     amount: currentValue.amount,
//     label: currentValue.label,

//   }
//   accumulator['total'] = Number(accumulator['total'] += currentValue.amount)

//   return accumulator
// }, { total: 0 })

// const incomesToProcess = incomes.map((income: { type: string; amount: number }) => {
//   return {
//     type: income.type,
//     amount: income.amount
//   }
// }).reduce((acc: any, income: { type: string; amount: number }) => {
//   const index = acc.findIndex((item: { type: string; amount: number }) => item.type === income.type)
//   if (index === -1) {
//     acc.push(income)
//   } else {
//     acc[index].amount += income.amount
//   }
//   return acc
// }, []).reduce((acc: any, income: { type: string; amount: number }) => {
//   acc[income.type] = income.amount
//   acc['total'] += income.amount
//   return acc

// }
//   , { total: 0 }
// )
