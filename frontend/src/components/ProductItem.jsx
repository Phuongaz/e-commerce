import React, { useContext } from "react";
import { ShopContext } from "../context/Shopcontext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      to={`/product/${id}`}
      className="relative overflow-hidden shadow-md transform transition-all hover:scale-105 hover:shadow-xl bg-[#F5F5DC]"
    >
      <div className="overflow-hidden rounded-t-lg">
        <img
          className="transition ease-in-out duration-300 object-cover w-full h-72 sm:h-80 md:h-72 lg:h-64"
          src={image[0]}
          alt={name}
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
