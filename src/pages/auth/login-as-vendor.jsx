// src/pages/auth/login-as-vendor.jsx
import React, { useEffect, useState } from 'react';
import { EmployeeManagementLoginScreen } from '@/assets';
import { Button } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginAsVendor = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

 
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
  
  const API_PREFIX = import.meta.env.VITE_API_PREFIX || ''; 

 
  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

 
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
  const url = `${BASE_URL}/auth/login`;

  try {
    const res = await axios.post(
      url,
      { userName, password },                    
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,                    
      }
    );

    console.log('Login response:', res.status, res.data);

    const {
      token,
      access_token,
      accessToken,
      data,
    } = res.data || {};
    const foundToken =
      token ||
      access_token ||
      accessToken ||
      (data && (data.token || data.access_token || data.accessToken));

    if (foundToken) {
      localStorage.setItem('token', foundToken);
      localStorage.setItem('vendor', JSON.stringify(res.data.vendor ?? res.data.user ?? {}));
      navigate('/dashboard');
    } else {
      setError('Token not found in response. Check response shape in console.');
    }
  } catch (err) {
    console.error('Login error:', err);
    if (err.code === 'ERR_NETWORK' && !err.response) {
      setError('Cannot reach backend — check server URL, CORS, or dev proxy.');
    } else if (err.response) {
      setError(err.response.data?.message || 'Invalid credentials.');
    } else {
      setError('Unexpected error. Please try again.');
    }
  }
};
 useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Base URL:', BASE_URL, 'API_PREFIX:', API_PREFIX);
    }
  }, [BASE_URL, API_PREFIX]);

  return (
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
              <label htmlFor="userName" className="block text-xs text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                id="userName"
                placeholder="Enter UserName"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                autoComplete="username"
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
  );
};

export default LoginAsVendor;
