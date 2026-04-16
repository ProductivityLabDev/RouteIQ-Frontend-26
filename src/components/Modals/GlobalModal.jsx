import React, { useState } from "react";
import Modal from "react-modal";
import { IoMdClose, IoMdSend } from "react-icons/io";
import colors from "@/utlis/Colors";


const GlobalModal = ({ isOpen, onClose, title, btnClose }) => {
    const [email, setEmail] = useState("");

    const handleSubmit = () => {
        if (typeof btnClose === "function") {
            btnClose(email);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 z-[1001] flex items-center justify-center px-4"
            overlayClassName="fixed inset-0 z-[1000] bg-black/40"
            ariaHideApp={false}
        >
            <div className="relative flex w-full max-w-[680px] flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg md:p-8">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    <IoMdClose size={24} />
                </button>

                {/* Header */}
                <h2 className="text-center text-2xl font-bold md:text-[2rem]" style={{ color: colors?.redColor }}>{title}</h2>

                {/* Input Section */}
                <div className="mt-4 flex w-full max-w-[420px] items-center overflow-hidden rounded-lg border border-gray-400">
                    <input
                        type="email"
                        placeholder="Enter email"
                        className="w-full p-3 outline-none text-gray-700"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <button style={{ backgroundColor: colors?.redColor }} onClick={handleSubmit} className="flex items-center p-4 text-white">
                        <IoMdSend size={20} />
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default GlobalModal;
