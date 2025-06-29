import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ProductContext } from "../context/ProductContext.jsx";

const UpdateProduct = () => {
  const { getProduct, updateProduct, uploadImages } = useContext(ProductContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [existingImageIds, setExistingImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImageIds, setNewImageIds] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        
        if (data) {
          setProduct(data);
          setName(data.name || "");
          setDescription(data.description || "");
          setPrice(data.price || "");
          setCategory(data.category || "Men");
          setSubCategory(data.sub_category || "Topwear");
          setBestseller(data.bestseller || false);
          setSizes(data.size || []);
          setExistingImageIds(data.images || []);
        }
      } catch (error) {
        toast.error("Failed to fetch product details", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Generate image URL from image ID
  const getImageUrl = (imageId) => {
    return `${backendUrl}/api/product/image/${imageId}`;
  };

  // Handle new image uploads
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedIds = await uploadImages(files);
      setNewImageIds((prev) => [...prev, ...uploadedIds]);
      setNewImages((prev) => [...prev, ...files]);
      
      toast.success("Images uploaded successfully!", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error("Failed to upload images", {
        position: "top-center",
        autoClose: 1500,
      });
    } finally {
      setUploading(false);
    }
  };

  const removeExistingImage = (index) => {
    setExistingImageIds(existingImageIds.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImageIds(newImageIds.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const allImageIds = [...existingImageIds, ...newImageIds];
    
    if (allImageIds.length === 0) {
      toast.error("Please provide at least one image", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name,
        description,
        price: parseFloat(price),
        category,
        sub_category: subCategory,
        bestseller,
        size: sizes,
        images: allImageIds,
      };

      const response = await updateProduct(id, productData);
      
      if (response?.success) {
        toast.success("Product updated successfully!", {
          position: "top-center",
          autoClose: 1500,
        });
        
        setTimeout(() => {
          navigate("/admin/list-items", { state: { updated: true } });
        }, 1000);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update product", {
        position: "top-center",
        autoClose: 1500,
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
        {/* Existing Images */}
        <div>
          <p className="mb-2 text-gray-600">Hình ảnh hiện tại</p>
          {existingImageIds.length > 0 ? (
            <div className="flex gap-2 flex-wrap mb-4">
              {existingImageIds.map((imageId, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={getImageUrl(imageId)}
                    alt="Existing"
                    className="w-20 h-20 object-cover rounded-md"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-4">Không có hình ảnh hiện tại</p>
          )}

          {/* Upload New Images */}
          <p className="mb-2 text-gray-600">Tải lên hình ảnh mới</p>
          <label className={`w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32 cursor-pointer bg-gray-50 ${uploading ? 'opacity-50' : ''}`}>
            <input 
              type="file" 
              multiple 
              hidden 
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading ? (
              <p className="text-gray-500">Đang tải ảnh...</p>
            ) : newImages.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {newImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="New preview"
                      className="w-20 h-20 object-cover rounded-md"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
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
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-1 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-700"></div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang cập nhật..." : uploading ? "Đang tải ảnh..." : "Cập nhật sản phẩm"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
