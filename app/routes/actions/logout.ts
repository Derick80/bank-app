import { ActionArgs } from '@remix-run/node'
import { authenticator } from '~/utils/auth/authenticator.server'

export async function action({ request }: ActionArgs) {
  await authenticator.logout(request, { redirectTo: '/auth/login' })
}
