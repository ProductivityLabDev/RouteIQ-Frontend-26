
import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiEditBoxFill } from "react-icons/ri";



const UserCard = ({ username, password, handleOpenDeleteModal }) => (
    <div className="bg-white rounded border border-[#e7e4db] w-full flex items-center justify-between px-5 py-4 shadow-sm mb-4">
        <div>
            <div className="flex items-center mb-1">
                <span className="text-[18] font-semibold text-[#202224] mr-2">Username:</span>
                <span className="text-[18] font-semibold text-[#202224]">{username}</span>
            </div>
            <div className="flex items-center">
                <span className="text-[18] font-semibold text-[#202224] mr-3">Password:</span>
                <span className="text-[18] font-semibold text-[#202224] tracking-widest">{password}</span>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <button className="flex items-center gap-1 text-[#171717] hover:text-[#333] text-sm font-normal">
                <RiEditBoxFill size={24} className="inline-block" color={'#000'}/>
                <span className="ml-1 text-[18px] text-[#202224] font-semibold">Edit</span>
            </button>
            <button className="flex items-center gap-1 text-[#171717] hover:text-[#ea384c] text-sm font-normal" onClick={handleOpenDeleteModal}>
                <RiDeleteBin6Line size={24} className="inline-block" color={'#000'} />
                <span className="ml-1 text-[18px] text-[#202224] font-semibold">Delete</span>
            </button>
        </div>
    </div>
);

export default UserCard;