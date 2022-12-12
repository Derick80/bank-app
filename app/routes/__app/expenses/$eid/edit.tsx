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
import { EQuery, ExpenseQuery, getExpense, updateExpense } from '~/utils/expenses.server'
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
  const expenseId = params.eid
  const formData = await request.formData()
  const description = formData.get('description')
  const accountNameId = formData.get('accountNameId')
  const amount = Number(formData.get('amount'))
  // @ts-ignore
  let due_date = new Date(formData.get('due_date'))
  const type = formData.get('type')
  const frequency = formData.get('frequency')
  const recurring = Boolean(formData.get('recurring'))
  invariant(recurring, 'Recurring')
  const paid =  formData.get('paid')
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
  frequency: frequency,
  recurring: recurring,
  paid: isPaid,
  userId: user.id,
  expenseId: expenseId

})
  return redirect(`/dashboard`)
}

export default function EditExpense() {
  const data = useLoaderData<typeof loader>()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Dialog isOpen={isOpen} handleClose={() => setIsOpen(false)}>
        <Edit data={data} type="expenses"

        />
      </Dialog>
    </>
  )
}
