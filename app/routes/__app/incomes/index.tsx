import { json, LoaderFunction, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Content } from '~/components/shared/content'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getUserIncomes, IncomeQuery } from '~/utils/incomes.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request)
  if (!user) return redirect('/login')
  const userId = user.id
  const incomes = await getUserIncomes(userId)

  const data = {
    incomes
  }
  return json(data)
}

export default function IncomesRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <h1 className='text-2xl font-semibold'>Welcome to My Income</h1>
      <div className='flex w-full justify-around p-2'>
        <div>
          <h1 className='text-2xl'>Income</h1>
          {data.incomes.map((income: IncomeQuery) => (
            <>
              <Content data={income} type='incomes' preview={false} showEdit />
            </>
          ))}
        </div>
      </div>
    </>
  )
}
