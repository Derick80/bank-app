import { Form, Link } from '@remix-run/react'
import { format } from 'date-fns'
import type { ExpenseQuery } from '~/utils/expenses.server'
import type { IncomeQuery } from '~/utils/incomes.server'
import { useOptionalUser } from '~/utils/utils'

type ContentProps = {
  data: IncomeQuery | ExpenseQuery
  type: string
  preview: boolean
  showEdit: boolean
  showMore?: boolean
}

export const Content = ({
  data,
  preview,
  showEdit,
  type,
  showMore = false
}: ContentProps) => {
  const user = useOptionalUser()
  console.log('type', type)

  return (
    <>
      <div className='flex flex-row'>
        <Link prefetch='intent' to={`/${type}/${data.id}/`}>
          <p>{data.description}</p>
        </Link>
        {data.due_date ? (
          <>
            <p>{format(new Date(data.due_date), 'MMM, dd')}</p>
          </>
        ) : null}
        <p>{data.amount}</p>

        {!preview && (
          <>
            <p>{data.frequency}</p>
            <p>{data.recurring}</p>
          </>
        )}
      </div>

      {showMore && user && (
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
      <div></div>
    </>
  )
}
