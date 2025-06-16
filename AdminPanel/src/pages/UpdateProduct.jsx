import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App.jsx";

const UpdateProduct = ({ token }) => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // Store existing images from backend
  const [newImages, setNewImages] = useState([]); // Store newly added images
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/${id}`, {
          headers: { admintoken: token },
        });

        if (response.data.success) {
          const data = response.data.product;
          setProduct(data);
          setName(data.name);
          setDescription(data.description);
          setPrice(data.price);
          setCategory(data.category);
          setSubCategory(data.subCategory);
          setBestseller(data.bestseller);
          setSizes(data.sizes || []);
          setExistingImages(data.image || []); // Set existing images
        }
      } catch (error) {
        toast.error("Failed to fetch product details", {
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

    fetchProduct();
  }, [id, token]);

  // Handle new image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  // Remove image from new uploads
  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // Remove existing image (to be deleted from backend)
  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Handle product update
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      // Add existing images that the user kept
      formData.append("existingImages", JSON.stringify(existingImages));

      // Add new images
      newImages.forEach((image, index) => {
        formData.append(`newImage${index + 1}`, image);
      });

      const response = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        formData,
        {
          headers: {
            admintoken: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success("Product updated successfully!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/list-items", { state: { updated: true } }); // Navigate with a state signal
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to update product", {
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
      setLoading(false);
    }
  };

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="bg-white p-6 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Cập nhật sản phẩm
      </h2>
      <form onSubmit={handleUpdateProduct} className="space-y-5">
        {/* Image Upload */}
        <div>
          <p className="mb-2 text-gray-600">Hình ảnh hiện tại</p>
          <div className="flex gap-2 flex-wrap">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <img
                  src={img}
                  alt="Existing"
                  className="w-full h-full object-cover rounded-md"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded-full text-xs"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <p className="mb-2 text-gray-600 mt-4">Tải lên hình ảnh mới</p>
          <label className="w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32 cursor-pointer bg-gray-50">
            <input type="file" multiple hidden onChange={handleImageUpload} />
            {newImages.length > 0 ? (
              <div className="flex gap-2">
                {newImages.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="New product images"
                      className="w-full h-full object-cover rounded-md"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded-full"
                    >
                      ✖
                    </button>
                  </div>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <p className="mb-1 text-gray-600">Giá (VNĐ)</p>
            <input
              className="w-full border px-3 py-2 rounded-lg focus:ring-1 focus:outline-none focus:border-blue-500"
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Product Description */}
        <div>
          <p className="mb-1 text-gray-600">Mô tả</p>
          <textarea
            className="w-full border px-3 py-2 rounded-lg focus:ring-1 focus:outline-none focus:border-blue-500"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
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

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
