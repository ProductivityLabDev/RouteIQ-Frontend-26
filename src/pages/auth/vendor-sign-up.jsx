import React, { useState } from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import Loader from '@/components/Loader';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import authBg from '@/assets/authbg.png';
import { BASE_URL } from '@/configs';

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

export function VendorSignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signUpData, setSignUpData] = useState({
    nameAndTitle: '',
    company: '',
    email: '',
    countryDialCode: COUNTRY_OPTIONS[0].dialCode,
    contactNumber: '',
  });

  const selectedCountry = getCountryMetaByDialCode(signUpData.countryDialCode);

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    const country = getCountryMetaByDialCode(
      name === "countryDialCode" ? value : signUpData.countryDialCode
    );

    setSignUpData((prev) => ({
      ...prev,
      [name]:
        name === "contactNumber"
          ? value.replace(/\D/g, '').slice(0, country.maxDigits)
          : value,
      ...(name === "countryDialCode"
        ? { contactNumber: prev.contactNumber.slice(0, country.maxDigits) }
        : {}),
    }));
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        nameAndTitle: signUpData.nameAndTitle,
        companyName: signUpData.company,
        email: signUpData.email,
        contactNumber: `${signUpData.countryDialCode} ${signUpData.contactNumber.trim()}`.trim(),
      };

      const res = await axios.post(`${BASE_URL}/signup/vendor/step1`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const vendorSignupId = getVendorSignupIdFromResponse(res.data);

      if (!vendorSignupId) {
        toast.error("Signup failed: No vendor ID returned.");
        return;
      }

      sessionStorage.setItem("vendorSignupId", String(vendorSignupId));
      toast.success("Signup Step 1 completed! Proceed to package selection.");

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
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${authBg})`,
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 w-full max-w-[600px] mx-auto px-4">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/src/assets/route-iq-logo.png" alt="" />
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-0">
            <div className="flex bg-[#2C2F32] rounded-t-lg overflow-hidden w-[100%]">
              <button
                onClick={() => navigate('/sign-in-vendor')}
                className="px-8 py-3 text-sm font-medium transition-colors w-[50%] bg-[#1F2124] text-gray-400 hover:text-white"
                type="button"
              >
                Login
              </button>
              <button
                type="button"
                className="px-8 py-3 text-sm font-medium transition-colors w-[50%] bg-[#2C2F32] text-white"
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="bg-[#2C2F32] rounded-b-lg p-8 shadow-2xl">
            <Typography className="text-white text-4xl font-bold mb-2">
              Vendor Information
            </Typography>
            <Typography className="text-gray-400 text-sm mb-6">
              Please enter your business details
            </Typography>

            <form onSubmit={handleSignUpSubmit}>
              <div className="flex flex-col gap-5">
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

                {error && (
                  <div>
                    <Typography className="text-red-500 text-sm">{error}</Typography>
                  </div>
                )}

                <Button
                  type="submit"
                  className="mt-2 bg-[#C01824] hover:bg-[#A0151F] text-white font-semibold text-base py-3 rounded-md transition-colors"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Processing..." : "PROCEED"}
                </Button>

                <Typography className="text-center text-gray-400 text-sm">
                  Already have an account?{" "}
                  <Link to="/sign-in-vendor" className="text-white font-medium hover:underline">
                    Login
                  </Link>
                </Typography>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default VendorSignUp;
