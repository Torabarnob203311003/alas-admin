import axios from "axios";
import { useEffect, useState } from "react";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add pagination functionality
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://newrepo-4pyc.onrender.com/admin/get-all-users",
          {
            method: "GET",
            credentials: "include", // 👈 Automatically sends cookies
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,

              // Add any other headers you need
            },
            //withCredentials: true, // MUST be here
          }
        );
        console.log("Server response:", response);
        // Check if we received any response data

        if (response.status !== 200) {
          console.log("Response data:", response);
          const errorData = await response.data.catch(() => ({})); // Corrected line
          throw new Error(
            errorData.message || `Failed to fetch (Status ${response.status})`
          );
        }

        const data = await response.data;
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setError(`Error fetching users: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto   ms-14 mt-16">
      <h1 className="text-2xl font-semibold mb-3 pr-[1310px]">All USERS</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse h-32 rounded-lg shadow-md"
            ></div>
          ))}
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  {/* <th className="py-2 px-4 border-b text-left">CODE</th> */}
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">REFERRAL</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id || user._id}>
                    {/* <td className="py-2 px-4 border-b text-left">
                      {user.id || user._id || "N/A"}
                    </td> */}
                    <td className="py-2 px-4 border-b text-left" >
                      {user.name || user.username || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-left">{user.email}</td>
                    <td className="py-2 px-4 border-b text-left">
                      {user.referral || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            {!loading && !error && (
              <>
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white "
                >
                  Previous
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(users.length / itemsPerPage)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white "
                >
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
