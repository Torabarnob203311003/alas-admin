import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../services/api";

export default function EditCategorySidebar({ card, onClose, onSubmit }) {
  const [title, setTitle] = useState(card?.name || "");
  const [description, setDescription] = useState(card?.description || "");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset form when card changes
  useEffect(() => {
    setTitle(card?.name || "");
    setDescription(card?.description || "");
    setPhoto(null);
  }, [card]);

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    if (photo) formData.append("image", photo);

    const response = await fetch(
      `${API_BASE_URL}/admin/edit-category/${card._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update category");
    }

    // Get fresh data after update
    const freshDataResponse = await fetch(
      `${API_BASE_URL}/admin/get-all-categories`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!freshDataResponse.ok) {
      throw new Error("Failed to fetch updated data");
    }

    const freshData = await freshDataResponse.json(); // <--- Fix: parse freshDataResponse here

    onSubmit(freshData); // Pass fresh updated list to parent
    onClose(); // Close the sidebar after successful update
  } catch (error) {
    console.error("Error updating category:", error);
    alert("Failed to update category");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* Overlay for small screens */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside
        className="
          fixed right-0
          z-50 mt-[120px]
          w-full max-w-sm border-r p-6
          overflow-auto shadow-lg
          md:relative md:w-1/4 md:max-w-none
          flex flex-col
        "
        style={{ width: "25.3333%", minWidth: "320px", height: "70vh" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Category</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-3xl font-bold"
            aria-label="Close edit panel"
          >
            <FaTimes />
          </button>
        </div>

        {/* Edit Category Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex-grow flex flex-col h-[120px]"
        >
          {/* Photo Upload */}
          <div>
            <label className="block mb-3 font-semibold text-gray-700">Photo</label>
            <label className="w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <img
                  src={card.image}
                  alt={card.name}
                  className="h-full w-full object-cover rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {/* Title Input */}
          <div>
            <label className="block mb-3 font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="Enter category title"
            />
          </div>

          {/* Description Input */}
          <div className="flex-grow">
            <label className="block mb-3 font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
              placeholder="Enter description"
            />
          </div>          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition font-semibold text-lg disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </aside>
    </>
  );
}
