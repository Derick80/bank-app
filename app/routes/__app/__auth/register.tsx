import type { ActionFunction, MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { badRequest, serverError } from 'remix-utils'
import { AuthForm } from '~/components/auth/auth-form'
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
      </div>
      <div className='mt-2 flex justify-between'>
        <Link
          className='text-sm text-slate-500 dark:text-slate-300'
          to='/login'
        >
          Already have an account?
        </Link>
      </div>
    </main>
  )
}

export default Page
