import { Expense } from '.prisma/client'
import {
  LoaderFunction,
  json,
  SerializeFrom,
  ActionFunction,
  redirect
} from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import { Dialog } from '~/components/shared/dialog'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { EQuery, ExpenseQuery, getExpense } from '~/utils/expenses.server'
import Edit from '../../incomes/$iid/edit'
import { Frequency } from '.prisma/client'

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await isAuthenticated(request)
  invariant(user, 'User Required')
  const expenseId = params.eid
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
  const formData = await request.formData()
  const description = formData.get('description')
  const AccountNumberId = formData.get('AccountNumberId')
  const amount = Number(formData.get('amount'))
  // @ts-ignore
  let due_date = new Date(formData.get('due_date'))
  const type = formData.get('type')
  const frequencies = formData.get('frequency')
  const recurring = Boolean(formData.get('recurring'))
  invariant(recurring, 'Recurring')
  const paid = Boolean(formData.get('paid'))

  if (
    typeof description !== 'string' ||
    typeof amount !== 'number' ||
    typeof type !== 'string' ||
    typeof frequencies !== 'string' ||
    typeof AccountNumberId !== 'string'
  ) {
    return new Response('Invalid form data', { status: 400 })
  }
  const frequency = Frequency[frequencies]
  const fields = {
    description,
    AccountNumberId,
    amount,
    due_date,
    type,
    frequency,
    recurring,
    paid,
    id: params.eid
  }

  const expense = await {
    ...fields
  }

  return redirect(`/dashboard/expenses/${expense.id}`)
}

export default function EditExpense() {
  const data = useLoaderData<typeof loader>() as ExpenseQuery
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Dialog isOpen={isOpen} handleClose={() => setIsOpen(false)}>
        <Edit data={data} type='expenses' />
      </Dialog>
    </>
  )
}
