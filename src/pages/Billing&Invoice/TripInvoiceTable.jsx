import React, { useState } from 'react'
import { tripInvoiceData } from '@/data/TripInvoiceTable'

const TripInvoiceTable = ({ handleInvoiceTransport }) => {
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

    const handleSelectAll = () => {
        if (allChecked) {
            setCheckedItems([]);
        } else {
            setCheckedItems(tripInvoiceData?.map((_, index) => index));
        }
        setAllChecked(!allChecked);
    };

    const handleSelectItem = (index) => {
        if (checkedItems.includes(index)) {
            setCheckedItems(checkedItems.filter(item => item !== index));
        } else {
            setCheckedItems([...checkedItems, index]);
        }
    };
    return (
        <div className='bg-white rounded-lg shadow-md p-4 w-[99%] h-[40vh]'>
            <div className="overflow-x-auto mt-4 border border-gray-200 rounded">
                <table className="min-w-full">
                    <thead className="bg-[#EEEEEE]">
                        <tr>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                                <input type="checkbox" className="form-checkbox custom-checkbox2" checked={allChecked} onChange={handleSelectAll} />
                            </th>
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
                        {tripInvoiceData.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 border-b">
                                    <input type="checkbox" className="form-checkbox custom-checkbox2"
                                        checked={checkedItems.includes(index)}
                                        onChange={() => handleSelectItem(index)} />
                                </td>
                                <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                    {item?.date}
                                </td>
                                <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                    {item?.kmPerRate}
                                </td>
                                <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                    {item?.mode}
                                </td>
                                <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                    {item?.mileage}
                                </td>
                                <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                    {item?.invoiceTotal}
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

export default TripInvoiceTable
