import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Edit } from '~/components/shared/edit'
import { Modal } from '~/components/shared/model'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { updateExpense } from '~/utils/expenses.server'
import type { IncomeQuery } from '~/utils/incomes.server'
import { getIncome, updateIncome } from '~/utils/incomes.server'

export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  invariant(user, 'User Required')
  const idToGet = args.params.iid
  invariant(idToGet, 'Post ID Required')
  const income = await getIncome(idToGet)

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
  const include = Boolean(formData.get('include'))
  let accountNameId = formData.get('accountNameId') as string

  if (
    typeof description !== 'string' ||
    typeof amount !== 'number' ||
    typeof type !== 'string' ||
    typeof frequency !== 'string'
  ) {
    return new Response('Invalid form data', { status: 400 })
  }

  const fields = {
    description,
    amount,
    due_date,
    type,
    frequency,
    recurring,
    include,
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
        include: fields.include,
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
        include: include,
        userId: user.id,
        expenseId: params.iid
      })
      return redirect(`/dashboard`)
  }

  return json({ error: 'Invalid action' }, { status: 400 })
}

export default function EditIncome() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <Modal isOpen={true} className='w-2/3 p-10'>
        {' '}
        <Edit data={data} type='incomes' />
      </Modal>
    </>
  )
}
