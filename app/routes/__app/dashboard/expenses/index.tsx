import { useLoaderData } from '@remix-run/react'
import { useRouteData } from 'remix-utils'

export default function ExpenseRoute() {
  const data = useLoaderData()

  console.log('data', data)

  return (
    <>
      <h1 className='text-2xl font-semibold'>Welcome to My Expenses</h1>
      <div className='flex w-full justify-around p-2'></div>
    </>
  )
}
