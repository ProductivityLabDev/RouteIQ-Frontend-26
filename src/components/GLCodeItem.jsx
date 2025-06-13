import React from 'react'
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { FaAngleDoubleRight } from "react-icons/fa";

export const GLCodeItem = ({ glCode, assignTo }) => (
    <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
        <div className="w-full sm:w-[45%] relative bg-[#F5F6FA] rounded-md">
            <select className="w-full p-3 bg-transparent appearance-none outline-none">
                <option>{glCode}</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray" />
        </div>
        <div className='flex flex-row '>
            <FaAngleDoubleRight size={20}/>
        </div>
        <div className="w-full sm:w-[45%] relative bg-[#F5F6FA] rounded-md">
            <select className="w-full p-3 bg-transparent appearance-none outline-none">
                <option>{assignTo}</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray" />
        </div>
    </div>
);