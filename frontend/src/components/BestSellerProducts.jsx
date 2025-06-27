import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shopcontext'
import Title from './Title';
import ProductItem from './ProductItem';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BestSellerProducts = () => {

    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        if (products && Array.isArray(products)) {
            const bestProduct = products.filter((item) => (
                item.bestseller
            ));
       
            setBestSeller(bestProduct.slice(0, 15));
        }
    }, [products])

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
      <div className="text-center text-3xl py-7">
        <Title text1={"SẢN PHẨM"} text2={"BÁN CHẠY"} />
      </div>
      <p className="montserrat-regular w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 text-center -mt-8 mb-12">
        Sản phẩm bán chạy nhất của chúng tôi đang chờ bạn{" "}
      </p>
      <div className="w-[95%] mx-auto mt-10">
        <Slider {...settings}>
          {bestSeller?.map((item, index) => (
            <div key={index} className="px-4">
              <ProductItem
                id={item._id}
                image={item.images}
                name={item.name}
                price={item.price}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default BestSellerProducts