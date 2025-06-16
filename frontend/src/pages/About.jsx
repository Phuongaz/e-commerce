import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";

const About = () => {
  return (
    <>
      <div className="mx-auto p-4 sm:p-6  text-gray-800 border-t px-4 sm:px-[5vw]">
        <div className="text-2xl mt-4 mb-16 text-center">
          <Title text1={"ABOUT"} text2={"US"} />
        </div>

        <div className="flex flex-col lg:flex-row gap-16 mb-10">
          <div className=" flex justify-center items-center">
            <img
              src={assets.about_img}
              alt="Clothing Display"
              className="w-full sm:max-w-[450px] rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-semibold mb-2.5 text-gray-900">
              Về AllWear
            </h3>
            <p className="mb-10 md:mb-6 text-base sm:text-lg text-gray-600">
            Chào mừng bạn đến với AllWear, điểm đến tuyệt vời cho những trang phục thời trang và chất lượng cao dành cho nam, nữ và trẻ em. Tại AllWear, chúng tôi tin rằng thời trang nên là điều dễ tiếp cận với mọi người, vì vậy chúng tôi cẩn thận chọn lọc bộ sưu tập của mình để mang đến cho bạn những xu hướng mới nhất và những món đồ cổ điển vượt thời gian với mức giá phải chăng.
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2.5 text-gray-900">
              Mục tiêu của chúng tôi
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
            Tại AllWear, sứ mệnh của chúng tôi là truyền cảm hứng tự tin và sự thể hiện bản thân qua thời trang. Chúng tôi cung cấp những trang phục vừa đẹp mắt, vừa thoải mái, kết hợp giữa giá cả phải chăng, chất lượng và phong cách, giúp khách hàng luôn tự tin và xinh đẹp mỗi ngày.
            </p>
          </div>
        </div>

        <div className="text-2xl text-center">
          <Title text1={"WHY"} text2={"CHOOSE US"} />
        </div>
        <ul className="list-disc list-inside mb-8 text-base sm:text-lg text-gray-600">
          <li>
          Sự lựa chọn đa dạng các trang phục thời thượng và vượt thời gian dành cho nam, nữ và trẻ em.
          </li>
          <li>Chất lượng tốt với giá cả phải chăng.</li>
          <li>
            Dịch vụ khách hàng thân thuộc và nhiệt tình sẵn sàng giúp đỡ bạn.
          </li>
          <li>
            Các tùy chọn mua hàng tiện ích với cửa hàng trực tuyến dễ sử dụng và giao hàng nhanh chóng.
          </li>
          <li>
            Cam kết bền vững với việc cung cấp sản phẩm bền và đạt tiêu chuẩn xã hội.
          </li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Tham gia gia AllWear
        </h2>
        <p className="text-base sm:text-lg text-gray-600">
          Tại AllWear, chúng tôi không chỉ là cửa hàng; chúng tôi là một cộng đồng thời trang. Theo dõi chúng tôi trên mạng xã hội để cập nhật những điều mới nhất về xu hướng, mẹo lựa chọn và ưu đãi độc quyền. Cảm ơn bạn đã chọn AllWear - chúng tôi không thể đợi để giúp bạn tạo ra phong cách hoàn hảo của mình!
        </p>
      </div>
    </>
  );
};

export default About;
