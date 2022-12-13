import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { isAuthenticated } from '~/utils/auth/authenticator.server'

export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  if (!user) return redirect('/auth/login')

  return json({ user })
}

export default function DashBoardRoute() {
  return <></>
}
