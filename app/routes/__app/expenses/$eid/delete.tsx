import {
  ActionFunction,
  LoaderArgs,
  LoaderFunction,
  redirect
} from '@remix-run/node'
import { badRequest, notFound, serverError } from 'remix-utils'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { deleteExpense } from '~/utils/expenses.server'

export async function loader(args: LoaderArgs) {
  throw notFound({ message: 'Delete Not Found' })
}

export const action: ActionFunction = async ({ request, params }) => {
  const user = await isAuthenticated(request)
  if (!user) return redirect('/login')
  const userId = user.id
  const expenseId = params.eid
  invariant(expenseId, 'Expense ID required')

  if (!expenseId) return notFound({ message: 'E ID Not Found' })

  try {
    if (request.method === 'POST') {
      await deleteExpense({ id: expenseId })
    }
    return redirect('/dashboard')
  } catch (error) {
    if (error instanceof Error) return badRequest({ message: error.message })
    return serverError({ message: 'something went wrong' })
  }
}
