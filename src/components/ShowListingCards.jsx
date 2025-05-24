import React, { useState } from 'react';

// ShowListingCards displays a grid of listing cards
function ShowListingCards({ listings = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedListings.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">No listings found.</div>
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
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold mb-1 text-gray-900 truncate">{listing.name}</h2>
                {listing.description && (
                  <p className="text-sm text-gray-600 mb-2 truncate">{listing.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center items-center mt-4 gap-6">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          &larr; Previous
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(listings.length / itemsPerPage)}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}

export default ShowListingCards;
