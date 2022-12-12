import { ActionFunction, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { createIncome } from '~/utils/incomes.server'
import { useUser } from '~/utils/utils'

export const action: ActionFunction = async ({ request, params }) => {
  const user = await isAuthenticated(request)
  invariant(user, 'User')

  const formData = await request.formData()
  const description = formData.get('description')
  const amount = Number(formData.get('amount'))
  // @ts-ignore
  let due_date = new Date(formData.get('due_date'))

  const type = formData.get('type')
  const frequency = formData.get('frequency')
  invariant(frequency, 'Frequency')

  const recurring = Boolean(formData.get('recurring'))
  invariant(recurring, 'Recurring')
  const paid = Boolean(formData.get('paid'))
  invariant(paid, 'Paid')

  if (
    typeof description !== 'string' ||
    typeof amount !== 'number' ||
    typeof type !== 'string' ||
    typeof frequency !== 'string'
  ) {
    return new Response('Invalid form data', { status: 400 })
  }

  const fields = {
    description,
    amount,
    due_date,
    type,
    frequency,
    recurring,
    paid
  }
  const income = await createIncome({
    description: fields.description,
    amount: fields.amount,
    due_date: fields.due_date,
    type: fields.type,
    frequency: fields.frequency,
    recurring: fields.recurring,
    paid: fields.paid,
    userId: user.id
  })
  return redirect(`/incomes/${income.id}`)
}

export default function NewIncome() {
  const user = useUser()
  const [formData, setFormData] = useState({
    source: '',
    accountNumber: '',
    amount: '',
    due_date: '',
    type: '',
    frequency: '',
    recurring: 'true',
    paid: 'false',
    description: '',
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
      <h1 className='text-2xl font-semibold'>Welcome to My Income</h1>
      <div className='flex w-full justify-around p-2'>
        <div>
          <h1 className='text-2xl'>Income</h1>
          <Form method='post' className='form-primary'>
            <input
              type='hidden'
              name='userId'
              value={formData.userId}
              onChange={(e) => handleInputChange(e, 'userId')}
            />
            <label>
              <span>Description</span>
              <input
                type='text'
                className='form-field-primary'
                name='description'
                value={formData.description}
                onChange={(e) => handleInputChange(e, 'description')}
              />
            </label>
            <label>
              <span>Amount</span>
              <input
                type='number'
                name='amount'
                className='form-field-primary'
                value={formData.amount}
                onChange={(e) => handleInputChange(e, 'amount')}
              />
            </label>
            <label>
              <span>Due Date</span>
              <input
                type='date'
                name='due_date'
                className='form-field-primary'
                value={formData.due_date}
                onChange={(e) => handleInputChange(e, 'due_date')}
              />
            </label>
            <label>
              <span>Type</span>
              <select
                name='type'
                className='form-field-primary'
                value={formData.type}
                onChange={(e) => handleInputChange(e, 'type')}
              >
                <option value='Payroll Income'>Payroll</option>
                <option value='Rental Income'>Rental Income</option>
                <option value='Other Income'>Other</option>
              </select>
            </label>
            <label>
              <span>Frequency</span>
              <select
                name='frequency'
                className='form-field-primary'
                value={formData.frequency}
                onChange={(e) => handleInputChange(e, 'frequency')}
              >
                <option value='BIANNUALLY'>BiAnually</option>
                <option value='WEEKLY'>Weekly</option>
                <option value='MONTHLY'>Monthly</option>
                <option value='YEARLY'>Yearly</option>
              </select>
            </label>
            <label>
              <span>Recurring</span>
              <input
                type='checkbox'
                name='recurring'
                value={formData.recurring}
                onChange={(e) => handleInputChange(e, 'recurring')}
              />
            </label>
            <label>
              <span>Paid</span>
              <input
                type='checkbox'
                name='paid'
                value={formData.paid}
                checked={formData.paid === 'false'}
                onChange={(e) => handleInputChange(e, 'paid')}
              />
            </label>
            <button type='submit'>Submit</button>
          </Form>
        </div>
      </div>
    </>
  )
}
