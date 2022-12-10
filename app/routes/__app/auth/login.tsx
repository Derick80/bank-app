import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect
} from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { badRequest, serverError } from 'remix-utils'
import { AuthForm } from '~/components/auth/auth-form'
import { SocialLoginForm } from '~/components/auth/social-login-form'
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

export const loader: LoaderFunction = async ({ request }) => {
  return (await isAuthenticated(request)) ? redirect('/') : null
}
export const action: ActionFunction = async ({ request }) => {
  try {
    return await authenticator.authenticate('login', request, {
      successRedirect: '/'
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
