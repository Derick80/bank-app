import { json, LoaderFunction } from '@remix-run/node'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getUserOptions } from '~/utils/options.server'


export const loader: LoaderFunction = async ({ request }) => {
    const user = await isAuthenticated(request)
    if (!user) return json({ error: 'Not authenticated' }, { status: 401 })

    const accountData = await getUserOptions(user.id)
    return json(user)
}