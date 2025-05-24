// ApiService.js
class ApiService {
  static BASE_URL = 'https://newrepo-4pyc.onrender.com';

  /**
   * Centralized request method to handle API calls with auth token
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} [options={}] - Fetch options like method, body, etc.
   * @returns {Promise<Object>} - Parsed JSON response
   */
  static async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Sign up user
   * @param {Object} userData - User data for signup
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email
   * @param {string} [userData.referral] - Optional referral code
   * @returns {Promise<boolean>} - Success status
   */
  static async signUpUser({ name, email, referral }) {
    try {
      const body = {
        name,
        email,
        ...(referral ? { referral } : {}),
        // password: 'secretpassword' // Add if needed
      };
      const response = await this.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      console.log('🔁 Signup API Response:', response, 'Status:', response.status);
      return response.status === 200;
    } catch (error) {
      console.error('❌ signUpUser failed:', error.message);
      return false;
    }
  }

  static async loginAdmin({ email, password }) {
    try {
      const response = await this.request('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      console.log('🔁 Login API Response:', response, 'Status:', response.status);
      return response.status === 200;
    } catch (error) {
      console.error('❌ loginAdmin failed:', error.message);
      return false;
    }
  }

  static async getAllUsers() {
    try {
      const response = await this.request('/admin/get-all-users');
      if (response.status === 200) {
        return response.data;
      } else {
        console.error('❌ Failed to load users:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to load users:', error.message);
      return [];
    }
  }

  /**
   * Get all categories
   * @returns {Promise<Array>} - List of category models
   */
  static async getAllCategories() {
    try {
      const response = await this.request('/user/get-all-categories');
      if (response.status === 200) {
        return response.data.map(categoryData => this.transformCategory(categoryData));
      } else {
        console.error('❌ Failed to load categories:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to load categories:', error.message);
      return [];
    }
  }

  /**
   * Transform category data from API to match the CategoryModel structure
   * @param {Object} categoryData - Raw category data from API
   * @returns {Object} - Transformed category model
   */
  static transformCategory(categoryData) {
    // This assumes a similar structure to the Dart CategoryModel
    // Adjust the transformation based on the actual structure needed
    return {
      id: categoryData.id,
      name: categoryData.name,
      description: categoryData.description,
      // Add other properties as needed based on your CategoryModel
    };
  }
}

export default ApiService;
