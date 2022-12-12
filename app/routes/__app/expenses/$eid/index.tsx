import { LoaderFunction, redirect, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Content } from '~/components/shared/content'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getExpense } from '~/utils/expenses.server'



export const loader: LoaderFunction = async ({request, params}) => {

    const user = await isAuthenticated(request)
    if (!user) return redirect('/login')
    const expenseId = params.eid
    invariant(expenseId, 'Expense ID Required')
    const userId = user.id
    const expenses = await getExpense(expenseId)

    return json({ expenses })
}


export default function ExpensesRoute() {
    const data = useLoaderData<typeof loader>()

    return (
        <>
            <h1 className='text-2xl font-semibold'>Welcome to My Income</h1>
            <div className='flex w-full justify-around p-2'>
                <div>
                    <h1 className='text-2xl'>Income</h1>
                    <Content data={data.expenses} type='expenses' preview={false} showEdit />
                </div>
            </div>
        </>
    )
}