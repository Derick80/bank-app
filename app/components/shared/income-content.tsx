import { Form, Link } from '@remix-run/react'
import { format } from 'date-fns'
import { useState } from 'react'
import { IncomeQuery } from '~/utils/incomes.server'

type IncomeTableProps = {
    incomes: IncomeQuery[]
}

export const IncomeTable = ({ incomes }: IncomeTableProps) => {


    const [formData, setFormData] = useState([...incomes])




    return (
        <>
            <table
                className=''
            >
                <thead>
                    <tr>
                        <th className=''>Description</th>
                        <th className=''>Type</th>
                        <th className=''>Due Date</th>
                        <th className=''>Amount</th>
                        <th className=''>Frequency</th>
                        <th className=''>Include

                        </th>
                        <th className=''>aAmount</th>
                    </tr>
                </thead>
                <tbody>



                        { incomes.map((income: IncomeQuery, index: number) => (
                            <tr key={ index }>
                                <td className=''>
                                    <input
                                        type='text'
                                        name='description'
                                        defaultValue={ income.description }
                                        onChange={ (event) => setFormData((form) => ({
                                            ...form,
                                            [event.target.name]: event.target.value
                                        })) }
                                    />
                                </td>
                                <td className=''>
                                    <select

                                        name='type'
                                        defaultValue={ income.type }
                                        onChange={ (event) => setFormData((form) => ({

                                            ...form,
                                            [event.target.name]: event.target.value
                                        })) }
                                    >
                                        <option value='income'>Income</option>
                                        <option value='expense'>Expense</option>
                                    </select>
                                </td>
                                <td className=''>
                                    <input

                                        type='date'
                                        name='due_date'
                                        defaultValue={ format(new Date(income.due_date), 'yyyy-MM-dd') }
                                        onChange={ (event) => setFormData((form) => ({

                                            ...form,
                                            [event.target.name]: event.target.value
                                        })) }
                                    />
                                </td>
                                <td className=''>
                                    <input

                                        type='number'
                                        name='amount'
                                        step={ 0.01 }
                                        defaultValue={ income.amount }
                                        onChange={ (event) => setFormData((form) => ({

                                            ...form,
                                            [event.target.name]: event.target.value
                                        })) }
                                    />
                                </td>
                                <td className=''>
                                    <select

                                        name='frequency'
                                        defaultValue={ income.frequency }
                                        onChange={ (event) => setFormData((form) => ({

                                            ...form,
                                            [event.target.name]: event.target.value
                                        })) }
                                    >
                                        <option value='weekly'>Weekly</option>
                                        <option value='biweekly'>Biweekly</option>
                                        <option value='monthly'>Monthly</option>
                                        <option value='yearly'>Yearly</option>
                                    </select>
                                </td>
                                <td className=''>
                                    <input

                                        type='checkbox'
                                        name='include'
                                        defaultChecked={ income.include }
                                        onChange={ (event) => setFormData((form) => ({
                                            ...form,
                                            [event.target.name]: event.target.checked
                                        })) }
                                    />
                                </td>
                                <td className=''>

                                    <input

                                        type='checkbox'
                                        name='recurring'
                                        defaultChecked={ income.recurring }
                                        onChange={ (event) => setFormData((form) => ({
                                            ...form,
                                            [event.target.name]: event.target.checked
                                        })) }
                                    />
                                </td>


                                <button type='submit'>Submit</button>

                            </tr>
                        )) }




                </tbody>
            </table>

        </>
    )

}