import { json, LoaderArgs, LoaderFunction } from '@remix-run/node'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getUserOptions } from '~/utils/options.server'

export async function loader(args: LoaderArgs) {
  const user = await isAuthenticated(args.request)
  if (!user) return json({ error: 'Not authenticated' }, { status: 401 })

  const accountData = await getUserOptions(user.id)
  return json(user)
}
