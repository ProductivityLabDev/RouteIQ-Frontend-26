import React from 'react';
import { Button } from '@material-tailwind/react';
const DeleteUserModal = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-gray-500"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <h2 className="text-center text-3xl font-medium text-red-600 mb-6">Delete User</h2>

                <p className="text-center text-2xl font-medium text-gray-800 mb-8">
                    Are you sure you want to delete?
                </p>

                <div className="flex justify-center space-x-4">
                    <Button
                        className="border border-[#C01824] bg-white text-[#C01824] px-12 py-2 rounded-[4px]"
                        onClick={onClose}
                    >
                        No, Cancel
                    </Button>
                    <Button className='bg-[#C01824] px-12 py-2 capitalize text-sm md:text-[16px] font-normal flex items-center'
                        variant='filled' onClick={onClose}>
                        Yes, Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;