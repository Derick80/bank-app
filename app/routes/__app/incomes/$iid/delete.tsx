import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { badRequest, notFound, serverError } from 'remix-utils'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { deleteIncome } from '~/utils/incomes.server'

export const loader: LoaderFunction = () => {
  throw notFound({ message: 'Not Found' })
}

export const action: ActionFunction = async ({ request, params }) => {
  const user = await isAuthenticated(request)
  invariant(user, 'User')
  const userId = user.id
  const incomeId = params.iid
  invariant(incomeId, 'Income ID')

  if (!userId || !incomeId) return notFound({ message: 'Not Found' })

  try {
    if (request.method === 'POST') {
      await deleteIncome({ id: incomeId })
    }
    return redirect('/dashboard')
  } catch (error) {
    if (error instanceof Error) return badRequest({ message: error.message })
    return serverError({ message: 'something went wrong' })
  }
}
