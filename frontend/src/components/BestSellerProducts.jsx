import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shopcontext'
import Title from './Title';
import ProductItem from './ProductItem';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BestSellerProducts = () => {
    const { products, loading } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        console.log("BestSellerProducts - Products received:", products?.length);
        if (products && Array.isArray(products) && products.length > 0) {
            const bestProduct = products.filter((item) => item.bestseller);
            const bestSellerSlice = bestProduct.slice(0, 15);
            console.log("BestSellerProducts - Best sellers found:", bestSellerSlice.length);
            setBestSeller(bestSellerSlice);
        }
    }, [products])

    const settings = {
        dots: true,
        infinite: bestSeller.length > 3,
        speed: 500,
        slidesToShow: Math.min(5, bestSeller.length),
        slidesToScroll: 1,
        autoplay: bestSeller.length > 3,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: Math.min(4, bestSeller.length),
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(3, bestSeller.length),
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: Math.min(2, bestSeller.length),
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
                <div className="text-center text-3xl py-7">
                    <Title text1={"SẢN PHẨM"} text2={"BÁN CHẠY"} />
                </div>
                <div className="flex justify-center items-center h-40">
                    <div className="text-lg">Loading best sellers...</div>
                </div>
            </div>
        );
    }

    // Show message if no best sellers
    if (!loading && (!bestSeller || bestSeller.length === 0)) {
        return (
            <div className="my-16">
                <div className="text-center text-3xl py-7">
                    <Title text1={"SẢN PHẨM"} text2={"BÁN CHẠY"} />
                </div>
                <div className="flex justify-center items-center h-40">
                    <div className="text-lg text-gray-600">No best sellers available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-16">
            <div className="text-center text-3xl py-7">
                <Title text1={"SẢN PHẨM"} text2={"BÁN CHẠY"} />
            </div>
            <p className="montserrat-regular w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 text-center -mt-8 mb-12">
                Sản phẩm bán chạy nhất của chúng tôi đang chờ bạn{" "}
            </p>
            
            <div className="w-[95%] mx-auto mt-10">
                {/* Debug info */}
                <div className="text-sm text-gray-500 mb-4 text-center">
                    Displaying {bestSeller.length} best sellers
                </div>
                
                {bestSeller.length > 3 ? (
                    <Slider {...settings}>
                        {bestSeller.map((item, index) => (
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
                    // Fallback to regular grid if few products
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {bestSeller.map((item, index) => (
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
}

export default BestSellerProducts