import React, { useState } from 'react';
import { Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Loader from '@/components/Loader';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slices/userSlice';
import axios from 'axios';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from 'react-hot-toast';
import authBg from '@/assets/authbg.png';

export function SignInVendor() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [securityText, setSecurityText] = useState(generateSecurityText());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign up form states
  const [signUpData, setSignUpData] = useState({
    nameAndTitle: '',
    company: '',
    email: '',
    contactNumber: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const reloadSecurityText = () => {
    setSecurityText(generateSecurityText());
  };

  function generateSecurityText() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validate security code
    if (securityCode !== securityText) {
      setError('Security code does not match. Please try again.');
      setSecurityText(generateSecurityText());
      setSecurityCode('');
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const url = `${BASE_URL}/auth/login`;

      const res = await axios.post(
        url,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Vendor login response:", res.data);

      const token =
        res.data?.token ||
        res.data?.access_token ||
        res.data?.accessToken ||
        res.data?.data?.token;

      if (!token) {
        setError("Token not found in response");
        setLoading(false);
        return;
      }

      // Store token in cookies and localStorage
      Cookies.set("token", token, { expires: 7, secure: true });
      localStorage.setItem("token", token);

      // Decode JWT token to get user info
      const decoded = jwtDecode(token);

      // Create modules map from decoded token
      const modulesMap = (decoded.modules || []).reduce((acc, mod) => {
        acc[mod.module] = { canRead: mod.canRead, canWrite: mod.canWrite };
        return acc;
      }, {});

      // Determine permission level
      const permission = Object.values(modulesMap).some(m => m.canWrite)
        ? "READ_WRITE"
        : "READ_ONLY";

      // Create user object
      const realUser = {
        email: decoded.email || decoded.username,
        role: decoded.role || "VENDOR",
        modules: modulesMap,
        control: permission,
      };

      // Store user in localStorage
      localStorage.setItem("vendor", JSON.stringify(realUser));

      // Dispatch to Redux
      dispatch(setUser({ user: realUser, token }));

      console.log("Vendor logged in:", realUser);
      toast.success("Logged in successfully!");

      // Navigate to vendor dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (err) {
      console.error("Vendor login error:", err);
      if (err.response) {
        const errorMessage = err.response.data?.message || "Invalid credentials. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = "Network error. Please check your connection and try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
      // Reset security code on error
      setSecurityText(generateSecurityText());
      setSecurityCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = `${BASE_URL}/signup/vendor/step1`;

      // Build API payload exactly as backend expects
      const payload = {
        //nameAndTitle: `${signUpData.name} - ${signUpData.title}`,
        nameAndTitle: signUpData.nameAndTitle,
        companyName: signUpData.company,
        email: signUpData.email,
        contactNumber: signUpData.contactNumber,
      };

      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Signup step 1 response:", res.data);
      toast.success("Signup Step 1 completed! Proceed to next step.");

      // Optionally navigate to step 2
      // navigate("/vendor/signup-step2");
      const vendorSignupId = res.data?.vendorSignupId;

      // safety check
      if (!vendorSignupId) {
        console.error("Vendor Signup ID missing from response");
        toast.error("Signup failed: No vendor ID returned.");
        return;
      }

      navigate("/dashboard_subscription", {
        state: { vendorSignupId }
      });

    } catch (err) {
      console.error("Signup Error:", err);

      const errorMessage =
        err.response?.data?.message ||
        "Signup failed. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "18px",
            padding: "16px 22px",
            minHeight: "60px",
            borderRadius: "40px",
          },
        }}
      />
      {loading && <Loader />}
      <section className="h-screen flex items-center justify-center relative overflow-hidden bg-white">
        {/* Blurred Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${authBg})`,
            // backgroundColor: '#fff',
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />

        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-[600px] mx-auto px-4">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              {/* Map Pin Icon with Bus */}
              <div className="relative">
                <img src="/src/assets/route-iq-logo.png" alt="" />
              </div>
              {/* Route IQ Text */}
              {/* <Typography className="text-[#C01824] text-4xl font-serif font-bold tracking-tight">
                Route IQ
              </Typography> */}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-0">
            <div className="flex bg-[#2C2F32] rounded-t-lg overflow-hidden w-[100%]">
              <button
                onClick={() => setActiveTab('login')}
                className={`px-8 py-3 text-sm font-medium transition-colors  w-[50%] ${activeTab === 'login'
                  ? 'bg-[#2C2F32] text-white'
                  : 'bg-[#1F2124] text-gray-400 hover:text-white'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`px-8 py-3 text-sm font-medium transition-colors w-[50%] ${activeTab === 'signup'
                  ? 'bg-[#2C2F32] text-white'
                  : 'bg-[#1F2124] text-gray-400 hover:text-white'
                  }`}
              >
                Sign up
              </button>
            </div>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="bg-[#2C2F32] rounded-b-lg p-8 shadow-2xl">
              <Typography className="text-white text-4xl font-bold mb-2">
                Login to Account
              </Typography>
              <Typography className="text-gray-400 text-sm mb-6">
                Please enter your email and password to continue
              </Typography>

              <form onSubmit={handleLoginSubmit}>
                <div className="flex flex-col gap-5">
                  {/* Email Field */}
                  <div>
                    <Typography variant="small" className="text-gray-300 text-sm font-medium mb-2">
                      User Name
                    </Typography>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full outline-none rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:border-[#C01824] focus:ring-1 focus:ring-[#C01824]"
                      placeholder="Enter username"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <Typography variant="small" className="text-gray-300 text-sm font-medium mb-2">
                      Password
                    </Typography>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full outline-none rounded-md px-4 py-3 pr-12 bg-white text-gray-900 border border-gray-300 focus:border-[#C01824] focus:ring-1 focus:ring-[#C01824]"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Security Text */}
                  <div>
                    <Typography variant="small" className="text-gray-300 text-sm font-medium mb-2">
                      Security Text
                    </Typography>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={securityCode}
                        onChange={(e) => setSecurityCode(e.target.value)}
                        placeholder="Enter the shown text"
                        className="flex-1 outline-none rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:border-[#C01824] focus:ring-1 focus:ring-[#C01824]"
                      />
                      <div className="flex items-center gap-2 bg-black rounded-md px-4 py-3 min-w-[140px] border border-gray-800">
                        <Typography
                          className="text-white text-xl font-extrabold tracking-wider select-none"
                          style={{
                            letterSpacing: '0.1em',
                            transform: 'skew(-5deg)',
                            filter: 'blur(0.3px)'
                          }}
                        >
                          {securityText}
                        </Typography>
                        <button
                          type="button"
                          onClick={reloadSecurityText}
                          className="ml-1 p-1.5 hover:bg-gray-800 rounded-full transition-colors flex items-center justify-center"
                        >
                          <ArrowPathIcon className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 rounded accent-[#C01824] cursor-pointer"
                      />
                      <Typography className="text-gray-300 text-sm ml-2">
                        Remember me on this computer
                      </Typography>
                    </label>
                    <Link to="/account/forgot-password" className="text-[#C01824] text-sm font-semibold hover:underline">
                      Forgot Password?
                    </Link>
                  </div>

                  {error && (
                    <div className="mt-2">
                      <Typography className="text-red-500 text-sm">{error}</Typography>
                    </div>
                  )}

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="mt-2 bg-[#C01824] hover:bg-[#A0151F] text-white font-semibold text-base py-3 rounded-md transition-colors"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'LOG IN'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <div className="bg-[#2C2F32] rounded-b-lg p-8 shadow-2xl">
              <Typography className="text-white text-4xl font-bold mb-2">
                Vendor Information
              </Typography>
              <Typography className="text-gray-400 text-sm mb-6">
                Please enter your business details
              </Typography>

              <form onSubmit={handleSignUpSubmit}>
                <div className="flex flex-col gap-5">
                  {/* Name Field */}
                  <div>
                    <Typography variant="small" className="text-gray-300 text-sm font-medium mb-2">
                      Name*
                    </Typography>
                    <input
                      type="text"
                      name="nameAndTitle"
                      value={signUpData.nameAndTitle}
                      onChange={handleSignUpChange}
                      className="w-full outline-none rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:border-[#C01824] focus:ring-1 focus:ring-[#C01824]"
                      placeholder="Enter name"
                      required
                    />
                  </div>

                  {/* Title Field */}
                  {/* <div>
                    <Typography variant="small" className="text-gray-300 text-sm font-medium mb-2">
                      Title*
                    </Typography>
                    <input
                      type="text"
                      name="title"
                      value={signUpData.title}
                      onChange={handleSignUpChange}
                      className="w-full outline-none rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:border-[#C01824] focus:ring-1 focus:ring-[#C01824]"
                      placeholder="Enter title"
                      required
                    />
                  </div> */}

                  {/* Company Field */}
                  <div>
                    <Typography variant="small" className="text-gray-300 text-sm font-medium mb-2">
                      Company*
                    </Typography>
                    <input
                      type="text"
                      name="company"
                      value={signUpData.company}
                      onChange={handleSignUpChange}
                      className="w-full outline-none rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:border-[#C01824] focus:ring-1 focus:ring-[#C01824]"
                      placeholder="Enter company name"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <Typography variant="small" className="text-gray-300 text-sm font-medium mb-2">
                      Email*
                    </Typography>
                    <input
                      type="email"
                      name="email"
                      value={signUpData.email}
                      onChange={handleSignUpChange}
                      className="w-full outline-none rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:border-[#C01824] focus:ring-1 focus:ring-[#C01824]"
                      placeholder="Enter email"
                      required
                    />
                  </div>

                  {/* Contact Number Field */}
                  <div>
                    <Typography variant="small" className="text-gray-300 text-sm font-medium mb-2">
                      Contact Number*
                    </Typography>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={signUpData.contactNumber}
                      onChange={handleSignUpChange}
                      className="w-full outline-none rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:border-[#C01824] focus:ring-1 focus:ring-[#C01824]"
                      placeholder="Enter contact number"
                      required
                    />
                  </div>

                  {/* Proceed Button */}
                  <Button
                    type="submit"
                    className="mt-2 bg-[#C01824] hover:bg-[#A0151F] text-white font-semibold text-base py-3 rounded-md transition-colors"
                    fullWidth

                  >
                    {loading ? "Processing..." : "PROCEED"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default SignInVendor;
