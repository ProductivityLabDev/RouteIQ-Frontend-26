import React, { useState } from 'react';
import { FiTrash, FiPlus } from 'react-icons/fi';

const EditInvoiceForm = ({ batchInvoice, }) => {
    const [lineItems, setLineItems] = useState([
        { id: 1, item: "SSD 402", price: "$205", qty: "504m", total: "$2561000" }
    ]);
    const [headers, setHeaders] = useState([]);

    const handleAddMoreHeader = () => {
        setHeaders(prev => [...prev, prev.length]);
    };
    const handleAddItem = () => {
        const newItem = {
            id: lineItems.length + 1,
            item: "SSD 402",
            price: "$205",
            qty: "504m",
            total: "$2561000"
        };
        setLineItems([...lineItems, newItem]);
    };

    const handleRemoveItem = (id) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };
    return (
        <div className='p-4'>
            {headers.map((_, index) => (
                <div key={index} className="w-full bg-white border-b border-gray-200 shadow-sm mb-4">
                    <div className="flex items-center justify-between px-4 py-2">
                        <div className="flex items-center space-x-3">
                            <button className="text-gray-600 hover:text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h2 className="font-medium text-gray-800 text-lg">Terminal {index + 1}</h2>
                            <button className="text-gray-600 hover:text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="text-gray-600 hover:text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <div className="mx-auto bg-white p-6 rounded shadow-sm border border-gray-200">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-[#333843] text-[23px]">{batchInvoice ? "Trip 1 Invoice" : "Invoice # 12501"}</h2>
                    <div className="text-right">
                        <div className="text-[16] text-[#667085] font-medium">Date</div>
                        <h2 className='text-[20px] font-bold text-[#333843]'>25-10-2024</h2>
                    </div>
                </div>

                <hr className="border-t border-[#C2C2C2] my-4" />

                {/* Top Form Fields */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-[14] mb-1 text-[#333843] font-bold">GL Code</label>
                        <input type="text" className="w-full outline-none border border-[#C1C1C1] rounded p-2" />
                    </div>

                    <div>
                        <label className="block text-[14] text-[#333843] font-bold mb-1">Bill From</label>
                        <input type="text" className="w-full outline-none border border-[#C1C1C1] rounded p-2" />
                    </div>

                    <div>
                        <label className="block text-[14] text-[#333843] font-bold mb-1">Bill To</label>
                        <input type="text" className="w-full outline-none border border-[#C1C1C1] rounded p-2" />
                    </div>
                    {!batchInvoice && (
                        <>
                            <div>
                                <label className="block text-[14] text-[#333843] font-bold mb-1">Type</label>
                                <input type="text" className="w-full outline-none border border-[#C1C1C1] rounded p-2" />
                            </div>

                            <div className="relative">
                                <label className="block text-[14] text-[#333843] font-bold mb-1">No of Buses</label>
                                <input type="text" className="w-full outline-none border border-[#C1C1C1] rounded p-2" />
                            </div>
                            <button className=" right-0 top-7 text-[#C01824] mr-2">
                                <FiPlus size={20} />
                            </button>
                        </>
                    )}
                </div>

                <hr className="border-t border-[#C2C2C2] my-4" />

                {/* Line Items Table */}
                <div className="mb-6">
                    <div className="w-full bg-white rounded border border-gray-200 overflow-hidden">
                        {/* Header Row */}
                        <div className="grid grid-cols-6 gap-2 bg-[#EEEEEE] p-4">
                            <div className="font-bold text-[#141516] text-[14]">S. No</div>
                            <div className="font-bold text-[#141516] text-[14]">GL Code</div>
                            <div className="font-bold text-[#141516] text-[14]">Unit Price</div>
                            <div className="font-bold text-[#141516] text-[14]">Mileage</div>
                            <div className="font-bold text-[#141516] text-[14]">Total Cost</div>
                            <div className="font-bold text-[#141516] text-[14] flex items-center justify-center">Action</div>
                        </div>


                        {lineItems.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-6 gap-2 p-2 items-center">
                                <div>
                                    <input
                                        type="text"
                                        value={index + 1}
                                        readOnly
                                        className="w-full outline-none border border-gray-300 rounded p-2 text-center"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={item.item}
                                        className="w-full outline-none border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={item.price}
                                        className="w-full outline-none border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={item.qty}
                                        className="w-full outline-none border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={item.total}
                                        className="w-full outline-none border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div className="flex justify-center items-center">
                                    <button onClick={() => handleRemoveItem(item.id)}>
                                        <FiTrash color="#C01824" size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {batchInvoice && (
                            <div className="flex justify-end mb-4 w-[95%]">
                                <button className="bg-[#C01824] text-white px-4 py-2 rounded" onClick={handleAddItem}>
                                    Add Item
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Item Button */}
                {!batchInvoice && (
                    <div className="flex justify-end mb-6">
                        <button className="bg-[#C01824] text-white px-4 py-2 rounded" onClick={handleAddItem}>
                            Add Item
                        </button>
                    </div>
                )}

                {/* Totals Section */}
                <div className="flex justify-end">
                    <div className="w-1/2">
                        <div className="flex justify-end gap-1 items-center mb-2">
                            <div className="font-bold text-[#141516] text-[18]">Total:</div>
                            <div className="flex items-center">
                                <span className="mr-2">$</span>
                                <input type="text" value="2561000" className="outline-none border border-gray-300 rounded p-1 w-24" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-1 items-center mb-2">
                            <div className="font-bold text-[#141516] text-[18]">Total Tax<span className="text-xs">(6%)</span>:</div>
                            <div className="flex items-center">
                                <span className="mr-2">$</span>
                                <input type="text" value="100" className="outline-none border border-gray-300 rounded p-1 w-24" />
                            </div>
                        </div>

                        <div className="left-1/2 right-1/2 -ml-[35vw]">
                            <hr className="border-t border-gray my-4" />
                        </div>

                        <div className="flex justify-end gap-1 items-center">
                            <div className="font-bold text-[#141516] text-[18]">Grand Total:</div>
                            <div className="flex items-center">
                                <span className="mr-2 text-[#141516] text-[18] font-medium">$ 5200000</span>
                            </div>
                        </div>
                        {batchInvoice && (
                            <div className="flex justify-end mt-4 w-[95%]">
                                <button className="bg-[#C01824] text-white px-4 py-2 rounded" onClick={handleAddMoreHeader}>
                                    Add More
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditInvoiceForm;