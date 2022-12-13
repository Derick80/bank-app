import type { ActionFunction, LoaderArgs, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { badRequest, serverError } from 'remix-utils'
import { AuthForm } from '~/components/shared/auth/auth-form'
import { SocialLoginForm } from '~/components/shared/auth/social-login-form'
import {
  authenticator,
  isAuthenticated
} from '~/utils/auth/authenticator.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Login',
    description: 'Login to your account'
  }
}
export async function loader(args: LoaderArgs) {
  return (await isAuthenticated(args.request)) ? redirect('/dashboard') : null
}
export const action: ActionFunction = async ({ request }) => {
  try {
    return await authenticator.authenticate('login', request, {
      successRedirect: '/dashboard'
    })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof Error)
      return badRequest({ message: `${error.message} +login error` })
    return serverError(error)
  }
}

export default function Login() {
  return (
    <article>
      <div className='rounded-lg bg-white p-8 shadow-md'>
        <AuthForm authType='login' />
        <div className='bg-white'>Or continue with</div>
        <Form action='/auth/github' method='post'>
          <button>GitHub</button>
        </Form>
        <SocialLoginForm provider='github'>
          <button>Github</button>
        </SocialLoginForm>
        <div className='mt-4'>
          <Link to='/auth/register'>Don't have an account?</Link>
        </div>
      </div>
    </article>
  )
}
