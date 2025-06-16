import React, { useState } from "react";
import Title from "./Title";
import { FaUserAlt } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonialsData = [
  {
    name: "Nguyễn Phương",
    feedback:
      "Tôi thực sự yêu thích những bộ quần áo tôi đã mua từ cửa hàng này. Chất lượng tuyệt vời và phù hợp với tôi. Tôi sẽ khuyên bạn nên mua từ cửa hàng này. Giao hàng cũng rất nhanh chóng và đóng gói cũng tuyệt vời.",
    rating: 5,
  },
  {
    name: "Trần Văn An",
    feedback:
      "Trải nghiệm mua hàng online tuyệt vời nhất mà tôi từng có. Quần áo tuyệt đẹp, thoải mái và giá cả hợp lý. Tôi rất ấn tượng với bộ sưu tập, đặc biệt là quần áo dân tộc.",
    rating: 4,
  },
  {
    name: "Lê Thị Huyền",
    feedback:
      "Tôi đã mua nhiều lần từ cửa hàng này và luôn nhận được sản phẩm chất lượng cao. Giao hàng nhanh chóng và dễ dàng. Tôi rất hài lòng với dịch vụ của cửa hàng.",
    rating: 5,
  },
  {
    name: "Nguyễn Văn Bình",
    feedback:
      "Tôi đã tìm thấy đúng những gì tôi đang tìm kiếm. Quần áo phù hợp với tôi, và kiểu dáng luôn được cập nhật. Tôi thích cách dễ sử dụng của trang web.",
    rating: 4,
  },
];

const Testimonials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const handleReadMore = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const truncateFeedback = (feedback) => {
    const maxLength = 150;
    return feedback.length > maxLength
      ? `${feedback.substring(0, maxLength)}...`
      : feedback;
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 550,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="my-2">
      <div className="text-center py-8 text-3xl text-blue-600">
        <Title text1={"ĐÁNH GIÁ"} text2={"KHÁCH HÀNG"} />
        <p className="montserrat-regular w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-500">
        Luôn lắng nghe những khách hàng hài lòng, những người đang yêu thích phong cách và trải nghiệm mới của mình.
        </p>
      </div>

      <div className="relative">
        <Slider {...settings}>
          {testimonialsData.map((item, index) => (
            <div key={index} className="p-4">
              <div className="bg-gray-50 shadow-lg rounded-lg p-6 flex flex-col items-center border border-gray-300">
                <div className="w-16 h-16 mb-2 flex items-center justify-center rounded-full border-2 border-blue-500 bg-gray-200">
                  <FaUserAlt className="text-blue-500 text-3xl" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <div className="flex text-yellow-600 items-center justify-center">
                    {[...Array(item.rating)].map((_, idx) => (
                      <span key={idx} className="text-yellow-500">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {truncateFeedback(item.feedback)}
                  </p>
                  <button
                    onClick={() => handleReadMore(item)}
                    className="mt-2 text-blue-500 text-xs hover:underline"
                  >
                    Read more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 h-80 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-600">
                {selectedTestimonial.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &#10005;
              </button>
            </div>
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full border-2 border-blue-500 bg-gray-200">
                <FaUserAlt className="text-blue-500 text-4xl" />
              </div>
              <div className="flex mt-2 text-yellow-500">
                {[...Array(selectedTestimonial.rating)].map((_, idx) => (
                  <span key={idx} className="text-yellow-500">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {selectedTestimonial.feedback}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
