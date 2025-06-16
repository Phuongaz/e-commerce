import React from "react";
import { assets } from "../assets/frontend_assets/assets";

const PolicyFeatures = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img
          src={assets.exchange_icon}
          className="w-28 m-auto mb-5"
          alt="exchange icon"
          loading="lazy"
        />
        <p className="font-semibold">Chính sách đổi trả dễ dàng</p>
        <p className="text-gray-400">
          Đổi trả sản phẩm dễ dàng với chúng tôi
        </p>
      </div>
      <div>
        <img
          src={assets.quality_icon}
          className="w-[101px] m-auto mb-5"
          alt="quality icon"
          loading="lazy"
        />
        <p className="font-semibold">Chính sách đổi trả 7 ngày</p>
        <p className="text-gray-400">
          Đổi trả sản phẩm trong vòng 7 ngày với chúng tôi
        </p>
      </div>
      <div>
        <img
          src={assets.support_img}
          className="w-[102px] m-auto mb-5"
          alt="support icon"
          loading="lazy"
        />
        <p className="font-semibold">Hỗ trợ khách hàng tốt nhất</p>
        <p className="text-gray-400">
          Đội ngũ chúng tôi sẵn sàng hỗ trợ bạn 24/7 với bất kỳ câu hỏi nào
        </p>
      </div>
      {/* New Section */}
    </div>
  );
};

export default PolicyFeatures;
