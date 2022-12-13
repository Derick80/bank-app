import type { ActionFunction, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getExpense } from '~/utils/expenses.server'
import Edit from '../../incomes/$iid/edit'
import { Modal } from '~/components/shared/model'

export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  invariant(user, 'User Required')
  const expenseId = args.params.eid
  invariant(expenseId, 'Expense ID Required')
  const expense = await getExpense(expenseId)
  if (!expense) {
    return json({ error: 'Expense not found' }, { status: 404 })
  }

  return json(expense)
}

export const action: ActionFunction = async ({ request }) => {
  const user = await isAuthenticated(request)
  invariant(user, 'User Required')
  const formData = await request.formData()
  const description = formData.get('description')
  const accountNameId = formData.get('accountNameId')
  const amount = Number(formData.get('amount'))
  // @ts-ignore
  const type = formData.get('type')
  const frequency = formData.get('frequency')
  invariant(frequency, 'Frequency')
  const recurring = Boolean(formData.get('recurring'))
  invariant(recurring, 'Recurring')

  if (
    typeof description !== 'string' ||
    typeof amount !== 'number' ||
    typeof type !== 'string' ||
    typeof frequency !== 'string' ||
    typeof accountNameId !== 'string'
  ) {
    return new Response('Invalid form data', { status: 400 })
  }

  return redirect(`/dashboard`)
}

export default function EditExpense() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      +{' '}
      <Modal isOpen={true} className='w-2/3 p-10'>
        <Edit data={data} type='expenses' />
      </Modal>
    </>
  )
}
