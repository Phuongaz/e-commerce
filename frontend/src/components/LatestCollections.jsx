import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LatestCollections = () => {
  const { products, loading } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    console.log("LatestCollections - Products received:", products?.length);
    if (products && Array.isArray(products) && products.length > 0) {
      const latest = products.slice(0, 25);
      console.log("LatestCollections - Setting latest products:", latest.length);
      setLatestProducts(latest);
    }
  }, [products]);

  const settings = {
    dots: true,
    infinite: latestProducts.length > 3,
    speed: 500,
    slidesToShow: Math.min(5, latestProducts.length),
    slidesToScroll: 1,
    autoplay: latestProducts.length > 3,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(4, latestProducts.length),
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, latestProducts.length),
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, latestProducts.length),
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Show loading state
  if (loading) {
    return (
      <div className="my-16">
        <div className="text-center py-8 text-3xl">
          <Title text1={"SẢN PHẨM"} text2={"MỚI"} />
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-lg">Loading latest products...</div>
        </div>
      </div>
    );
  }

  // Show message if no products
  if (!loading && (!latestProducts || latestProducts.length === 0)) {
    return (
      <div className="my-16">
        <div className="text-center py-8 text-3xl">
          <Title text1={"SẢN PHẨM"} text2={"MỚI"} />
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-lg text-gray-600">No latest products available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-16">
      <div className="text-center py-8 text-3xl">
        <Title text1={"SẢN PHẨM"} text2={"MỚI"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[#2C1810] -mt-2 montserrat-regular">
          Làm mới phong cách của bạn với những sản phẩm mới được chế tác để mang đến sự thanh lịch và được thiết kế
          để tạo ấn tượng.
        </p>
      </div>
      
      <div className="w-[95%] mx-auto mt-7">
        {/* Debug info
        <div className="text-sm text-gray-500 mb-4 text-center">
          Displaying {latestProducts.length} products
        </div> */}
        
        {latestProducts.length > 3 ? (
          <Slider {...settings}>
            {latestProducts.map((item, index) => (
              <div key={item._id || index} className="px-2">
                <ProductItem
                  id={item._id}
                  image={item.images}
                  name={item.name}
                  price={item.price}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {latestProducts.map((item, index) => (
              <ProductItem
                key={item._id || index}
                id={item._id}
                image={item.images}
                name={item.name}
                price={item.price}
              />
            ))}
          </div>
        )}  
      </div>
    </div>
  );
};

export default LatestCollections;
