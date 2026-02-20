import React, { useState } from 'react'
import { EmployeeManagementLoginScreen } from '@/assets'
import { Button } from '@material-tailwind/react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { getApiUrl, getAxiosConfig } from '@/configs'

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please fill in all fields.')
            return
        }

        setLoading(true)
        try {
            const url = getApiUrl('/auth/login')
            const res = await axios.post(
                url,
                { username: email, password },
                getAxiosConfig()
            )

            const token =
                res.data?.token ||
                res.data?.access_token ||
                res.data?.accessToken ||
                res.data?.data?.token

            if (!token) {
                setError('Login failed. Token not received.')
                setLoading(false)
                return
            }

            // Store token
            Cookies.set('token', token, { expires: 7, secure: true })
            localStorage.setItem('token', token)

            const decoded = jwtDecode(token)

            // Store basic employee info
            const employeeUser = {
                username: decoded.username || email,
                role: decoded.role || 'employee',
                modules: {},
                control: 'READ_ONLY',
            }
            localStorage.setItem('employeeUser', JSON.stringify(employeeUser))

            navigate('/EmployeeDashboard/home')
        } catch (err) {
            console.error('Employee login error:', err)
            if (err.response) {
                setError(err.response.data?.message || 'Invalid credentials. Please try again.')
            } else {
                setError('Network error. Please check your connection.')
            }
        } finally {
            setLoading(false)
        }
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

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="email" className="block text-xs text-gray-700 mb-1">
                                Email ID / Username
                            </label>
                            <input
                                type="text"
                                id="email"
                                placeholder="Enter Email ID or Username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#C01824]"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="block text-xs text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#C01824]"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword
                                        ? <EyeIcon className="h-4 w-4 text-gray-500" />
                                        : <EyeSlashIcon className="h-4 w-4 text-gray-500" />
                                    }
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-3 w-3 text-[#C01824] border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 text-xs text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <Link to="/account/forgot-password" className="text-xs text-[#C01824] hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        {error && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
                                <p className="text-xs text-red-600">{error}</p>
                            </div>
                        )}

                        <Button
                            className="mt-2 bg-[#C01824] font-normal text-[14px] rounded-[5px] py-2 opacity-100"
                            fullWidth
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'LOGIN'}
                        </Button>

                        <div className="mt-4 text-center">
                            <Link to="/account/sign-in" className="text-xs text-gray-500 hover:text-[#C01824]">
                                ← Back to main login
                            </Link>
                        </div>
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
