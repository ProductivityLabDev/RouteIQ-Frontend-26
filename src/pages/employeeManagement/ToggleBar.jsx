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

     const items = [
        { title: "Terminal 1" },
        { title: "Terminal 2" },
        { title: "Terminal 3" },
        { title: "Terminal 4" },
        { title: "Corporate" },
    ];

    return (
        <>
            {edit ? <EditTableData handleClose={handleClose} /> :
                <div className="w-full space-y-4">
            {items.map((item, index) => (
                <div key={index} className="w-full bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-2">
                        <div className="flex items-center space-x-3">
                            <button className="text-gray-600 hover:text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <h2 className="font-semibold text-[#202224] text-[18]">{item.title}</h2>

                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={() => setIsOpen(isOpen === index ? null : index)}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M1.27677 15.6698C1.0108 15.6698 0.786288 15.5783 0.603232 15.3954C0.420316 15.2124 0.328857 14.9879 0.328857 14.7219V12.5915C0.328857 12.3394 0.376357 12.0985 0.471357 11.8688C0.566218 11.6392 0.701705 11.4364 0.877816 11.2604L11.3189 0.835222C11.4922 0.672444 11.6846 0.547721 11.8959 0.461055C12.1072 0.374388 12.3289 0.331055 12.5612 0.331055C12.79 0.331055 13.0136 0.374388 13.232 0.461055C13.4502 0.547721 13.6423 0.677722 13.8084 0.851055L15.1684 2.21689C15.3418 2.37967 15.4691 2.57106 15.5505 2.79106C15.6319 3.01092 15.6726 3.23168 15.6726 3.45335C15.6726 3.68557 15.6319 3.90814 15.5505 4.12105C15.4691 4.33411 15.3418 4.5273 15.1684 4.70064L4.74823 15.1208C4.57226 15.297 4.36941 15.4324 4.13969 15.5273C3.91011 15.6223 3.66927 15.6698 3.41719 15.6698H1.27677ZM12.5553 4.61501L13.722 3.45335L12.5503 2.27668L11.3787 3.44335L12.5553 4.61501Z" fill="#1C1B1F"/>
                                </svg>
                            </button>

                            <button
                                className="bg-[#C01824] text-white text-sm px-4 py-1 rounded"
                                onClick={() => setBalanceModal(balanceModal === index ? null : index)}
                            >
                                Payroll In Process
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsOpen(isOpen === index ? null : index)}
                                className="text-[#000000] hover:text-[#000000]"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-6 w-6 transition-transform duration-200 ${isOpen === index ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
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
        </div>
            }
        </>
    );
};

export default ToggleBar;