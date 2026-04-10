import React, { useEffect } from 'react'
import { Button, ButtonGroup } from '@material-tailwind/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSchoolInvoices } from '@/redux/slices/schoolInvoicesSlice'

const Invoices = () => {
    const dispatch = useDispatch();
    const { invoices: invoicesState, loading } = useSelector((s) => s.schoolInvoices);
    const invoices = Array.isArray(invoicesState?.data) ? invoicesState.data : Array.isArray(invoicesState) ? invoicesState : [];

    useEffect(() => {
        dispatch(fetchSchoolInvoices({ limit: 20, offset: 0 }));
    }, [dispatch]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '--';
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatAmount = (amount) => {
        if (amount == null) return '--';
        return `$${Number(amount).toFixed(2)}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-[50%] lg:w-[50%] xl:w-[50%] h-[100%]">
            {/* Header */}
            <div className="flex justify-between items-center pb-2">
                <h2 className="text-[22px] lg:text-[26px] xl:text-[14px] font-bold text-black">Invoices</h2>
                <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text">
                    <Button className="bg-[#C01824] hover:bg-[#C01824]/80 text-white px-4 lg:px-6 py-2 lg:py-3 lg:text-[14px] capitalize font-bold">
                        School Invoices
                    </Button>
                </ButtonGroup>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4 border border-gray-200 rounded h-[40vh] lg:h-[38vh]">
                <table className="min-w-full text-[10px] md:text-[12px]">
                    <thead className="bg-[#EEEEEE]">
                        <tr>
                            <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[14px] font-bold text-black">Date</th>
                            <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[14px] font-bold text-black">Description</th>
                            <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[14px] font-bold text-black">Invoice Total</th>
                            <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[14px] font-bold text-black">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading.invoices ? (
                            <tr>
                                <td colSpan={4} className="text-center py-6 text-gray-400 text-sm">Loading...</td>
                            </tr>
                        ) : invoices.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-6 text-gray-400 text-sm">No invoices found.</td>
                            </tr>
                        ) : (
                            invoices.map((invoice, index) => (
                                <tr key={invoice.id ?? index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-[14px] font-bold text-[#141516]">
                                        {formatDate(invoice.invoiceDate ?? invoice.createdAt ?? invoice.date)}
                                    </td>
                                    <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-[14px] font-bold text-[#141516]">
                                        {invoice.description ?? invoice.invoiceType ?? invoice.instituteName ?? '--'}
                                    </td>
                                    <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-[14px] font-bold text-[#141516]">
                                        {formatAmount(invoice.totalAmount ?? invoice.amount ?? invoice.invoiceTotal)}
                                    </td>
                                    <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-[14px] font-bold">
                                        <div className="flex flex-col items-start">
                                            <span className="text-black font-bold">{invoice.status ?? '--'}</span>
                                            <button className="text-[#C01824] text-[10px] md:text-[12px] mt-1 hover:text-red-800 focus:outline-none">
                                                View invoice
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Invoices;
