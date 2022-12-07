import { Form, useActionData, useSearchParams } from '@remix-run/react'
import { useEffect } from 'react'

type Props = {
  authType: 'register' | 'login'
}

const actionMap: Record<Props['authType'], { button: string; url: string }> = {
  register: {
    url: '/register',
    button: 'Sign up'
  },
  login: {
    url: '/login',
    button: 'Log in'
  }
}

export const AuthForm = ({ authType }: Props) => {
  const action = useActionData()
  const [searchParams] = useSearchParams()
  const { button, url } = actionMap[authType]
  const redirectTo = searchParams.get('redirectTo')

  useEffect(() => {
    if (action && action.message) {
      alert(action.message)
    }
  }, [action])

  return (
    <Form className='flex flex-col gap-5' method='post' action={url}>
      <input type='hidden' name='redirectTo' value={redirectTo || '/'} />

      <input
        id='email'
        name='email'
        type='email'
        placeholder='youremail@mail.com'
      />

      <input
        id='password'
        name='password'
        type='password'
        placeholder='********'
      />

      <button className='mt-2 w-full' type='submit'>
        {button}
      </button>
    </Form>
  )
}
