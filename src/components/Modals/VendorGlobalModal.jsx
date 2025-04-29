import React from 'react';
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";

const VendorGlobalModal = ({
    isOpen,
    onClose,
    title,
    children,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryAction,
    onSecondaryAction
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-40"
            ariaHideApp={false}
        >
            <div className="bg-white rounded-md p-6 shadow-lg relative w-[50%] mx-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                >
                    <IoMdClose size={20} />
                </button>

                <h2 className="text-2xl font-medium text-gray-800 mb-6">{title}</h2>

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