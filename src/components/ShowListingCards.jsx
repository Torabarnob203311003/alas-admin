import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function ShowListingCards({
  listings = [],
  loading = false,
  error = null,
  onEditClick,    // New prop to handle edit clicks
  onDeleteClick,  // Pass your existing delete handler here
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [listings]);

  const paginatedListings = listings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(listings.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-300 rounded-lg overflow-hidden shadow-sm animate-pulse"
          >
            <div className="w-full h-40 bg-gray-200" />
            <div className="p-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
        Error loading listings: {error}
      </div>
    );
  }

  const shouldShowPagination = listings.length > itemsPerPage;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedListings.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            No listings found.
          </div>
        ) : (
          paginatedListings.map((listing) => (
            <div
              key={listing._id || listing.id}
              className="bg-white border border-zinc-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="p-4 flex-grow">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {listing.name}
                </h3>
                {listing.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {listing.description}
                  </p>
                )}
                {listing.location && (
                  <p className="text-gray-500 text-sm">{listing.location}</p>
                )}
              </div>
              <div className="flex justify-between px-4 pb-2">
                <button
                  type="button"
                  onClick={() => onDeleteClick(listing)}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white transition"
                  aria-label={`Delete ${listing.name}`}
                >
                  <MdDelete size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => onEditClick(listing)}
                  className="bg-green-600 hover:bg-green-700 p-2 rounded-lg text-white transition"
                  aria-label={`Edit ${listing.name}`}
                >
                  <FaEdit size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {shouldShowPagination && (
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= Math.ceil(listings.length / itemsPerPage)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ShowListingCards;
