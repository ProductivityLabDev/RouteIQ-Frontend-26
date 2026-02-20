import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '@/utlis/Colors';
import { EmployeeDashboardUser } from '@/assets';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import Cookies from 'js-cookie';

const EmployeeHeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const employeeUser = JSON.parse(localStorage.getItem('employeeUser') || '{}');
  const displayName = employeeUser?.username || employeeUser?.name || 'Employee';

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('employeeUser');
    localStorage.removeItem('token');
    Cookies.remove('token');
    navigate('/EmployeeDashboard');
  };

  return (
    <div className='flex justify-end items-center bg-[#FFFFFF] p-4 shadow-lg  z-30'>
      <div className='flex items-center mr-4 relative'>
        {/* Profile area */}
        <div className='flex items-center cursor-pointer' onClick={toggleDropdown}>
          <img
            src={EmployeeDashboardUser}
            className='w-10 h-10 rounded-full mr-2'
            alt='User'
          />
          <div>
            <p className='text-sm font-semibold text-gray-900'>{displayName}</p>
          </div>
          <MdKeyboardArrowDown color={colors.blackColor} className='ml-2 text-lg' />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className='absolute top-12 right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-md z-20'>
            <div className='flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer'>
              <FaRegUser size={20} className='text-gray-600 mr-2' />
              <span className='text-sm text-gray-700'>Edit Profile</span>
            </div>
            <div
              onClick={handleLogout}
              className='flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer'
            >
              <IoMdLogOut size={20} className='text-gray-600 mr-2' />
              <span className='text-sm text-gray-700'>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeHeaderNav;
