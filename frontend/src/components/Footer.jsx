import React from "react";
import { assets } from "../assets/frontend_assets/assets";
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaMapMarkedAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="montserrat-regular px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-[#F5F5DC]">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-28 text-sm">
        <div>
          <img
            className="mb-5 w-32"
            src={assets.logo}
            alt="Test Logo"
            loading="lazy"
          />
          <p className="w-full md:w-2/3 text-[#2C1810]">
            Chào mừng đến với cửa hàng quần áo AllWear. Chúng tôi cung cấp nhiều sản phẩm thời thượng và chất lượng cao cho bạn.
          </p>
        </div>

        <div>
          <p className="pt-4 text-xl font-medium mb-5 text-[#2C1810]">Truy cập nhanh</p>
          <ul className="flex flex-col gap-1">
            <li>
              <Link to="/" className="text-[#2C1810] hover:text-[#8B4513] transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/orders" className="text-[#2C1810] hover:text-[#8B4513] transition-colors">
                Đơn hàng của tôi
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-[#2C1810] hover:text-[#8B4513] transition-colors">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-[#2C1810] hover:text-[#8B4513] transition-colors">
                Liên hệ chúng tôi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="pt-4 text-xl font-medium mb-5 text-[#2C1810]">Liên hệ chúng tôi</p>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#8B4513]" />
              <a href="tel:+911234567809" className="text-[#2C1810] hover:text-[#8B4513] transition-colors">
                +84 9090909090
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[#8B4513]" />
              <a
                href="mailto:fancyfinds4u@gmail.com"
                className="text-[#2C1810] hover:text-[#8B4513] transition-colors"
              >
                allwear@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaFacebookF className="text-[#8B4513]" />
              <a href="https://www.facebook.com/allwear" className="text-[#2C1810] hover:text-[#8B4513] transition-colors">
                AllWear Fashion
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkedAlt className="text-[#8B4513]" />
              <a href="https://www.google.com/maps/place/AllWear+Fashion" className="text-[#2C1810] hover:text-[#8B4513] transition-colors">
                Địa chỉ: 123 Nguyễn Văn Cừ, Hồ Chí Minh
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr className="border-[#8B4513]" />
        <p className="py-5 text-sm text-center text-[#2C1810]">
          Copyright {year} @ Phuongaz - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
