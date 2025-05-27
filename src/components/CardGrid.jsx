import React, { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import Card from "./Card";
import EditCategorySidebar from "./EditCategorySidebar";
import CreateCategoryModal from "./CreateCategoryModal";
import ShowListingCards from "./ShowListingCards";
import CreateListingModal from "./CreateListingModal";

const initialCardsData = [];
const itemsPerPage = 8;

export default function CardsGrid() {
  const [cardsData, setCardsData] = useState(initialCardsData);
  const [editingCard, setEditingCard] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showListingCreateModal, setShowListingCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // Add your token here if needed
  const token = "your-token-here";
  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const fetchCardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://newrepo-4pyc.onrender.com/admin/get-all-categories",
        config
      );
      setCardsData(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    fetchCardData();
  }, [fetchCardData]);

  useEffect(() => {
    if (shouldRefetch) {
      const fetchUpdatedData = async () => {
        try {
          const freshData = await axios.get(
            "https://newrepo-4pyc.onrender.com/admin/get-all-categories",
            config
          );
          setCardsData(freshData.data);

          // Re-fetch data a second time
          const secondFetchData = await axios.get(
            "https://newrepo-4pyc.onrender.com/admin/get-all-categories",
            config
          );
          setCardsData(secondFetchData.data);
        } catch (error) {
          console.error("Error fetching updated categories:", error);
        } finally {
          setShouldRefetch(false);
        }
      };

      fetchUpdatedData();
    }
  }, [shouldRefetch, config]);

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

  const showNextButton = !loading && paginatedCards.length === itemsPerPage;

  const handleEditSubmit = async (formData) => {
    try {
      const response = await axios.put(
        `https://newrepo-4pyc.onrender.com/admin/edit-category/${formData.id}`,
        formData,
        config
      );

      if (response.status === 200 && response.data) {
        const updatedCard = response.data;
        setCardsData((prev) =>
          prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        );
        setEditingCard(null);
      } else if (response.status === 403) {
        console.error("Authorization failed. Token might be invalid or expired.");
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page
        return;
      } else {
        console.error("Failed to save card changes to the database.");
      }
    } catch (error) {
      console.error("Error saving card changes:", error);
    }
  };

  const handleCreateSubmit = async (formData) => {
    try {
      setLoading(true);

      // Create FormData for multipart upload
      const data = new FormData();
      data.append("name", formData.title);
      data.append("description", formData.description);
      if (formData.photo) {
        data.append("image", formData.photo);
      }

      console.log("Request payload (FormData):", data); // Log the payload

      // Dynamically retrieve token from localStorage
      const token = localStorage.getItem("token");
      const dynamicConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "https://newrepo-4pyc.onrender.com/admin/create-category",
        data,
        dynamicConfig
      );

      if (response.status === 201 || response.status === 200) {
        const newCategory = response.data;
        console.log("New category created:", newCategory);

        // Append the new card to the UI instantly
        setCardsData((prev) => {
          const updatedCards = [
            ...prev,
            {
              name: newCategory.name,
              image: newCategory.image,
              description: newCategory.description,
            },
          ];
          const lastPage = Math.ceil(updatedCards.length / itemsPerPage);
          setCurrentPage(lastPage); // Set current page to last page
          return updatedCards;
        });

        // Trigger re-fetch of data
        setShouldRefetch(true);

        setShowCreateModal(false);
      } else {
        console.error("Failed to create category", response.data);
      }
    } catch (error) {
      console.error(
        "Error creating new category:",
        error.response?.data || error.message
      );
      alert("Failed to create category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    try {
      setShowListingCreateModal(false);
      const freshData = await axios.get(
        "https://newrepo-4pyc.onrender.com/admin/get-all-categories",
        config
      );
      setCardsData(freshData.data);

      if (editingCard) {
        const updatedCard = freshData.data.find(
          (card) => card._id === editingCard._id
        );
        if (updatedCard) {
          setEditingCard(updatedCard);
        }
      }
    } catch (error) {
      console.error("Error updating data after creating listing:", error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto p-12 transition-all duration-300">
        <div className="flex justify-between items-center mt-5">
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
              <button
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCreateModal(true)}
              >
                Create New
              </button>
            </>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <div className="border-t-4 border-green-500 border-solid rounded-full w-10 h-10 animate-spin"></div>
          </div>
        ) : editingCard ? (
          <div className="mt-6">
            <ShowListingCards listings={editingCard.listings || []} />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {paginatedCards.map((card) => (
                <Card
                  key={card.id || card._id}
                  card={{ ...card, title: card.name }}
                  onEditClick={setEditingCard}
                />
              ))}
            </div>

            {!editingCard && (
              <div className="flex justify-center mt-4 me-20 gap-9">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                {showNextButton && (
                  <button
                    onClick={handleNextPage}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {editingCard && (
        <EditCategorySidebar
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {showListingCreateModal && (
        <CreateListingModal
          isOpen={showListingCreateModal}
          onClose={() => setShowListingCreateModal(false)}
          onListingCreated={handleCreateListing}
          categoryName={editingCard?.name}
        />
      )}
    </div>
  );
}
