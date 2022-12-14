import { Form } from '@remix-run/react'
import { format } from 'date-fns'
import { useState } from 'react'
import type { ExpenseQuery } from '~/utils/expenses.server'
import { IncomeExpense } from '~/utils/types.server'
import { useUser } from '~/utils/utils'

type EditProps = {
  data: IncomeExpense

}
export const Edit = ({ data }: EditProps) => {
  const user = useUser()

  const [, setFormData] = useState({
    description: data.description || '',
    accountNameId: data.accountNameId,
    amount: data.amount || 0,
    due_date: data.due_date || '',
    type: data.type || '',
    frequency: data.frequency || '',
    recurring: data.recurring || false,
    include: data.include || false,
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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((form) => ({
      ...form,
      [event.target.name]: event.target.checked
    }))
  }

  return (
    <>
      <Form method='post' className='form-primary'>
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
        {data.accountNameId && (
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
          step={0.01}
          defaultValue={data.amount}
          className='form-field-primary'
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
        {data.accountNameId ? (
          <>
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
          </>
        ) : (
          <>
            <select
              name='type'
              className='form-field-primary'
              defaultValue={data.type}
              onChange={(event) => handleInputChange(event, 'type')}
            >
              <option value='Mortgage'>Mortgage</option>
              <option value='Student Loan'>Student Loan</option>
              <option value='Utilities'>Utilities</option>
              <option value='Auto'>Auto</option>
              <option value='Credit Card'>Credit Card</option>
              <option value='Monthly Subscription'>Monthly Subscription</option>
              <option value='Grocery'>Grocery</option>
            </select>
          </>
        )}

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
          checked={data.recurring}
          onChange={(event) => handleInputChange(event, 'recurring')}
        />

        <label htmlFor='include'>include</label>
        <input
          type='checkbox'
          name='include'
          checked={data.include}
          onChange={(event) => handleInputChange(event, 'include')}
        />

        <div className='flex items-center justify-center'>

          {data.accountNameId ? (
            <>
              <button
                type='submit'
                name='_action'
                value='updateExpenses'
                className='btn-base btn-outline'
              >
                Update Expense
              </button>
            </>
          ): (
            <>
                <button
                  type='submit'
                  name='_action'
                  value='updateIncomes'
                  className='btn-base btn-solid'
                >
                  Update Income
                </button>
            </>
          )}


        </div>
      </Form>
    </>
  )
}
