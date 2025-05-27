import { pickFileIcon } from '@/assets';
import React, { useState } from 'react'

const AddDriver = ({ handleCancel }) => {
    const [formData, setFormData] = useState({});

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white w-full rounded-lg">
            <form className="w-full">
                <div className="flex flex-row w-full gap-6 p-6">
                    {/* First column */}
                    <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-black mb-1">Name</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Zip</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Date</label>
                        <input
                            type="date"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] w-full py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Email</label>
                        <input
                            type="email"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Rate changes</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Cycle</label>
                        <div className="relative">
                            <select className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-full">
                                <option>Select</option>
                                <option>Weekly</option>
                                <option>Bi-weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                    </div>

                    {/* Second column */}
                    <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-black mb-1">Address</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">State</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Status</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Grade</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Terminal Assigned To</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Type</label>
                        <div className="relative">
                            <select className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-full">
                                <option>Select</option>
                                <option>Hourly</option>
                                <option>Salary</option>
                                <option>Commission</option>
                            </select>
                        </div>
                    </div>

                    {/* Third column */}
                    <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-black mb-1">City</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            className="outline-none border border-[#D5D5D5] w-full rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Type</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Rate</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Fuel Card Code</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />
                    </div>
                </div>

                {/* File upload section */}
                <div className="mt-6 border border-dashed border-[#EBB7BB] rounded-lg p-6 text-center m-6 w-full h-32 flex flex-row gap-3 items-center justify-center">
                    <div className="flex justify-center">
                        <img src={pickFileIcon} className="w-10 h-10" />
                    </div>
                    <p className="mt-1 text-sm text-red-600">Drag and Drop Files</p>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-start space-x-4 p-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-8 py-2 border border-[#C01824] w-[45%] text-red-600 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleCancel}
                        className="px-8 py-2 bg-[#C01824] w-[45%] text-white rounded hover:bg-red-700"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDriver