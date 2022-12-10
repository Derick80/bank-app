import { Income } from '@prisma/client'
import { Link } from '@remix-run/react'
import { format } from 'date-fns'
import { getIncome } from '~/utils/incomes.server'
import { MoreButton } from './more-button'

type IncomeContentProps = {
  income: Income
  preview: boolean
  showMore?: boolean
}

export const IncomeContent = ({
  income,
  preview,
  showMore = false
}: IncomeContentProps) => {
  const total = income
  console.log('total', total)

  return (
    <>
      <div className='flex flex-row'>
        <Link prefetch='intent' to={`/dashboard/incomes/${income.id}/`}>
          <p>{income.description}</p>
        </Link>
        <p>{format(new Date(income.due_date), 'MMM, do')}</p>
        <p>{income.amount}</p>

        {!preview && (
          <>
            <p>{income.frequency}</p>
            <p>{income.recurring}</p>
          </>
        )}
      </div>

      <div>
        {showMore && <MoreButton data={income} />}
        <div></div>
      </div>
    </>
  )
}
