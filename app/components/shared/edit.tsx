import { Props } from '@headlessui/react/dist/types'
import { Form } from '@remix-run/react'
import { format } from 'date-fns'
import { useState } from 'react'
import { ExpenseQuery } from '~/utils/expenses.server'
import { IncomeQuery } from '~/utils/incomes.server'
import { useUser } from '~/utils/utils'

type EditProps = {
  data:
    | IncomeQuery
    | (ExpenseQuery & {
        accountNameId?: string
      })
  type: 'incomes' | 'expenses'
}
export const Edit = ({ data, type }: EditProps) => {
  const user = useUser()

  const [formData, setFormData] = useState({
    description: '',
    accountNameId: '',
    amount: 0,
    due_date: '',
    type: '',
    frequency: '',
    recurring: 'true',
    paid: 'false',
    userId: user.id
  })
  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLFormElement | HTMLSelectElement
    >,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value
    }))
  }

  return (
    <>
      <Form
        method='post'
        action={`/dashboard/${type}/${data.id}/edit`}
        className='form-primary'
      >
        <input
          type='hidden'
          name='userId'
          defaultValue={data.userId}
          onChange={(event) => handleInputChange(event, 'userId')}
        />

        <label htmlFor='description'>Description</label>
        <input
          type='text'
          name='description'
          className='form-field-primary'
          defaultValue={data.description}
          onChange={(event) => handleInputChange(event, 'description')}
        />
        {type !== 'incomes' && (
          <>
            <label htmlFor='accountNameId'>Account Name</label>
            <input
              type='text'
              name='accountNameId'
              className='form-field-primary'
              defaultValue={data.accountNameId}
              onChange={(event) => handleInputChange(event, 'accountNameId')}
            />
          </>
        )}

        <label htmlFor='amount'>Amount</label>
        <input
          type='number'
          name='amount'
          className='form-field-primary'
          defaultValue={data.amount}
          onChange={(event) => handleInputChange(event, 'amount')}
        />

        <label htmlFor='due_date'>Due Date</label>
        <input
          type='date'
          name='due_date'
          className='form-field-primary'
          defaultValue={format(new Date(data.due_date), 'yyyy-MM-dd')}
          onChange={(event) => handleInputChange(event, 'due_date')}
        />

        <label htmlFor='type'>Type</label>
        <select
          name='type'
          className='form-field-primary'
          defaultValue={data.type}
          onChange={(event) => handleInputChange(event, 'type')}
        >
          <option value='Payroll Income'>Payroll</option>
          <option value='Rental Income'>Rental Income</option>
          <option value='Other Income'>Other</option>
        </select>

        <label htmlFor='frequency'>Frequency</label>
        <select
          name='frequency'
          className='form-field-primary'
          defaultValue={data.frequency}
          onChange={(event) => handleInputChange(event, 'frequency')}
        >
          <option value='BIANNUALLY'>BiAnually</option>
          <option value='WEEKLY'>Weekly</option>
          <option value='MONTHLY'>Monthly</option>
          <option value='YEARLY'>Yearly</option>
        </select>

        <label htmlFor='recurring'>Recurring</label>
        <input
          type='checkbox'
          name='recurring'
          defaultValue={data.recurring}
          onChange={(event) => handleInputChange(event, 'recurring')}
        />

        <label htmlFor='paid'>Paid</label>
        <input
          type='checkbox'
          name='paid'
          defaultValue={data.paid}
          onChange={(event) => handleInputChange(event, 'paid')}
        />

        <button type='submit'>Submit</button>
      </Form>
    </>
  )
}
