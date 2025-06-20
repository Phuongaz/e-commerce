import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";

const ListProducts = ({ token }) => {
  const [listItems, setListItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();


  const fetchList = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/list-all-products`
      );
      if (response?.data?.success) {
        setListItems(response.data.products);
      } else {
        toast.error(response.data.message, {
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products.", {
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

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/product/${id}`, {
        headers: { admintoken: token },
      });
      if (response?.data?.success) {
        toast.success("Product removed successfully!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        await fetchList();
      } else {
        toast.error(response.data.message, {
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove product.", {
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

useEffect(() => {
  fetchList(); // Always fetch on mount

  if (location.state?.updated) {
    fetchList(); // Fetch again if update signal exists
    window.history.replaceState({}, document.title); // Clear state after fetching
  }
}, [location]);

  return (
    <div className="bg-white">
      <h2 className="text-xl font-semibold mb-4">Danh sách tất cả sản phẩm</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-100 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm md:text-base uppercase">
              <th className="py-3 px-4 text-left">Hình ảnh</th>
              <th className="py-3 px-4 text-left">Tên</th>
              <th className="py-3 px-4 text-left">Mô tả</th>
              <th className="py-3 px-4 text-left">Danh mục</th>
              <th className="py-3 px-4 text-left">Giá</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {listItems.map((item, index) => (
              <tr
                key={item._id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } hover:bg-gray-50 transition`}
              >
                <td className="py-3 px-4">
                  <img
                    className="w-12 h-12 object-cover rounded-md border"
                    src={item?.image[0]}
                    alt="product"
                    loading="lazy"
                  />
                </td>
                <td className="py-3 px-4">{item?.name}</td>
                <td className="py-3 px-4">
                  {item?.description.slice(0, 100)}...
                </td>
                <td className="py-3 px-4">{item?.category}</td>
                <td className="py-3 pl-4 text-left font-semibold text-gray-600">
                   {item?.price} {currency}
                </td>
                <td className="py-3 px-4 text-center flex justify-center gap-3">
                  {/* Edit Button */}
                  <button
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={() => navigate(`/update-item/${item._id}`)}
                  >
                    <MdEdit size={20} />
                  </button>

                  {/* Delete Button */}
                  <button
                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    onClick={() => removeProduct(item._id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {listItems.length === 0 && (
          <p className="text-center text-gray-600 mt-4">
            Không có sản phẩm nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListProducts;
