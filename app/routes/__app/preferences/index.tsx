import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { isAuthenticated } from '~/utils/auth/authenticator.server'

export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  if (!user) return json({ error: 'Not authenticated' }, { status: 401 })

  return json(user)
}
