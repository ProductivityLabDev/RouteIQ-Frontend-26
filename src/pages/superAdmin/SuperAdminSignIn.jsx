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
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
              placeholder="Enter password"
            />
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
