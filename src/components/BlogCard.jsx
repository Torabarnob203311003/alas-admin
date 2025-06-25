import React, { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import Card from "./Card";
import EditCategorySidebar from "./EditCategorySidebar";
import ShowListingCards from "./ShowListingCards";
import CreateListingModal from "./CreateListingModal";

const initialCardsData = [];
const itemsPerPage = 8;

export default function BlogCard() {
  const [cardsData, setCardsData] = useState(initialCardsData);
  const [editingCard, setEditingCard] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showListingCreateModal, setShowListingCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const token = localStorage.getItem("token");
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
        "https://newrepo-4pyc.onrender.com/user/all-blogs", // <-- fetch blogs!
        config
      );
      setCardsData(response.data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
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
            "https://newrepo-4pyc.onrender.com/user/all-blogs",
            config
          );
          setCardsData(freshData.data);
          setShouldRefetch(false);
        } catch (error) {
          console.error("Error fetching updated categories:", error);
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

  const handleEditSubmit = (updatedCategories) => {
    if (Array.isArray(updatedCategories)) {
      setCardsData(updatedCategories);
      setEditingCard(null);
    } else {
      console.error("Unexpected updated categories data:", updatedCategories);
    }
  };

  // Unified delete handler for categories and listings
  const handleDelete = async (itemToDelete, isListing = false) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${itemToDelete.name}"?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(
        `https://newrepo-4pyc.onrender.com/admin/delete/${itemToDelete._id}`,
        config
      );

      if (response.status === 200) {
        if (isListing) {
          // Remove listing from the editing category's listings
          setEditingCard((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              listings: prev.listings.filter(
                (listing) => listing._id !== itemToDelete._id
              ),
            };
          });
          alert("Listing deleted successfully.");
        } else {
          // Remove category from the main cardsData
          setCardsData((prevCards) =>
            prevCards.filter((card) => card._id !== itemToDelete._id)
          );

          if (editingCard && editingCard._id === itemToDelete._id) {
            setEditingCard(null);
          }
          alert("Category deleted successfully.");
        }
      } else {
        alert("Failed to delete. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error occurred while deleting.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (formData) => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      if (formData.image) {
        data.append("image", formData.image);
      }
      if (formData.tag) {
        data.append("tag", formData.tag);
      }
      if (formData.date) {
        data.append("date", formData.date);
      }

      const token = localStorage.getItem("token");
      const dynamicConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "https://newrepo-4pyc.onrender.com/admin/create-blog",
        data,
        dynamicConfig
      );

      if (response.status === 201 || response.status === 200) {
        setShouldRefetch(true);
        setShowCreateModal(false);
      } else {
        console.error("Failed to create blog", response.data);
      }
    } catch (error) {
      console.error(
        "Error creating new blog:",
        error.response?.data || error.message
      );
      alert("Failed to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    try {
      setShowListingCreateModal(false);
      const freshData = await axios.get(
        "https://newrepo-4pyc.onrender.com/user/all-blogs",
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

  const handleEditListing = (listing) => {
    setEditingListing(listing);
    setShowListingCreateModal(true);
  };

  // After editing a listing, refresh all categories & update editingCard
  const handleUpdateListing = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://newrepo-4pyc.onrender.com/user/all-blogs",
        config
      );
      setCardsData(response.data);

      const updatedCard = response.data.find(
        (card) => card._id === editingCard._id
      );
      if (updatedCard) {
        setEditingCard(updatedCard);
      }

      setEditingListing(null);
      setShowListingCreateModal(false);
    } catch (error) {
      console.error("Failed to refresh categories after update:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto p-12 transition-all duration-300">
        <div className="flex justify-between items-center mt-5">
          {editingCard ? (
            <div
              className="flex justify-between items-center mt-3"
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
              <h1 className="text-xl font-bold">All Blogs</h1>
              <button
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCreateModal(true)}
              >
                Create New Blog
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
            <ShowListingCards
              listings={editingCard.listings || []}
              onEditClick={handleEditListing}
              onDeleteClick={(listing) => handleDelete(listing, true)} // Listing deletion
            />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {paginatedCards.map((card) => (
                <Card
                  key={card.id || card._id}
                  card={{
                    ...card,
                    title: card.title, // blog title
                    image: card.image, // blog image
                    description: card.description, // blog description
                  }}
                  // Remove onEditClick/onDeleteClick if you don't need category editing
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
          onClose={() => {
            setShowListingCreateModal(false);
            setEditingListing(null);
          }}
          onListingCreated={handleCreateListing}
          categoryName={editingCard?.name}
          initialData={editingListing}
          onSubmit={handleUpdateListing}
        />
      )}
    </div>
  );
}

// Inside CreateCategoryModal (or your blog creation modal)
function CreateCategoryModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    image: null, // <-- only image
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Create New Blog</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            required
            className="border rounded px-3 py-2"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            placeholder="Enter tag"
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
}

