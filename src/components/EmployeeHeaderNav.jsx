import React from 'react'
import colors from '@/utlis/Colors';
import { EmployeeDashboardUser } from '@/assets';
import { MdKeyboardArrowDown } from "react-icons/md";

const EmployeeHeaderNav = () => {
    return (
        <div className='flex justify-end items-center bg-[#FFFFFF] p-4 shadow-lg w-100 h-22.5'>
            <div className='flex items-center mr-4'>
                <div className='flex items-center cursor-pointer'>
                    <img src={EmployeeDashboardUser} className='rounded-full mr-2' />
                    <span className='text-gray-700 text-sm'>John Doe</span>
                </div>
                <MdKeyboardArrowDown color={colors.blackColor} className='ml-2 cursor-pointer' />
            </div>
        </div>
    )
}

export default EmployeeHeaderNav