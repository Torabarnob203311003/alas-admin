// components/CreateUserForm.jsx
import React, { useState } from "react";

export default function CreateUserForm({ onClose, onSubmit }) {
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ photo, name, description, email, referral });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-2xl font-bold hover:text-gray-900"
          aria-label="Close form"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6">Create New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload */}
          <div>
            <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400">Click to upload photo</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2 font-semibold text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write a short description"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>

          {/* Referral */}
          <div>
            <label htmlFor="referral" className="block mb-2 font-semibold text-gray-700">
              Referral
            </label>
            <input
              id="referral"
              type="text"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter referral (optional)"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
