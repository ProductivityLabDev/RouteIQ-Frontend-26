import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGlCodeHistory } from '@/redux/slices/payrollSlice'
import { EditTrip } from './Modals/EditTrip'

const HistoryLogTable = ({ setAddExpense, setPayModal }) => {
  const dispatch = useDispatch()
  const { glCodeHistory, loading, error } = useSelector((state) => state.payroll)

  const [searchTerm, setSearchTerm] = useState('')
  const [editedModal, setEditedModal] = useState(false)

  useEffect(() => {
    dispatch(fetchGlCodeHistory({ limit: 20, offset: 0 }))
  }, [dispatch])

  const handleSearch = () => {
    dispatch(fetchGlCodeHistory({ search: searchTerm, limit: 20, offset: 0 }))
  }

  const historyList = glCodeHistory?.history || []

  return (
    <div className="w-full overflow-hidden rounded-lg">
      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded px-4 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-[#C01824]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="ml-4 bg-[#C01824] text-white px-5 py-2 rounded hover:bg-[#a9141d] transition"
        >
          Search
        </button>
      </div>

      {loading.glCodeHistory && <p className="text-gray-500 mb-4">Loading...</p>}
      {error.glCodeHistory && <p className="text-red-500 mb-4">{error.glCodeHistory}</p>}

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Vendor Name</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Address</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Phone No</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Payment Method</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Payment Terms</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">GL Codes</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Expenses/Bill</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Amount</th>
          </tr>
        </thead>
        <tbody>
          {historyList.length === 0 && !loading.glCodeHistory ? (
            <tr>
              <td colSpan={8} className="py-6 text-center text-gray-400">No history found</td>
            </tr>
          ) : (
            historyList.map((item, index) => (
              <tr key={item.id ?? index} className="border-t border-gray-200">
                <td className="py-3 px-4">{item.vendorName ?? item.name ?? '-'}</td>
                <td className="py-3 px-4">{item.address ?? '-'}</td>
                <td className="py-3 px-4">{item.phone ?? '-'}</td>
                <td className="py-3 px-4">{item.paymentMethod ?? '-'}</td>
                <td className="py-3 px-4">{item.paymentTerms ?? '-'}</td>
                <td className="py-3 px-4">{item.glCodes ?? item.glCode ?? '-'}</td>
                <td className="py-3 px-4">{item.bill ?? item.expenses ?? '-'}</td>
                <td className="py-3 px-4 flex items-center space-x-2">
                  <span className="text-black font-medium">{item.amount ?? '-'}</span>
                  {item.status && (
                    <span className="text-[#147D2C] py-1 rounded px-3 font-bold bg-[#C2FACE]">
                      {item.status}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination info */}
      {glCodeHistory?.total > 0 && (
        <p className="text-sm text-gray-500 mt-3">
          Showing {historyList.length} of {glCodeHistory.total} records
        </p>
      )}

      {editedModal && (
        <EditTrip handleOpen={() => setEditedModal(false)} open={editedModal} />
      )}
    </div>
  )
}

export default HistoryLogTable
