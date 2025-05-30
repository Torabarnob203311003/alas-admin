import React, { useState, useEffect } from "react";

function CreateListingModal({
  isOpen,
  onClose,
  categoryName,
  onListingCreated,
  initialData = null, // For editing: existing listing data
  onSubmit 
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdListing, setCreatedListing] = useState(null);

  // Fill form with initialData when modal opens for editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setLocation(initialData.location || "");
      setReferralLink(initialData.referralLink || "");
      setPhoto(null); // Cannot prefill file input
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setLocation("");
    setReferralLink("");
    setPhoto(null);
    setError("");
    setShowSuccess(false);
    setCreatedListing(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("referralLink", referralLink);
      if (photo) {
        formData.append("images", photo);
      }

      if (initialData && initialData._id) {
        // EDIT mode - call your /admin/edit-listing/:id API
        const endpoint = `https://newrepo-4pyc.onrender.com/admin/edit-listing/${initialData._id}`;
        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // Do NOT set Content-Type; browser sets it for FormData automatically
          },
          body: formData,
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || "Failed to update listing");
        }

        setCreatedListing(responseData);
        setShowSuccess(true);
        if (onSubmit) onSubmit(responseData);
      } else {
        // CREATE mode
        if (!categoryName) throw new Error("Category name is missing");

        const endpoint = `https://newrepo-4pyc.onrender.com/admin/add-listing/${categoryName}`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || "Failed to create listing");
        }

        setCreatedListing(responseData);
        setShowSuccess(true);
        if (onListingCreated) onListingCreated(responseData);
      }

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to submit listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-90vh overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          onClick={handleClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Listing" : "Create New Listing"}
        </h2>

        {showSuccess && createdListing && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded-lg">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <h3 className="text-lg font-semibold text-green-800">
                Listing {initialData ? "Updated" : "Created"} Successfully!
              </h3>
            </div>
            <div className="space-y-1 text-sm text-green-700 text-left">
              <p>
                <strong>Name:</strong> {createdListing.name}
              </p>
              {createdListing.description && (
                <p>
                  <strong>Description:</strong> {createdListing.description}
                </p>
              )}
              {createdListing.location && (
                <p>
                  <strong>Location:</strong> {createdListing.location}
                </p>
              )}
              {createdListing.referralLink && (
                <p>
                  <strong>Referral Link:</strong> {createdListing.referralLink}
                </p>
              )}
            </div>
            <p className="text-xs text-green-600 mt-2">
              Modal will close automatically...
            </p>
          </div>
        )}

        {!showSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-left">
                Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-left">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-left">
                Location
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-left">
                Referral Link
              </label>
              <input
                type="url"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={referralLink}
                onChange={(e) => setReferralLink(e.target.value)}
                disabled={isSubmitting}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-left">
                Photo
              </label>
              <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : initialData && initialData.images && initialData.images.length > 0 ? (
                  <img
                    src={initialData.images[0]}
                    alt="Current"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <svg
                      className="w-8 h-8 text-gray-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    <span className="text-gray-400">Click to upload photo</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isSubmitting}
                />
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200 text-left">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isSubmitting
                  ? initialData
                    ? "Saving Changes..."
                    : "Creating..."
                  : initialData
                  ? "Save Changes"
                  : "Create Listing"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateListingModal;
