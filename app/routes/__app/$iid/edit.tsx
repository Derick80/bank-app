import type { ActionFunction, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Edit } from '~/components/shared/edit'
import { Modal } from '~/components/shared/model'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { updateExpense } from '~/utils/expenses.server'
import { getIncome, updateIncome } from '~/utils/incomes.server'

export async function loader({ request, params }: LoaderArgs) {
  const incomeId = params.iid
  invariant(incomeId, 'Income ID Required')
  let incomeProsmie = await getIncome(incomeId)
  const user = await isAuthenticated(request)
  invariant(user, 'User Required')

  let [income] = await Promise.all([incomeProsmie])
  invariant(income, 'Income Required')
  return json({income})
}

export const action: ActionFunction = async ({ request, params }) => {
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
        description: fields.description,
        amount: fields.amount,
        accountNameId: accountNameId,
        due_date: fields.due_date,
        type: fields.type,
        frequency: fields.frequency,
        recurring: fields.recurring,
        include: fields.include,
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
        <Edit data={data}

        />
      </Modal>
    </>
  )
}
