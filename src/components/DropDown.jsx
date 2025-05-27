import { Button } from '@material-tailwind/react';
import React, { useState } from 'react';
import { FaBars, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { PiPencilSimpleFill } from "react-icons/pi";


export const DropdownItem = ({ title, children, isOpen, onToggle, icon, isSchool = false, }) => {
    return (
        <div className="mb-2">
            <button
                onClick={onToggle}
                className={`w-full h-[6vh] flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none ${isOpen ? 'rounded-b-none' : ''}`}
            >
                <span className="flex items-center text-[#202224] font-[600]">
                    {icon && <img src={icon} alt="" className="w-6 h-6 mr-2" />}
                    <FaBars className="mr-2" />
                    {title}
                </span>
                 <PiPencilSimpleFill className="ml-2" size={18} color='#1C1B1F'/>
                {isSchool ? (
                    isOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />
                ) : (
                    isOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />
                )}
            </button>
            {isOpen && (
                <div className="bg-white border border-t-0 border-gray-300 rounded-b-md p-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export const SchoolDetails = ({ school, handleEditInstitutePopUp }) => (
    <div>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className='gap-6 flex flex-col'>
                <p className='gap-11 flex'><strong>President:</strong> {school.president}</p>
                <p className='gap-12 flex'><strong>Principle:</strong> {school.principle}</p>
                <p className='gap-6 flex'><strong>Total Students:</strong> {school.totalStudents}</p>
            </div>
            <div>
                <p className='gap-10 flex'><strong>Total Buses:</strong> {school.totalBuses}</p>
                <p className='gap-10 flex'><strong>Contact No:</strong> {school.contact}</p>
            </div>
        </div>
        <Button onClick={handleEditInstitutePopUp} className="px-10 py-1.5 border-2 border-[#C01824] text-[18px] text-[#C01824] capitalize rounded-[6px]" size='md' variant='outlined'>
            Edit
        </Button>
    </div>
);