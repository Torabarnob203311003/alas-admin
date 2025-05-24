import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import EditCategorySidebar from "./EditCategorySidebar";
import CreateCategoryModal from "./CreateCategoryModal";
import ShowListingCards from "./ShowListingCards";
import CreateListingModal from "./CreateListingModal";

const initialCardsData = [];

export default function CardsGrid() {
  const [cardsData, setCardsData] = useState(initialCardsData);
  const [editingCard, setEditingCard] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showListingCreateModal, setShowListingCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  //  remove after work done
  console.log("cardsData", cardsData);

  // Fetch categories from API on mount
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://newrepo-4pyc.onrender.com/admin/get-all-categories")
      .then((res) => {
        setCardsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setLoading(false);
      });
  }, []);

  // Filter cards by selected editing category's title
  const filteredCards = useMemo(() => {
    if (editingCard) {
      return cardsData.filter((c) => c.name === editingCard.name);
    }
    return cardsData;
  }, [cardsData, editingCard]);

  const paginatedCards = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCards.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCards, currentPage]);

  const handleEditSubmit = async (formData) => {
    try {
      // Make API call to save the edited card details in the database
      const response = await axios.put(
        `https://newrepo-4pyc.onrender.com/admin/edit-category/${formData.id}`,
        formData
      );

      if (response.status === 200 && response.data) {
        // Use the updated card data from the API response
        const updatedCard = response.data;

        // Update local state with the edited card
        setCardsData((prev) =>
          prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        );
        setEditingCard(null);
      } else {
        console.error("Failed to save card changes to the database.");
      }
    } catch (error) {
      console.error("Error saving card changes:", error);
    }
  };

  const handleCreateSubmit = (formData) => {
    const newCard = {
      id: cardsData.length + 1,
      title: formData.title,
      description: formData.description,
      count: 0,
      image: formData.photo ? URL.createObjectURL(formData.photo) : "",
    };
    setCardsData([newCard, ...cardsData]);
    setShowCreateModal(false);
  };

  const handleCreateListing = (newListing) => {
    setCardsData((prev) =>
      prev.map((card) =>
        card.id === editingCard.id
          ? { ...card, listings: [newListing, ...card.listings] }
          : card
      )
    );
    console.log("New listing created:", newListing);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredCards.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex h-full   ">
      {/* Left: Cards list (filtered if editing) */}
      <div
        className={`flex-1 overflow-auto p-12 transition-all duration-300 ${
          editingCard || showCreateModal ? "" : ""
        }`}
      >
        <div className="flex justify-between items-center mt-5  ">
          {/* Show "All Listings" text and "Create New List" button for the selected card */}
          {editingCard ? (
            <div
              className="flex justify-between items-center mt-10"
              style={{ gap: "710px" }}
            >
              <h1 className="text-xl font-bold">All Listings</h1>
              <button
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setShowListingCreateModal(true)}
              >
                Create New Listing
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold">All Categories</h1>
              {/* Show "Create New" button */}
              <button
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCreateModal(true)}
              >
                Create New
              </button>
            </>
          )}
        </div>

        {/* Show listing cards if a card is selected for editing */}
        {editingCard ? (
          <div className="mt-6">
            <ShowListingCards listings={editingCard.listings || []} />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {paginatedCards.map((card) => (
                <Card
                  key={card.id}
                  card={{ ...card, title: card.name }} // Map `name` to `title` for compatibility
                  onEditClick={setEditingCard}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {!loading && filteredCards.length > itemsPerPage && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage >= Math.ceil(filteredCards.length / itemsPerPage)
                  }
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Edit sidebar */}
      {editingCard && (
        <EditCategorySidebar
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Create new category modal */}
      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {/* Create new listing modal */}
      {showListingCreateModal && (
        <CreateListingModal
          isOpen={showListingCreateModal}
          onClose={() => setShowListingCreateModal(false)}
          onCreate={handleCreateListing}
          categoryName={editingCard?.name}
        />
      )}
    </div>
  );
}