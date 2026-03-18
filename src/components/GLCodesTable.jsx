import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaEllipsisVertical } from "react-icons/fa6"
import { FaRegTrashAlt } from "react-icons/fa"
import { fetchExpenses, deleteExpense } from '@/redux/slices/accountsPayableSlice'
import { EditTrip } from './Modals/EditTrip'

const GLCodesTable = ({ setAddExpense, setPayModal }) => {
    const dispatch = useDispatch()
    const { expenses, loading, error } = useSelector((state) => state.accountsPayable)

    const [modalPosition, setModalPosition] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editedModal, setEditedModal] = useState(false)
    const [activeId, setActiveId] = useState(null)

    useEffect(() => {
        dispatch(fetchExpenses({ source: 'All', limit: 20, offset: 0 }))
    }, [dispatch])

    const handleEllipsisClick = (event, id) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setModalPosition({ top: rect.top + window.scrollY + 30, left: rect.left + window.scrollX - 140 })
        setActiveId(id)
        setIsModalOpen(true)
    }

    const handleDelete = (id) => {
        dispatch(deleteExpense(id))
        setIsModalOpen(false)
    }

    const expenseList = expenses?.data || []

    return (
        <div className="w-full overflow-hidden rounded-lg">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Vendor Name</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Expense Type</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Source</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Payment Method</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Expense Date</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Due Date</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Amount</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Status</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading.expenses && (
                        <tr><td colSpan={8} className="py-6 text-center text-gray-400">Loading...</td></tr>
                    )}
                    {error.expenses && (
                        <tr><td colSpan={8} className="py-6 text-center text-red-500">{error.expenses}</td></tr>
                    )}
                    {!loading.expenses && expenseList.length === 0 && (
                        <tr><td colSpan={8} className="py-6 text-center text-gray-400">No expenses found</td></tr>
                    )}
                    {expenseList.map((expense) => (
                        <tr key={expense.id} className="border-t border-gray-200">
                            <td className="py-3 px-4">{expense.vendorUsername ?? '-'}</td>
                            <td className="py-3 px-4">{expense.expenseType ?? '-'}</td>
                            <td className="py-3 px-4">{expense.source ?? '-'}</td>
                            <td className="py-3 px-4">{expense.paymentMethod ?? '-'}</td>
                            <td className="py-3 px-4">{expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : '-'}</td>
                            <td className="py-3 px-4">{expense.dueDate ? new Date(expense.dueDate).toLocaleDateString() : '-'}</td>
                            <td className="py-3 px-4 font-semibold">${expense.amount ?? '-'}</td>
                            <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    expense.status === 'Paid'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {expense.status ?? 'Pending'}
                                </span>
                            </td>
                            <td className="py-3 px-4 flex items-center space-x-2">
                                <button
                                    className="px-4 py-1 rounded text-white font-medium bg-[#C01824]"
                                    onClick={() => setPayModal(expense.id)}
                                >
                                    PAY
                                </button>
                                <button onClick={(e) => handleEllipsisClick(e, expense.id)}>
                                    <FaEllipsisVertical size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && modalPosition && (
                <div
                    className="fixed w-40 bg-white border rounded shadow-lg z-50 text-left"
                    style={{ top: modalPosition.top, left: modalPosition.left }}
                >
                    <ul className="py-2">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => { setAddExpense(true); setIsModalOpen(false) }}
                        >
                            Edit
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                            onClick={() => handleDelete(activeId)}
                        >
                            Delete
                        </li>
                    </ul>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsModalOpen(false)} />
            )}

            {editedModal && (
                <EditTrip handleOpen={() => setEditedModal(false)} open={editedModal} />
            )}
        </div>
    )
}

export default GLCodesTable
