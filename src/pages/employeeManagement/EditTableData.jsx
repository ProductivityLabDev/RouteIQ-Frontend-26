import React, { useState } from 'react'

const EditTableData = ({ handleClose }) => {
    const [formData, setFormData] = useState({});

    return (
        <>
       <h3 className="text-[24px] font-bold text-[#2C2F32] mt-4 mb-4 w-[100%]">Edit</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white w-full rounded-lg">
            <form className="w-full">
                
                <div className="flex flex-row w-full gap-6 p-6">
                    {/* First column */}
                    <div className="w-full space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Title</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6  bg-[#F5F6FA]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Pay Cycle</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Federal Tax</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">SSN</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]" />
                        </div>
                    </div>

                    {/* Second column */}
                    <div className="w-full space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Name</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Pay Type</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">State Tax</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">YTD</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]" />
                        </div>
                    </div>

                    {/* Third column */}
                    <div className="w-full space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Work Hours</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6  bg-[#F5F6FA]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Job Type</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6  bg-[#F5F6FA]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Local Tax</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6  bg-[#F5F6FA]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Holiday Pay</label>
                            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6  bg-[#F5F6FA]" />
                        </div>
                    </div>
                </div>

                {/* Single Row Below Columns */}
                <div className="px-6">
                    <label className="block text-sm font-medium text-black mb-1">Allowances</label>
                    <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 w-full bg-[#F5F6FA]" />
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-start space-x-4 p-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-8 py-2 border border-[#C01824] w-[45%] text-red-600 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleClose}
                        className="px-8 py-2 bg-[#C01824] w-[45%] text-white rounded hover:bg-red-700"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};

export default EditTableData