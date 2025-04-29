import { pickFileIcon } from '@/assets';
import React, { useState } from 'react'

const EditDriver = ({ handleCancel }) => {
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
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Zip</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Date</label>
                        <input
                            type="date"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] w-full py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Email</label>
                        <input
                            type="email"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Rate changes</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Cycle</label>
                        <div className="relative">
                            <select className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] w-full">
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
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">State</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Status</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Grade</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Terminal Assigned To</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Type</label>
                        <div className="relative">
                            <select className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] w-full">
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
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            className="outline-none border border-[#D5D5D5] w-full rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Type</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Rate</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Fuel Card Code</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>
                </div>
                <div className='w-full mt-6 flex flex-col gap-5 p-6'>
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 
                      border border-gray-200 rounded-md">
                        <span className="text-gray-700 text-sm">Image.jpg</span>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 
                      border border-gray-200 rounded-md">
                        <span className="text-gray-700 text-sm">Document.pdf</span>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 
                      border border-gray-200 rounded-md">
                        <span className="text-gray-700 text-sm">License.pdf</span>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
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

export default EditDriver