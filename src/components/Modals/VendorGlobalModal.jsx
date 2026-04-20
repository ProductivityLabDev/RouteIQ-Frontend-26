import React from 'react';
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";

const VendorGlobalModal = ({
    isOpen,
    onClose,
    title,
    children,
    contentClassName = "",
    primaryButtonText,
    secondaryButtonText,
    onPrimaryAction,
    onSecondaryAction
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 z-[1101] flex items-center justify-center px-4"
            overlayClassName="fixed inset-0 z-[1100] bg-black bg-opacity-40"
            ariaHideApp={false}
        >
            <div className={`relative z-[1102] bg-white rounded-md p-6 shadow-lg w-[35%] mx-auto ${contentClassName}`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                >
                    <IoMdClose size={20} className='text-[#000000]'/>
                </button>

                <h2 className="text-2xl font-bold text-[#202224] mb-6">{title}</h2>

                <div className="mb-6">
                    {children}
                </div>
                
                <div className='flex justify-end items-end'>
                    {(primaryButtonText || secondaryButtonText) && (
                        <div className="flex w-[25%] justify-end gap-4 mt-6">
                            {secondaryButtonText && (
                                <button
                                    onClick={onSecondaryAction || onClose}
                                    className="px-6 py-2 border border-[#C01824] bg-transparent font-bold text-[#C01824] rounded  w-full"
                                >
                                    {secondaryButtonText}
                                </button>
                            )}
                            {primaryButtonText && (
                                <button
                                    onClick={onPrimaryAction}
                                    className="px-6 py-2 bg-[#C01824] text-white rounded hover:bg-[#C01824] w-full"
                                >
                                    {primaryButtonText}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default VendorGlobalModal;
