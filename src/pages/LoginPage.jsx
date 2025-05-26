import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { useAuth } from "../contexts/AuthContext.jsx";
import logo from "../assets/logo.png";

import Cookies from "js-cookie";
import axios from "axios";

export default function LoginPage() {
 // const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For show/hide toggle
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://newrepo-4pyc.onrender.com/admin/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data) {
        const { refreshToken, accessToken } = res.data;

        if (refreshToken && accessToken) {
          Cookies.set("refreshToken", refreshToken, {
            expires: 7,
            secure: window.location.protocol === "https:",
            sameSite: "strict",
          });

          Cookies.set("accessToken", accessToken, {
            expires: 1,
            secure: window.location.protocol === "https:",
            sameSite: "strict",
          });

          localStorage.setItem("token", accessToken);

          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
          return;
        }

        const token =
          res.data.token || res.data.accessToken || res.data.access_token;

        if (token) {
          Cookies.set("accessToken", token, {
            expires: 1,
            secure: window.location.protocol === "https:",
            sameSite: "strict",
          });
          localStorage.setItem("token", token);

          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          if (res.data.success || res.data.message === "Login successful") {
            navigate("/");
          } else {
            setError("Login successful but no authentication token received");
          }
        }
      } else {
        setError("No data received from server");
      }

      if (res.status === 200) {
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            `Server error: ${err.response.status}. ${
              err.response.data?.error || "Please try again"
            }`
        );
      } else if (err.request) {
        setError(
          "Server connection failed. Please check if the server is running."
        );
      } else {
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white w-full max-w-screen-xl sm:max-w-md rounded-lg p-6 sm:p-8 shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src={logo}
            alt="Logo"
            className="h-76 w-76 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3ELogo%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">
          Log In
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-left font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-left font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-black focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-2.5 rounded-md text-sm font-medium transition disabled:opacity-70 mt-6"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-4 sm:mt-6 text-center">
          <span
            className="text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Create account
          </span>
        </div>
      </div>
    </div>
  );
}
