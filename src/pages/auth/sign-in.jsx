import React, { useState, useEffect } from 'react';
import { Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { logo } from '@/assets';
import Loader from '@/components/Loader';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slices/userSlice';
import axios from 'axios';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { BASE_URL, getApiUrl, getAxiosConfig, setAuthTokens } from '@/configs';

const SECURITY_CODE_LENGTH = 6;
const SECURITY_CODE_REFRESH_SECONDS = 60;

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [securityText, setSecurityText] = useState(generateSecurityText());
  const [securityTimer, setSecurityTimer] = useState(SECURITY_CODE_REFRESH_SECONDS);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

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
        window.location.replace("/account/sign-in");
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
    setSecurityCode('');
    setSecurityTimer(SECURITY_CODE_REFRESH_SECONDS);
  };

  function generateSecurityText() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < SECURITY_CODE_LENGTH; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecurityTimer((prev) => {
        if (prev <= 1) {
          setSecurityText(generateSecurityText());
          setSecurityCode('');
          return SECURITY_CODE_REFRESH_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validate security code
    if (securityCode.trim().toLowerCase() !== securityText.toLowerCase()) {
      setError('Security code does not match. Please try again.');
      reloadSecurityText();
      return;
    }

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const url = getApiUrl('/auth/login')
    try {

      const res = await axios.post(
        url,
        { username, password, deviceType: "Web" },
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
        setLoading(false);
        return;
      }

      // Store token in cookies and localStorage
      Cookies.set("token", token, { expires: 7, secure: true });
      setAuthTokens(token, refreshToken);

      // Decode JWT token to get user info
      const decoded = jwtDecode(token);


      // Extract instituteId from token (for school login)
      const instituteId = decoded.instituteId
        || decoded.InstituteId
        || decoded.institute_id
        || decoded.instituteID
        || decoded.InstituteID
        || null;


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
        username: decoded.username,
        role: decoded.role || "USER",
        modules: modulesMap,
        control: permission,
        instituteId: instituteId, // Store instituteId for school login
      };

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(realUser));

      // Also store instituteId separately for easy access
      if (instituteId) {
        localStorage.setItem("instituteId", instituteId.toString());
      }

      // Dispatch to Redux
      dispatch(setUser({ user: realUser, token }));


      // Navigate to schools dashboard
      navigate("/dashboard/home");

    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Invalid credentials. Please try again.");
      } else {
        setError("Network error. Please check your connection and try again.");
      }
      // Reset security code on error
      reloadSecurityText();
    } finally {
      setLoading(false);
    }
  };

  const timerMinutes = String(Math.floor(securityTimer / 60)).padStart(2, '0');
  const timerSeconds = String(securityTimer % 60).padStart(2, '0');

  const handleEmployeeLogin = () => {
    navigate("/EmployeeDashboard");
  };
  // const handleSchoolLogin = () => {
  //     navigate("/dashboard");
  //   };

  // const handleVendorLogin = () => {
  //   navigate("/dashboard");
  // };
  const handleVendorLogin = () => {
    navigate("/LoginAsVendor");
  };

  return (
    <>
      {loading && <Loader />}
      <section className="min-h-screen flex items-center justify-center bg-[url('./assets/auth-bg.png')] bg-cover bg-center bg-no-repeat px-2 md:px-4 py-6 overflow-auto">
        <div className="w-full max-h-[90vh] scrollbar-hide overflow-y-auto max-w-[600px] mx-auto py-3 md:py-8 px-4 rounded-[10px] bg-white">
          <div className="mx-auto w-full max-w-[500px] pb-3">
            <img src={logo} className='w-full max-w-[180px] md:max-w-[200px] mt-3' alt="not found" />
            <Typography className="font-bold text-[24px] md:text-[32px] mt-5">Login to Account</Typography>
            <Typography variant="paragraph" className="text-[14px] md:text-[16px] text-[#202224] font-normal">Please enter your email and password to continue</Typography>
          </div>
          <form className="mt-4 mb-2 mx-auto w-full max-w-[500px]" onSubmit={handleSubmit}>
            <div className="mb-1 flex flex-col gap-5">
              <Typography variant="small" className="-mb-3 text-[14px] font-medium text-[#2C2F32]">
                User Name
              </Typography>
              <input
                required
                placeholder="Enter username"
                className="outline-none rounded-[6px] p-3 border border-[#808080]/60 h-[50px] bg-[#FAFAFA]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Typography variant="small" className="-mb-3 text-[14px] font-medium text-[#2C2F32]">
                Password
              </Typography>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password123@"
                  required
                  className="outline-none rounded-[6px] w-full pl-3 pr-10 border border-[#808080]/60 h-[50px] bg-[#FAFAFA]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5 text-[#141516]" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 text-[#141516]" />
                  )}
                </button>
              </div>
              <Typography variant="small" className="-mb-3 text-[14px] font-medium text-[#2C2F32]">
                Security Code
              </Typography>
              <div className="flex items-center justify-between -mt-3">
                <Typography className="text-xs text-[#6B7280]">
                  Code refreshes in {timerMinutes}:{timerSeconds}
                </Typography>
                <button
                  type="button"
                  className="text-xs font-medium text-[#C01824]"
                  onClick={reloadSecurityText}
                >
                  Refresh Code
                </button>
              </div>
              <div className='flex gap-2 items-center'>
                <input
                  required
                  placeholder="Enter the shown text"
                  className="outline-none rounded-[6px] w-full max-w-[327px] pl-3 pr-10 border border-[#808080]/60 h-[52px] bg-[#FAFAFA]"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                />
                <div className="flex justify-between items-center w-full max-w-[180px] border border-[#808080]/60 rounded-[6px] bg-[#FAFAFA]">
                  <Typography
                    className="!border-t-blue-gray-200 select-none h-[50px] text-xl md:text-2xl font-extrabold text-black focus:!border-t-gray-900 line-through p-2"
                  >
                    {securityText}
                  </Typography>
                  <button
                    type="button"
                    className="flex items-center pr-1.5"
                    onClick={reloadSecurityText}
                    title="Refresh security code"
                  >
                    <ArrowPathIcon className="h-4 w-4 text-black" />
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <div className="mt-2">
                <Typography className="text-red-500 text-sm">{error}</Typography>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 mt-2">
              <Checkbox
                required
                className='rounded-[5px] h-5 w-5 custom-checkbox'
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center text-[#2C2F32] text-xs md:text-[14px] justify-start font-medium"
                  >
                    Remember me on this computer
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <Typography className="font-semibold text-[#C01824] text-xs md:text-[14px]">
                <Link to="/account/forgot-password">
                  Forgot Password?
                </Link>
              </Typography>
            </div>

            <Button
              className="mt-6 bg-[#C01824] font-normal text-[14px] md:text-[14px] rounded-[5px] py-4 opacity-100"
              fullWidth
              type="submit"
              disabled={loading}
            // onClick={handleSchoolLogin}
            >
              {loading ? 'Logging in...' : 'LOG IN AS A SCHOOL'}
            </Button>
            <Button className="mt-6 bg-[#C01824] font-normal text-[14px] md:text-[14px] rounded-[5px] py-4 opacity-100" fullWidth type="button" onClick={handleEmployeeLogin}            >
              LOGIN AS A EMPLOYEE
            </Button>
            <Button className="mt-6 bg-[#C01824] font-normal text-[14px] md:text-[14px] rounded-[5px] py-4 opacity-100" fullWidth type="button" onClick={handleVendorLogin}            >
              LOGIN AS A VENDOR
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

export default SignIn;

