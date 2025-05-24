import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

import Cookies from "js-cookie";

import ApiService from "../components/fetch/ApiService";
import axios from "axios";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      const res = await axios.post(
        "https://newrepo-4pyc.onrender.com/admin/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            //"Authorization": `Bearer ${localStorage.getItem("token")}`,
            // Add any other headers you need
          },
          withCredentials: true, // MUST be here
        }
      );

      console.log("Server response:", res);

      // Check if we received any response data
      if (res.data) {
        console.log("Response data:", res.data);

        // Extract tokens from response
        const { refreshToken, accessToken } = res.data;

        if (refreshToken && accessToken) {
          // Store tokens in cookies (more secure than localStorage)
          Cookies.set("refreshToken", refreshToken, {
            expires: 7, // 7 days
            secure: window.location.protocol === "https:", // secure if using HTTPS
            sameSite: "strict",
          });

          Cookies.set("accessToken", accessToken, {
            expires: 1, // 1 day
            secure: window.location.protocol === "https:",
            sameSite: "strict",
          });

          // Also save a copy in localStorage as fallback for your existing code
          localStorage.setItem("token", accessToken);

          console.log("Tokens saved successfully in cookies");
          setTimeout(() => {
            window.location.href = "/"; // Force a hard reload
          }, 1000);
          return;
        }

        // Fallback for different token response formats
        const token =
          res.data.token || res.data.accessToken || res.data.access_token;

        if (token) {
          // Store in both cookies and localStorage for compatibility
          Cookies.set("accessToken", token, {
            expires: 1,
            secure: window.location.protocol === "https:",
            sameSite: "strict",
          });
          localStorage.setItem("token", token);

          console.log("Token saved successfully in cookies");
          setTimeout(() => {
            window.location.href = "/"; // Force a hard reload
          }, 1000);
        } else {
          console.warn("No token found in response:", res.data);

          if (res.data.success || res.data.message === "Login successful") {
            console.log(
              "Login appears successful despite no token, proceeding..."
            );
            navigate("/");
          } else {
            setError("Login successful but no authentication token received");
          }
        }
      } else {
        setError("No data received from server");
      }
      //const success = await ApiService.loginAdmin({ email, password });
      if (res.status === 200) {
        // Assuming the login was successful, you can navigate to the dashboard or home page
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        console.log("Error status:", err.response.status);
        console.log("Error data:", err.response.data);

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
    <div className="min-h-screen flex  items-center justify-center bg-gray-100 ">
      <div className="bg-white w-full max-w-sm rounded-lg p-8 shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-20"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3ELogo%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 text-sm text-red-600 text-center">{error}</div>
          )}

          {/* Log In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium transition disabled:opacity-70"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-4 text-center">
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
