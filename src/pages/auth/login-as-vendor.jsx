import React, { useEffect, useState } from 'react';
import { EmployeeManagementLoginScreen } from '@/assets';
import { Button } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/slices/userSlice';
import axios from 'axios';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from 'react-hot-toast';
import { BASE_URL, API_PREFIX, getAxiosConfig, getApiUrl, setAuthTokens } from '@/configs';

const getLatestVendorProfile = async (token) => {
    const requestConfig = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    };

    try {
        const response = await axios.get(`${BASE_URL}/vendor/profile`, requestConfig);
        return response.data?.data ?? response.data ?? null;
    } catch (error) {
        const status = error?.response?.status;
        if (status === 404 || status === 405) {
            const response = await axios.get(`${BASE_URL}/institute/vendor/profile`, requestConfig);
            return response.data?.data ?? response.data ?? null;
        }
        return null;
    }
};

const LoginAsVendor = () => {

    const navigate = useNavigate();
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const url = getApiUrl("auth/login");


        try {
            const res = await axios.post(
                url,
                { email, password, deviceType: "Web" },
                getAxiosConfig()
            );


            const token =
                res.data?.token ||
                res.data?.access_token ||
                res.data?.accessToken ||
                res.data?.data?.token;

            const refreshToken =
                res.data?.refresh_token ||
                res.data?.refreshToken ||
                res.data?.data?.refresh_token ||
                null;

            if (!token) {
                setError("Token not found in response");
                return;
            }

            Cookies.set("token", token, { expires: 7, secure: true });
            setAuthTokens(token, refreshToken);

            const decoded = jwtDecode(token);

            const modulesMap = (decoded.modules || []).reduce((acc, mod) => {
                acc[mod.module] = { canRead: mod.canRead, canWrite: mod.canWrite };
                return acc;
            }, {});

            const permission = Object.values(modulesMap).some(m => m.canWrite)
                ? "READ_WRITE"
                : "READ_ONLY";

            const profile = await getLatestVendorProfile(token);

            const realUser = {
                name: profile?.NameAndTitle || profile?.nameAndTitle || profile?.FullName || profile?.fullName || decoded.name || decoded.fullName || decoded.username || decoded.email,
                fullName: profile?.FullName || profile?.fullName || profile?.NameAndTitle || profile?.nameAndTitle || "",
                username: profile?.Username || profile?.username || decoded.username || decoded.email,
                email: profile?.Email || profile?.email || decoded.email || decoded.username,
                companyName: profile?.CompanyName || profile?.companyName || "",
                nameAndTitle: profile?.NameAndTitle || profile?.nameAndTitle || "",
                profileImage: profile?.Logo || profile?.logoUrl || profile?.LogoUrl || profile?.profileImage || profile?.ProfileImage || "",
                role: decoded.role || "USER",
                modules: modulesMap,
                control: permission,
            };

            localStorage.setItem("vendor", JSON.stringify(realUser));

            dispatch(setUser({ user: realUser, token }));

            toast.success("Logged in successfully!");

            setTimeout(() => navigate("/dashboard"), 500);

        } catch (err) {

            if (err.response) {
                toast.error(err.response.data?.message || "Invalid credentials.");
            } else {
                const message = "Unexpected error. Please try again.";
                setError(message);
                toast.error(message);
            }
        }
    };

    useEffect(() => {
        if (import.meta.env.DEV) {
        }
        setLoading(false)
    }, [BASE_URL, API_PREFIX]);

    // Debug: Track email state changes
    // useEffect(() => {
    //     if (email) {
    //         console.log("📧 Email state updated:", email);
    //     }
    // }, [email]);

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{
                style: {
                    fontSize: "18px",
                    padding: "16px 22px",
                    minHeight: "60px",
                    borderRadius: "40px",
                },
            }} />
            <div className="flex flex-row w-full h-screen">
                <div className="p-8 bg-[#fff] w-[82%] flex flex-col justify-center">
                    <div className="p-8 w-[65%] flex flex-col justify-center self-center">
                        <h1 className="text-2xl font-normal text-gray-900 mb-2">Login as Vendor</h1>
                        <div className="mb-4">
                            <h2 className="text-sm font-normal text-gray-900 mb-0.5">Welcome Back</h2>
                            <p className="text-xs text-gray-700">Please enter your login credentials.</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="email" className="block text-xs text-gray-700 mb-1">
                                    Email / Username
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter email or username"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
                                    value={email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setemail(value);
                                    }}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="block text-xs text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <input type="checkbox" id="remember" className="h-3 w-3 text-blue-600 border-gray-300 rounded" />
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

                            <Button
                                className="mt-6 bg-[#C01824] font-normal text-[14px] md:text-[16px] rounded-[5px] py-2 opacity-100"
                                fullWidth
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Logging in…' : 'LOGIN'}
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
        </>
    );
};

export default LoginAsVendor;
