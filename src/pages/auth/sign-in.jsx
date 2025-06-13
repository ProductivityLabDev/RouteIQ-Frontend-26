import React, { useState } from 'react';
import { Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { logo } from '@/assets';
import Loader from '@/components/Loader';

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [securityText, setSecurityText] = useState(generateSecurityText());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   if (username && password && securityCode === securityText) {
  //     setLoading(true);
  //     setTimeout(() => {
  //       setLoading(false);
  //       navigate('/dashboard/home');
  //     }, 1000);
  //   } else {
  //     alert('Please fill in all fields correctly.');
  //   }
  // };
  const handleSubmit = (event) => {
    event.preventDefault();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    console.log("Username:", username);
    console.log("Is Email:", isEmail);

    if (username && password && securityCode === securityText) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (isEmail) {
          navigate('/dashboard_subscription');
        } else {
          console.log("Navigating to /dashboard/home");
          navigate('/dashboard/home');
        }
      }, 1000);
    } else {
      alert('Please fill in all fields correctly.');
    }
  };

  const handleEmployeeLogin = () => {
    navigate("/EmployeeDashboard");
  };

  const handleVendorLogin = () => {
    navigate("/dashboard");
  };

  return (
    <>
      {loading && <Loader />}
      <section className="h-screen flex items-center justify-center bg-[url('./assets/auth-bg.png')] bg-cover bg-center bg-no-repeat px-2 md:px-4">
        <div className="w-full max-w-[600px] mx-auto py-3 md:py-8 px-4 rounded-[10px] bg-white">
          <div className="mx-auto w-full max-w-[500px] pb-3">
            <img src={logo} className='w-full max-w-[180px] md:max-w-[200px] mt-3' alt="not found" />
            <Typography className="font-bold text-[24px] md:text-[32px] mt-5">Login to Account</Typography>
            <Typography variant="paragraph" className="text-[14px] md:text-[18px] text-[#202224] font-normal">Please enter your email and password to continue</Typography>
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
                    className="!border-t-blue-gray-200 select-none h-[50px] text-xl md:text-3xl font-extrabold text-black focus:!border-t-gray-900 line-through p-2"
                  >
                    {securityText}
                  </Typography>
                  <button
                    type="button"
                    className="flex items-center pr-1.5"
                    onClick={reloadSecurityText}
                  >
                    <ArrowPathIcon className="h-4 w-4 text-black" />
                  </button>
                </div>
              </div>
            </div>
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

            <Button className="mt-6 bg-[#C01824] font-normal text-[14px] md:text-[16px] rounded-[5px] py-4 opacity-100" fullWidth type="submit">
              LOG IN
            </Button>
            <Button className="mt-6 bg-[#C01824] font-normal text-[14px] md:text-[16px] rounded-[5px] py-4 opacity-100" fullWidth type="button" onClick={handleEmployeeLogin}            >
              LOGIN AS A EMPLOYEE
            </Button>
             <Button className="mt-6 bg-[#C01824] font-normal text-[14px] md:text-[16px] rounded-[5px] py-4 opacity-100" fullWidth type="button" onClick={handleVendorLogin}            >
              LOGIN AS A VENDOR
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

export default SignIn;

{/* <Typography variant="paragraph" className="text-center text-gray-700 font-medium mt-4">
            Not registered?
            <Link to="/account/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography> */}