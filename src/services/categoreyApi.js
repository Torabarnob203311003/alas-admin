// api.js
import axios from "axios";

const API_BASE_URL = "https://newrepo-4pyc.onrender.com";

export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/get-all-categories`);
  // Adjust this depending on your API response structure
  // Example: if response.data.categories holds array
  // return response.data.categories;

  return response.data; // if API returns array directly
};
