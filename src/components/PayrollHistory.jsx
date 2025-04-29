import { moneyBag } from '@/assets';
import { payrollData } from '@/data/dummyData';
import { useState } from 'react';

const PayrollHistory = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Payroll History</h2>
                <a href="#" className="text-blue-500 text-sm font-medium">See All</a>
            </div>

            <div className="rounded-md">
                <div className="grid grid-cols-3 py-3 px-4 border-b bg-[#F5F5F5] border-gray-200">
                    <div className="text-sm font-medium text-gray-600">Date</div>
                    <div className="text-sm font-medium text-gray-600">Amount</div>
                    <div className="text-sm font-medium text-gray-600">Status</div>
                </div>

                {payrollData.map((item) => (
                    <div key={item.id} className="grid grid-cols-3 py-3 px-4">
                        <div className="text-sm text-gray-800">{item.date}</div>
                        <div className="text-sm text-gray-800">{item.amount}</div>
                        <div>
                            <button onClick={() => setSelectedImage(item.invoiceImage)} className="flex items-center text-sm text-[#C01824] text-bold bg-white border border-gray-200 rounded-md px-3 py-1">
                                <img src={moneyBag} />
                                <span>View Pay Stub</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setSelectedImage(null)}>
                    <div className="bg-white p-4 rounded-lg max-w-xl w-full relative">
                        <img src={selectedImage} alt="Invoice Slip" className="w-full h-auto rounded-md" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayrollHistory;