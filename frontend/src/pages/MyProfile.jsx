import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/user";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State for loader
  const { navigate, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUserData = async () => {
      try {
        const response = await getProfile();
        console.log(response);
        setUser(response.data.data);
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
  }, [isAuthenticated]);

  const handleEmailChange = async () => {
    try {
      const response = await updateProfile({ email: newEmail });
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

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (!user)
    return (
      <div className="text-center text-black font-semibold mt-20">
        Đang tải thông tin tài khoản...
      </div>
    );

  return (
    <div className="flex items-center justify-center py-10  px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl montserrat-regular text-[#8B4513] flex items-center gap-2 mb-6 border-b pb-4">
          <FaUser className="text-black" /> Thông tin tài khoản
        </h2>

        <div className="space-y-6">
          <div className="text-lg font-medium flex flex-col">
            <span className="text-[#8B4513]">Họ và tên</span>
            <span className="text-[#8B4513] bg-gray-100 font-normal p-2 rounded-md">
              {user.name}
            </span>
          </div>

          <div className="text-lg font-medium flex flex-col">
            <span className="text-[#8B4513]">Email</span>
            {!isEditing ? (
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <span className="text-[#8B4513] font-normal">{user.email}</span>
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

        {/* <button
          onClick={() => setIsModalOpen(true)}
          className="mt-8 w-full bg-[#8B4513] text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-[#2C1810] transition-all duration-200 shadow-md"
        >
          <FaTrash /> Xóa tài khoản
        </button> */}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Bạn có chắc chắn muốn xóa tài khoản?</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa tài khoản? Thao tác này không thể được hoàn tác.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>Đang xóa...</>
                ) : (
                  <>
                    <FaTrash />
                    Xác nhận xóa
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
