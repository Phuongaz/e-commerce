import React, { useContext } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/Shopcontext";

const Hero = () => {

  const { navigate } = useContext(ShopContext);
  return (
    <div className="relative w-full h-[450px] max-h-[450px] mt-3">
      {/* Overlay for text */}
      <div className="absolute inset-0 bg-[#2C1810] opacity-80"></div>

      {/* Background container with 60% height */}
      <div className="absolute top-0 left-0 w-full h-full shadow-xl">
        {/* Hero image */}
        <img
          src={assets.hero}
          alt="Hero Image"
          className="w-full h-full object-cover opacity-60"
          loading="lazy"
        />
      </div>

      <div className="flex items-center justify-center relative z-10 text-center text-[#F5F5DC] px-6 sm:px-12 h-full">
        <div>
          <h2 className="text-3xl sm:text-4xl mb-4 font-semibold bangers-regular">
          Khám phá những điều tốt nhất về thời trang và phong cách sống
          </h2>
          <p className="text-lg sm:text-xl mb-6 montserrat-regular">
          Mua sắm ngay hôm nay và nhận ưu đãi lớn
          </p>
          <button
            onClick={() => {
              navigate("/collection");
            }}
            className="bg-[#8B4513] text-[#F5F5DC] py-3 px-6 rounded-full text-lg font-semibold transition duration-300 transform hover:scale-105 hover:bg-[#2C1810]"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
