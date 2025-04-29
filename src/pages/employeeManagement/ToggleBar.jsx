import BalanceModal from '@/components/Modals/BalanceModal';
import React, { useState } from 'react';
import DriverTable from './DriverTable';
import EditTableData from './EditTableData';

const ToggleBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [balanceModal, setBalanceModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const handleEdit = () => {
        setEdit(true);
        setActiveDropdown(null);
    }
    const handleClose = () => {
        setEdit(false);
    }
    return (
        <>
            {edit ? <EditTableData handleClose={handleClose} /> :
                <div className="w-full space-y-4">
                    {[...Array(4)].map((_, index) => (
                        <div className="w-full bg-white border-b border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between px-4 py-2">
                                <div className="flex items-center space-x-3">
                                    <button className="text-gray-600 hover:text-gray-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <h2 className="font-medium text-gray-800 text-lg">Terminal 1</h2>
                                    <button className="text-gray-600 hover:text-gray-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button
                                        className="bg-[#C01824] text-white text-sm px-4 py-1 rounded"
                                        onClick={() => setBalanceModal(index === balanceModal ? null : index)}
                                    >
                                        Payroll In Process
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4">

                                    <button
                                        onClick={() => setIsOpen(index === isOpen ? null : index)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-6 w-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {isOpen === index && (
                                <div className="w-full bg-white border-t border-gray-200 shadow-sm">
                                    <DriverTable handleEdit={handleEdit} />
                                </div>
                            )}
                            {balanceModal === index && (
                                <BalanceModal setBalanceModal={setBalanceModal} />
                            )}
                        </div>
                    ))}
                </div >
            }
        </>
    );
};

export default ToggleBar;