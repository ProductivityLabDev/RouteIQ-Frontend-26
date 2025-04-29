import React, { useState, useRef, useEffect } from 'react';
import { EmployeeManagementLoginScreen } from '@/assets';
import { Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import EmployeeDropdown from '@/components/EmployeeDropdown';

const Designation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleDropdown = () => setIsOpen(prev => !prev);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (value) => {
        setSelected(value);
        setIsOpen(false);
    };

    const handleSubmit = () => {
        navigate('/EmployeeDashboard/home');
    };

    return (
        <div className="flex flex-row w-full h-screen">
            <div className="p-8 bg-white w-[82%] flex flex-col justify-center">
                <div className="p-8 w-[65%] self-center">
                    <h1 className="text-2xl font-normal text-gray-900 mb-2">Designation</h1>
                    <p className="text-xs text-gray-700 mb-4">Please enter your designation</p>

                    <form>
                        <EmployeeDropdown />

                        <Button
                            className="mt-6 bg-[#C01824] font-normal text-[14px] md:text-[16px] rounded-[5px] py-2"
                            fullWidth
                            type="button"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>

            <div className="w-[60%] h-full">
                <img
                    src={EmployeeManagementLoginScreen}
                    alt="Route IQ Management System"
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
};

export default Designation;
