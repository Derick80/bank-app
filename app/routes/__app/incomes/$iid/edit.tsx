import type { ActionFunction, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useNavigate } from '@remix-run/react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import { Dialog } from '~/components/shared/dialog'
import { Edit } from '~/components/shared/edit'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getExpense, updateExpense } from '~/utils/expenses.server'
import type { IncomeQuery } from '~/utils/incomes.server'
import { getIncome, updateIncome } from '~/utils/incomes.server'
import { validateNumber } from '~/utils/validators.server'

export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  invariant(user, 'User Required')
  const idToGet = args.params.iid
  invariant(idToGet, 'Post ID Required')
  const income = await getIncome(idToGet)
  const expenses = await getExpense(idToGet)

  return json(income)
}

export async function action({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  invariant(user, 'User Required')
  const formData = await request.formData()
  const action = formData.get('_action')

  const description = formData.get('description')
  const amount = Number(formData.get('amount'))
  // @ts-ignore
  let due_date = new Date(formData.get('due_date'))
  const type = formData.get('type')
  const frequency = formData.get('frequency')
  invariant(frequency, 'Frequency')
  const recurring = Boolean(formData.get('recurring'))
  invariant(recurring, 'Recurring')
  const paid = Boolean(formData.get('paid'))
  let accountNameId = formData.get('accountNameId') as string

  if (
    typeof description !== 'string' ||
    typeof amount !== 'number' ||
    typeof type !== 'string' ||
    typeof frequency !== 'string'
  ) {
    return new Response('Invalid form data', { status: 400 })
  }

  const errors = {
    amount: validateNumber(amount as number)
  }

  const fields = {
    description,
    amount,
    due_date,
    type,
    frequency,
    recurring,
    paid,
    incomeId: params.iid
  }
  switch (action) {
    case 'updateIncomes':
      await updateIncome({
        description: fields.description,
        amount: fields.amount,
        due_date: fields.due_date,
        type: fields.type,
        frequency: fields.frequency,
        recurring: fields.recurring,
        paid: fields.paid,
        userId: user.id,
        incomeId: params.iid
      })
      return redirect(`/dashboard`)

    case 'updateExpenses':
      await updateExpense({
        description: description,
        accountNameId: accountNameId,
        amount: amount,
        due_date: due_date,
        type: type,
        frequency: frequency,
        recurring: recurring,
        paid: paid,
        userId: user.id,
        expenseId: params.iid
      })
      return redirect(`/dashboard`)
  }

  return json({ error: 'Invalid action' }, { status: 400 })
}

export default function EditIncome() {
  const data = useLoaderData<typeof loader>() as IncomeQuery
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()

  const handleCLosing = () => {
    setIsOpen(false)
    navigate('/dashboard')
  }
  return (
    <>
      <Dialog isOpen={true} handleClose={() => handleCLosing()}>
        <Edit data={data} type='incomes' />
      </Dialog>
    </>
  )
}
