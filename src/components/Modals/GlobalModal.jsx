import React from "react";
import Modal from "react-modal";
import { IoMdClose, IoMdSend } from "react-icons/io";
import colors from "@/utlis/Colors";


const GlobalModal = ({ isOpen, onClose, title, btnClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-40"
        >
            <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center w-[35%] h-[25%] shadow-lg relative">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    <IoMdClose size={24} />
                </button>

                {/* Header */}
                <h2 className="text-center text-2xl font-bold" style={{ color: colors?.redColor, fontSize: '2rem' }}>{title}</h2>

                {/* Input Section */}
                <div className="mt-4 flex items-center border w-[65%] border-gray-400 rounded-lg overflow-hidden">
                    <input
                        type="email"
                        placeholder="Enter email"
                        className="w-full p-3 outline-none text-gray-700"
                        onClick={btnClose}
                    />
                    <button style={{ backgroundColor: colors?.redColor }} onClick={btnClose} className="text-white p-4 flex items-center">
                        <IoMdSend size={20} />
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default GlobalModal;