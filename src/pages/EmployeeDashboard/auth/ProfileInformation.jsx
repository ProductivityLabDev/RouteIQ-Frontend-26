import React from 'react'
import { EmployeeManagementLoginScreen } from '@/assets'
import { Button } from '@material-tailwind/react'
import { useNavigate } from 'react-router-dom'
const ProfileInformation = () => {
    const navigate = useNavigate()
    const handleSubmit = () => {
        navigate('/EmployeeDashboard/designation')
    }
    return (
        <div className="flex flex-row w-full h-screen">
            <div className="p-8 bg-[#fff] w-[82%] flex flex-col justify-center">
                <div className="p-8 w-[65%] flex flex-col justify-center self-center">
                    <h1 className="text-2xl font-normal text-gray-900 mb-2">Profile Information</h1>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="name" className="block text-xs text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter Name"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="block text-xs text-gray-700 mb-1">Email ID</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter Email ID"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="block text-xs text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="number"
                                id="phoneNumber"
                                placeholder="Enter Phone Number"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bankAccountNo" className="block text-xs text-gray-700 mb-1">Bank Account No</label>
                            <input
                                type="text"
                                id="bankAccountNo"
                                placeholder="Bank Account No"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
                            />
                        </div>
                        <Button className="mt-6 bg-[#C01824] font-normal text-[14px] md:text-[16px] rounded-[5px] py-2 opacity-100" fullWidth type="button" onClick={handleSubmit}>
                            submit
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
    )
}

export default ProfileInformation