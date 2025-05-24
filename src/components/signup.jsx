import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError('');
    try {
      const res = await axios.post('https://newrepo-4pyc.onrender.com/auth/signup', {
        name: fullName,
        email,
        password,
        referral: referral || undefined,
      });
      if (res.status === 201 || res.status === 200) {
        navigate('/login');
      } else {
        setError(res.data?.message || 'Signup failed');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-sm rounded-lg p-8 shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20"
          />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        <div className="mb-4">
          <label className="text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
         <div className="mb-6">
          <label className="text-sm font-medium">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="text-sm font-medium">
            Referral (optional)
          </label>
          <input
            type="text"
            placeholder="Referral code"
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
          />
        </div>
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium transition"
        >
          Create account
        </button>
      </div>
    </div>
  );
}
