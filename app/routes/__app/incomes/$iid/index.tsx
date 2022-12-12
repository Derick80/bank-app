import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Content } from '~/components/shared/content'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getIncome } from '~/utils/incomes.server'

export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  invariant(user, 'User')
  const userId = user.id
  const incomeId = args.params.iid
  invariant(userId, 'User ID')
  invariant(incomeId, 'Income ID')

  console.log('incomeId', incomeId)

  const income = await getIncome(incomeId)

  return json({ income })
}

export default function IncomeRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <h1 className='text-2xl font-semibold'>Welcome to My Income</h1>
      <div className='flex w-full justify-around p-2'>
        <div>
          <h1 className='text-2xl'>Income</h1>
          <Content data={data.income} type='incomes' preview={false} showEdit />
        </div>
      </div>
    </>
  )
}
