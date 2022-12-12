import { LoaderFunction, redirect, json, LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Content } from '~/components/shared/content'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getExpense } from '~/utils/expenses.server'
export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  if (!user) return redirect('/login')
  const expenseId = args.params.eid
  console.log('expenseId', expenseId)

  invariant(expenseId, 'Expense ID Required')
  const userId = user.id
  const expenses = await getExpense(expenseId)

  return json({ expenses })
}

export default function ExpensesRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <h1 className='text-2xl font-semibold'>Welcome to My Ex</h1>
      <div className='flex w-full justify-around p-2'>
        <div>
          <h1 className='text-2xl'>Ex</h1>
          <Content
            data={data.expenses}
            type={'expenses'}
            preview={false}
            showMore
            showEdit
          />
        </div>
      </div>
    </>
  )
}
