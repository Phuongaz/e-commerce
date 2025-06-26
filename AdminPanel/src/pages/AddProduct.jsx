import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const AddProduct = ({ token }) => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });

      const response = await axios.post(
        `${backendUrl}/api/admin/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setName("");
        setDescription("");
        setBestseller(false);
        setCategory("Men");
        setImages([]);
        setPrice("");
        setSizes([]);
      }
    } catch (error) {
      toast.error("Failed to add product", {
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  return (
    <div className="bg-white p-6 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Thêm sản phẩm
      </h2>
      <form onSubmit={handleAddProduct} className="space-y-5">
        {/* Image Upload */}
        <div>
          <p className="mb-2 text-gray-600">Hình ảnh sản phẩm</p>
          <label className="w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32 cursor-pointer bg-gray-50">
            <input type="file" multiple hidden onChange={handleImageUpload} />
            {images.length > 0 ? (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-md"
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nhấp để tải lên hình ảnh</p>
            )}
          </label>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-gray-600">Tên sản phẩm</p>
            <input
              className="w-full border px-3 py-2 rounded-lg focus:ring-1 focus:outline-none focus:border-blue-500"
              type="text"
              required
              placeholder="Tên sản phẩm"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div>
            <p className="mb-1 text-gray-600">Giá (VNĐ)</p>
            <input
              className="w-full border px-3 py-2 rounded-lg focus:ring-1 focus:outline-none focus:border-blue-500"
              type="number"
              required
              placeholder="25"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>
        </div>

        {/* Product Description */}
        <div>
          <p className="mb-1 text-gray-600">Mô tả</p>
          <textarea
            className="w-full border px-3 py-2 rounded-lg focus:ring-1 focus:outline-none focus:border-blue-500"
            required
            placeholder="Mô tả sản phẩm"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
        </div>

        {/* Category & SubCategory */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-gray-600">Danh mục</p>
            <select
              className="w-full border px-3 py-2 rounded-lg focus:ring-1 focus:outline-none focus:border-blue-500"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className="mb-1 text-gray-600">Danh mục con</p>
            <select
              className="w-full border px-3 py-2 rounded-lg focus:ring-1 focus:outline-none focus:border-blue-500"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="mb-2 text-gray-600">Kích cỡ</p>
          <div className="flex gap-2">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <p
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((s) => s !== size)
                      : [...prev, size]
                  )
                }
                className={`px-4 py-1 border border-gray-300 rounded-lg cursor-pointer ${
                  sizes.includes(size)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {size}
              </p>
            ))}
          </div>
        </div>

        {/* Bestseller Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Đánh dấu là Bestseller</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={bestseller}
              onChange={() => setBestseller((prev) => !prev)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-1 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-700"></div>
          </label>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
