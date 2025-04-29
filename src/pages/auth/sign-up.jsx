import React, { useState } from 'react';
import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { logo } from '@/assets';

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="h-screen flex items-center justify-center bg-[url('./assets/auth-bg.png')] bg-cover bg-center bg-no-repeat px-4">
      <div className="w-full max-w-[600px] mx-auto py-14 px-7 rounded-xl bg-white">
        <div className="mx-auto w-full max-w-[500px]">
          <img src={logo} alt="not found" />
          <Typography variant="h3" className="font-bold mb-1 mt-9">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-md font-normal">Enter your email and password to register.</Typography>
        </div>
        <form className="mt-4 mb-2 mx-auto w-full max-w-[500px]">
          <div className="mb-1 flex flex-col gap-5">
            <Typography variant="small" className="-mb-3 font-medium text-[#2C2F32]/80">
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              required
              className="!border-t-blue-gray-200 h-[50px] bg-[#FAFAFA] focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" className="-mb-3 font-medium text-[#2C2F32]/80">
              Password
            </Typography>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                required
                placeholder="********"
                className="!border-t-blue-gray-200 h-[50px] bg-[#FAFAFA] focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-[#141516]" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-[#141516]" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              required
              className='custom-checkbox'
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  I agree the
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Typography variant="small" className="font-medium text-[#C01824]">
              <Link to="/account/sign-up">
                Terms and Conditions
              </Link>
            </Typography>
          </div>

          <Button className="mt-6 bg-[#C01824] font-normal text-md rounded-sm py-4 opacity-100" fullWidth>
            SIGN UP
          </Button>

          <Typography variant="paragraph" className="text-center text-gray-700 font-medium mt-4">
            Already have an account?
            <Link to="/account/sign-in" className="text-gray-900 ml-1">Sign In</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
