import React, { useState, useEffect } from 'react';
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
import { BASE_URL, setAuthTokens } from '@/configs';

const COUNTRY_OPTIONS = [
  { code: "US", label: "United States", dialCode: "+1", maxDigits: 10 },
  { code: "CA", label: "Canada", dialCode: "+1", maxDigits: 10 },
  { code: "GB", label: "United Kingdom", dialCode: "+44", maxDigits: 10 },
  { code: "AU", label: "Australia", dialCode: "+61", maxDigits: 9 },
  { code: "AE", label: "United Arab Emirates", dialCode: "+971", maxDigits: 9 },
  { code: "SA", label: "Saudi Arabia", dialCode: "+966", maxDigits: 9 },
  { code: "PK", label: "Pakistan", dialCode: "+92", maxDigits: 10 },
  { code: "IN", label: "India", dialCode: "+91", maxDigits: 10 },
];

const getCountryMetaByDialCode = (dialCode) =>
  COUNTRY_OPTIONS.find((country) => country.dialCode === dialCode) ?? COUNTRY_OPTIONS[0];

const getVendorSignupIdFromResponse = (responseData) =>
  responseData?.vendorSignupId ||
  responseData?.data?.vendorSignupId ||
  responseData?.data?.VendorSignupId ||
  responseData?.VendorSignupId ||
  null;

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
    countryDialCode: COUNTRY_OPTIONS[0].dialCode,
    contactNumber: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Prevent browser back button after logout
  useEffect(() => {
    // Check if user is logged out (no token)
    const token = localStorage.getItem("token");
    if (!token) {
      // Push a new state to prevent back navigation
      window.history.pushState(null, "", window.location.href);

      const handlePopState = (event) => {
        // Prevent going back to previous page
        window.history.pushState(null, "", window.location.href);
        // Stay on sign-in page
        window.location.replace(window.location.pathname);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, []);

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
        { email, password, deviceType: "Web" },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
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
        setLoading(false);
        return;
      }

      // Store token in cookies and localStorage
      Cookies.set("token", token, { expires: 7, secure: true });
      setAuthTokens(token, refreshToken);

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

      const profile = await getLatestVendorProfile(token);

      // Create user object
      const realUser = {
        name: profile?.NameAndTitle || profile?.nameAndTitle || profile?.FullName || profile?.fullName || decoded.name || decoded.fullName || decoded.firstName || decoded.username || decoded.email,
        fullName: profile?.FullName || profile?.fullName || profile?.NameAndTitle || profile?.nameAndTitle || "",
        username: profile?.Username || profile?.username || decoded.username || decoded.email,
        email: profile?.Email || profile?.email || decoded.email || decoded.username,
        companyName: profile?.CompanyName || profile?.companyName || "",
        nameAndTitle: profile?.NameAndTitle || profile?.nameAndTitle || "",
        profileImage: profile?.Logo || profile?.logoUrl || profile?.LogoUrl || profile?.profileImage || profile?.ProfileImage || "",
        role: decoded.role || "VENDOR",
        modules: modulesMap,
        control: permission,
      };

      // Store user in localStorage
      localStorage.setItem("vendor", JSON.stringify(realUser));

      // Dispatch to Redux
      dispatch(setUser({ user: realUser, token }));

      toast.success("Logged in successfully!");

      // Navigate to vendor dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (err) {
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
        contactNumber: `${signUpData.countryDialCode} ${signUpData.contactNumber.trim()}`.trim(),
      };

      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Signup Step 1 completed! Proceed to next step.");

      // Optionally navigate to step 2
      // navigate("/vendor/signup-step2");
      const vendorSignupId = getVendorSignupIdFromResponse(res.data);

      // safety check
      if (!vendorSignupId) {
        toast.error("Signup failed: No vendor ID returned.");
        return;
      }

      sessionStorage.setItem("vendorSignupId", String(vendorSignupId));

      navigate("/dashboard_subscription", {
        state: { vendorSignupId }
      });

    } catch (err) {

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
    const selectedCountry = getCountryMetaByDialCode(
      name === "countryDialCode" ? value : signUpData.countryDialCode
    );

    setSignUpData(prev => ({
      ...prev,
      [name]:
        name === "contactNumber"
          ? value.replace(/\D/g, '').slice(0, selectedCountry.maxDigits)
          : value,
      ...(name === "countryDialCode"
        ? {
            contactNumber: prev.contactNumber.slice(0, selectedCountry.maxDigits),
          }
        : {}),
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityText(generateSecurityText());
      setSecurityCode('');
    }, 60000);


    return () => {
      clearInterval(interval);
    };
  }, []);

  const selectedCountry = getCountryMetaByDialCode(signUpData.countryDialCode);
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
      <section className="h-screen flex items-center justify-center relative overflow-y-auto overflow-x-hidden bg-white">
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
                onClick={() => navigate('/sign-up-vendor')}
                className={`px-8 py-3 text-sm font-medium transition-colors w-[50%] ${activeTab === 'signup'
                  ? 'bg-[#2C2F32] text-white'
                  : 'bg-[#1F2124] text-gray-400 hover:text-white'
                  }`}
                type="button"
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
                    <div className="flex gap-3">
                      <div className="relative w-[150px] shrink-0">
                        <select
                          name="countryDialCode"
                          value={signUpData.countryDialCode}
                          onChange={handleSignUpChange}
                          className="w-full appearance-none outline-none rounded-md px-4 py-3 pr-10 bg-white text-gray-900 border border-gray-300 focus:border-[#C01824] focus:ring-1 focus:ring-[#C01824]"
                          aria-label="Select country code"
                        >
                          {COUNTRY_OPTIONS.map((country) => (
                            <option key={`${country.code}-${country.dialCode}`} value={country.dialCode}>
                              {country.code} ({country.dialCode})
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
                          v
                        </span>
                      </div>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={signUpData.contactNumber}
                        onChange={handleSignUpChange}
                        className="flex-1 outline-none rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:border-[#C01824] focus:ring-1 focus:ring-[#C01824]"
                        placeholder="Enter contact number"
                        inputMode="tel"
                        maxLength={selectedCountry.maxDigits}
                        required
                      />
                    </div>
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
