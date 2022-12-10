import { json, LoaderFunction, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import LandingPage from '~/components/landing-page'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getDashBoardExpenses } from '~/utils/expenses.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request)
  if (!user) return <LandingPage />
  else {
    return redirect('/dashboard')
  }
}
