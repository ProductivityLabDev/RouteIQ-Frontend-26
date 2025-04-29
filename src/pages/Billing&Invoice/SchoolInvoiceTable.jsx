import React from 'react'
import { schoolInoviceData } from '@/data/school-inovice-data'

const SchoolInvoiceTable = ({ handleInvoiceTransport }) => {
    return (
        <div className='bg-white rounded-lg shadow-md p-4 w-[99%] h-[40vh]'>
            <div className="overflow-x-auto mt-4 border border-gray-200 rounded">
                <table className="min-w-full">
                    <thead className="bg-[#EEEEEE]">
                        <tr>
                            <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                Date
                            </th>
                            <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                Institute / Company Name
                            </th>
                            <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                Mode
                            </th>
                            <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                Type
                            </th>
                            <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                Invoice Total
                            </th>
                            <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                Invoice
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {schoolInoviceData.map((Invoices, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                    {Invoices.date}
                                </td>
                                <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                    {Invoices.companyName}
                                </td>
                                <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                    {Invoices.mode}
                                </td>
                                <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                    {Invoices.type}
                                </td>
                                <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                    {Invoices.invoiceTotal}
                                </td>
                                <td className="px-6 py-4 border-b text-[14px] font-[600]">
                                    <button className="text-[#C01824] text-sm mt-1 hover:text-red-800 focus:outline-none self-start" onClick={handleInvoiceTransport}>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SchoolInvoiceTable
