import type { ActionFunction, MetaFunction } from '@remix-run/node'
import { Form, Link, useFormAction } from '@remix-run/react'
import { badRequest, serverError } from 'remix-utils'
import { AuthForm } from '~/components/auth/auth-form'
import { SocialLoginForm } from '~/components/auth/social-login-form'
import { authenticator } from '~/utils/auth/authenticator.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Remix sonic-death template | Login',
    description: 'Login to do many things!'
  }
}

export const action: ActionFunction = async ({ request }) => {
  try {
    return await authenticator.authenticate('register', request, {
      successRedirect: '/'
    })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof Error) return badRequest({ message: error.message })
    return serverError(error)
  }
}

const Page = () => {
  return (
    <main className='mx-auto w-full max-w-md'>
      <div className='rounded-lg bg-white p-8 shadow-md'>
        <AuthForm authType='register' />
        <div className='bg-white'>Or continue with</div>
        <SocialLoginForm provider='github'>
          <button type='submit' formAction={useFormAction('/auth/github')}>
            {' '}
            <svg
              className='absolute left-6 h-6 w-6 fill-black'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z'
              />
            </svg>
            <span>continue with github</span>
          </button>
        </SocialLoginForm>
      </div>
      <div className='mt-2 flex justify-between'>
        <Link
          className='text-sm text-slate-500 dark:text-slate-300'
          to='/auth/login'
        >
          Already have an account?
        </Link>
      </div>
    </main>
  )
}

export default Page
