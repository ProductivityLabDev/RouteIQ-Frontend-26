import React, { useState } from "react";
import {
    Button,
} from "@material-tailwind/react";
const CreateAccessCard = ({ setCreateAccess }) => {
    const [forms, setForms] = useState([Date.now()]);
    const handleAddForm = () => {
        setForms((prev) => [...prev, Date.now()]);
    };
    return (
        <>
        <h2 className="text=[#202224] text-[32px] font-bold mt-4 mb-4 font-[Nunito Sans]">Create Access</h2>
        <div className="bg-white rounded-lg shadow-sm p-6 w-full h-full max-h-[700px] overflow-y-auto">
            {/* Form Header */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                    <div className="relative">
                        <select className="rounded-md p-3 w-full outline-none appearance-none text-gray border border-[#D5D5D5] bg-[#F5F6FA]">
                            <option value="">Fleet manager</option>
                            <option value="">Terminal manager</option>
                            <option value="">Reginal manager</option>
                            <option value="">IT</option>
                            <option value="">Accountant</option>
                            <option value="">Mechanic</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="outline-none border w-full border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                    />
                </div>
            </div>

            {forms.map((formId) => (
                <div key={formId} className="bg-[#F5F6FA] border border-[#D5D5D5] rounded-lg p-6 mb-6">
                    {/* Department Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-black mb-3">Select Department</label>
                        <div className="grid grid-cols-4 gap-4">
                            {["Vehicle", "Employee", "School", "Route", "Tracking", "Scheduling", "Chats", "Accounting"].map(
                                (dept) => (
                                    <div key={dept} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`dept-${formId}-${dept}`}
                                            name={`department-${formId}`}
                                            className="w-4 h-4 accent-red-600 border-gray-300"
                                        />
                                        <label htmlFor={`dept-${formId}-${dept}`} className="ml-2 text-sm text-black">
                                            {dept}
                                        </label>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Terminal Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-black mb-3">Select Terminal</label>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <div key={num} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`terminal-${formId}-${num}`}
                                        name={`terminal-${formId}`}
                                        className="w-4 h-4 accent-red-600 border-gray-300"
                                    />
                                    <label htmlFor={`terminal-${formId}-${num}`} className="ml-2 text-sm text-black">
                                        Terminal {num}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Control Selection */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-3">Control</label>
                        <div className="flex gap-6">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id={`read-only-${formId}`}
                                    name={`control-${formId}`}
                                    className="w-4 h-4 accent-red-600 border-gray-300"
                                />
                                <label htmlFor={`read-only-${formId}`} className="ml-2 text-sm text-black">
                                    Read Only
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id={`read-write-${formId}`}
                                    name={`control-${formId}`}
                                   className="w-4 h-4 accent-red-600 border-gray-300"
                                />
                                <label htmlFor={`read-write-${formId}`} className="ml-2 text-sm text-black">
                                    Read & Write
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Add Button - Right Aligned */}
            <div className="flex justify-end mb-6">
                <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                    variant='filled' size='lg' onClick={handleAddForm}>
                    Add
                </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    className="border border-[#C01824] bg-white text-[#C01824] px-12 py-2 rounded-[4px]"
                    onClick={() => setCreateAccess(false)}
                >
                    Cancel
                </button>
                <Button className='bg-[#C01824] px-12 py-2 capitalize text-sm md:text-[16px] font-normal flex items-center'
                    variant='filled' onClick={() => setCreateAccess(false)}>
                    Save
                </Button>
            </div>
        </div>
        </>
    );
};

export default CreateAccessCard;