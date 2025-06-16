import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ShopContext } from "../context/Shopcontext";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State for loader
  const { backendUrl, token, navigate } = useContext(ShopContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const activeToken = token || storedToken;

    if (!activeToken) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token: activeToken },
        });
        setUser(response.data);
      } catch (error) {
        toast.error("Failed to load profile. Please log in again.", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    };

    fetchUserData();
  }, [token]);

  const handleEmailChange = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/update-email`,
        { email: newEmail },
        { headers: { token: token } }
      );
      toast.success("Email updated successfully", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setUser((prev) => ({ ...prev, email: response.data.updatedEmail }));
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update email", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true); // Show loader
    try {
      await axios.delete(`${backendUrl}/api/user/account`, {
        headers: { token: token },
      });
      localStorage.clear();
      toast.success("Account deleted successfully", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsModalOpen(false);

      setTimeout(() => {
        navigate("/"); // Navigate first
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Failed to delete account", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsDeleting(false); // Hide loader
    }
  };

  if (!token) {
    return (
      <div className="text-center text-black font-semibold mt-20">
        Please log in to view your profile.
      </div>
    );
  }

  if (!user)
    return (
      <div className="text-center text-black font-semibold mt-20">
        Loading Profile...
      </div>
    );

  return (
    <div className="flex items-center justify-center py-10  px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2 mb-6 border-b pb-4">
          <FaUser className="text-black" /> My Profile
        </h2>

        <div className="space-y-6">
          <div className="text-lg font-medium flex flex-col">
            <span className="text-gray-500">Name</span>
            <span className="text-gray-800 bg-gray-100 font-normal p-2 rounded-md">
              {user.name}
            </span>
          </div>

          <div className="text-lg font-medium flex flex-col">
            <span className="text-gray-500">Email</span>
            {!isEditing ? (
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <span className="text-gray-800 font-normal">{user.email}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-700 hover:text-blue-900 transition"
                >
                  <FaEdit />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  className="border border-gray-300 p-2 rounded-md flex-1 focus:ring-1 focus:ring-blue-700 outline-none font-normal"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                />
                <button
                  onClick={handleEmailChange}
                  className="bg-blue-700 text-white px-3 py-2 rounded-md hover:bg-blue-800 transition font-normal"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-8 w-full bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition-all duration-200 shadow-md"
        >
          <FaTrash /> Delete Account
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6">
              Do you really want to delete your account? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>Deleting...</>
                ) : (
                  <>
                    <FaTrash />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
