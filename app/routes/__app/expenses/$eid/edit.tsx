import type { ActionFunction, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import type { frequencyType } from '~/utils/expenses.server'
import { getExpense, updateExpense } from '~/utils/expenses.server'
import Edit from '../../incomes/$iid/edit'
import { Portal } from '~/components/shared/prtal'
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

export const action: ActionFunction = async ({ request, params }) => {
  const user = await isAuthenticated(request)
  invariant(user, 'User Required')
  const expenseId = params.eid
  const formData = await request.formData()
  const description = formData.get('description')
  const accountNameId = formData.get('accountNameId')
  const amount = Number(formData.get('amount'))
  // @ts-ignore
  let due_date = new Date(formData.get('due_date'))
  const type = formData.get('type')
  const frequency = formData.get('frequency')
  invariant(frequency, 'Frequency')
  const freq: frequencyType = frequency
  const recurring = Boolean(formData.get('recurring'))
  invariant(recurring, 'Recurring')
  const paid = formData.get('paid')
  const isPaid = paid ? true : false

  if (
    typeof description !== 'string' ||
    typeof amount !== 'number' ||
    typeof type !== 'string' ||
    typeof frequency !== 'string' ||
    typeof accountNameId !== 'string'
  ) {
    return new Response('Invalid form data', { status: 400 })
  }

  const updated = await updateExpense({
    description: description,
    accountNameId: accountNameId,
    amount: amount,
    due_date: due_date,
    type: type,
    frequency: freq,
    recurring: recurring,
    paid: isPaid,
    userId: user.id,
    expenseId: expenseId
  })
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
