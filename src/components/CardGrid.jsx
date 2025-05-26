import React, { useState, useMemo, useEffect } from "react";
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

  // Add your token here if needed
  const token = "your-token-here";
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchCardData = async () => {
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
  };

  useEffect(() => {
    fetchCardData();
  }, []);

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

      // Convert photo to base64 if present
      let base64Image = "";
      if (formData.photo) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(formData.photo);
        });
      }

      const postData = {
        title: formData.title,
        description: formData.description,
        image: base64Image,
      };

      const response = await axios.post(
        "https://newrepo-4pyc.onrender.com/admin/create-category",
        postData,
        config
      );

      if (response.status === 201 || response.status === 200) {
        // After create success, fetch updated list from API
        const freshDataResponse = await axios.get(
          "https://newrepo-4pyc.onrender.com/admin/get-all-categories",
          config
        );

        if (freshDataResponse.status === 200) {
          const updatedCards = freshDataResponse.data;
          setCardsData(updatedCards);

          // Set current page to last page so new card is visible
          const lastPage = Math.ceil(updatedCards.length / itemsPerPage);
          setCurrentPage(lastPage);

          setShowCreateModal(false);
        } else {
          console.error("Failed to fetch updated categories");
        }
      } else {
        console.error("Failed to create new category");
      }
    } catch (error) {
      console.error("Error creating new category:", error);
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
