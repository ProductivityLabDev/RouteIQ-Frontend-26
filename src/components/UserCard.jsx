
import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";


const UserCard = ({ username, password, handleOpenDeleteModal }) => (
    <div className="bg-white rounded border border-[#e7e4db] w-full flex items-center justify-between px-5 py-4 shadow-sm mb-4">
        <div>
            <div className="flex items-center mb-1">
                <span className="text-sm font-normal text-[#222] mr-2">Username:</span>
                <span className="text-sm text-[#222]">{username}</span>
            </div>
            <div className="flex items-center">
                <span className="text-sm font-normal text-[#222] mr-3">Password:</span>
                <span className="text-sm text-[#222] tracking-widest">{password}</span>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <button className="flex items-center gap-1 text-[#171717] hover:text-[#333] text-sm font-normal">
                <FaRegEdit size={18} className="inline-block" color={'#000'} />
                <span className="ml-1">Edit</span>
            </button>
            <button className="flex items-center gap-1 text-[#171717] hover:text-[#ea384c] text-sm font-normal" onClick={handleOpenDeleteModal}>
                <RiDeleteBin6Line size={18} className="inline-block" color={'#000'} />
                <span className="ml-1">Delete</span>
            </button>
        </div>
    </div>
);

export default UserCard;