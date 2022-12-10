import { Form, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { ExpenseQuery } from '~/utils/expenses.server'
import { IncomeQuery } from '~/utils/incomes.server'
import { UserType, useUser } from '~/utils/utils'

type Props = {
  data: IncomeQuery | ExpenseQuery
}

export const MoreButton = ({ data }: Props) => {
  const user = useUser()

  const isLoggedIn = user !== null
  const isOwner = user && user.id === data.userId

  return (
    <>
      {isLoggedIn && isOwner && (
        <Form method='post' action={`/dashboard/incomes/${data.id}/delete`}>
          <button type='submit' className=''>
            <span className='material-symbols-outlined'>delete</span>{' '}
          </button>
        </Form>
      )}
    </>
  )
}
