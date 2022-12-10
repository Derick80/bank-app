import { Income } from '@prisma/client'
import { Link } from '@remix-run/react'
import { format } from 'date-fns'
import type { ExpenseQuery } from '~/utils/expenses.server'
import type { IncomeQuery } from '~/utils/incomes.server'
import { getIncome } from '~/utils/incomes.server'
import { MoreButton } from './more-button'

type ContentProps = {
  data: IncomeQuery | ExpenseQuery
  type: 'incomes' | 'expenses'
  preview: boolean
  showMore?: boolean
}

export const Content = ({
  data,
  type,
  preview,
  showMore = false
}: ContentProps) => {

  return (
    <>
      <div className='flex flex-row'>
        <Link prefetch='intent' to={`/dashboard/${type}/${data.id}/`}>
          <p>{data.description}</p>
        </Link>
        {data.due_date ? (
          <>
            <p>{format(new Date(data.due_date), 'MMM, do')}</p>
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

      <div>
        {showMore && <MoreButton data={data} />}
        <div></div>
      </div>
    </>
  )
}