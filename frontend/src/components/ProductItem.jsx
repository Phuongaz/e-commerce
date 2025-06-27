import React, { useContext } from "react";
import { ShopContext } from "../context/Shopcontext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, backendUrl } = useContext(ShopContext);

  // Generate image URL from image ID using the API endpoint
  const getImageUrl = (imageId) => {
    if (!imageId) return '';
    // Use the backend API endpoint to get image by ID
    return `${backendUrl}/api/product/image/${imageId}`;
  };

  // Default image when no product image is available
  const defaultImage = "https://via.placeholder.com/400x300/F5F5DC/2C1810?text=No+Image";
  
  // Get first image ID or use default
  const productImage = (image && Array.isArray(image) && image.length > 0) 
    ? getImageUrl(image[0]) 
    : defaultImage;

  return (
    <Link
      to={`/product/${id}`}
      className="relative overflow-hidden shadow-md transform transition-all hover:scale-105 hover:shadow-xl bg-[#F5F5DC]"
    >
      <div className="overflow-hidden rounded-t-lg">
        <img
          className="transition ease-in-out duration-300 object-cover w-full h-72 sm:h-80 md:h-72 lg:h-64"
          src={productImage}
          alt={name}
          onError={(e) => {
            e.target.src = defaultImage; // Fallback if image fails to load
          }}
        />
      </div>
      <div className="p-4">
        <p className="text-lg font-semibold text-[#2C1810] truncate">{name}</p>
        <p className="text-sm font-medium text-[#8B4513]">
           {price} {currency}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
