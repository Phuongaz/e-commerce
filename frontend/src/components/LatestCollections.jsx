import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LatestCollections = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 25));
  }, [products]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

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
        <Slider {...settings}>
          {latestProducts.map((item, index) => (
            <div key={index} className="px-4">
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default LatestCollections;
