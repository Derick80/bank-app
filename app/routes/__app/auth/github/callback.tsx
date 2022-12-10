import type { LoaderFunction } from '@remix-run/node'
import { authenticator } from '~/utils/auth/authenticator.server'

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.authenticate('github', request, {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  })
}
