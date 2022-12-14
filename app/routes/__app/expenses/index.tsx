import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Content } from '~/components/shared/content'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getAllUserExpenses } from '~/utils/expenses.server'

export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  if (!user) return redirect('/login')
  const userId = user.id
  const expenses = await getAllUserExpenses(userId)

  const data = {
    expenses
  }
  return json(data)
}

export default function ExpensesRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <h1 className='text-2xl font-semibold'>Welcome to My Expenses</h1>
      <div className='flex w-full justify-around p-2'>
        <div>
          <h1 className='text-2xl'>Expenses</h1>
          {data.expenses.map((expense) => (
            <>
              <Content
                data={expense}
                type='expenses'
                preview={false}
                showEdit
              />
            </>
          ))}
        </div>
      </div>
    </>
  )
}

// Path: app/routes/__app/dashboard/expenses/$eid/index.tsx
