import React from 'react'
import { EmployeeManagementLoginScreen } from '@/assets'
import { Button } from '@material-tailwind/react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const handleLogin = () => {
        navigate('/EmployeeDashboard/profileInformation')
    }
    return (
        <div className="flex flex-row w-full h-screen">
            <div className="p-8 bg-[#fff] w-[82%] flex flex-col justify-center">
                <div className="p-8 w-[65%] flex flex-col justify-center self-center">

                    <h1 className="text-2xl font-normal text-gray-900 mb-2">Login as Employee</h1>
                    <div className="mb-4">
                        <h2 className="text-sm font-normal text-gray-900 mb-0.5">Welcome Back</h2>
                        <p className="text-xs text-gray-700">Please enter your login credentials.</p>
                    </div>

                    <form>
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
                            <label htmlFor="password" className="block text-xs text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-3 w-3 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 text-xs text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <div>
                                <Link to="/account/forgot-password" className="text-xs text-[#C01824] hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
                        <Button className="mt-6 bg-[#C01824] font-normal text-[14px] md:text-[16px] rounded-[5px] py-2 opacity-100" fullWidth type='button' onClick={handleLogin}>
                            LOGIN
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

export default Login