import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function CreateCategoryModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    if (photo) {
      formData.append("image", photo);
    }

    try {
      // Create the category
      const response = await fetch(
        "https://newrepo-4pyc.onrender.com/admin/create-category",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create category: ${response.statusText}`);
      }

      // After successful creation, fetch fresh data
      const freshResponse = await fetch(
        "https://newrepo-4pyc.onrender.com/admin/get-all-categories",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!freshResponse.ok) {
        throw new Error("Failed to fetch updated categories");
      }

      const freshData = await freshResponse.json();
      console.log("Category created and data refreshed:", freshData);
      onSubmit(freshData);
      onClose(); // Close the modal after successful creation
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsCreating(false);
    }
  }; // Properly close the handleSubmit function

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-2xl font-bold hover:text-gray-900"
          aria-label="Close form"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-6">Create New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex mb-2 font-semibold text-gray-700">
              Photo
            </label>
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

          <div>
            <label className="flex mb-2 font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category title"
            />
          </div>

          <div>
            <label className="flex mb-2 font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          </div>          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition disabled:opacity-50 flex items-center justify-center"
          >
            {isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Category...
              </>
            ) : (
              'Add Category'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
