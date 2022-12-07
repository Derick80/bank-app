import type { Session } from '@remix-run/node'
import { createCookieSessionStorage } from '@remix-run/node'

const secret = process.env.SESSION_SECRET
if (!secret) {
  throw new Error('SESSION_SECRET is not set')
}

const cookieOptions = {
  name: '_bank_session',
  httpOnly: true,
  sameSite: 'lax' as 'lax',
  path: '/',
  secrets: [secret],
  secure: false
}

export const sessionStorage = createCookieSessionStorage({
  cookie: cookieOptions
})

export const getSession = async (request: Request) => {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))

  return session
}

export const commitSession = async (session: Session) => {
  const headers = new Headers({
    'Set-Cookie': await sessionStorage.commitSession(session)
  })

  return headers
}
