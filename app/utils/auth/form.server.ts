import { FormStrategy } from 'remix-auth-form'
import invariant from 'tiny-invariant'
import type { RegisterForm } from '../types.server'
import { createUser, getUser } from '../users.server'
import bcrypt from 'bcryptjs'

export const registerStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email')
  const password = form.get('password')
  invariant(typeof email === 'string', 'Email is not a string')

  const existingUser = await getUser({ email })
  if (existingUser) {
    throw new Error('User already exists')
  }
  const user = await createUser({ email, password } as RegisterForm)
  return user.id
})

export const loginStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email')
  const password = form.get('password')
  invariant(typeof email === 'string', 'Email is not a string')
  invariant(typeof password === 'string', 'Password is not a string')
  const user = await getUser({ email })
  if (!user) {
    throw new Error('User not found')
  }
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Invalid password')
  }
  return user.id
})
