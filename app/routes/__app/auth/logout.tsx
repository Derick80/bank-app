// app/routes/logout.tsx
import { ActionFunction, LoaderFunction } from '@remix-run/node'
import { notFound } from 'remix-utils'
import { authenticator } from '~/utils/auth/authenticator.server'
export const loader: LoaderFunction = () => {
  throw notFound({ message: "This page doesn't exists." })
}

export let action: ActionFunction = async ({ request, params }) => {
  await authenticator.logout(request, { redirectTo: '/auth/login' })
}
export default function LogoutResource() {
  return <div>Whops! You should have been redirected.</div>
}
