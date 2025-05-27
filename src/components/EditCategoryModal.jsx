import React, { useState } from "react";

export default function EditCategoryModal({ onClose, onSubmit, category }) {
  const [title, setTitle] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [photo, setPhoto] = useState(null);

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCategory = { _id: category._id, title, description, photo };
    onSubmit(updatedCategory);
    onClose();
  };

  return (
    <div className="fixed flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-2xl font-bold hover:text-gray-900"
          aria-label="Close form"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6">Edit Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Photo</label>
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
            <label className="block mb-2 font-semibold text-gray-700">
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
            <label className="block mb-2 font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter description"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
