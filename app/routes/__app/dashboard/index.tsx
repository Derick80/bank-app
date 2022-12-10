import { json, LoaderFunction, redirect } from '@remix-run/node'
import { Form, useFormAction } from '@remix-run/react'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getDashBoardExpenses } from '~/utils/expenses.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request)
  if (!user) return redirect('/auth/login')

  const expenses = await getDashBoardExpenses(user.id)
  return json({ expenses })
}

export default function DashBoardRoute() {
  return (
    <article>
      <h1>Welcome to My Bank</h1>
      you are logged in
      <Form method='post' action='/auth/logout'>
        <button type='submit'>Logout</button>
      </Form>
    </article>
  )
}
