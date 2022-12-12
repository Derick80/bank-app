import { Form, Link } from '@remix-run/react'
import type { ExpenseQuery } from '~/utils/expenses.server'
import type { IncomeQuery } from '~/utils/incomes.server'
import { useUser } from '~/utils/utils'

type Props = {
  data: IncomeQuery | ExpenseQuery
  type: 'incomes' | 'expenses'
}

export const MoreButton = ({ data, type }: Props) => {
  const user = useUser()
  const isLoggedIn = user !== null
  const isOwner = user && user.id === data.userId

  return (
    <>
      {isLoggedIn && isOwner && (
        <>
          <div className='flex flex-row'>
            <Form method='post' action={`/${type}/${data.id}/delete`}>
              <button type='submit' className=''>
                <span className='material-symbols-outlined'>delete</span>{' '}
              </button>
            </Form>
            <Link to={`/${type}/${data.id}/edit`}>
              <span className='material-symbols-outlined'>edit</span>{' '}
            </Link>
          </div>
        </>
      )}
    </>
  )
}
