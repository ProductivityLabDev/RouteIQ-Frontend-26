import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { logo, redtick } from '@/assets';

export function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const otpRefs = useRef([]);
  otpRefs.current = otpRefs.current.slice(0, otp.length);

  useEffect(() => {
    if (step === 2) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };


  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < otp.length - 1) {
        otpRefs.current[index + 1].focus();
      }

      if (value === "" && index > 0) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      setStep(4);
    } else {
      alert("Passwords do not match!");
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <section className="h-screen flex items-center justify-center bg-[url('./assets/auth-bg.png')] bg-cover bg-center bg-no-repeat px-2 md:px-4">
      <div className="w-full max-w-[600px] mx-auto py-7 md:py-16 md:px-7 px-4 rounded-xl bg-white">
        <div className="mx-auto w-full max-w-[500px]">
          {step === 1 && (
            <>
              <img src={logo} className='w-full max-w-[180px] md:max-w-[220px]' alt="not found" />
              <Typography className="font-medium text-[#C01824] text-[24px] md:text-[45px] mb-1 mt-7">Forgot Password</Typography>
              <Typography className="text-[14px] md:text-[16px] text-[#2C2F32] font-medium py-3 md:py-5">
                Enter your email for the verification process, we will send a 4-digit code to your email.
              </Typography>
            </>
          )}
          {step === 2 && (
            <>
              <Typography className="font-semibold my-3 text-[28px] md:text-[45px] text-[#C01824]">Verification</Typography>
              <Typography className="text-[14px] md:text-[16px] text-[#2C2F32] font-normal">
                Enter the 4-digit code that you received on your email.
              </Typography>
            </>
          )}
          {step === 3 && (
            <>
              <img src={logo} className='w-full max-w-[150px] md:max-w-[220px]' alt="not found" />
              <Typography className="font-medium text-[24px] md:text-[45px] py-3 md:py-9 text-[#C01824]">New Password</Typography>
              <Typography className="text-sm md:text-[16px] pb-3 text-[#2C2F32] font-medium">
                Set the new password for your account so you can log in and access all features.
              </Typography>
            </>
          )}
          {step === 4 && (
            <>
              <img src={redtick} alt="Tick mark" className="w-28 h-28 mx-auto my-6" />
              <Typography className="font-medium my-3 text-[#C01824] text-[24px] md:text-[34px] text-center">Successfully</Typography>
              <Typography variant="paragraph" className="text-[14px] md:text-[16px] font-normal text-center">
                Your password has been reset successfully.
              </Typography>
              <Button
                onClick={() => navigate('/account/sign-in')}
                className="mt-10 bg-[#C01824] font-normal text-[14px] md:text-[16px] rounded-[4px] py-4 opacity-100 w-full"
              >
                Continue
              </Button>
            </>
          )}
        </div>
        <form className="mb-2 mx-auto w-full max-w-[500px]" onSubmit={step === 1 ? handleEmailSubmit : step === 2 ? handleOtpSubmit : handlePasswordSubmit}>
          {step === 1 && (
            <div className="mb-1 flex flex-col gap-5">
              <Typography className="-mb-4 text-[14px] font-medium text-[#2C2F32]">
                E mail
              </Typography>
              <input
                required
                type='email'
                placeholder="Enter email"
                className="h-[50px] bg-[#FAFAFA] outline-none border border-[#9BADCA]/60 rounded-[5px] p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="mt-3 bg-[#C01824] text-[14px] md:text-[16px] font-semibold rounded-[5px] py-4 opacity-100" fullWidth>
                Continue
              </Button>
            </div>
          )}
          {step === 2 && (
            <div className="mb-1 flex flex-col gap-3">
              <div className="grid grid-cols-4 place-content-center gap-1 place-items-center mt-8 mb-4">
                {otp.map((value, index) => (
                  <div key={index} className="w-full max-w-[70px] md:max-w-[84px] md:h-[76px]">
                    <input
                      className="w-full h-full font-semibold text-5xl flex flex-col items-center justify-center text-center px-5 outline-none rounded-[5px] border border-[#9BADCA] bg-white focus:bg-[#FAFAFA] focus:ring-1 ring-red-700"
                      type="text"
                      value={value}
                      required
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      maxLength={1}
                      ref={(el) => otpRefs.current[index] = el}
                    />
                  </div>
                ))}
              </div>
              <Typography className="text-center text-[16px] font-medium text-[#C01824]">
                {formatTime(timeLeft)}
              </Typography>
              <Button type="submit" className="mt-4 bg-[#C01824] font-normal text-[16px] rounded-[5px] py-4 opacity-100" fullWidth>
                {isOtpComplete ? "Verify" : "Continue"}
              </Button>
              <Typography className="text-center text-[14px] md:text-[16px] text-[#808080] mt-3">
                If you didn’t receive a code! <Link to="#" className="ml-1 text-[#C01824] font-medium">Resend</Link>
              </Typography>
            </div>
          )}
          {step === 3 && (
            <div className="my-5 flex flex-col gap-5">
              <Typography variant="small" className="-mb-3 font-medium text-[#2C2F32]">
                Enter new password
              </Typography>
              <div className="relative">
                <input
                  required
                  placeholder='8 symbols at least'
                  type={showNewPassword ? "text" : "password"}
                  className="outline-none h-[50px] w-full rounded-[5px] pl-3 pr-12 bg-[#FAFAFA] border-[#EAEAEA] border"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeIcon className="h-[20px] w-[20px] text-[#0F1012]" /> : <EyeSlashIcon className="h-[20px] w-[20px] text-[#0F1012]" />}
                </div>
              </div>
              <Typography variant="small" className="-mb-3 font-medium text-[#2C2F32]">
                Confirm new password
              </Typography>
              <div className="relative">
                <input
                  required
                  placeholder='8 symbols at least'
                  type={showConfirmPassword ? "text" : "password"}
                  className="outline-none h-[50px] w-full rounded-[5px] pl-3 pr-12 bg-[#FAFAFA] border-[#EAEAEA] border"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeIcon className="h-[20px] w-[20px] text-[#0F1012]" /> : <EyeSlashIcon className="h-[20px] w-[20px] text-[#0F1012]" />}
                </div>
              </div>
              <Button type="submit" className="mt-4 bg-[#C01824] font-normal text-[14px] md:text-[16px] rounded-[5px] py-4 opacity-100" fullWidth>
                Update Password
              </Button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;
