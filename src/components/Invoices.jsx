import React, { useState } from 'react'
import { VerticalDot } from '@/assets'
import { Button, ButtonGroup } from '@material-tailwind/react'

const Invoices = () => {
    const [selectedTab, setSelectedTab] = useState('School Invoices');
    const Invoices = [
        { date: 'May 28, 2024', desc: 'Business Subscription', invoiceTotal: '$30.00', status: 'Paid' },
        { date: 'Apr 28, 2024', desc: 'Business Subscription', invoiceTotal: '$30.00', status: 'Paid' },
        { date: 'Mar 28, 2024', desc: 'Business Subscription', invoiceTotal: '$30.00', status: 'Paid' },
    ];
    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-[50%] lg:w-[50%] xl:w-[50%] h-[100%]">
            {/* ---------------- Header of Card --------------- */}
            <div className="flex justify-between items-center pb-2">
                <h2 className="text-[22px] lg:text-[26px] xl:text-[14px] font-bold text-black">Invoices</h2>
                <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" >
                    {['Subscription', 'School Invoices', 'Driver invoices'].map(tab => (
                        <Button
                            key={tab}
                            className={
                                selectedTab === tab
                                    ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-4 lg:px-6 py-2 lg:py-3 lg:text-[14px] capitalize font-bold'
                                    : 'bg-white px-4 lg:px-6 py-2 lg:py-3 capitalize font-bold'
                            }
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>

            {/* ------------ Content -------------------- */}
            <div className="overflow-x-auto mt-4 border border-gray-200 rounded h-[40vh] lg:h-[38vh]">
                <table className="min-w-full text-[10px] md:text-[12px]">
                    <thead className="bg-[#EEEEEE]">
                        <tr>
                            <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[14px] md:text-[12px] lg:text-[14px] font-bold text-black">
                                Date
                            </th>
                            <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[14px] md:text-[12px] lg:text-[14px] font-bold text-black">
                                Description
                            </th>
                            <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[14px] md:text-[12px] lg:text-[14px] font-bold text-black">
                                Invoice Total
                            </th>
                            <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[14px] md:text-[12px] lg:text-[14px] font-bold text-black">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Invoices.map((invoice, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-[14px] md:text-[14px] font-bold text-[#141516]">
                                    {invoice.date}
                                </td>
                                <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-[14px] md:text-[14px] font-bold text-[#141516]">
                                    {invoice.desc}
                                </td>
                                <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-[14px] md:text-[14px] font-bold text-[#141516]">
                                    {invoice.invoiceTotal}
                                </td>
                                <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-[14px] md:text-[14px] font-bold">
                                    <div className="flex flex-col items-center w-[35]">
                                        <span className="text-black font-bold self-start">Paid</span>
                                        <button className="text-[#C01824] text-[10px] md:text-[12px] mt-1 hover:text-red-800 focus:outline-none self-start">
                                            View invoice
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Invoices
