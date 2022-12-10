import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import { Dialog } from '~/components/shared/dialog'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getExpense } from '~/utils/expenses.server'
import Edit from '../../incomes/$iid/edit'

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await isAuthenticated(request)
  invariant(user, 'User Required')
  const expenseId = params.eid
  invariant(expenseId, 'Expense ID Required')
  const expense = await getExpense(expenseId, user.id)

  return json(expense)
}

export default function EditExpense() {
  const data = useLoaderData<typeof loader>()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Dialog isOpen={isOpen} handleClose={() => setIsOpen(false)}>
        <Edit data={data} type='expenses' />
      </Dialog>
    </>
  )
}
