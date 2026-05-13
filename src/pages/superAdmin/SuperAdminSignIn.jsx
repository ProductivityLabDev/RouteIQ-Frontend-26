import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { Toaster, toast } from "react-hot-toast";
import authBg from "@/assets/authbg.png";
import { BASE_URL, clearAuthTokens, setAuthTokens } from "@/configs";

export default function SuperAdminSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          email: email.trim(),
          password,
          deviceType: "Web",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const token =
        response.data?.token ||
        response.data?.access_token ||
        response.data?.accessToken ||
        response.data?.data?.token;

      const refreshToken =
        response.data?.refresh_token ||
        response.data?.refreshToken ||
        response.data?.data?.refresh_token ||
        null;

      if (!token) {
        throw new Error("Access token not found in response");
      }

      const decoded = jwtDecode(token);
      const role = String(decoded?.role || "").toUpperCase();

      if (role !== "SUPER_ADMIN" && role !== "SUB_ADMIN") {
        clearAuthTokens();
        localStorage.removeItem("superAdminSession");
        throw new Error("This account does not have super admin or sub admin access.");
      }

      setAuthTokens(token, refreshToken);
      Cookies.set("token", token, { expires: 7, secure: true });
      localStorage.setItem(
        "superAdminSession",
        JSON.stringify({
          active: true,
          email: decoded?.email || email.trim(),
          role,
          responsibilities: decoded?.responsibilities ?? [],
          allowedModules: decoded?.allowedModules ?? null,
          signedInAt: new Date().toISOString(),
        })
      );

      toast.success(
        role === "SUB_ADMIN"
          ? "Sub admin logged in successfully"
          : "Super admin logged in successfully"
      );
      const defaultPath = role === "SUB_ADMIN" ? "/super-admin/vendors" : "/super-admin/dashboard";
      const nextPath = location.state?.from || defaultPath;
      navigate(nextPath, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to sign in as super admin";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f5ef] px-4">
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 3000 }} />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      <div className="absolute inset-0 bg-white/70" />

      <div className="relative z-10 w-full max-w-lg rounded-[32px] border border-[#ebe6da] bg-white p-10 shadow-xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#8e8a80]">
          Route IQ
        </p>
        <h1 className="text-4xl font-bold text-[#171a2a]">Super Admin Sign In</h1>
        <p className="mt-3 text-sm text-[#6e6d67]">
          Separate access for platform-level monitoring and vendor workspace control.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
              placeholder="Enter super admin email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 pr-12 outline-none transition focus:border-[#c01824]"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-[#8e8a80] transition hover:text-[#171a2a]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M10.58 10.58A2 2 0 0013.42 13.42"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.88 5.09A10.94 10.94 0 0112 4.91c5.05 0 9.27 3.11 10.8 7.5a11.59 11.59 0 01-3.04 4.57"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.61 6.61A11.62 11.62 0 001.2 12.41c.89 2.57 2.77 4.73 5.27 6.06A11.26 11.26 0 0012 19.91c1.59 0 3.11-.31 4.49-.88"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      d="M1.2 12.41C2.73 8.02 6.95 4.91 12 4.91s9.27 3.11 10.8 7.5c-1.53 4.39-5.75 7.5-10.8 7.5s-9.27-3.11-10.8-7.5z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12.41" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm font-medium text-[#c01824]">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#c01824] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#a61520]"
          >
            {loading ? "Signing In..." : "Continue to Super Admin"}
          </button>
        </form>
      </div>
    </section>
  );
}
